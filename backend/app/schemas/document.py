from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentRead(BaseModel):
    id: str
    application_id: str
    document_type: str
    original_filename: str
    content_type: str | None = None
    file_size: str | None = None
    status: str
    rejection_reason: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
