import random
import string

from app.database import get_database
from app.modules.room.model import Room, RoomMetaData

db = get_database()
room_coll = db.get_collection("rooms")
room_meta_coll = db.get_collection("room_meta")


async def check_id(id: str):
    return await room_coll.find_one({"room_id": id})


async def get_unique_id():
    cur_id = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    while await check_id(cur_id) is not None:
        cur_id = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return cur_id


async def create_room(name: str, description: str, owner: str):
    room_meta = RoomMetaData(
        name=name,
        description=description,
        owner_id=owner,
        room_id=await get_unique_id(),
    )

    room_meta_result = await room_meta_coll.insert_one(room_meta.dict())

    if room_meta_result.inserted_id is None:
        raise Exception("Error in Inserting Room Meta Data")

    room = Room(meta_data=room_meta_result.inserted_id, id=room_meta.room_id)

    room_result = await room_coll.insert_one(room.dict())

    if room_result.inserted_id is None:
        raise Exception("Error in Inserting Room Data")

    return room_meta.room_id
