import asyncio
from typing import Any


class Cache:
    def __init__(self, name: str = ""):
        self.cache = {}
        self.register_sync_func(name, 120)
        self.name = name

    async def _get(self, key: str) -> Any:
        return self.cache.get(key)

    async def _set(self, key: str, value: Any, ttl: int = 120) -> None:
        self.cache[key] = value

    async def sync_func(self, key: str, value: Any):
        raise NotImplementedError("Sync Function Not Implemented")

    def delete(self, key: str) -> None:
        if key in self.cache:
            del self.cache[key]

    def clear(self) -> None:
        self.cache = {}

    def register_sync_func(self, key: str, ttl: int) -> None:
        async def sync():
            while True:
                cur_cache = await self._get(key)
                await self.sync_func(key, cur_cache)
                await asyncio.sleep(ttl)

        asyncio.get_event_loop().create_task(sync())
