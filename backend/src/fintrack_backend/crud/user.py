"""CRUD operations for user entities."""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from fintrack_backend.models.user import User
from fintrack_backend.schemas.user import UserCreate, UserUpdate
from fintrack_backend.security.password import hash_password


class UserCRUD:
    """Data access methods for the `User` model."""

    @staticmethod
    def create(db: Session, user_create: UserCreate) -> User:
        """Create and persist a new user."""
        db_user = User(
            name=user_create.name,
            email=user_create.email,
            password_hash=hash_password(user_create.password),
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_all(db: Session) -> list[User]:
        """Return all users."""
        query = select(User)
        return db.execute(query).scalars().all()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Return a user by email or `None` if it does not exist."""
        query = select(User).where(User.email == email)
        return db.execute(query).scalar_one_or_none()

    @staticmethod
    def get_by_id(db: Session, user_id: str) -> Optional[User]:
        """Return a user by ID or `None` if it does not exist."""
        query = select(User).where(User.id == user_id)
        return db.execute(query).scalar_one_or_none()

    @staticmethod
    def update(db: Session, user_id: str, user_update: UserUpdate) -> Optional[User]:
        """Update user fields and return updated user, or `None` if missing."""
        db_user = UserCRUD.get_by_id(db, user_id)
        if not db_user:
            return None

        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def delete(db: Session, user_id: str) -> bool:
        """Delete user by ID. Returns `True` when user existed and was deleted."""
        db_user = UserCRUD.get_by_id(db, user_id)
        if not db_user:
            return False
        db.delete(db_user)
        db.commit()
        return True


user_crud = UserCRUD()
