import json
import typing
from datetime import datetime

from bson import ObjectId
from loguru import logger

from app.core.cache_system import Cache
from app.database import Database
from app.modules.room.model import (
    Room,
    RoomActivity,
    RoomMetaData,
    SummaryInstance,
    TranscriptInstance,
)

db = Database().instance()


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)


def object_hook(dct):
    for key, value in dct.items():
        if key == "_id" or key == "meta_data_id":
            dct[key] = ObjectId(value)
        elif key in ["timestamp", "created_at", "updated_at"]:
            dct[key] = datetime.fromisoformat(value)
    return dct


class BaseCache(Cache):
    def __init__(self, cache_name, redis_url):
        super().__init__(cache_name, redis_url)

    async def _get_from_collection(self, collection, query):
        return await collection.find_one(query)

    async def _update_collection(self, collection, query, update):
        return await collection.update_one(query, update, upsert=True)

    async def _serialize(self, data):
        return json.dumps(data.dict(), cls=JSONEncoder)

    async def _deserialize(self, data, model_class):
        if data:
            return model_class(**json.loads(data, object_hook=object_hook))
        return None


class RoomCache(BaseCache):
    def __init__(self):
        super().__init__("room_cache", "redis://localhost:6379")
        self._collection = db.get_collection("rooms")

    async def get_room(self, room_id) -> Room | None:
        room_data = await self._get(room_id)
        if room_data:
            # logger.info(, "room_data")
            return await self._deserialize(room_data, Room)
        room_from_db = await self._get_from_collection(
            self._collection, {"id": room_id}
        )
        if room_from_db:
            await self.set_room(room_id, Room(**room_from_db))
            return Room(**room_from_db)
        return None

    async def set_room(self, room_id, room: Room):
        await self._set(room_id, await self._serialize(room))

    async def sync_func(self, key: str, value: typing.Any):
        await self._update_collection(
            self._collection,
            {"id": key},
            {"$set": json.loads(value, object_hook=object_hook)},
        )


class RoomMetaCache(BaseCache):
    def __init__(self):
        super().__init__("room_meta_cache", "redis://localhost:6379")
        self._collection = db.get_collection("room_meta")

    async def get_room_meta(self, room_id) -> RoomMetaData | None:
        room_meta_data = await self._get(room_id)
        if room_meta_data:
            return await self._deserialize(room_meta_data, RoomMetaData)
        room_meta_from_db = await self._get_from_collection(
            self._collection, {"room_id": room_id}
        )
        if room_meta_from_db:
            await self.set_room_meta(room_id, RoomMetaData(**room_meta_from_db))
            return RoomMetaData(**room_meta_from_db)
        return None

    async def set_room_meta(self, room_id, room_meta: RoomMetaData):
        await self._set(room_id, await self._serialize(room_meta), ttl=600)

    async def sync_func(self, key: str, value: typing.Any):
        await self._update_collection(
            self._collection,
            {"room_id": key},
            {"$set": json.loads(value, object_hook=object_hook)},
        )


class TranscriptCache(BaseCache):
    def __init__(self):
        super().__init__("transcript_cache", "redis://localhost:6379")
        self._collection = db.get_collection("transcript")

    async def get_transcript(self, room_id) -> list[TranscriptInstance] | None:
        transcript_data = await self._get(room_id)
        # print(transcript_data)
        if transcript_data:
            # transcript_data = json.loads(transcript_data, object_hook=object_hook)
            return [
                await self._deserialize(instance, TranscriptInstance)
                for instance in json.loads(transcript_data)
            ]  # type: ignore
        return None

    async def set_transcript(self, room_id, transcript: TranscriptInstance):
        # print(transcript)
        cur_transcript = await self.get_transcript(room_id)
        if cur_transcript is None:
            cur_transcript = [transcript]
        # print(cur_transcript[-1].index, transcript.index)
        if cur_transcript[-1].index < transcript.index:
            cur_transcript.append(transcript)
        elif cur_transcript[-1].index == transcript.index:
            cur_transcript[-1] = transcript

        # print(cur_transcript)
        serialized_transcript = [
            await self._serialize(instance) for instance in cur_transcript
        ]
        serialized_transcript = json.dumps(serialized_transcript, cls=JSONEncoder)
        await self._set(
            room_id,
            serialized_transcript,
            ttl=6000,
        )

    async def sync_func(self, key: str, value: typing.Any):
        await self._update_collection(
            self._collection,
            {"room_id": key},
            {"$set": {"instances": json.loads(value)}},
        )


class SummaryCache(BaseCache):
    def __init__(self):
        super().__init__("summary_cache", "redis://localhost:6379")
        self._collection = db.get_collection("summary")

    async def get_summary(self, room_id) -> list[SummaryInstance] | None:
        summary_data = await self._get(room_id)
        if summary_data:
            return [
                await self._deserialize(instance, SummaryInstance)
                for instance in json.loads(summary_data)
            ]  # type: ignore
        summary_from_db = self._collection.find({"room_id": room_id})

        summary_from_db = [
            SummaryInstance(**instance)
            async for instance in summary_from_db.sort("timestamp")
        ]

        if summary_from_db:
            await self.set_summary(
                room_id,
                summary_from_db,
            )
            return summary_from_db
        return None

    async def set_summary(self, room_id, summary: list[SummaryInstance]):
        cur_summary = await self.get_summary(room_id)
        if cur_summary is None:
            cur_summary = []
        if len(cur_summary) == 0:
            cur_summary = summary
        else:
            cur_summary = sorted(cur_summary + summary, key=lambda x: x.timestamp)
        serialized_summary = [
            await self._serialize(instance) for instance in cur_summary
        ]
        await self._set(
            room_id,
            json.dumps(serialized_summary, cls=JSONEncoder),
            ttl=6000,
        )

    async def sync_func(self, key: str, value: typing.Any):
        await self._update_collection(
            self._collection,
            {"room_id": key},
            {"$set": {"instances": json.loads(value)}},
        )


class RoomActivityCache(BaseCache):
    def __init__(self):
        super().__init__("room_activity_cache", "redis://localhost:6379")
        self._collection = db.get_collection("room_activity")

    async def get_all(self, user_id) -> list[RoomActivity] | None:
        db_activites = self._collection.find({"user_id": user_id})
        db_activities = [
            RoomActivity(**activity)
            async for activity in db_activites.sort("timestamp", -1)
        ]
        cache_activities = await self.get_user_activity(user_id)

        # print(db_activities)
        # print(cache_activities)

        final_activities = []
        if db_activities:
            final_activities += db_activities
        if cache_activities:
            for activity in cache_activities:
                if activity not in final_activities:
                    final_activities.append(activity)
        final_activities.sort(key=lambda x: x.timestamp, reverse=True)
        return final_activities

    async def get_user_activity(self, user_id) -> list[RoomActivity] | None:
        hash_key = "room_activity_cache"
        pattern = f"{user_id}_*"
        cursor = b"0"
        entries = []
        while cursor:
            cursor, fields = await self.redis.hscan(hash_key, cursor, match=pattern)  # type: ignore
            print(fields)
            for field, value in fields.items():
                entries.append((field, value))
        logger.info(entries)
        user_activity_data = []
        for key, value in entries:
            user_activity_data.append(value)
        if user_activity_data:
            return [
                await self._deserialize(instance, RoomActivity)
                for instance in user_activity_data
            ]  # type: ignore
        user_activity_from_db = self._collection.find({"user_id": user_id})
        user_activity_from_db = [
            RoomActivity(**instance)
            async for instance in user_activity_from_db.sort("timestamp", -1).limit(10)
        ]
        if user_activity_from_db:
            for instance in user_activity_from_db:
                await self.set_room_activity(instance.room_id, user_id, instance)
            return user_activity_from_db
        return None

    async def get_room_activity(self, room_id, user_id) -> RoomActivity | None:
        room_activity_data = await self._get(f"{user_id}_{room_id}")
        if room_activity_data:
            return [
                await self._deserialize(instance, RoomActivity)
                for instance in json.loads(room_activity_data)
            ]  # type: ignore
        room_activity_from_db = await self._get_from_collection(
            self._collection, {"room_id": room_id, "user_id": user_id}
        )
        if room_activity_from_db:
            await self.set_room_activity(
                room_id, user_id, RoomActivity(**room_activity_from_db)
            )
            return RoomActivity(**room_activity_from_db)
        return None

    async def set_room_activity(self, room_id, user_id, room_meta: RoomActivity):
        await self._set(
            f"{user_id}_{room_id}", await self._serialize(room_meta), ttl=600
        )

    async def sync_func(self, key: str, value: typing.Any):
        res = await self._collection.find_one_and_update(
            {"room_id": key.split("_")[1], "user_id": key.split("_")[0]},
            {"$set": json.loads(value, object_hook=object_hook)},
        )
        if not res:
            await self._collection.insert_one(
                json.loads(value, object_hook=object_hook)
            )
