import logging

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.database.models import Application, Payment
from app.schemas.payment import PaymentCreate, PaymentRead, PaymentVerify
from app.services import payment_service
from app.services.data_service import get_visa_type_by_id
from app.services.timeline_service import add_timeline_event

logger = logging.getLogger("ibhub.payments")

router = APIRouter(prefix="/payments", tags=["payments"])


def payment_to_response(payment: Payment):
    return {
        "orderId": payment.id,
        "paymentId": payment.gateway_payment_id,
        "reference": payment.payment_reference,
        "gateway": payment.payment_method.lower(),
        "amount": float(payment.amount),
        "currency": payment.currency,
        "status": payment.status,
        "breakdown": {
            "visaFee": float(payment.visa_fee),
            "serviceFee": float(payment.service_fee),
            "tax": float(payment.tax),
        },
        "paidAt": payment.updated_at if payment.status == "PAID" else None,
    }


def _get_owned_application(db: Session, application_id: str, current_user: dict) -> Application:
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if application is None or application.user_id != current_user.get("sub"):
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return application


@router.post("/create-order", response_model=PaymentRead)
def create_order(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    application = _get_owned_application(db, payment_data.applicationId, current_user)

    visa_type = get_visa_type_by_id(
        application.country_slug,
        application.visa_type_id,
    )

    if visa_type is None:
        raise HTTPException(
            status_code=400,
            detail="Visa type not found",
        )

    fees = visa_type.get("fees", {})

    # Pricing is always computed server-side from the visa type on file —
    # the client never supplies or influences the amount charged.
    visa_fee = float(fees.get("visaFee", 0))
    service_fee = float(fees.get("serviceFee", 0))
    tax = float(fees.get("tax", 0))

    total_amount = visa_fee + service_fee + tax

    if total_amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid payment amount",
        )

    currency = fees.get("currency", "INR")
    payment_reference = payment_service.create_payment_reference(application.id)

    payment = Payment(
        application_id=application.id,
        payment_reference=payment_reference,
        amount=str(total_amount),
        visa_fee=str(visa_fee),
        service_fee=str(service_fee),
        tax=str(tax),
        currency=currency,
        payment_method="RAZORPAY",
        status="CREATED",
    )

    db.add(payment)
    db.flush()

    try:
        gateway_order_id = payment_service.create_gateway_order(
            amount_in_smallest_unit=round(total_amount * 100),
            currency=currency,
            receipt=payment_reference,
        )
        payment.gateway_order_id = gateway_order_id
    except httpx.HTTPError:
        logger.exception("Failed to create gateway order")
        db.rollback()
        raise HTTPException(
            status_code=502,
            detail="Unable to reach the payment gateway. Please try again.",
        )

    application.status = "PAYMENT_PENDING"

    db.commit()
    db.refresh(payment)

    add_timeline_event(
        db,
        application_id=application.id,
        event_type="PAYMENT_INITIATED",
        label="Payment initiated",
        actor_type="user",
        actor_label=current_user.get("email"),
    )

    return payment_to_response(payment)


@router.post("/verify")
def verify_payment(
    payment_data: PaymentVerify,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_data.orderId)
        .first()
    )

    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    application = _get_owned_application(db, payment.application_id, current_user)

    # Idempotent: replaying a verify call for an already-settled payment
    # never re-triggers side effects or flips the outcome.
    if payment.status in ("PAID", "FAILED"):
        return {
            "verified": payment.status == "PAID",
            "application": {"id": application.id, "status": application.status},
        }

    gateway_confirmed = False

    if payment_service.gateway_configured() and payment.gateway_order_id:
        # Real gateway configured: never trust the browser's claimed outcome.
        # The payment is only ever marked PAID if the cryptographic
        # signature Razorpay itself generated checks out server-side.
        if not payment_data.razorpaySignature:
            raise HTTPException(
                status_code=400,
                detail="Payment signature is required for verification.",
            )

        gateway_confirmed = payment_service.verify_gateway_signature(
            order_id=payment.gateway_order_id,
            payment_id=payment_data.gatewayPaymentId,
            signature=payment_data.razorpaySignature,
        )
    else:
        # No real gateway credentials configured — sandbox mode. This is the
        # current state of the project: the frontend does not yet load a
        # real Razorpay Checkout, so no cryptographic signature exists for
        # the backend to check. The outcome is still constrained as much as
        # possible: it can only be applied to the requesting user's own
        # payment/application, exactly once, at a server-computed amount.
        gateway_confirmed = payment_data.outcome == "success"

    payment.gateway_payment_id = payment_data.gatewayPaymentId
    payment.gateway_signature = payment_data.razorpaySignature

    if gateway_confirmed:
        payment.status = "PAID"
        application.status = "PAID"

        db.commit()
        db.refresh(payment)

        add_timeline_event(
            db,
            application_id=application.id,
            event_type="PAYMENT_SUCCESSFUL",
            label="Payment successful",
            actor_type="user",
            actor_label=current_user.get("email"),
        )
        add_timeline_event(
            db,
            application_id=application.id,
            event_type="APPLICATION_SUBMITTED",
            label="Application submitted for processing",
            actor_type="system",
        )

        return {
            "verified": True,
            "application": {"id": application.id, "status": application.status},
        }

    payment.status = "FAILED"
    application.status = "PAYMENT_PENDING"

    db.commit()
    db.refresh(payment)

    add_timeline_event(
        db,
        application_id=application.id,
        event_type="PAYMENT_FAILED",
        label="Payment failed",
        actor_type="user",
        actor_label=current_user.get("email"),
    )

    return {
        "verified": False,
        "application": {"id": application.id, "status": application.status},
    }


@router.get("/{payment_id}", response_model=PaymentRead)
def get_payment(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    # Ownership check — a payment can only be read by the applicant who owns
    # the application it belongs to.
    _get_owned_application(db, payment.application_id, current_user)

    return payment_to_response(payment)
