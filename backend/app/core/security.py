import base64
import hashlib
import hmac
import json
import secrets
import time

import bcrypt
from fastapi.security import HTTPBearer

from app.core.config import settings


security = HTTPBearer(auto_error=False)


# ---------------------------------------------------------
# Password hashing
# ---------------------------------------------------------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


# ---------------------------------------------------------
# Signed session tokens (HMAC-SHA256, JWT-shaped)
# ---------------------------------------------------------

def _encode_part(data: bytes) -> str:
    """
    Convert bytes to URL-safe Base64 without '=' padding.
    """
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _decode_part(value: str) -> bytes:
    """
    Decode URL-safe Base64 without '=' padding.
    """
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def create_token(sub: str, email: str, role: str, expire_minutes: int) -> str:
    """
    Create a signed authentication token for a user or admin.
    `role` is either "user" or "admin" and decides which table `sub` refers to.
    """

    now = int(time.time())

    payload = {
        "sub": sub,
        "email": email,
        "role": role,
        "iat": now,
        "exp": now + (expire_minutes * 60),
    }

    header = {
        "alg": "HS256",
        "typ": "IBHUB",
    }

    encoded_header = _encode_part(
        json.dumps(header, separators=(",", ":")).encode("utf-8")
    )

    encoded_payload = _encode_part(
        json.dumps(payload, separators=(",", ":")).encode("utf-8")
    )

    message = f"{encoded_header}.{encoded_payload}".encode("utf-8")

    signature = hmac.new(
        settings.secret_key.encode("utf-8"),
        message,
        hashlib.sha256,
    ).digest()

    encoded_signature = _encode_part(signature)

    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"


def create_admin_token(sub: str, email: str) -> str:
    return create_token(sub, email, "admin", settings.admin_token_expire_minutes)


def create_user_token(sub: str, email: str) -> str:
    return create_token(sub, email, "user", settings.user_token_expire_minutes)


def verify_token(token: str) -> dict:
    """
    Verify the token signature and expiration.

    Raises ValueError when the token is invalid.
    """

    parts = token.split(".")

    if len(parts) != 3:
        raise ValueError("Invalid token")

    encoded_header, encoded_payload, encoded_signature = parts

    message = f"{encoded_header}.{encoded_payload}".encode("utf-8")

    expected_signature = hmac.new(
        settings.secret_key.encode("utf-8"),
        message,
        hashlib.sha256,
    ).digest()

    try:
        actual_signature = _decode_part(encoded_signature)
    except Exception as exc:
        raise ValueError("Invalid token signature") from exc

    if not hmac.compare_digest(expected_signature, actual_signature):
        raise ValueError("Invalid token signature")

    try:
        payload = json.loads(_decode_part(encoded_payload))
    except Exception as exc:
        raise ValueError("Invalid token payload") from exc

    if not isinstance(payload, dict):
        raise ValueError("Invalid token payload")

    expiration = payload.get("exp")

    if not isinstance(expiration, int):
        raise ValueError("Invalid token expiration")

    if expiration <= int(time.time()):
        raise ValueError("Token expired")

    if not payload.get("email") or not payload.get("sub") or not payload.get("role"):
        raise ValueError("Invalid token payload")

    return payload


# ---------------------------------------------------------
# Password reset tokens
#
# The raw token is only ever handed to the user via the emailed link. The
# database stores nothing but its SHA-256 hash, so a leaked database can
# never be used to reset anyone's password.
# ---------------------------------------------------------

def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)


def hash_reset_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
