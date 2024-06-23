import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import jwt
from app.core import core_router
from app.database import get_database
from app.modules import api_router

import app.config as cfg
import app.TokenVerification as tv

app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(tv.JWTVerificationMiddleware)


db = get_database(cfg.config.database_url, "darkknight")

app.include_router(api_router)
app.include_router(core_router)

print(app.routes)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8080, reload=True)
