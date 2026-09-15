import os
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.dependencies import get_current_user_or_admin
from app.database.database import get_db
from app.database.models import Application, Document
from app.schemas.document import DocumentRead
from app.services.timeline_service import add_timeline_event


router = APIRouter(
    prefix="/applications",
    tags=["documents"],
)

UPLOAD_DIR = settings.upload_dir
MAX_UPLOAD_BYTES = settings.max_upload_size_mb * 1024 * 1024

ALLOWED_CONTENT_TYPES = {
    "application/pdf": ".pdf",
    "image/jpeg": (".jpg", ".jpeg"),
    "image/png": ".png",
}

os.makedirs(UPLOAD_DIR, exist_ok=True)


def _require_application_access(db: Session, application_id: str, current_user: dict) -> Application:
    """
    A document belongs to an application. Only the application's owning
    applicant, or an admin, may touch it.
    """

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

    role = current_user.get("role")

    if role == "admin":
        return application

    if role == "user" and application.user_id == current_user.get("sub"):
        return application

    # 404 rather than 403 to avoid confirming the application exists to a
    # user who does not own it.
    raise HTTPException(
        status_code=404,
        detail="Application not found",
    )


@router.post(
    "/{application_id}/documents",
    response_model=DocumentRead,
)
async def upload_document(
    application_id: str,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_or_admin),
):
    application = _require_application_access(db, application_id, current_user)

    # Basic file validation — content type must be one we accept.
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, JPG and PNG files are allowed.",
        )

    # The extension is derived from the validated content type, never trusted
    # from the client-supplied filename, which also rules out path traversal.
    expected_extensions = ALLOWED_CONTENT_TYPES[file.content_type]
    if isinstance(expected_extensions, str):
        expected_extensions = (expected_extensions,)

    extension = expected_extensions[0]

    stored_filename = f"{uuid4()}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        stored_filename,
    )

    # Save the uploaded file, enforcing a hard size cap while streaming so an
    # oversized upload can't exhaust disk space before being rejected.
    file_size = 0

    try:
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                file_size += len(chunk)

                if file_size > MAX_UPLOAD_BYTES:
                    buffer.close()
                    os.remove(file_path)
                    raise HTTPException(
                        status_code=400,
                        detail=f"File exceeds the maximum size of {settings.max_upload_size_mb}MB.",
                    )

                buffer.write(chunk)
    except HTTPException:
        raise
    except Exception:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail="Failed to store the uploaded file.")

    # A safe display filename derived only from the original name's
    # extension-free stem (truncated), never used to build a filesystem path.
    safe_original_name = os.path.basename(file.filename or "document")[:255]

    # Replace any previous document of the same type for this application.
    previous = (
        db.query(Document)
        .filter(
            Document.application_id == application_id,
            Document.document_type == document_type,
        )
        .first()
    )

    if previous is not None:
        if previous.file_path and os.path.exists(previous.file_path):
            os.remove(previous.file_path)
        db.delete(previous)
        db.commit()

    # Create database record
    document = Document(
        application_id=application_id,
        document_type=document_type,
        original_filename=safe_original_name,
        stored_filename=stored_filename,
        file_path=file_path,
        content_type=file.content_type,
        file_size=str(file_size),
        status="PENDING",
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    add_timeline_event(
        db,
        application_id=application_id,
        event_type="DOCUMENT_UPLOADED",
        label=f"Document uploaded: {document_type}",
        actor_type=current_user.get("role"),
        actor_label=current_user.get("email"),
    )

    return document



@router.get(
    "/{application_id}/documents",
    response_model=list[DocumentRead],
)
def get_documents(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_or_admin),
):
    _require_application_access(db, application_id, current_user)

    documents = (
        db.query(Document)
        .filter(Document.application_id == application_id)
        .order_by(Document.created_at.desc())
        .all()
    )

    return documents


@router.delete(
    "/{application_id}/documents/{document_id}",
)
def delete_document(
    application_id: str,
    document_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_or_admin),
):
    _require_application_access(db, application_id, current_user)

    # Find the document
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.application_id == application_id,
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    # Delete the physical file
    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)

    # Delete the database record
    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully",
        "documentId": document_id,
    }



@router.get(
    "/{application_id}/documents/{document_id}/access",
)
def access_document(
    application_id: str,
    document_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_or_admin),
):
    _require_application_access(db, application_id, current_user)

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.application_id == application_id,
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    if not os.path.exists(document.file_path):
        raise HTTPException(
            status_code=404,
            detail="Document file not found",
        )

    return FileResponse(
        path=document.file_path,
        media_type=document.content_type or "application/octet-stream",
        filename=document.original_filename,
    )
