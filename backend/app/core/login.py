from app.TokenVerification import JWTVerificationMiddleware, verify_token
from fastapi import APIRouter, HTTPException

from app.modules.user.model import UserLogin
from app.modules.user.service import authenticate_user, create_user
from fastapi import Request


login_router = APIRouter()


@login_router.post("/signup")
async def signup(data: UserLogin):
    print(data)
    try:
        user = await create_user(data)
        print(user)
        if not user:
            return HTTPException(status_code=400, detail="User already exists")
        return user
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@login_router.post("/login")
async def login(data: UserLogin):
    print(data)
    user = await authenticate_user(data.username, data.password)
    if not user:
        return HTTPException(status_code=400, detail="Incorrect username or password")
    return {
        "status": True,
        "message": "Login successful",
        "token": user.get("access_token"),
    }


@login_router.post("/verify")
async def verify(data):
    print(data)
    verify_token(data.token)
    return {"status": True, "message": "Token is valid"}
