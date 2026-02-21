"""Authentication endpoints for registration, login, and token refresh."""

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack_backend.config import settings
from fintrack_backend.crud.user import user_crud
from fintrack_backend.database import get_db
from fintrack_backend.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from fintrack_backend.models.user import User
from fintrack_backend.schemas.user import UserCreate
from fintrack_backend.security.jwt import create_access_token, create_refresh_token, verify_token
from fintrack_backend.security.password import verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _build_token_response(user: User, refresh_token: str | None = None) -> dict:
    """Build a consistent auth payload for login/register/refresh endpoints."""
    payload = {
        "access_token": create_access_token(
            data={"sub": user.id},
            expires_delta=timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        ),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
    }

    if refresh_token is not None:
        payload["refresh_token"] = refresh_token

    return payload


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
        user_data: RegisterRequest,
        db: Session = Depends(get_db)
):
    """Register a new user and return a token pair."""
    existing_user = user_crud.get_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    user = user_crud.create(
        db,
        UserCreate(
            name=user_data.name,
            email=user_data.email,
            password=user_data.password,
        ),
    )

    refresh_token = create_refresh_token(data={"sub": user.id})

    return _build_token_response(user, refresh_token=refresh_token)


@router.post("/login", response_model=TokenResponse)
async def login(
        credentials: LoginRequest,
        db: Session = Depends(get_db)
):
    """Authenticate a user and return a token pair."""
    user = user_crud.get_by_email(db, credentials.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    refresh_token = create_refresh_token(data={"sub": user.id})

    return _build_token_response(user, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
        refresh_token: str,
        db: Session = Depends(get_db)
):
    """Issue a new access token from a valid refresh token."""
    payload = verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user_id = payload.get("sub")
    user = user_crud.get_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return _build_token_response(user)
