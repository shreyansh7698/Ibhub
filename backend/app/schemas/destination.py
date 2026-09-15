from pydantic import BaseModel


class DestinationBase(BaseModel):
    name: str
    country: str
    description: str | None = None


class DestinationCreate(DestinationBase):
    pass


class DestinationRead(DestinationBase):
    id: int

    class Config:
        orm_mode = True
