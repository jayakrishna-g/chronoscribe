from urllib import response

import jwt
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.base import BaseHTTPMiddleware
from fastapi.security import HTTPBearer

import app.config as cfg


def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            cfg.config.keycloak_public_key,
            algorithms=[cfg.config.jwt_algorithm],
            audience=cfg.config.keycloak_audience,
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


class JWTVerificationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if "authorization" not in request.headers:
            raise HTTPException(status_code=401, detail="Authorization header missing")

        auth = request.headers["authorization"]
        try:
            scheme, token = auth.split()
            if scheme.lower() != "bearer":
                raise HTTPException(
                    status_code=401, detail="Invalid authentication scheme"
                )

            payload = verify_token(token)
            request.state.user = payload  # Attach user payload to request state
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=401, detail=f"Token verification failed: {str(e)}"
            )

        response = await call_next(request)
        return response
