from fastapi import APIRouter

router = APIRouter(prefix="/consultations", tags=["consultations"])


@router.get("/")
async def list_consultations():
    return {"message": "Consultations router ready"}
