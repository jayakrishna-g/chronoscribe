from getpass import getuser
from os import name
from app.TokenVerification import verify_token
from app.modules.user.service import create_user, user_exists
from fastapi import APIRouter, FastAPI

from app.modules.room.routes import room_router
from app.modules.user.model import TokenData, User
from app.modules.user.routes import user_router

api_router = APIRouter()

api_router.include_router(user_router)
api_router.include_router(room_router)


def init_app_routes(app: FastAPI) -> None:
    app.include_router(api_router)
    return None


@api_router.post("/api/verify")
async def verify(data: TokenData):
    if data.token is None:
        # Handle the case where token is not provided in the request
        return {"status": False, "message": "Token is missing"}
    # print(data.token)  # Proceed with a non-None token
    # Add your token verification logic here
    payload = verify_token(data.token)
    user: User = User(
        full_name=payload["name"],
        email=payload["email"],
        username=payload["preferred_username"],
    )
    if user_exists(payload["email"]) is False:
        user = await create_user(user)
        return {"status": True, "message": "User created"}

    return {"status": True, "message": "Token is verified "}
