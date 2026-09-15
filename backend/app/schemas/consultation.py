from pydantic import BaseModel, EmailStr


class ConsultationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    message: str | None = None


class ConsultationRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None = None
    message: str | None = None

    class Config:
        orm_mode = True
