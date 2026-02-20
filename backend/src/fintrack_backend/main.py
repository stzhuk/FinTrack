"""FastAPI application entrypoint for FinTrack backend."""

from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from fintrack_backend.config import settings
from fintrack_backend.database import init_db, close_db
from fintrack_backend.routers import (
    auth_router,
    users_router,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown lifecycle tasks for the application."""
    logger.info("Starting FinTrack API")
    await init_db()
    logger.info("Database initialized")
    yield
    logger.info("Shutting down FinTrack API")
    await close_db()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*"],
)

app.include_router(auth_router)
app.include_router(users_router)


@app.get("/api/health", tags=["health"])
async def health_check():
    """Return service health and current API version."""
    return {
        "status": "healthy",
        "version": settings.PROJECT_VERSION,
    }
