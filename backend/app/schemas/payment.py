from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PaymentCreate(BaseModel):
    applicationId: str


class PaymentVerify(BaseModel):
    orderId: str
    gatewayPaymentId: str
    outcome: str
    # Present only when the frontend integrates real Razorpay Checkout.
    # When the backend is configured with real gateway credentials, these
    # become required and are cryptographically verified server-side.
    razorpaySignature: str | None = None


class PaymentBreakdown(BaseModel):
    visaFee: float
    serviceFee: float
    tax: float


class PaymentRead(BaseModel):
    orderId: str
    paymentId: str | None = None
    reference: str | None = None
    gateway: str
    amount: float
    currency: str
    status: str
    breakdown: PaymentBreakdown
    paidAt: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


