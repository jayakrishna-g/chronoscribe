import token
from pydantic import BaseModel, EmailStr


class User(BaseModel):
    username: str
    email: EmailStr | None = None
    full_name: str | None = None
    disabled: bool | None = False


class UserCreate(User):
    password: str


class UserUpdate(User):
    password: str | None = None


class UserLogin(User):
    password: str
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    token: str | None = None


class UserInDB(User):
    hashed_password: str
