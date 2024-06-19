from fastapi import APIRouter, FastAPI

from app.modules.user.model import UserLogin

user_router = APIRouter()


@user_router.post("/signup")
async def signup():
    return {"token": "token"}


@user_router.post("/login")
async def login(data: UserLogin):
    return {data.email, data.password}


def init_user_routes(app: FastAPI):
    app.include_router(user_router, prefix="/user")
