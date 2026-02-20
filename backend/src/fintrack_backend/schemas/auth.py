"""Pydantic schemas for authentication-related endpoints."""

from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    """Credentials payload for user login."""

    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """Registration payload used to create a user account."""

    name: str
    email: EmailStr
    password: str


class TokenUser(BaseModel):
    """User details embedded in token responses."""

    id: str
    name: str
    email: EmailStr


class TokenResponse(BaseModel):
    """Standard auth response containing tokens and user summary."""

    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: TokenUser
