import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import app.config as cfg
import app.TokenVerification as tv
from app.core import core_router
from app.database import get_database
from app.modules import api_router

app = FastAPI(root_path="/api")

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


db = get_database(cfg.config.database_url, "darkknight")

app.include_router(api_router)
app.include_router(core_router)


print(app.routes)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8080, reload=True)
