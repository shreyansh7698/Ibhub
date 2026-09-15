# IBHub Backend

This backend provides the API foundation for the IBHub application.

## Structure

- `app/` contains the FastAPI application, routers, schemas, services, and utilities.
- `uploads/documents/` stores uploaded documents.
- `tests/` is reserved for automated tests.

## Getting Started

1. Create and activate a virtual environment.
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the API:

   ```bash
   python run.py
   ```

The service will run by default on `http://localhost:8000`.
