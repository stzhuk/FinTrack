"""Convenience CLI commands for local development workflows."""

import subprocess


def dev():
    """Run development server with auto-reload enabled."""
    subprocess.run(
        ["uvicorn", "fintrack_backend.main:app", "--reload"],
        check=True,
    )


def test():
    """Execute test suite using pytest."""
    subprocess.run(["pytest"], check=True)
