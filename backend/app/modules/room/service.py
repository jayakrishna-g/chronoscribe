import json
from loguru import logger

from app.core.connection_manager import ConnectionManager
from app.modules.room import CacheName, get_cache_manager
from app.modules.room.cache import (
    RoomActivityCache,
    RoomCache,
    RoomMetaCache,
    SummaryCache,
    TranscriptCache,
)
from app.modules.room.crud import create_room
from app.modules.room.model import (
    Room,
    RoomActivity,
    RoomCreate,
    SummaryInstance,
    TranscriptInstance,
)
from app.modules.summarizer.google_llm_model import TranscriptSummarizer

cache_manager = get_cache_manager()
connection_manager = ConnectionManager.instance()


async def get_owner_rooms():
    return []


def create_broadcast_message(service, message):
    return {
        "status": True,
        "type": "broadcast",
        "body": {"service": service, "message": message},
    }


class RoomActivityService:
    def __init__(self) -> None:
        self._cache: RoomActivityCache = cache_manager.get_cache(
            CacheName.room_activity
        )  # type: ignore

    async def get(self, room_id, user_id):
        return await self._cache.get_room_activity(room_id, user_id)

    async def write(self, room_id, user_id, value):
        await self._cache.set_room_activity(room_id, user_id, value)

    async def get_recent(self, user_id):
        return await self._cache.get_user_activity(user_id)

    async def get_all(self, user_id):
        return await self._cache.get_all(user_id)

    async def register_activity(self, room_id, user_id, activity, is_owner=False):
        await self.write(
            room_id,
            user_id,
            RoomActivity(
                room_id=room_id, user_id=user_id, activity=activity, is_owner=is_owner
            ),
        )

    @staticmethod
    def instance():
        instance: RoomActivityService = globals().get("room_activity_service")  # type: ignore
        if instance:
            return instance
        else:
            instance = RoomActivityService()
            globals()["room_activity_service"] = instance
            return instance


class RoomMetaService:
    def __init__(self) -> None:
        self._cache: RoomMetaCache = cache_manager.get_cache(CacheName.room_meta)  # type: ignore

    async def get(self, room_id):
        return await self._cache.get_room_meta(room_id)

    async def write(self, room_id, value):
        await self._cache.set_room_meta(room_id, value)

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
        return await self._cache.get_transcript(room_id)

    def write(self, room_id, value):
        return self._cache.set_transcript(room_id, value)

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
        return await self._cache.get_summary(room_id)

    async def write(self, room_id, value: str):
        return await self._cache.set_summary(room_id, [SummaryInstance(content=value)])

    async def generate(self, room_id, content):
        # print("Generating summary" + content)

        transcript = json.dumps(content)
        summary = TranscriptSummarizer.instance().get_summary(transcript)
        logger.info("Summary generated", summary)
        await self.write(room_id, summary)
        return summary

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
    def __init__(self) -> None:
        self._cache: RoomCache = cache_manager.get_cache(CacheName.room)  # type: ignore

    async def get(self, room_id) -> Room | None:
        return await self._cache.get_room(room_id)

    async def put(self, room_id, room):
        return await self._cache.set_room(room_id, room)

    async def create(self, room: RoomCreate):
        try:
            room_id = await create_room(room.name, room.description, room.owner_id)
            return room_id
        except Exception as e:
            raise e

    @staticmethod
    def instance():
        _identifier = "room_service"
        instance: RoomService = globals().get(_identifier)  # type: ignore

        if instance:
            return instance

        else:
            instance = RoomService()
            globals()[_identifier] = instance
            return instance


class WebSocketService:
    async def transcript(self, room_id, websocket, data, connection_manager):
        if "content" in data and "index" in data:
            message = {
                "content": data["content"],
                "index": data["index"],
            }
            logger.info("In transcript service", message)
            room = await RoomService.instance().get(room_id)
            transcript_service = TranscriptService.instance()
            if room:
                await transcript_service.write(room_id, TranscriptInstance(**message))
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

    async def closeRoom(self, room_id, websocket, data, connection_manager):
        room = await RoomService.instance().get(room_id)
        if room is None:
            raise ValueError("Room not found")
        room.is_active = False
        await RoomService.instance().put(room_id, room)
        await connection_manager.broadcast(
            room_id, create_broadcast_message("closeRoom", True)
        )

    async def summary(self, room_id, websocket, data, connection_manager):
        room = await RoomService.instance().get(room_id)
        if room is None:
            raise ValueError("Room not found")
        if "start" in data and "end" in data:
            transcript_service = TranscriptService.instance()
            transcript = await transcript_service.get(room_id)
            if transcript:
                summary_service = SummaryService.instance()
                cur_content = [
                    transcript.json()
                    for transcript in transcript[data["start"] : data["end"]]
                ]
                print("Current Content", cur_content)
                print(data["start"], data["end"])
                logger.info("Current Content", cur_content)
                if cur_content:
                    gen_summary = await summary_service.generate(room_id, cur_content)
                    if gen_summary:
                        await connection_manager.broadcast(
                            room_id, create_broadcast_message("summary", gen_summary)
                        )

    def map_service(self, service_name):
        print("Service Name", service_name)
        services = {
            "transcript": self.transcript,
            "emoji": self.emoji,
            "quick_question": self.quick_question,
            "quick_question_answer": self.quick_question_answer,
            "question": self.question,
            "close_room": self.closeRoom,
            "summary": self.summary,
        }
        return services.get(service_name)

    async def handle(self, websocket, data, room_id, connection_manager):
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
    if "ws_service" not in globals():
        global ws_service
        ws_service = WebSocketService()
    await ws_service.handle(websocket, data, room_id, connection_manager)  # type: ignore
