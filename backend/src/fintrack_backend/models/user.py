"""User SQLAlchemy model definitions."""

import uuid
from datetime import datetime, UTC

from sqlalchemy import Boolean, Column, DateTime, String

from fintrack_backend.database import Base


class User(Base):
    """Persistent user account model."""

    __tablename__ = "users"

    id = Column(String(36), primary_key=True,
                default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True),
                        default=lambda: datetime.now(UTC))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )

    def __repr__(self):
        """Return string representation for logs and debugging."""
        return f"<User {self.email}>"
