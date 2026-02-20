"""Database primitives and lifecycle helpers for the application."""

import logging
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from fintrack_backend.config import settings

logger = logging.getLogger(__name__)

engine = create_engine(
    settings.DATABASE_URL,
    future=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)

Base = declarative_base()


def get_db() -> Generator:
    """Yield a database session and ensure it is closed after usage."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def init_db():
    """Initialize database schema.

    Uses SQLAlchemy metadata to create missing tables.
    """
    Base.metadata.create_all(bind=engine)


async def close_db():
    """Dispose database engine connections during application shutdown."""
    engine.dispose()
