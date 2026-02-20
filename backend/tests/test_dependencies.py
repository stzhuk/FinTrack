"""Unit tests for shared FastAPI dependencies."""

import asyncio

import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from fintrack_backend.dependencies import get_current_user


def test_get_current_user_returns_user_id_for_valid_token(monkeypatch) -> None:
    """Dependency should return user ID extracted from a valid token payload."""

    def fake_verify_token(token: str) -> dict[str, str]:
        assert token == "valid-token"
        return {"sub": "user-42"}

    monkeypatch.setattr(
        "fintrack_backend.dependencies.verify_token", fake_verify_token)
    credentials = HTTPAuthorizationCredentials(
        scheme="Bearer", credentials="valid-token")

    result = asyncio.run(get_current_user(credentials))

    assert result == {"user_id": "user-42"}


def test_get_current_user_raises_for_invalid_token(monkeypatch) -> None:
    """Dependency should raise HTTP 401 when token cannot be decoded."""

    def fake_verify_token(token: str):
        return None

    monkeypatch.setattr(
        "fintrack_backend.dependencies.verify_token", fake_verify_token)
    credentials = HTTPAuthorizationCredentials(
        scheme="Bearer", credentials="invalid")

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(get_current_user(credentials))

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid authentication credentials"
