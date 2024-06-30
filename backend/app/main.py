from contextlib import asynccontextmanager

import jwt
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from loguru import logger

import app.config as cfg
import app.TokenVerification as tv
from app.core import core_router
from app.database import Database
from app.modules import api_router

# db.connect(cfg.config.database_url)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
def verify_token(request, call_next):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")
        # try:
    print(token)
    #     payload = tv.verify_token(token.split(" ")[1])
    #     request.state.user = payload
    #     print(payload)
    # except ExpiredSignatureError:
    #     raise HTTPException(status_code=401, detail="Token has expired")
    # except InvalidTokenError as e:
    #     raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    return call_next(request)


@asynccontextmanager
async def startup_event():
    db = Database.instance()
    db.connect(cfg.config.database_url, cfg.config.app_name)
    yield
    db.close()


app.include_router(api_router)
app.include_router(core_router)


logger.info(f"{app.routes}")


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8080, reload=True)
