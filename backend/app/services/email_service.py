import logging
import smtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger("ibhub.email")


def _smtp_configured() -> bool:
    return bool(settings.smtp_host and settings.smtp_from_email)


def send_email(to_email: str, subject: str, html_body: str, text_body: str) -> None:
    """
    Send an email via SMTP. If SMTP is not configured, the message is printed
    to the console instead so local development keeps working out of the box.

    Never logs credentials. The console fallback is a local developer
    convenience only and must not be relied on in production.
    """

    if not _smtp_configured():
        print(
            "\n----- DEV EMAIL OUTPUT (SMTP not configured) -----\n"
            f"To: {to_email}\n"
            f"Subject: {subject}\n\n"
            f"{text_body}\n"
            "----------------------------------------------------\n"
        )
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.smtp_from_email
    message["To"] = to_email
    message.set_content(text_body)
    message.add_alternative(html_body, subtype="html")

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            if settings.smtp_use_tls:
                server.starttls()
            if settings.smtp_username and settings.smtp_password:
                server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)
    except Exception:
        # Never include the email body (which may contain a reset link/token)
        # in the log line.
        logger.exception("Failed to send email to recipient")
        raise


def send_password_reset_email(to_email: str, reset_url: str, product_name: str = "IBHub") -> None:
    subject = f"{product_name} password reset request"

    text_body = (
        f"We received a request to reset your {product_name} password.\n\n"
        f"Reset your password using this link (valid for a limited time):\n"
        f"{reset_url}\n\n"
        "If you did not request this, you can safely ignore this email."
    )

    html_body = (
        f"<p>We received a request to reset your {product_name} password.</p>"
        f'<p><a href="{reset_url}">Click here to reset your password</a> '
        "(this link is valid for a limited time).</p>"
        "<p>If you did not request this, you can safely ignore this email.</p>"
    )

    send_email(to_email, subject, html_body, text_body)
