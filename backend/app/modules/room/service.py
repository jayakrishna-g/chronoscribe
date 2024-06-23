from app.core.connection_manager import get_connection_manager
from app.database import get_database
from app.modules.room import CacheName, get_cache_manager
from app.modules.room.cache import RoomMetaCache, SummaryCache, TranscriptCache
from app.modules.room.model import RoomMetaData, TranscriptInstance

db = get_database()
room_coll = db.get_collection("rooms")
cache_manager = get_cache_manager()
connection_manager = get_connection_manager()


async def get_owner_rooms(owner):
    rooms = room_coll.find(
        {"owner": owner}, {"name": 1, "description": 1, "room_id": 1, "_id": 0}
    )
    return await rooms.to_list(length=1000)


def create_broadcast_message(service, message):
    return {
        "status": True,
        "type": "broadcast",
        "body": {"service": service, "message": message},
    }


class RoomMetaService:
    def __init__(self) -> None:
        self._cache: RoomMetaCache = cache_manager.get_cache(CacheName.room_meta)  # type: ignore

    async def get(self, room_id):
        return await self._cache.get_room_meta(room_id)

    async def write(self, room_id, value):
        await self._cache.write_room_meta(room_id, value)

    @staticmethod
    def instance():
        instance: RoomMetaService = globals().get("room_meta_service")  # type: ignore
        if instance:
            return instance
        else:
            instance = RoomMetaService()
            globals()["room_meta_service"] = instance
            return instance


class TranscriptService:
    def __init__(self) -> None:
        self._cache: TranscriptCache = cache_manager.get_cache(CacheName.transcript)  # type: ignore

    async def get(self, room_id):
        return self._cache.get_transcript(room_id)

    async def write(self, room_id, value):
        return self._cache.write_transcript(room_id, value)

    @staticmethod
    def instance():
        _identifier = "room_transcript_service"
        instance: TranscriptService = globals().get(_identifier)  # type: ignore
        if instance:
            return instance
        else:
            instance = TranscriptService()
            globals()[_identifier] = instance
            return instance


class SummaryService:
    def __init__(self) -> None:
        self._cache: SummaryCache = cache_manager.get_cache(CacheName.summary)  # type: ignore

    async def get(self, room_id):
        return self._cache.get_summary(room_id)

    async def write(self, room_id, value):
        return self._cache.write_summary(room_id, value)

    @staticmethod
    def instance():
        _identifier = "summary_service"
        instance: SummaryService = globals().get(_identifier)  # type: ignore

        if instance:
            return instance

        else:
            instance = SummaryService()
            globals()[_identifier] = instance
            return instance


class RoomService:
    async def transcript(self, room_id, websocket, data, connection_manager):
        if "transcript_content" in data and "transcript_index" in data:
            message = {
                "transcript_content": data["transcript_content"],
                "transcript_index": data["transcript_index"],
            }
            room = await cached_rooms.get(room_id)
            if room:
                room.save_transcript(TranscriptInstance(**message))
                await connection_manager.broadcast(
                    room_id, create_broadcast_message("transcript", message)
                )

    async def emoji(self, room_id, websocket, data, connection_manager):
        if "emoji" in data:
            message = {"emoji": data["emoji"]}
            await connection_manager.broadcast(
                room_id, create_broadcast_message("emoji", message)
            )

    async def quick_question(self, room_id, websocket, data, connection_manager):
        if "question" in data:
            message = {"question": data["question"]}
            if "options" in data:
                message["options"] = data["options"]
            await connection_manager.broadcast(
                room_id, create_broadcast_message("quick_question", message)
            )

    async def quick_question_answer(self, room_id, websocket, data, connection_manager):
        if "answer" in data:
            message = {"answer": data["answer"]}
            await connection_manager.broadcast(
                room_id, create_broadcast_message("quick_question_answer", message)
            )

    async def question(self, room_id, websocket, data, connection_manager):
        if "question" in data:
            message = {"question": data["question"]}
            await connection_manager.broadcast(
                room_id, create_broadcast_message("question", message)
            )

    def map_service(self, service_name):
        services = {
            "transcript": self.transcript,
            "emoji": self.emoji,
            "quick_question": self.quick_question,
            "quick_question_answer": self.quick_question_answer,
            "question": self.question,
        }
        return services.get(service_name)

    async def handle(self, websocket, data, room_id, connection_manager):
        print(data)
        service_name = data.get("service")
        if not service_name:
            raise ValueError("Service Type not specified")
        room_service = self.map_service(service_name)
        if not room_service:
            raise ValueError("Invalid service type")
        if not room_id:
            raise ValueError("Room ID not specified")
        incoming_data = data.get("body") or {}
        await room_service(room_id, websocket, incoming_data, connection_manager)


async def handle_room_socket(websocket, data, room_id, connection_manager):
    if "room_service" not in globals():
        global room_service
        room_service = RoomService()
    await room_service.handle(websocket, data, room_id, connection_manager)  # type: ignore
