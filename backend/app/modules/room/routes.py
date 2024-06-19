from fastapi import APIRouter, FastAPI, WebSocket, WebSocketDisconnect

from app.modules.room.connection_manager import get_connection_manager
from app.modules.room.model import RoomCreate
from app.modules.room.service import (
    create_room,
    get_owner_rooms,
    get_room,
    handle_room_socket,
)

room_router = APIRouter()
connection_manager = get_connection_manager()


@room_router.get("/{room_id}")
async def fetch_room(room_id: str):
    print("fetching room with id", room_id)
    room = await get_room(room_id)
    print("room fetched", room)
    if not room:
        return {"error": "Room not found"}
    return room.dict()


@room_router.get("/all/{owner}")
async def get_all_rooms(owner: str):
    owner_rooms = await get_owner_rooms(owner)
    print("owner rooms", owner_rooms)
    return {"rooms": owner_rooms}


@room_router.post("/")
async def new_room(room: RoomCreate):
    print("creating room")
    room_id = await create_room(room.name, room.description, room.owner)
    print("room created", room_id)
    return {"room_id": room_id}


@room_router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    if not await get_room(room_id):
        await websocket.accept()
        await websocket.send_text("Invalid room ID")
        await websocket.close()
        return

    await connection_manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            data = eval(data)
            await handle_room_socket(websocket, data, room_id, connection_manager)
    except WebSocketDisconnect:
        await connection_manager.disconnect(websocket, room_id)


def init_room_routes(app: FastAPI):
    app.include_router(room_router)
