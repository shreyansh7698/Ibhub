from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "IBHub Backend"
    debug: bool = True

    # Application security
    secret_key: str = "change-me"

    # Database
    database_url: str = "sqlite:///./app.db"

    # Public URL of the deployed frontend — used both for password-reset
    # links and as the allowed CORS origin.
    frontend_url: str = "http://localhost:5173"

    # Admin authentication (used only to seed the first admin account)
    admin_email: str = "admin@theibhub.com"
    admin_password: str = "ibhub-demo"

    # Token lifetimes
    admin_token_expire_minutes: int = 480
    user_token_expire_minutes: int = 480
    password_reset_token_expire_minutes: int = 30

    # SMTP / email
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_email: str = ""
    smtp_use_tls: bool = True

    # File uploads
    max_upload_size_mb: int = 12
    upload_dir: str = "uploads/documents"

    # Payment gateway (Razorpay)
    payment_key_id: str = ""
    payment_key_secret: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
