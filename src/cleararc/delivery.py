"""Deliver dated course editions and retain independent delivery records."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, date, datetime
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json
from pathlib import Path
import smtplib
import ssl
import subprocess
from tempfile import NamedTemporaryFile
from typing import Callable, Literal

from cleararc.apple import Edition
from cleararc.config import DeliveryConfig, config_directory, resolve_smtp_password


class DeliveryError(RuntimeError):
    """A private-library delivery could not be completed."""


@dataclass(frozen=True)
class DeliveryRecord:
    """The durable result of delivering one dated edition to one library."""

    course_id: str
    target: Edition
    edition_date: date
    edition_path: Path
    outcome: Literal["delivered", "failed"]
    recorded_at: datetime
    detail: str | None = None


def import_into_books(
    edition_path: Path,
    *,
    run: Callable[..., subprocess.CompletedProcess[str]] = subprocess.run,
) -> None:
    """Ask macOS to import an Apple edition into Books."""
    try:
        run(["open", "-a", "Books", str(edition_path)], check=True, text=True)
    except (OSError, subprocess.CalledProcessError) as error:
        raise DeliveryError(f"Could not import {edition_path} into Books: {error}") from error


def send_to_kindle(
    config: DeliveryConfig,
    edition_path: Path,
    *,
    password_resolver: Callable[[DeliveryConfig], str] = resolve_smtp_password,
    smtp_factory: Callable[..., smtplib.SMTP] = smtplib.SMTP,
) -> None:
    """Send one Kindle EPUB through the configured Send to Kindle account."""
    try:
        password = password_resolver(config)
        message = _kindle_message(config, edition_path)
        context = ssl.create_default_context()
        with smtp_factory(config.smtp_host, config.smtp_port) as smtp:
            smtp.starttls(context=context)
            smtp.login(config.username, password)
            smtp.sendmail(config.sender, [config.kindle_address], message.as_string())
    except DeliveryError:
        raise
    except (OSError, smtplib.SMTPException) as error:
        raise DeliveryError(
            f"Could not send {edition_path} to {config.kindle_address}: {error}"
        ) from error


def save_delivery_record(record: DeliveryRecord, directory: Path | None = None) -> Path:
    """Atomically save the latest independent result for one target and dated edition."""
    record_directory = directory or delivery_records_directory()
    destination = (
        record_directory
        / record.course_id
        / record.edition_date.isoformat()
        / f"{record.target}.json"
    )
    destination.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "course_id": record.course_id,
        "target": record.target.value,
        "edition_date": record.edition_date.isoformat(),
        "edition_path": str(record.edition_path),
        "outcome": record.outcome,
        "recorded_at": (
            record.recorded_at.astimezone(UTC)
            .replace(microsecond=0)
            .isoformat()
            .replace("+00:00", "Z")
        ),
        "detail": record.detail,
    }
    with NamedTemporaryFile(
        mode="w", encoding="utf-8", dir=destination.parent, prefix=".delivery-", delete=False
    ) as temporary_file:
        temporary_path = Path(temporary_file.name)
        temporary_file.write(json.dumps(payload, indent=2) + "\n")
    try:
        temporary_path.chmod(0o600)
        temporary_path.replace(destination)
    finally:
        temporary_path.unlink(missing_ok=True)
    return destination


def delivery_records_directory() -> Path:
    """Return the private local location for durable delivery records."""
    return config_directory() / "delivery-records"


def _kindle_message(config: DeliveryConfig, edition_path: Path) -> MIMEMultipart:
    message = MIMEMultipart()
    message["From"] = config.sender
    message["To"] = config.kindle_address
    message["Subject"] = "Cleararc course edition"
    message.attach(MIMEText("Sent by Cleararc to your private Kindle library.", "plain"))
    attachment = MIMEBase("application", "epub+zip")
    attachment.set_payload(edition_path.read_bytes())
    encoders.encode_base64(attachment)
    attachment.add_header("Content-Disposition", f'attachment; filename="{edition_path.name}"')
    message.attach(attachment)
    return message
