from typing import Any

import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo.results import InsertOneResult

import app.config as cfg

_Document = dict[str, Any]


class Database:
    def __init__(self, uri: str, db: str) -> None:
        self.client = motor.motor_asyncio.AsyncIOMotorClient(uri)
        self.db = self.client[db]
        print(f"Connected to database {db}")

    def get_collection(self, collection: str) -> AsyncIOMotorCollection:
        return self.db[collection]

    async def find_one(
        self, collection: str, query: dict[str, Any]
    ) -> _Document | None:
        return await self.db[collection].find_one(query)

    async def find(self, collection: str, query: dict[str, Any]) -> list[_Document]:
        cursor = self.db[collection].find(query)
        return await cursor.to_list(length=None)  # Fetch all documents

    async def insert_one(
        self, collection: str, document: dict[str, Any]
    ) -> InsertOneResult:
        return await self.db[collection].insert_one(document)

    async def insert_many(
        self, collection: str, documents: list[dict[str, Any]]
    ) -> None:
        await self.db[collection].insert_many(documents)

    async def update_one(
        self, collection: str, query: dict[str, Any], update: dict[str, Any]
    ) -> None:
        await self.db[collection].update_one(query, update)

    async def update_many(
        self, collection: str, query: dict[str, Any], update: dict[str, Any]
    ) -> None:
        await self.db[collection].update_many(query, update)

    async def delete_one(self, collection: str, query: dict[str, Any]) -> None:
        await self.db[collection].delete_one(query)

    async def delete_many(self, collection: str, query: dict[str, Any]) -> None:
        await self.db[collection].delete_many(query)


def get_database(
    uri: str = cfg.config.database_url, db: str = "darkknight"
) -> Database:
    if "db_instance" not in globals():
        global db_instance
        db_instance = Database(uri, db)
    return db_instance  # type: ignore
