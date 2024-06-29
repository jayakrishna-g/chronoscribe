from urllib import request, response

import jwt
from fastapi import HTTPException

import app.config as cfg


def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            cfg.config.keycloak_public_key,
            algorithms=[cfg.config.jwt_algorithm],
            audience=cfg.config.keycloak_audience,
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
