from typing import Any, Mapping  # noqa: UP035

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from app.core.utils import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)
from app.database import Database
from app.modules.user.model import UserInDB, UserLogin

db = Database().instance()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

user_coll = db.get_collection("users")

print(user_coll.find())


async def get_user(username: str) -> Mapping[str, Any] | None:
    user = await user_coll.find_one({"username": username})
    return user


async def create_user(user: UserLogin):
    user_dict = user.model_dump()
    user_dict["hashed_password"] = get_password_hash(user_dict["password"])
    del user_dict["password"]
    print(user_dict)
    await user_coll.insert_one(user_dict)
    del user_dict["_id"]
    return user_dict


async def authenticate_user(username: str, password: str):
    user_mapping = await get_user(username)
    if not user_mapping:
        return False
    user = {
        v: user_mapping[v] for v in filter(lambda x: x != "_id", user_mapping.keys())
    }
    print(user)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    del user["hashed_password"]
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
        username: str = payload.get("sub")  # type: ignore
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
