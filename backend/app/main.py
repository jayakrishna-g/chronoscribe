from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.config as cfg
from app.core import core_router
from app.database import Database
from app.modules import api_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@asynccontextmanager
async def startup_event():
    db = Database.instance()
    db.connect(cfg.config.database_url, cfg.config.app_name)
    yield
    db.close()


app.include_router(api_router)
app.include_router(core_router)

print(app.routes)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8080, reload=True)
