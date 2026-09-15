from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.services import auth_service
from app.services.auth_service import AuthError
from app.services.email_service import send_password_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])


class SignupRequest(BaseModel):
    fullName: str
    email: EmailStr
    phone: str | None = None
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str


class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    if len(data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long.",
        )

    try:
        return auth_service.signup(
            db,
            full_name=data.fullName,
            email=data.email,
            phone=data.phone,
            password=data.password,
        )
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        return auth_service.login(db, email=data.email, password=data.password)
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    raw_token = auth_service.create_password_reset_token_for_user(db, data.email)

    if raw_token is not None:
        reset_url = f"{settings.frontend_url.rstrip('/')}/reset-password?token={raw_token}"
        send_password_reset_email(data.email, reset_url)

    # Identical response whether or not the account exists.
    return {"sent": True}


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    if len(data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long.",
        )

    try:
        auth_service.reset_user_password(db, data.token, data.password)
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    return {"reset": True}


@router.get("/me")
def get_me(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    try:
        return auth_service.get_profile(db, current_user["sub"])
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if len(data.newPassword) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long.",
        )

    try:
        auth_service.change_password(
            db,
            user_id=current_user["sub"],
            current_password=data.currentPassword,
            new_password=data.newPassword,
        )
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    return {"changed": True}
