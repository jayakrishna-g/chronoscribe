from enum import Enum

from app.modules.room.cache import (
    RoomActivityCache,
    RoomCache,
    RoomMetaCache,
    SummaryCache,
    TranscriptCache,
)


class CacheName(str, Enum):
    room = "room"
    transcript = "transcript"
    summary = "summary"
    room_meta = "room_meta"
    genric = "generic"
    room_activity = "room_activity"


class CacheManager:
    def __init__(self) -> None:
        self.cache_list: dict[
            CacheName,
            RoomCache
            | RoomMetaCache
            | TranscriptCache
            | SummaryCache
            | None
            | RoomActivityCache,
        ] = {}
        for cache_name in CacheName:
            self.cache_list[cache_name] = None

    def add_cache(self, cache_name: CacheName, cache) -> None:
        self.cache_list[cache_name] = cache

    def create_cache(self, cache_name: CacheName) -> None:
        if cache_name == CacheName.room:
            self.cache_list[cache_name] = RoomCache()
        elif cache_name == CacheName.transcript:
            self.cache_list[cache_name] = TranscriptCache()
        elif cache_name == CacheName.summary:
            self.cache_list[cache_name] = SummaryCache()
        elif cache_name == CacheName.room_meta:
            self.cache_list[cache_name] = RoomMetaCache()
        elif cache_name == CacheName.room_activity:
            self.cache_list[cache_name] = RoomActivityCache()
        else:
            raise Exception("Invalid Cache Name")

    def get_cache(self, cache_name: CacheName):
        for cache in self.cache_list.keys():
            if cache == cache_name:
                if self.cache_list[cache_name]:
                    return self.cache_list[cache_name]
                else:
                    self.create_cache(cache_name)
                    return self.cache_list[cache_name]

        return None


def get_cache_manager() -> CacheManager:
    if "room_cache_manager" not in globals():
        globals()["room_cache_manager"] = CacheManager()
    return globals()["room_cache_manager"]
