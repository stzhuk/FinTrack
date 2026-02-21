"""Shared pytest fixtures for API integration tests."""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

import fintrack_backend.main as main_module
from fintrack_backend.database import Base, get_db
from fintrack_backend.models.user import User


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    """Provide an isolated SQLite session that persists for a single test."""
    engine = create_engine(
        "sqlite+pysqlite://",
        future=True,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    session_factory = sessionmaker(
        bind=engine, autocommit=False, autoflush=False)
    Base.metadata.create_all(bind=engine)

    session = session_factory()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """Create a test client wired to the test database and no-op lifespan hooks."""

    async def _noop() -> None:
        return None

    main_module.init_db = _noop
    main_module.close_db = _noop

    def _override_get_db() -> Generator[Session, None, None]:
        yield db_session

    main_module.app.dependency_overrides[get_db] = _override_get_db

    with TestClient(main_module.app) as test_client:
        yield test_client

    main_module.app.dependency_overrides.clear()
