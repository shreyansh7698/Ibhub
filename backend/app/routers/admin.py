from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.dependencies import get_current_admin
from app.core.security import create_admin_token
from app.database.database import get_db
from app.database.models import Application, ApplicationNote, Document
from app.schemas.admin import AdminLogin
from app.services import admin_service
from app.services.admin_service import AdminAuthError
from app.services.application_service import build_application_detail
from app.services.email_service import send_password_reset_email
from app.services.timeline_service import add_timeline_event

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)


class AdminStatusUpdate(BaseModel):
    status: str
    note: str | None = None


class AdminNoteCreate(BaseModel):
    body: str


class AdminDocumentStatusUpdate(BaseModel):
    status: str
    reason: str | None = None


class AdminForgotPasswordRequest(BaseModel):
    email: str


class AdminResetPasswordRequest(BaseModel):
    token: str
    password: str


@router.post("/login")
async def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    admin = admin_service.validate_admin(db, data.email, data.password)

    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_admin_token(sub=admin.id, email=admin.email)

    expires_at = datetime.utcnow() + timedelta(minutes=settings.admin_token_expire_minutes)

    return {
        "session": {
            "token": token,
            "email": admin.email,
            "role": "admin",
            "expiresAt": expires_at.isoformat() + "Z",
        }
    }


@router.post("/forgot-password")
async def admin_forgot_password(data: AdminForgotPasswordRequest, db: Session = Depends(get_db)):
    raw_token = admin_service.create_admin_password_reset_token(db, data.email)

    if raw_token is not None:
        reset_url = f"{settings.frontend_url.rstrip('/')}/admin/reset-password?token={raw_token}"
        send_password_reset_email(data.email, reset_url, product_name="IBHub Admin")

    # Identical response whether or not the account exists.
    return {"sent": True}


@router.post("/reset-password")
async def admin_reset_password(data: AdminResetPasswordRequest, db: Session = Depends(get_db)):
    if len(data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long.",
        )

    try:
        admin_service.reset_admin_password(db, data.token, data.password)
    except AdminAuthError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    return {"reset": True}


@router.get("/")
async def admin_root(
    current_user: dict = Depends(get_current_admin),
):
    return {
        "message": "Admin authentication successful.",
        "user": current_user,
    }


@router.get("/applications")
async def admin_list_applications(
    search: str | None = None,
    country: str | None = None,
    visaType: str | None = None,
    paymentStatus: str | None = None,
    status: str | None = None,
    from_: str | None = Query(
        default=None,
        alias="from",
    ),
    to: str | None = None,
    page: int = 1,
    pageSize: int = 20,
    sort: str = "createdAt",
    dir: str = "desc",
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin),
):
    applications, total = admin_service.list_applications(
        db=db,
        search=search,
        country=country,
        visa_type=visaType,
        payment_status=paymentStatus,
        status=status,
        date_from=from_,
        date_to=to,
        page=page,
        page_size=pageSize,
        sort=sort,
        direction=dir,
    )

    return {
        "items": [
            {
                "id": application.id,
                "countrySlug": application.country_slug,
                "countryName": application.country_name,
                "countryCode": application.country_code,
                "visaTypeId": application.visa_type_id,
                "visaTypeLabel": application.visa_type_label,
                "applicant": {
                    "firstName": application.first_name,
                    "lastName": application.last_name,
                    "email": application.email,
                    "phone": application.phone,
                    "passportNumber": application.passport_number,
                },
                "status": application.status,
                "createdAt": application.created_at,
                "updatedAt": application.updated_at,
            }
            for application in applications
        ],
        "total": total,
        "page": page,
        "pageSize": pageSize,
    }


@router.get("/applications/{application_id}")
async def admin_get_application(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin),
):
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    detail = build_application_detail(db, application)

    note_rows = (
        db.query(ApplicationNote)
        .filter(ApplicationNote.application_id == application.id)
        .order_by(ApplicationNote.created_at.asc())
        .all()
    )

    detail["notes"] = [
        {
            "id": note.id,
            "body": note.body,
            "createdAt": note.created_at,
            "by": note.created_by,
        }
        for note in note_rows
    ]

    return detail


@router.patch("/applications/{application_id}/status")
async def admin_set_status(
    application_id: str,
    data: AdminStatusUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin),
):
    allowed_statuses = {
        "UNDER_REVIEW",
        "DOCUMENT_VERIFICATION",
        "PROCESSING",
        "APPROVED",
        "REJECTED",
        "COMPLETED",
    }

    new_status = data.status.strip().upper()

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid application status. "
                "Allowed statuses: "
                "UNDER_REVIEW, DOCUMENT_VERIFICATION, "
                "PROCESSING, APPROVED, REJECTED, COMPLETED"
            ),
        )

    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    application.status = new_status

    note_body = data.note.strip() if data.note else None

    if note_body:
        application.notes = note_body
        db.add(
            ApplicationNote(
                application_id=application.id,
                body=note_body,
                created_by=current_user.get("email", "admin"),
            )
        )

    db.commit()
    db.refresh(application)

    add_timeline_event(
        db,
        application_id=application.id,
        event_type="STATUS_CHANGED",
        label=f"Application status changed to {new_status.replace('_', ' ').title()}",
        actor_type="admin",
        actor_label=current_user.get("email"),
    )

    return {
        "id": application.id,
        "status": application.status,
        "note": application.notes,
        "updatedAt": application.updated_at,
    }



@router.patch("/documents/{document_id}/status")
async def admin_set_document_status(
    document_id: str,
    data: AdminDocumentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin),
):
    allowed_statuses = {
        "PENDING",
        "VERIFIED",
        "REJECTED",
    }

    new_status = data.status.strip().upper()

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid document status. "
                "Allowed statuses: PENDING, VERIFIED, REJECTED"
            ),
        )

    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    # A rejection should contain a reason.
    if new_status == "REJECTED":
        if not data.reason or not data.reason.strip():
            raise HTTPException(
                status_code=400,
                detail="A rejection reason is required when rejecting a document",
            )

        document.rejection_reason = data.reason.strip()

    else:
        # Clear an old rejection reason when the document
        # is moved back to PENDING or VERIFIED.
        document.rejection_reason = None

    document.status = new_status

    db.commit()
    db.refresh(document)

    add_timeline_event(
        db,
        application_id=document.application_id,
        event_type="DOCUMENT_VERIFIED" if new_status == "VERIFIED" else (
            "DOCUMENT_REJECTED" if new_status == "REJECTED" else "DOCUMENT_STATUS_CHANGED"
        ),
        label=f"Document '{document.document_type}' marked {new_status.lower()}",
        description=document.rejection_reason,
        actor_type="admin",
        actor_label=current_user.get("email"),
    )

    return {
        "id": document.id,
        "status": document.status,
        "rejectionReason": document.rejection_reason,
        "updatedAt": document.updated_at,
    }


@router.post("/applications/{application_id}/notes")
async def admin_add_note(
    application_id: str,
    data: AdminNoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin),
):
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    body = data.body.strip()

    if not body:
        raise HTTPException(
            status_code=400,
            detail="Note body cannot be empty",
        )

    note = ApplicationNote(
        application_id=application.id,
        body=body,
        created_by=current_user.get("email", "admin"),
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    add_timeline_event(
        db,
        application_id=application.id,
        event_type="NOTE_ADDED",
        label="Internal note added",
        actor_type="admin",
        actor_label=current_user.get("email"),
        internal=True,
    )

    return {
        "id": note.id,
        "body": note.body,
        "at": note.created_at,
        "by": note.created_by,
    }


@router.get("/stats")
async def admin_get_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin),
):
    return admin_service.get_admin_stats(db)
