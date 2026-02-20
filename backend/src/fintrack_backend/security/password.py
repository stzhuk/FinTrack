"""Password hashing and verification utilities."""

from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plain text password using the configured password context."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain text password against a stored hash."""
    return pwd_context.verify(plain_password, hashed_password)
