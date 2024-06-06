from fastapi.security import OAuth2PasswordBearer
from modules.user.model import UserInDB
from core.utils import decode_access_token, get_password_hash, verify_password, create_access_token
from fastapi import Depends, HTTPException, WebSocket, status
from jose import JWTError
from database import get_database

db = get_database()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

user_coll = db.get_collection("users")

print(user_coll.find())

async def get_user(username: str) -> UserInDB:
    user = await user_coll.find_one({"username": username})
    return user
    
def create_user(user: UserInDB):
    user = user.dict()
    user["hashed_password"] = get_password_hash(user["password"])
    del user["password"]
    user_coll.insert_one(user)
    return user

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    print(user)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    del user["hashed_password"];
    user["access_token"] = create_access_token({"sub": user["username"]})
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(username=username)
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


