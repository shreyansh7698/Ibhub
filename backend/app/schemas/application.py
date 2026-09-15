from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------------------------------------------------------
# Applicant information
# ---------------------------------------------------------

class ApplicantData(BaseModel):
    firstName: str
    lastName: str
    dateOfBirth: date
    gender: str
    nationality: str

    passportNumber: str
    passportIssueDate: date
    passportExpiryDate: date

    countryOfResidence: str
    address: str
    city: str
    state: str | None = None
    postalCode: str | None = None

    phone: str
    email: EmailStr


# ---------------------------------------------------------
# Travel information
# ---------------------------------------------------------

class TravelData(BaseModel):
    travelStartDate: date
    travelEndDate: date


# ---------------------------------------------------------
# Create application
# ---------------------------------------------------------

class ApplicationCreate(BaseModel):
    countrySlug: str
    visaTypeId: str


# ---------------------------------------------------------
# Update application
# ---------------------------------------------------------

class ApplicationUpdate(BaseModel):
    visaTypeId: str | None = None
    applicant: ApplicantData | None = None
    travel: TravelData | None = None
    step: str | None = None


# ---------------------------------------------------------
# Timeline
# ---------------------------------------------------------

class TimelineEvent(BaseModel):
    id: str
    type: str
    label: str
    at: datetime
    by: str | None = None
    internal: bool = False


# ---------------------------------------------------------
# Application response
# ---------------------------------------------------------

class ApplicationRead(BaseModel):
    id: str

    countrySlug: str
    countryName: str
    countryCode: str

    visaTypeId: str
    visaTypeLabel: str

    applicant: dict
    travel: dict

    status: str

    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)
