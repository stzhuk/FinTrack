"""Shared FastAPI dependencies used across routers."""

from typing import TypedDict

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from fintrack_backend.security.jwt import verify_token


bearer_scheme = HTTPBearer()


class CurrentUser(TypedDict):
    """Authenticated user context extracted from JWT."""

    user_id: str


async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> CurrentUser:
    """Resolve current user identity from a bearer JWT token."""
    token = credentials.credentials

    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return CurrentUser(user_id=user_id)
