from fastapi import APIRouter, FastAPI

from app.modules.room.routes import room_router
from app.modules.user.routes import user_router

api_router = APIRouter()

api_router.include_router(user_router)
api_router.include_router(room_router)


def init_app_routes(app: FastAPI) -> None:
    app.include_router(api_router)
    return None
