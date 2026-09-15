from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.database import SessionLocal, init_db
from app.routers import admin, applications, auth, documents, destinations, payments
from app.services.admin_service import seed_default_admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    db = SessionLocal()
    try:
        seed_default_admin(db)
    finally:
        db.close()

    yield


app = FastAPI(
    title="IBHUB Backend",
    description="IBHUB visa application backend API",
    version="1.0.0",
    lifespan=lifespan,
)

_configured_origins = [settings.frontend_url] if settings.frontend_url else []

# Vite's dev server hops to the next free port (5173, 5174, 5175, ...) whenever
# one is already taken, so a fixed allowlist entry constantly falls out of
# sync. In debug mode, accept any localhost/127.0.0.1 port instead; in
# production only the explicit FRONTEND_URL is ever allowed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=_configured_origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+" if settings.debug else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "IBHUB FastAPI backend is running."}


app.include_router(auth.router)
app.include_router(applications.router)
app.include_router(documents.router)
app.include_router(destinations.router)
app.include_router(payments.router)
app.include_router(admin.router)
