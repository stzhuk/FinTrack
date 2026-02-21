"""Integration tests for protected user profile routes."""

from fastapi.testclient import TestClient


def _register_and_get_access_token(client: TestClient, email: str) -> str:
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": email,
            "password": "StrongPassword123!",
        },
    )
    return response.json()["access_token"]


def test_get_me_returns_user_profile(client: TestClient) -> None:
    """GET /api/users/me should return the authenticated user profile."""
    token = _register_and_get_access_token(client, "me@example.com")

    response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["email"] == "me@example.com"
    assert payload["name"] == "Test User"


def test_get_me_requires_auth_header(client: TestClient) -> None:
    """GET /api/users/me should reject unauthenticated requests."""
    response = client.get("/api/users/me")

    assert response.status_code == 401


def test_update_me_updates_profile_fields(client: TestClient) -> None:
    """PUT /api/users/me should update supported profile fields."""
    token = _register_and_get_access_token(client, "update@example.com")

    update_response = client.put(
        "/api/users/me",
        json={"name": "Updated Name"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Updated Name"

    read_response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert read_response.status_code == 200
    assert read_response.json()["name"] == "Updated Name"
