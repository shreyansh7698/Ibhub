from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_user_token,
    generate_reset_token,
    hash_password,
    hash_reset_token,
    verify_password,
)
from app.database.models import PasswordResetToken, User


class AuthError(Exception):
    """Raised for user-facing authentication errors (bad credentials, duplicate email, etc)."""


def _session_payload(user: User) -> dict:
    token = create_user_token(sub=user.id, email=user.email)

    expires_at = datetime.utcnow() + timedelta(minutes=settings.user_token_expire_minutes)

    return {
        "token": token,
        "role": "user",
        "email": user.email,
        "fullName": user.full_name,
        "expiresAt": expires_at.isoformat() + "Z",
    }


def signup(db: Session, full_name: str, email: str, phone: str | None, password: str) -> dict:
    normalized_email = email.strip().lower()

    existing = db.query(User).filter(User.email == normalized_email).first()

    if existing is not None:
        raise AuthError("An account with this email already exists.")

    user = User(
        full_name=full_name.strip(),
        email=normalized_email,
        phone=phone,
        password_hash=hash_password(password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return _session_payload(user)


def login(db: Session, email: str, password: str) -> dict:
    normalized_email = email.strip().lower()

    user = db.query(User).filter(User.email == normalized_email).first()

    if user is None or not verify_password(password, user.password_hash):
        raise AuthError("Invalid email or password.")

    return _session_payload(user)


def _create_reset_token(db: Session, kind: str, user_id: str | None, admin_id: str | None) -> str:
    raw_token = generate_reset_token()

    reset_token = PasswordResetToken(
        token_hash=hash_reset_token(raw_token),
        kind=kind,
        user_id=user_id,
        admin_id=admin_id,
        expires_at=datetime.utcnow() + timedelta(minutes=settings.password_reset_token_expire_minutes),
    )

    db.add(reset_token)
    db.commit()

    return raw_token


def create_password_reset_token_for_user(db: Session, email: str) -> str | None:
    """
    Returns the raw reset token if the account exists, otherwise None.
    Callers must respond identically either way to avoid account enumeration.
    """

    normalized_email = email.strip().lower()

    user = db.query(User).filter(User.email == normalized_email).first()

    if user is None:
        return None

    return _create_reset_token(db, kind="user", user_id=user.id, admin_id=None)


def reset_user_password(db: Session, raw_token: str, new_password: str) -> None:
    token_hash = hash_reset_token(raw_token)

    reset_token = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.kind == "user",
        )
        .first()
    )

    if reset_token is None or reset_token.used_at is not None:
        raise AuthError("This reset link is invalid or has expired.")

    if reset_token.expires_at < datetime.utcnow():
        raise AuthError("This reset link is invalid or has expired.")

    user = db.query(User).filter(User.id == reset_token.user_id).first()

    if user is None:
        raise AuthError("This reset link is invalid or has expired.")

    user.password_hash = hash_password(new_password)
    reset_token.used_at = datetime.utcnow()
    _invalidate_other_reset_tokens(db, user.id, exclude_id=reset_token.id)

    db.commit()


def _invalidate_other_reset_tokens(db: Session, user_id: str, exclude_id: str | None = None) -> None:
    query = db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user_id,
        PasswordResetToken.kind == "user",
        PasswordResetToken.used_at.is_(None),
    )

    if exclude_id is not None:
        query = query.filter(PasswordResetToken.id != exclude_id)

    for token in query.all():
        token.used_at = datetime.utcnow()


def get_profile(db: Session, user_id: str) -> dict:
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise AuthError("Account not found.")

    return {
        "email": user.email,
        "fullName": user.full_name,
        "phone": user.phone,
        "createdAt": user.created_at,
    }


def change_password(db: Session, user_id: str, current_password: str, new_password: str) -> None:
    user = db.query(User).filter(User.id == user_id).first()

    if user is None or not verify_password(current_password, user.password_hash):
        raise AuthError("Current password is incorrect.")

    user.password_hash = hash_password(new_password)
    _invalidate_other_reset_tokens(db, user.id)

    db.commit()
