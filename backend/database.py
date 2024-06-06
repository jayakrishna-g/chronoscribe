import motor.motor_asyncio
import config as cfg
db_instance = None

class Database:

    def __init__(self, uri: str, db: str):
        self.client = motor.motor_asyncio.AsyncIOMotorClient(uri)
        self.db = self.client[db]
        print(f"Connected to database {db}")

    def get_collection(self, collection: str):
        return self.db[collection]
    
    async def find_one(self, collection: str, query: dict):
        return await self.db[collection].find_one(query)
    
    async def find(self, collection: str, query: dict):
        return self.db[collection].find(query)
    
    async def insert_one(self, collection: str, document: dict):
        return await self.db[collection].insert_one(document)
    
    async def insert_many(self, collection: str, documents: list):
        return await self.db[collection].insert_many(documents)
    
    async def update_one(self, collection: str, query: dict, update: dict):
        return await self.db[collection].update_one(query, update)
    
    async def update_many(self, collection: str, query: dict, update: dict):
        return await self.db[collection].update_many(query, update)
    
    async def delete_one(self, collection: str, query: dict):
        return await self.db[collection].delete_one(query)
    
    async def delete_many(self, collection: str, query: dict):
        return await self.db[collection].delete_many(query)
    

def get_database(uri = cfg.config.database_url, db = "darkknight"):
    global db_instance
    if not db_instance:
        db_instance = Database(uri, db)
    return db_instance
