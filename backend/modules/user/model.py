from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class User(BaseModel):
    username: str
    email: EmailStr | None = None
    full_name: str | None = None
    disabled: bool | None = False
    

class UserInDB(User):
    hashed_password: str


class UserCreate(User):
    password: str


class UserUpdate(User):
    password: Optional[str] = None


class UserLogin(User):
    password: str
    username: str



class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserInDB(User):
    hashed_password: str