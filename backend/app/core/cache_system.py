import asyncio
from typing import Any

from redis import asyncio as aioredis


class Cache:
    def __init__(self, name: str, redis_url: str = "redis://localhost:6379"):
        self.redis = aioredis.from_url(redis_url, decode_responses=True)
        self.name = name

    async def _get(self, key: str) -> Any:
        return await self.redis.hget(self.name, key)  # type: ignore

    async def _set(self, key: str, value: Any, ttl: int = 120) -> None:
        await self.redis.hset(self.name, key, value)  # type: ignore
        await self.redis.expire(self.name, ttl)

    async def sync_func(self, key: str, value: str):
        raise NotImplementedError("Sync Function Not Implemented")

    async def delete(self, key: str) -> None:
        await self.redis.hdel(self.name, key)  # type: ignore

    async def clear(self) -> None:
        await self.redis.delete(self.name)

    async def register_sync_func(self, ttl: int) -> None:
        async def sync():
            while True:
                keys = await self.redis.hkeys(self.name)  # type: ignore
                for key in keys:
                    value = await self._get(key.decode())
                    await self.sync_func(key.decode(), value)
                await asyncio.sleep(ttl)

        asyncio.get_event_loop().create_task(sync())
