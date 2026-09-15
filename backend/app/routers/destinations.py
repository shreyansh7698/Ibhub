from fastapi import APIRouter, HTTPException

from app.services.data_service import (
    get_destination_by_slug,
    get_visa_config,
)

router = APIRouter(
    prefix="/destinations",
    tags=["destinations"],
)


@router.get("/")
def get_destinations():
    from app.services.data_service import load_seed_data

    data = load_seed_data()

    return data.get("destinations", [])


@router.get("/{country_slug}/visa")
def get_destination_visa(country_slug: str):
    destination = get_destination_by_slug(country_slug)

    if destination is None:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )

    visa_config = get_visa_config(country_slug)

    if visa_config is None:
        raise HTTPException(
            status_code=404,
            detail="Visa information not found",
        )

    return {
        "destination": destination,
        "visa": visa_config,
    }