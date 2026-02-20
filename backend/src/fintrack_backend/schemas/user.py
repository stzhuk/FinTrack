"""Pydantic schemas for user API contracts."""

from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    """Payload for creating a new user account."""

    name: str
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Payload for partially updating user profile information."""

    name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    """Public representation of a user returned by API endpoints."""

    id: str
    name: str
    email: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
