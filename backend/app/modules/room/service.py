import asyncio
import random
import string
from threading import Lock

from app.database import get_database
from app.modules.room.connection_manager import get_connection_manager
from app.modules.room.model import Room, TranscriptInstance

db = get_database()
room_coll = db.get_collection("rooms")
in_memory_rooms: dict[str, Room] = {}
room_lock = Lock()
connection_manager = get_connection_manager()


async def sync_rooms():
    print("Syncing rooms")
    await asyncio.gather(*[save_room(room) for room in in_memory_rooms.values()])
    print("Rooms synced")
    await asyncio.sleep(120)
    await sync_rooms()


async def get_owner_rooms(owner):
    rooms = room_coll.find(
        {"owner": owner}, {"name": 1, "description": 1, "room_id": 1, "_id": 0}
    )
    return await rooms.to_list(length=1000)


asyncio.get_event_loop().create_task(sync_rooms())  # type: ignore


def create_broadcast_message(service, message):
    return {
        "status": True,
        "type": "broadcast",
        "body": {"service": service, "message": message},
    }


async def get_room(room_id):
    room = in_memory_rooms.get(room_id)
    if room:
        print("Room found in memory")
        return room
    room = await room_coll.find_one({"room_id": room_id})
    if room:
        room_obj = Room(
            room["name"], room["description"], room["owner"], room["room_id"]
        )
        room_obj.transcript = [
            TranscriptInstance(transcript_content=x[1], transcript_index=x[0])
            for x in enumerate(room["transcript"])
        ]
        room_obj.summaries = room["summaries"]
        room_obj.start_summary_index = len(room_obj.transcript)
        room_lock.acquire()
        in_memory_rooms[room_id] = room_obj
        room_lock.release()
        return room_obj


async def get_unique_id():
    id = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    while await get_room(id):
        id = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return id


async def save_room(room: Room):
    #room.summarize()
    if len(room.summaries) > 0 and room.has_newSummary():
        await connection_manager.broadcast(
            room.room_id, create_broadcast_message("summary", room.summaries[-1])
        )
    room_dict = room.db_dict()
    room_id = room_dict["room_id"]
    await room_coll.update_one({"room_id": room_id}, {"$set": room_dict}, upsert=True)
    return room_id


async def create_room(name, description, owner) -> str:
    room_id = await get_unique_id()
    room = Room(name, description, owner, room_id)
    room_lock.acquire()
    in_memory_rooms[room_id] = room
    room_lock.release()
    await save_room(room)
    return room_id


class RoomService:
    async def transcript(self, room_id, websocket, data, connection_manager):
        if "transcript_content" in data and "transcript_index" in data:
            message = {
                "transcript_content": data["transcript_content"],
                "transcript_index": data["transcript_index"],
            }
            room = await get_room(room_id)
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
