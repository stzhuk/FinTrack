import subprocess
import sys


def dev():
    subprocess.run(
        ["uvicorn", "fintrack_backend.main:app", "--reload"],
        check=True,
    )


def test():
    subprocess.run(["pytest"], check=True)
