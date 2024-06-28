from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

import app.config as cfg


class Database:
    def __init__(self) -> None:
        self._client: AsyncIOMotorClient = None  # type: ignore
        self._db: AsyncIOMotorDatabase = None  # type: ignore

    @staticmethod
    def instance():
        _identifier = "database"
        instance: Database = globals().get(_identifier)  # type: ignore

        if instance:
            return instance

        else:
            instance = Database()
            instance.connect(cfg.config.database_url)
            globals()[_identifier] = instance
            return instance

    def connect(self, uri, db: str = "chronoscribe"):
        print(f"Connecting to Database with URI {uri} and DB {db}")
        print(f"Connecting to Database with URI {uri} and DB {db}")
        self._client = AsyncIOMotorClient(uri)
        self._db = self._client[db]  # type: ignore

    def get_collection(self, collection: str):
        return self._db[collection]

    def close(self):
        self._client.close()
