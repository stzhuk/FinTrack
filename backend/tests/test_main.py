"""Unit tests for application entrypoint behavior."""

from fastapi.testclient import TestClient

import fintrack_backend.main as main_module


async def _noop() -> None:
    """Async no-op used to disable DB lifecycle during tests."""


main_module.init_db = _noop
main_module.close_db = _noop
client = TestClient(main_module.app)


def test_health_check() -> None:
    """Health endpoint returns service status and version."""
    response = client.get("/api/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "healthy"
    assert "version" in payload
