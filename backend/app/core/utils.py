from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from app.config import config


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=150)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, config.jwt_secret_key, algorithm=config.jwt_algorithm
    )
    return encoded_jwt


def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token, config.jwt_secret_key, algorithms=[config.jwt_algorithm]
        )
        return payload
    except Exception:
        return None


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)
