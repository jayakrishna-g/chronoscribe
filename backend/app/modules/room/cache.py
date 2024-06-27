import asyncio
import typing

from app.core.cache_system import Cache
from app.database import Database
from app.modules.room.model import Room, RoomMetaData

db = Database().instance()


class RoomCache(Cache):
    def __init__(self):
        super().__init__()
        self._collection = db.get_collection("rooms")

    async def _get_from_db(self, room_id):
        return await self._collection.find_one({"id": room_id})

    async def _write_to_db(self, room_id, value):
        print(value)
        return await self._collection.update_one({"id": room_id}, value)

    async def get_room(self, room_id):
        room = await self._get(room_id)
        if room:
            return room
        print("Fetching Room Data from DB")
        room_from_db: Room = await self._get_from_db(room_id)  # type: ignore
        if not room_from_db:
            raise Exception("Accessing Room Data which does not exist")
        await self.write_room(room_id, room_from_db)
        return room_from_db

    async def add_room(self, room: Room):
        inser_res = await self._collection.insert_one(room.model_dump())
        room_id = room.id
        if inser_res.acknowledged:
            await self.write_room(room_id, room)
        else:
            raise Exception("Error in Adding Room to DB")

    async def write_room(self, room_id, room: Room):
        print(f"Writing Room Data of room{room_id} to Cache {room}")
        await self._set(room_id, room)

    async def sync_func(self, key: str, value: typing.Any):
        print(f"Syncing Room Data for Room {key} with Data {value}")
        await self._write_to_db(key, value)


class RoomMetaCache(Cache):
    def __init__(self):
        super().__init__()
        self._collection = db.get_collection("room_meta")

    async def _get_from_db(self, room_id):
        return await self._collection.find_one({"room_id": room_id})

    async def _write_to_db(self, room_id, value):
        return await self._collection.update_one({"room_id": room_id}, value)

    async def _serilaize(self, room_meta) -> RoomMetaData:
        return RoomMetaData(**room_meta)

    async def get_room_meta(self, room_id) -> RoomMetaData:
        room_meta = await self._get(room_id)
        if room_meta:
            return room_meta
        room_meta_from_db = await self._get_from_db(room_id)
        if not room_meta_from_db:
            raise Exception("Accessing Room Meta Data which does not exist")
        serialized_room_meta = await self._serilaize(room_meta_from_db)
        await self.write_room_meta(room_id, serialized_room_meta)
        return serialized_room_meta

    async def add_room_meta(self, room_meta: RoomMetaData):
        if room_meta.room_id is None:
            raise Exception("Room ID not provided")
        inser_res = await self._collection.insert_one(room_meta.model_dump())
        room_id = room_meta.room_id
        if inser_res.acknowledged:
            await self.write_room_meta(room_id, room_meta)
            return room_meta
        else:
            raise Exception("Error in Adding Room Meta Data to DB")

    async def write_room_meta(self, room_id, room_meta):
        print(f"Writing Meta Data of room{room_id} from Cache")
        await self._set(room_id, room_meta, ttl=600)

    async def sync_func(self, key, value):
        print(f"Room Meta Cache: {self.cache}")
        print(f"Syncing Room Meta Data for Room {key} with Data {value}")
        await self._write_to_db(key, value)


class TranscriptCache(Cache):
    def __init__(self):
        super().__init__()
        self._collection = db.get_collection("transcript")

    async def _get_from_db(self):
        return ""  # To-Do

    async def _write_to_db(self):
        return await asyncio.sleep(1)  # To-Do

    async def get_transcript(self, room_id):
        transcript = await self._get(room_id)
        if transcript:
            return transcript
        # transcript_from_db = await self._get_from_db()
        return None

    async def sync_func(self, key: str, value: typing.Any):
        print(f"Transcript Cache: {self.cache}")
        print(f"Syncing Transcripts for Room{key}")
        await self._write_to_db()

    async def write_transcript(self, room_id, transcript):
        await self._set(room_id, transcript, ttl=600)


class SummaryCache(Cache):
    def __init__(self):
        super().__init__()
        self._collection = db.get_collection("summary")

    async def _get_from_db(self, room_id):
        return ""  # To-Do

    async def _write_to_db(self, room_id):
        return  # To-Do

    async def get_summary(self, room_id):
        summary = await self._get(room_id)
        if summary:
            return summary
        summary_from_db = await self._get_from_db(room_id=room_id)
        return None

    async def sync_func(self, key: str, value: typing.Any):
        print(self.cache)
        print(f"Syncing Summary Data for Room {key}")
        await self._write_to_db(key)

    async def write_summary(self, room_id, summary):
        await self._set(room_id, summary, ttl=600)
