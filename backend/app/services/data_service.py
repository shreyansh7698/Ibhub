import json
from functools import lru_cache
from pathlib import Path


SEED_DATA_FILE = Path(__file__).resolve().parent.parent / "seed_data.json"


@lru_cache
def load_seed_data():
    with open(SEED_DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def get_destination_by_slug(country_slug: str):
    data = load_seed_data()

    for destination in data.get("destinations", []):
        if destination.get("slug") == country_slug:
            return destination

    return None


def get_visa_config(country_slug: str):
    data = load_seed_data()

    destination = get_destination_by_slug(country_slug)

    if destination is None:
        return None

    defaults = data.get("defaults", {})
    overrides = data.get("overrides", {})

    country_override = overrides.get(country_slug, {})

    visa_config = {
        **defaults,
        **country_override,
    }

    if "visaTypes" not in country_override:
        visa_config["visaTypes"] = defaults.get("visaTypes", [])

    if "requiredDocuments" not in country_override:
        visa_config["requiredDocuments"] = defaults.get(
            "requiredDocuments",
            []
        )

    if "processingTime" not in country_override:
        visa_config["processingTime"] = defaults.get(
            "processingTime"
        )

    return visa_config


def get_visa_type_by_id(country_slug: str, visa_type_id: str):
    visa_config = get_visa_config(country_slug)

    if visa_config is None:
        return None

    for visa_type in visa_config.get("visaTypes", []):
        if visa_type.get("id") == visa_type_id:
            return visa_type

    return None