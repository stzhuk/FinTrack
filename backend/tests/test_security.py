"""Unit tests for password and JWT security utilities."""

from datetime import timedelta

from fintrack_backend.security.jwt import (
    create_access_token,
    create_refresh_token,
    get_user_id_from_token,
    verify_token,
)
from fintrack_backend.security.password import hash_password, verify_password


def test_password_hash_and_verify_roundtrip() -> None:
    """Password hashing should produce verifiable non-plain-text hashes."""
    plain_password = "StrongPassword123!"

    hashed_password = hash_password(plain_password)

    assert hashed_password != plain_password
    assert verify_password(plain_password, hashed_password) is True
    assert verify_password("wrong-password", hashed_password) is False


def test_access_token_roundtrip_contains_subject() -> None:
    """Access token should decode and contain expected subject."""
    token = create_access_token(
        {"sub": "user-123"},
        expires_delta=timedelta(minutes=5),
    )

    payload = verify_token(token)

    assert payload is not None
    assert payload["sub"] == "user-123"


def test_refresh_token_contains_refresh_type() -> None:
    """Refresh token should include refresh type marker."""
    token = create_refresh_token({"sub": "user-999"})

    payload = verify_token(token)

    assert payload is not None
    assert payload["type"] == "refresh"


def test_get_user_id_from_token_ignores_refresh_token() -> None:
    """User ID extractor should ignore refresh tokens by design."""
    access_token = create_access_token({"sub": "user-access"})
    refresh_token = create_refresh_token({"sub": "user-refresh"})

    assert get_user_id_from_token(access_token) == "user-access"
    assert get_user_id_from_token(refresh_token) is None
