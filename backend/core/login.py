from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from modules.user.model import UserLogin
from modules.user.service import authenticate_user, create_user

login_router = APIRouter()

@login_router.post("/signup")
async def signup(data: UserLogin):
    print(data)
    try:
        user = create_user(data)
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
    return {"status": True, "message": "Login successful", "token": user.get("access_token")}
