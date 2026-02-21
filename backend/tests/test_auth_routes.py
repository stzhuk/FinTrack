"""Integration tests for authentication API routes."""

from fastapi.testclient import TestClient


def test_register_returns_token_pair_and_user_payload(client: TestClient) -> None:
    """Register endpoint should create user and return auth tokens."""
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Alice",
            "email": "alice@example.com",
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert payload["access_token"]
    assert payload["refresh_token"]
    assert payload["user"]["email"] == "alice@example.com"


def test_register_rejects_duplicate_email(client: TestClient) -> None:
    """Register endpoint should reject an already existing email."""
    payload = {
        "name": "Bob",
        "email": "bob@example.com",
        "password": "StrongPassword123!",
    }
    first = client.post("/api/auth/register", json=payload)
    second = client.post("/api/auth/register", json=payload)

    assert first.status_code == 201
    assert second.status_code == 400
    assert second.json()["detail"] == "Email is already registered"


def test_login_returns_tokens_for_valid_credentials(client: TestClient) -> None:
    """Login endpoint should authenticate valid users."""
    client.post(
        "/api/auth/register",
        json={
            "name": "Carol",
            "email": "carol@example.com",
            "password": "StrongPassword123!",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "carol@example.com", "password": "StrongPassword123!"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["access_token"]
    assert payload["refresh_token"]
    assert payload["user"]["name"] == "Carol"


def test_login_rejects_invalid_credentials(client: TestClient) -> None:
    """Login endpoint should reject incorrect credentials."""
    response = client.post(
        "/api/auth/login",
        json={"email": "missing@example.com", "password": "invalid"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_refresh_returns_new_access_token(client: TestClient) -> None:
    """Refresh endpoint should issue a new access token for valid refresh token."""
    register_response = client.post(
        "/api/auth/register",
        json={
            "name": "Dora",
            "email": "dora@example.com",
            "password": "StrongPassword123!",
        },
    )

    refresh_token = register_response.json()["refresh_token"]
    response = client.post(f"/api/auth/refresh?refresh_token={refresh_token}")

    assert response.status_code == 200
    payload = response.json()
    assert payload["access_token"]
    assert payload.get("refresh_token") is None
    assert payload["user"]["email"] == "dora@example.com"


def test_refresh_rejects_invalid_token(client: TestClient) -> None:
    """Refresh endpoint should reject malformed/invalid refresh tokens."""
    response = client.post("/api/auth/refresh?refresh_token=invalid-token")

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid refresh token"
