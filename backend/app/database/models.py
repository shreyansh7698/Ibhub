from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
        index=True,
    )

    full_name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    password_hash = Column(String(255), nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
        index=True,
    )

    full_name = Column(String(200), nullable=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


class PasswordResetToken(Base):
    """
    Stores only a SHA-256 hash of the reset token, never the raw value.
    `kind` distinguishes applicant resets from admin resets since they
    reference different owner tables.
    """

    __tablename__ = "password_reset_tokens"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
        index=True,
    )

    token_hash = Column(String(64), unique=True, nullable=False, index=True)
    kind = Column(String(10), nullable=False)  # "user" or "admin"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    admin_id = Column(String(36), ForeignKey("admin_users.id"), nullable=True)

    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Application(Base):
    __tablename__ = "applications"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
        index=True,
    )

    # Owning user (every application belongs to exactly one authenticated user)
    user_id = Column(
        String(36),
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    # Visa information
    country_slug = Column(String(100), nullable=False)
    country_name = Column(String(150), nullable=False)
    country_code = Column(String(10), nullable=False)

    visa_type_id = Column(String(100), nullable=False)
    visa_type_label = Column(String(150), nullable=False)

    # Applicant information
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    date_of_birth = Column(String(20), nullable=True)
    gender = Column(String(30), nullable=True)
    nationality = Column(String(100), nullable=True)

    passport_number = Column(String(100), nullable=True)
    passport_issue_date = Column(String(20), nullable=True)
    passport_expiry_date = Column(String(20), nullable=True)

    country_of_residence = Column(String(150), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    postal_code = Column(String(30), nullable=True)

    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)

    # Travel information
    travel_start_date = Column(String(20), nullable=True)
    travel_end_date = Column(String(20), nullable=True)

    # Application state
    status = Column(
        String(50),
        nullable=False,
        default="DRAFT",
    )

    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


class Document(Base):
    __tablename__ = "documents"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
        index=True,
    )

    # Which application owns this document
    application_id = Column(
        String(36),
        ForeignKey("applications.id"),
        nullable=False,
        index=True,
    )

    # Document information
    document_type = Column(
        String(100),
        nullable=False,
    )

    original_filename = Column(
        String(255),
        nullable=False,
    )

    stored_filename = Column(
        String(255),
        nullable=False,
    )

    file_path = Column(
        String(500),
        nullable=False,
    )

    content_type = Column(
        String(100),
        nullable=True,
    )

    file_size = Column(
        String(50),
        nullable=True,
    )

    # Verification status
    status = Column(
        String(50),
        nullable=False,
        default="PENDING",
    )

    rejection_reason = Column(
        Text,
        nullable=True,
    )

    # Timestamp
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

class Payment(Base):
    __tablename__ = "payments"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
        index=True,
    )

    application_id = Column(
        String(36),
        ForeignKey("applications.id"),
        nullable=False,
        index=True,
    )

    payment_reference = Column(
        String(100),
        unique=True,
        nullable=False,
    )

    amount = Column(
        String(50),
        nullable=False,
    )

    visa_fee = Column(
        String(50),
        nullable=False,
        default="0",
    )

    service_fee = Column(
        String(50),
        nullable=False,
        default="0",
    )

    tax = Column(
        String(50),
        nullable=False,
        default="0",
    )

    currency = Column(
        String(10),
        nullable=False,
        default="INR",
    )

    payment_method = Column(
        String(50),
        nullable=False,
    )

    status = Column(
        String(50),
        nullable=False,
        default="CREATED",
    )

    gateway_order_id = Column(
        String(150),
        nullable=True,
    )

    gateway_payment_id = Column(
        String(150),
        nullable=True,
    )

    gateway_signature = Column(
        String(500),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


class ApplicationNote(Base):
    """Internal admin notes attached to an application. One application can have many."""

    __tablename__ = "application_notes"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
        index=True,
    )

    application_id = Column(
        String(36),
        ForeignKey("applications.id"),
        nullable=False,
        index=True,
    )

    body = Column(Text, nullable=False)
    created_by = Column(String(255), nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class ApplicationTimelineEvent(Base):
    """Append-only audit trail of everything that happens to an application."""

    __tablename__ = "application_timeline_events"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
        index=True,
    )

    application_id = Column(
        String(36),
        ForeignKey("applications.id"),
        nullable=False,
        index=True,
    )

    event_type = Column(String(50), nullable=False)
    label = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    actor_type = Column(String(20), nullable=True)  # "user" | "admin" | "system"
    actor_label = Column(String(255), nullable=True)

    internal = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)