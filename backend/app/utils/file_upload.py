from pathlib import Path


def save_uploaded_file(file_content: bytes, filename: str, destination_dir: str = "uploads/documents") -> str:
    destination = Path(destination_dir)
    destination.mkdir(parents=True, exist_ok=True)
    file_path = destination / filename
    file_path.write_bytes(file_content)
    return str(file_path)
