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
    except jwt.DecodeError as e:
        raise HTTPException(status_code=400, detail="Invalid token: " + str(e))
    except jwt.ExpiredSignatureError as e:
        raise HTTPException(status_code=400, detail="Expired token: " + str(e))
    except jwt.InvalidAudienceError as e:
        raise HTTPException(status_code=400, detail="Invalid audience: " + str(e))
    except jwt.InvalidIssuerError as e:
        raise HTTPException(status_code=400, detail="Invalid issuer: " + str(e))
    except Exception as e:
        raise HTTPException(
            status_code=400, detail="Token verification failed: " + str(e)
        )
