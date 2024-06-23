import asyncio
import typing

from app.core.cache_system import Cache
from app.database import Database
from app.modules.room.model import RoomMetaData

db = Database().instance()


class RoomCache(Cache):
    def __init__(self):
        super().__init__()
        self._collection = db.get_collection("rooms")

    async def _get_from_db(self, room_id):
        return self._collection.find_one({"room_id": room_id})

    async def _write_to_db(self, room_id, value):
        return self._collection.update_one({"room_id": room_id}, value)

    async def get_room(self, room_id):
        room = await self.get(room_id)
        if room:
            return room
        room_from_db = await self._get_from_db(room_id)
        if not room_from_db:
            raise Exception("Accessing Room Data which does not exist")
        self.set(room_id, room_from_db, ttl=600)
        return room_from_db

    async def write_room(self, room_id, room):
        print(f"Writing Room Data of room{room_id} to Cache")
        self.set(room_id, room)

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
        return self._collection.update_one({"room_id": room_id}, value)

    async def _serilaize(self, room_meta) -> RoomMetaData:
        return RoomMetaData(**room_meta)

    async def get_room_meta(self, room_id) -> RoomMetaData:
        room_meta = await self.get(room_id)
        if room_meta:
            return room_meta
        room_meta_from_db = await self._get_from_db(room_id)
        if not room_meta_from_db:
            raise Exception("Accessing Room Meta Data which does not exist")
        serialized_room_meta = await self._serilaize(room_meta_from_db)
        self.set(room_id, serialized_room_meta, ttl=600)
        return serialized_room_meta

    async def write_room_meta(self, room_id, room_meta):
        print(f"Writing Meta Data of room{room_id} from Cache")
        self.set(room_id, room_meta, ttl=600)

    async def sync_func(self, key, value):
        print(f"Syncing Room Meta Data for Room {key} with Data {value}")
        await self._write_to_db(key, value)


class TranscriptCache(Cache):
    def __init__(self):
        super().__init__()
        self._collection = db.get_collection("transcript")

    async def _get_from_db(self):
        return ""  # To-Do

    async def _write_to_db(self):
        return  # to-do

    async def get_transcript(self, room_id):
        transcript = await self.get(room_id)
        if transcript:
            return transcript
        transcript_from_db = await self._get_from_db()
        return None

    async def sync_func(self, key: str, value: typing.Any):
        print(f"Syncing Transcripts for Room{key}")
        await self._write_to_db()

    async def write_transcript(self, room_id, transcript):
        self.set(room_id, transcript, ttl=600)


class SummaryCache(Cache):
    def __init__(self):
        super().__init__()
        self._collection = db.get_collection("summary")

    async def _get_from_db(self, room_id):
        return ""  # To-Do

    async def _write_to_db(self, room_id):
        return  # To-Do

    async def get_summary(self, room_id):
        summary = await self.get(room_id)
        if summary:
            return summary
        summary_from_db = await self._get_from_db(room_id=room_id)
        return None

    async def sync_func(self, key: str, value: typing.Any):
        print(f"Syncing Summary Data for Room {key}")
        await self._write_to_db(key)

    async def write_summary(self, room_id, summary):
        self.set(room_id, summary, ttl=600)
