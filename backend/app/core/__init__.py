from fastapi import APIRouter

from app.core.login import login_router

core_router = APIRouter()

core_router.include_router(login_router)
