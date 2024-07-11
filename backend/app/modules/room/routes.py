from fastapi import APIRouter, FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from loguru import logger

from app.core.connection_manager import ConnectionManager
from app.modules.room.model import RoomCreate, RoomUpdate
from app.modules.room.service import (
    RoomMetaService,
    RoomService,
    TranscriptService,
    FileService,
    handle_room_socket,
)
import json

room_router = APIRouter()
api_prefix = "/api/room"
ws_prefix = "/ws/room"

room_api_router = APIRouter(prefix=api_prefix)
room_ws_router = APIRouter(prefix=ws_prefix)


connection_manager = ConnectionManager.instance()


@room_api_router.get("/meta/{room_id}")
async def fetch_room_meta(room_id: str):
    logger.info(f"fetching room meta with id {room_id}")
    room_meta = await RoomMetaService.instance().get(room_id)
    logger.info(f"room meta fetched {room_meta}")
    if not room_meta:
        return {"error": "Room not found"}
    return room_meta.model_dump_json()


@room_api_router.get("/data/{room_id}")
async def fetch_room(room_id: str):
    logger.info(f"fetching room with id {room_id}")
    room_meta = await RoomService.instance().get(room_id)
    logger.info(f"room  fetched {room_meta}")
    if not room_meta:
        return {"error": "Room not found"}
    return room_meta.model_dump_json()

@room_api_router.post("/file/{room_id}")
async def save_file(room_id: str,file: UploadFile = File(...)):
    logger.info(f"Saving room file with id {room_id}")
    logger.info(file)
    gcs_url = await FileService.instance().filesave(room_id,file)	
    return {"status":"success", "gcp_url": gcs_url}

@room_api_router.get("/transcript/{room_id}")
async def fetch_room_transcript(room_id: str):
    logger.info(f"fetching room transcript with id {room_id}")
    transcript = await TranscriptService.instance().get(room_id)
    logger.info(f"room transcript fetched {transcript}")
    return transcript


@room_api_router.post("/")
async def create_room(room: RoomCreate):
    logger.info("creating room")
    room_id = await RoomService.instance().create(room)
    logger.info(f"room created{room_id}")
    return {"room_id": room_id}


@room_api_router.put("/meta/{room_id}")
async def update_room_meta(room: RoomUpdate):
    logger.info(f"updating room meta with id {room.room_id} ")
    try:
        await RoomMetaService.instance().write(room.room_id, room.model_dump())

    except Exception as e:
        raise e
    return {"status": "Success"}


@room_ws_router.websocket("/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    # if not await get_room(room_id):
    #     await websocket.accept()
    #     await websocket.send_text("Invalid room ID")
    #     await websocket.close()
    #     return

    await connection_manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)
            await handle_room_socket(websocket, data, room_id, connection_manager)
    except WebSocketDisconnect:
        await connection_manager.disconnect(websocket, room_id)


room_router.include_router(room_api_router)
room_router.include_router(room_ws_router)


def init_room_routes(app: FastAPI):
    app.include_router(room_router)
