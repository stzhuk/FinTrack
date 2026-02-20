"""JWT token creation and validation helpers."""

import logging
from datetime import datetime, timedelta, UTC
from typing import Optional

from jose import JWTError, jwt

from fintrack_backend.config import settings

logger = logging.getLogger(__name__)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed access token for the provided payload."""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """Create a signed refresh token for the provided payload."""
    to_encode = data.copy()
    expire = datetime.now(
        UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token.

    Returns decoded payload on success, otherwise `None`.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        logger.warning("Token verification failed")
        return None


def get_user_id_from_token(token: str) -> Optional[str]:
    """Extract user identifier from a valid non-refresh token."""
    payload = verify_token(token)
    if payload and payload.get("type") != "refresh":
        return payload.get("sub")
    return None
