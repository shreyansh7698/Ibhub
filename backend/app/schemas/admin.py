from pydantic import BaseModel, EmailStr


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class AdminRead(BaseModel):
    email: EmailStr
    role: str