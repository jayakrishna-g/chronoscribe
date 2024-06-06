import json
import asyncio
from fastapi import FastAPI
from fastapi import WebSocket
import uvicorn
import config as cfg 
from database import get_database
from core.login import login_router
from fastapi.middleware.cors import CORSMiddleware
from modules.room.routes import room_router
from modules.room.service import handle_room_socket

app = FastAPI(root_path='/api')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


db = get_database(cfg.config.database_url, "darkknight")

app.include_router(login_router)


app.include_router(room_router)



if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8080, reload=True)

