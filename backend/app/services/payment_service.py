import hashlib
import hmac
from uuid import uuid4

import httpx

from app.core.config import settings

RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders"


def create_payment_reference(application_id: str) -> str:
    return f"PAY-{application_id}-{uuid4().hex[:8].upper()}"


def gateway_configured() -> bool:
    return bool(settings.payment_key_id and settings.payment_key_secret)


def create_gateway_order(amount_in_smallest_unit: int, currency: str, receipt: str) -> str | None:
    """
    Creates a real order with Razorpay when credentials are configured.
    Returns the gateway order id, or None when running without real
    credentials (sandbox mode).
    """

    if not gateway_configured():
        return None

    response = httpx.post(
        RAZORPAY_ORDERS_URL,
        auth=(settings.payment_key_id, settings.payment_key_secret),
        json={
            "amount": amount_in_smallest_unit,
            "currency": currency,
            "receipt": receipt,
        },
        timeout=15,
    )
    response.raise_for_status()

    return response.json()["id"]


def verify_gateway_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """
    Re-derives the Razorpay payment signature server-side and compares it
    against the one supplied by the client. This is the only thing that
    proves a payment was genuinely authorized by the gateway rather than
    merely claimed by the browser.
    """

    expected_signature = hmac.new(
        settings.payment_key_secret.encode("utf-8"),
        f"{order_id}|{payment_id}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected_signature, signature)
