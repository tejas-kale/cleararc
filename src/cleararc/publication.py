"""Coordinate the validated publication of one dated course edition."""

from __future__ import annotations

from collections.abc import Callable, Mapping, Sequence
from datetime import UTC, date, datetime
from pathlib import Path

from cleararc.apple import Edition
from cleararc.delivery import DeliveryRecord, save_delivery_record
from cleararc.registry import Course
from cleararc.validation import ValidatedEditions, build_and_validate_course


class PublicationError(RuntimeError):
    """One or more deliveries failed after the publication gate passed."""

    def __init__(self, course_id: str, records: Sequence[DeliveryRecord]) -> None:
        self.records = tuple(records)
        failures = [record for record in records if record.outcome == "failed"]
        super().__init__(
            "\n".join(
                f"{record.target.value.title()} delivery failed: {record.detail}. "
                f"Retry with cleararc publish {course_id} --date {record.edition_date} "
                f"--only {record.target.value}."
                for record in failures
            )
        )


EditionDelivery = Callable[[Path], None]
BuildAndValidate = Callable[..., ValidatedEditions]
SaveRecord = Callable[[DeliveryRecord], object]
Clock = Callable[[], datetime]


def publish_course(
    course: Course,
    repository_root: Path,
    publication_date: date,
    *,
    targets: Sequence[Edition],
    build_and_validate: BuildAndValidate = build_and_validate_course,
    deliver: Mapping[Edition, EditionDelivery],
    save_record: SaveRecord = save_delivery_record,
    recorded_at: Clock = lambda: datetime.now(UTC),
) -> tuple[DeliveryRecord, ...]:
    """Build and validate both editions before independently delivering selected targets."""
    editions = build_and_validate(course, repository_root, publication_date=publication_date)
    records: list[DeliveryRecord] = []
    for target in targets:
        edition_path = editions.path_for(target)
        try:
            deliver[target](edition_path)
        except Exception as error:
            record = DeliveryRecord(
                course.course_id,
                target,
                publication_date,
                edition_path,
                "failed",
                recorded_at(),
                str(error),
            )
        else:
            record = DeliveryRecord(
                course.course_id,
                target,
                publication_date,
                edition_path,
                "delivered",
                recorded_at(),
            )
        save_record(record)
        records.append(record)
    if any(record.outcome == "failed" for record in records):
        raise PublicationError(course.course_id, records)
    return tuple(records)
