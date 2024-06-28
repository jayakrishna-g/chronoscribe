from fastapi import APIRouter, HTTPException
from loguru import logger

from app.modules.user.model import UserLogin
from app.modules.user.service import authenticate_user, create_user

login_router = APIRouter(prefix="/api")


@login_router.post("/signup")
async def signup(data: UserLogin):
    logger.info(data)
    try:
        user = await create_user(data)
        logger.info(user)
        if not user:
            return HTTPException(status_code=400, detail="User already exists")
        return user
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@login_router.post("/login")
async def login(data: UserLogin):
    logger.info(data)
    user = await authenticate_user(data.username, data.password)
    if not user:
        return HTTPException(status_code=400, detail="Incorrect username or password")
    return {
        "status": True,
        "message": "Login successful",
        "token": user.get("access_token"),
    }
