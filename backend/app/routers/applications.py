from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.database.models import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate
from app.services.application_service import build_application_detail
from app.services.data_service import (
    get_destination_by_slug,
    get_visa_type_by_id,
)
from app.services.timeline_service import add_timeline_event

router = APIRouter(
    prefix="/applications",
    tags=["applications"],
)


def application_to_response(application: Application, db: Session):
    return build_application_detail(db, application)


def _get_owned_application(db: Session, application_id: str, current_user: dict) -> Application:
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

    if application.user_id != current_user.get("sub"):
        # 404 rather than 403 so an application ID cannot be used to probe
        # for the existence of another user's application.
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return application


@router.get("/")
def list_my_applications(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Summary list of the authenticated applicant's own applications."""

    applications = (
        db.query(Application)
        .filter(Application.user_id == current_user["sub"])
        .order_by(Application.created_at.desc())
        .all()
    )

    return [
        {
            "id": application.id,
            "countrySlug": application.country_slug,
            "countryName": application.country_name,
            "countryCode": application.country_code,
            "visaTypeId": application.visa_type_id,
            "visaTypeLabel": application.visa_type_label,
            "status": application.status,
            "createdAt": application.created_at,
            "updatedAt": application.updated_at,
        }
        for application in applications
    ]


@router.post("/")
def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Find the destination
    destination = get_destination_by_slug(
        application_data.countrySlug
    )

    if destination is None:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )

    # Find the selected visa type
    visa_type = get_visa_type_by_id(
        application_data.countrySlug,
        application_data.visaTypeId,
    )

    if visa_type is None:
        raise HTTPException(
            status_code=400,
            detail="Visa type not found for this destination",
        )

    # Create application
    application = Application(
        user_id=current_user["sub"],
        country_slug=destination["slug"],
        country_name=destination["name"],
        country_code=destination["code"],
        visa_type_id=visa_type["id"],
        visa_type_label=visa_type["label"],
        status="DRAFT",
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    add_timeline_event(
        db,
        application_id=application.id,
        event_type="APPLICATION_CREATED",
        label="Application created",
        actor_type="user",
        actor_label=current_user.get("email"),
    )

    return application_to_response(application, db)


@router.get("/{application_id}")
def get_application(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    application = _get_owned_application(db, application_id, current_user)

    return application_to_response(application, db)


@router.patch("/{application_id}")
def update_application(
    application_id: str,
    application_data: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    application = _get_owned_application(db, application_id, current_user)

    # Update visa type if supplied
    if application_data.visaTypeId is not None:

        visa_type = get_visa_type_by_id(
            application.country_slug,
            application_data.visaTypeId,
        )

        if visa_type is None:
            raise HTTPException(
                status_code=400,
                detail="Visa type not found for this destination",
            )

        application.visa_type_id = visa_type["id"]
        application.visa_type_label = visa_type["label"]

    # Update applicant information
    applicant_submitted = False

    if application_data.applicant is not None:

        applicant = application_data.applicant

        application.first_name = applicant.firstName
        application.last_name = applicant.lastName
        application.date_of_birth = str(applicant.dateOfBirth)
        application.gender = applicant.gender
        application.nationality = applicant.nationality
        application.passport_number = applicant.passportNumber
        application.passport_issue_date = str(
            applicant.passportIssueDate
        )
        application.passport_expiry_date = str(
            applicant.passportExpiryDate
        )
        application.country_of_residence = (
            applicant.countryOfResidence
        )
        application.address = applicant.address
        application.city = applicant.city
        application.state = applicant.state
        application.postal_code = applicant.postalCode
        application.phone = applicant.phone
        application.email = applicant.email

        if application.status == "DRAFT":
            application.status = "DOCUMENTS_PENDING"
            applicant_submitted = True

    # Update travel information
    if application_data.travel is not None:

        travel = application_data.travel

        application.travel_start_date = str(
            travel.travelStartDate
        )
        application.travel_end_date = str(
            travel.travelEndDate
        )

    # Update frontend step if supplied
    if application_data.step is not None:
        application_step = application_data.step

        if application_step:
            application.status = application_step

    db.commit()
    db.refresh(application)

    if applicant_submitted:
        add_timeline_event(
            db,
            application_id=application.id,
            event_type="APPLICANT_SUBMITTED",
            label="Applicant information submitted",
            actor_type="user",
            actor_label=current_user.get("email"),
        )

    return application_to_response(application, db)
