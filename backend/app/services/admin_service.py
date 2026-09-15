from datetime import datetime, timedelta

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    generate_reset_token,
    hash_password,
    hash_reset_token,
    verify_password,
)
from app.database.models import AdminUser, Application, Payment, PasswordResetToken


class AdminAuthError(Exception):
    """Raised for admin-facing authentication errors."""


def seed_default_admin(db: Session) -> None:
    """
    Ensure at least one admin account exists, seeded from the configured
    ADMIN_EMAIL / ADMIN_PASSWORD. Never overwrites an existing admin's
    password, so it is safe to call on every startup.
    """

    normalized_email = settings.admin_email.strip().lower()

    existing = db.query(AdminUser).filter(AdminUser.email == normalized_email).first()

    if existing is not None:
        return

    admin = AdminUser(
        email=normalized_email,
        full_name="Administrator",
        password_hash=hash_password(settings.admin_password),
    )

    db.add(admin)
    db.commit()


def get_admin_by_email(db: Session, email: str) -> AdminUser | None:
    normalized_email = email.strip().lower()
    return db.query(AdminUser).filter(AdminUser.email == normalized_email).first()


def validate_admin(db: Session, email: str, password: str) -> AdminUser | None:
    """
    Validate admin credentials against the database and return the matching
    admin record, or None when the credentials are invalid.
    """

    admin = get_admin_by_email(db, email)

    if admin is None or not verify_password(password, admin.password_hash):
        return None

    return admin


def create_admin_password_reset_token(db: Session, email: str) -> str | None:
    """
    Returns the raw reset token if an admin account exists for this email,
    otherwise None. Callers must respond identically either way.
    """

    admin = get_admin_by_email(db, email)

    if admin is None:
        return None

    raw_token = generate_reset_token()

    reset_token = PasswordResetToken(
        token_hash=hash_reset_token(raw_token),
        kind="admin",
        admin_id=admin.id,
        expires_at=datetime.utcnow() + timedelta(minutes=settings.password_reset_token_expire_minutes),
    )

    db.add(reset_token)
    db.commit()

    return raw_token


def reset_admin_password(db: Session, raw_token: str, new_password: str) -> None:
    """
    Resets an ADMIN's own password via a token from /admin/forgot-password.
    This path can only ever touch the `admin_users` table — it has no way to
    reach or modify a regular applicant's account.
    """

    token_hash = hash_reset_token(raw_token)

    reset_token = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.kind == "admin",
        )
        .first()
    )

    if reset_token is None or reset_token.used_at is not None:
        raise AdminAuthError("This reset link is invalid or has expired.")

    if reset_token.expires_at < datetime.utcnow():
        raise AdminAuthError("This reset link is invalid or has expired.")

    admin = db.query(AdminUser).filter(AdminUser.id == reset_token.admin_id).first()

    if admin is None:
        raise AdminAuthError("This reset link is invalid or has expired.")

    admin.password_hash = hash_password(new_password)
    reset_token.used_at = datetime.utcnow()

    other_tokens = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.admin_id == admin.id,
            PasswordResetToken.kind == "admin",
            PasswordResetToken.id != reset_token.id,
            PasswordResetToken.used_at.is_(None),
        )
        .all()
    )

    for token in other_tokens:
        token.used_at = datetime.utcnow()

    db.commit()


def list_applications(
    db: Session,
    search: str | None = None,
    country: str | None = None,
    visa_type: str | None = None,
    payment_status: str | None = None,
    status: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    page: int = 1,
    page_size: int = 20,
    sort: str = "createdAt",
    direction: str = "desc",
):
    """
    Return filtered and paginated applications for the admin dashboard.
    """

    query = db.query(Application)

    # Search
    if search:
        search_value = f"%{search.strip()}%"

        query = query.filter(
            or_(
                Application.first_name.ilike(search_value),
                Application.last_name.ilike(search_value),
                Application.email.ilike(search_value),
                Application.passport_number.ilike(search_value),
                Application.id.ilike(search_value),
            )
        )

    # Country
    if country:
        query = query.filter(
            Application.country_slug == country
        )

    # Visa type
    if visa_type:
        query = query.filter(
            Application.visa_type_id == visa_type
        )

    # Application status
    if status:
        query = query.filter(
            Application.status == status
        )

    # Payment status
    if payment_status:
        query = query.join(
            Payment,
            Payment.application_id == Application.id,
        ).filter(
            Payment.status == payment_status
        )

    # From date
    if date_from:
        try:
            from_date = datetime.fromisoformat(date_from)

            query = query.filter(
                Application.created_at >= from_date
            )
        except ValueError:
            pass

    # To date
    if date_to:
        try:
            to_date = datetime.fromisoformat(date_to)

            # If only a date was supplied, include the complete day.
            if len(date_to) == 10:
                to_date = to_date + timedelta(days=1)

            query = query.filter(
                Application.created_at < to_date
            )
        except ValueError:
            pass

    # Total before pagination
    total = query.count()

    # Sorting
    sort_columns = {
        "createdAt": Application.created_at,
        "updatedAt": Application.updated_at,
        "firstName": Application.first_name,
        "lastName": Application.last_name,
        "status": Application.status,
        "country": Application.country_name,
        "visaType": Application.visa_type_label,
    }

    sort_column = sort_columns.get(
        sort,
        Application.created_at,
    )

    if direction.lower() == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    # Safety limits
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)

    offset = (page - 1) * page_size

    applications = (
        query
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return applications, total


def get_admin_stats(db: Session):
    """
    Return statistics used by the admin dashboard.
    """

    # Total number of applications.
    total = (
        db.query(func.count(Application.id))
        .scalar()
        or 0
    )

    # Applications currently waiting for admin review.
    pending_review = (
        db.query(func.count(Application.id))
        .filter(Application.status == "UNDER_REVIEW")
        .scalar()
        or 0
    )

    # Applications waiting for documents.
    documents_pending = (
        db.query(func.count(Application.id))
        .filter(Application.status == "DOCUMENTS_PENDING")
        .scalar()
        or 0
    )

    # Applications whose application status is PAID.
    paid = (
        db.query(func.count(Application.id))
        .filter(Application.status == "PAID")
        .scalar()
        or 0
    )

    # Applications currently being processed.
    processing = (
        db.query(func.count(Application.id))
        .filter(Application.status == "PROCESSING")
        .scalar()
        or 0
    )

    # Approved applications.
    approved = (
        db.query(func.count(Application.id))
        .filter(Application.status == "APPROVED")
        .scalar()
        or 0
    )

    # Rejected applications.
    rejected = (
        db.query(func.count(Application.id))
        .filter(Application.status == "REJECTED")
        .scalar()
        or 0
    )

    # Applications created today.
    start_of_today = datetime.combine(
        datetime.utcnow().date(),
        datetime.min.time(),
    )

    start_of_tomorrow = start_of_today + timedelta(days=1)

    today_applications = (
        db.query(func.count(Application.id))
        .filter(
            Application.created_at >= start_of_today,
            Application.created_at < start_of_tomorrow,
        )
        .scalar()
        or 0
    )

    # Total revenue from successful payments.
    #
    # Payment.amount is stored as String in the current database model,
    # so SQLite may perform numeric conversion for SUM. We convert the
    # result to float for a clean API response.
    revenue_result = (
        db.query(func.sum(Payment.amount))
        .filter(Payment.status == "PAID")
        .scalar()
    )

    try:
        revenue = float(revenue_result or 0)
    except (TypeError, ValueError):
        revenue = 0.0

    return {
        "total": total,
        "pendingReview": pending_review,
        "documentsPending": documents_pending,
        "paid": paid,
        "processing": processing,
        "approved": approved,
        "rejected": rejected,
        "todayApplications": today_applications,
        "revenue": revenue,
    }