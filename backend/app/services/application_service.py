from sqlalchemy.orm import Session

from app.database.models import Application, ApplicationTimelineEvent, Document, Payment
from app.services.timeline_service import timeline_to_response


def _document_to_response(document: Document) -> dict:
    return {
        "id": document.id,
        "type": document.document_type,
        "fileName": document.original_filename,
        "fileSize": (
            int(document.file_size)
            if document.file_size and str(document.file_size).isdigit()
            else document.file_size
        ),
        "mimeType": document.content_type,
        "status": document.status,
        "rejectionReason": document.rejection_reason,
        "uploadedAt": document.created_at,
    }


def _payment_to_response(payment: Payment) -> dict:
    def _num(value):
        try:
            return float(value)
        except (TypeError, ValueError):
            return 0

    return {
        "orderId": payment.id,
        "paymentId": payment.gateway_payment_id,
        "reference": payment.payment_reference,
        "gateway": payment.payment_method,
        "amount": _num(payment.amount),
        "currency": payment.currency,
        "status": payment.status,
        "breakdown": {
            "visaFee": _num(payment.visa_fee),
            "serviceFee": _num(payment.service_fee),
            "tax": _num(payment.tax),
        },
        "paidAt": payment.updated_at if payment.status == "PAID" else None,
    }


def build_application_detail(db: Session, application: Application) -> dict:
    """
    Full application payload shared by the applicant-facing and admin
    endpoints: applicant/travel info plus documents, payment and the
    persisted timeline. Internal notes are intentionally excluded here —
    only the admin endpoint attaches those.
    """

    documents = (
        db.query(Document)
        .filter(Document.application_id == application.id)
        .order_by(Document.created_at.asc())
        .all()
    )

    payment = (
        db.query(Payment)
        .filter(Payment.application_id == application.id)
        .order_by(Payment.created_at.desc())
        .first()
    )

    timeline_events = (
        db.query(ApplicationTimelineEvent)
        .filter(ApplicationTimelineEvent.application_id == application.id)
        .order_by(ApplicationTimelineEvent.created_at.asc())
        .all()
    )

    return {
        "id": application.id,
        "countrySlug": application.country_slug,
        "countryName": application.country_name,
        "countryCode": application.country_code,
        "visaTypeId": application.visa_type_id,
        "visaTypeLabel": application.visa_type_label,
        "applicant": {
            "firstName": application.first_name,
            "lastName": application.last_name,
            "dateOfBirth": application.date_of_birth,
            "gender": application.gender,
            "nationality": application.nationality,
            "passportNumber": application.passport_number,
            "passportIssueDate": application.passport_issue_date,
            "passportExpiryDate": application.passport_expiry_date,
            "countryOfResidence": application.country_of_residence,
            "address": application.address,
            "city": application.city,
            "state": application.state,
            "postalCode": application.postal_code,
            "phone": application.phone,
            "email": application.email,
        },
        "travel": {
            "travelStartDate": application.travel_start_date,
            "travelEndDate": application.travel_end_date,
        },
        "documents": [_document_to_response(d) for d in documents],
        "payment": _payment_to_response(payment) if payment else None,
        "status": application.status,
        "timeline": timeline_to_response(timeline_events),
        "createdAt": application.created_at,
        "updatedAt": application.updated_at,
    }
