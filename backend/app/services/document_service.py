from pathlib import Path

UPLOAD_DIR = Path("uploads/documents")


def ensure_upload_directory() -> Path:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    return UPLOAD_DIR
