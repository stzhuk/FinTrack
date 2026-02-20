"""Unit tests for user CRUD operations."""

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from fintrack_backend.crud.user import user_crud
from fintrack_backend.database import Base
from fintrack_backend.models.user import User
from fintrack_backend.schemas.user import UserCreate, UserUpdate


def _create_test_session() -> Session:
    """Create an isolated in-memory SQLite session for tests."""
    engine = create_engine("sqlite+pysqlite:///:memory:", future=True)
    Base.metadata.create_all(bind=engine)
    session_factory = sessionmaker(
        bind=engine, autocommit=False, autoflush=False)
    return session_factory()


def test_create_and_get_user_by_email() -> None:
    """Created user should be retrievable by email."""
    db = _create_test_session()
    try:
        created_user = user_crud.create(
            db,
            UserCreate(name="Alice", email="alice@example.com",
                       password="secret123"),
        )

        fetched_user = user_crud.get_by_email(db, "alice@example.com")

        assert fetched_user is not None
        assert fetched_user.id == created_user.id
        assert fetched_user.password_hash != "secret123"
    finally:
        db.close()


def test_update_user_name() -> None:
    """Updating a user should persist new values."""
    db = _create_test_session()
    try:
        created_user = user_crud.create(
            db,
            UserCreate(name="Bob", email="bob@example.com",
                       password="secret123"),
        )

        updated_user = user_crud.update(
            db, created_user.id, UserUpdate(name="Bobby"))

        assert updated_user is not None
        assert updated_user.name == "Bobby"
    finally:
        db.close()


def test_delete_user_returns_true_when_user_exists() -> None:
    """Delete should return True when an existing user is removed."""
    db = _create_test_session()
    try:
        created_user = user_crud.create(
            db,
            UserCreate(name="Carol", email="carol@example.com",
                       password="secret123"),
        )

        was_deleted = user_crud.delete(db, created_user.id)
        deleted_user = user_crud.get_by_id(db, created_user.id)

        assert was_deleted is True
        assert deleted_user is None
    finally:
        db.close()


def test_delete_user_returns_false_when_missing() -> None:
    """Delete should return False when user does not exist."""
    db = _create_test_session()
    try:
        assert user_crud.delete(db, "missing-id") is False
    finally:
        db.close()
