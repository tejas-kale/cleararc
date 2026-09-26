"""Read and validate Cleararc's explicit active-course registry."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path, PurePosixPath
import re
import tomllib
from uuid import UUID


class RegistryError(ValueError):
    """A course registry cannot safely describe Cleararc's active corpus."""


@dataclass(frozen=True)
class PublicationIdentities:
    """Stable identifiers for the two editions of a course."""

    apple: str
    kindle: str


@dataclass(frozen=True)
class Course:
    """One explicitly registered active course and its publication metadata."""

    course_id: str
    display_title: str
    source: str
    reading_order: int
    author: str
    collection: str
    cover: str
    publication_identities: PublicationIdentities
    documents: tuple[str, ...]


_COURSE_ID = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*$")
_REQUIRED_COURSE_FIELDS = {
    "id",
    "title",
    "source",
    "reading_order",
    "author",
    "collection",
    "cover",
    "publication_ids",
    "documents",
}


def default_registry_path() -> Path:
    """Return the packaged authoritative course registry."""
    return Path(__file__).with_name("course_registry.toml")


def load_course_registry(registry_path: Path | None = None) -> tuple[Course, ...]:
    """Load the explicitly declared active courses in deterministic reading order."""
    path = registry_path or default_registry_path()
    try:
        with path.open("rb") as registry_file:
            data = tomllib.load(registry_file)
    except FileNotFoundError as error:
        raise RegistryError(f"Course registry {path} is missing.") from error
    except tomllib.TOMLDecodeError as error:
        raise RegistryError(f"Course registry {path} is malformed: {error}.") from error

    raw_courses = data.get("courses")
    if not isinstance(raw_courses, list) or not raw_courses:
        raise RegistryError(f"Course registry {path} must define a non-empty [[courses]] list.")

    courses = tuple(_parse_course(raw_course, path) for raw_course in raw_courses)
    _validate_uniqueness(courses, path)
    return tuple(sorted(courses, key=lambda course: course.reading_order))


def _parse_course(raw_course: object, registry_path: Path) -> Course:
    if not isinstance(raw_course, dict):
        raise RegistryError(f"Course registry {registry_path} has a course that is not a table.")

    missing_fields = sorted(_REQUIRED_COURSE_FIELDS - raw_course.keys())
    if missing_fields:
        raise RegistryError(
            f"Course registry {registry_path} has a course missing required field(s): "
            f"{', '.join(missing_fields)}."
        )

    course_id = _string_field(raw_course, "id", registry_path)
    if not _COURSE_ID.fullmatch(course_id):
        raise RegistryError(f"Course registry {registry_path} has invalid course id {course_id!r}.")

    display_title = _string_field(raw_course, "title", registry_path, course_id)
    if len(display_title.split()) > 5:
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} has a display title "
            "longer than five words."
        )

    source = _relative_path_field(raw_course, "source", registry_path, course_id)
    cover = _relative_path_field(raw_course, "cover", registry_path, course_id)
    reading_order = raw_course["reading_order"]
    if not isinstance(reading_order, int) or isinstance(reading_order, bool) or reading_order < 1:
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} has an invalid reading_order."
        )

    publication_ids = raw_course["publication_ids"]
    if not isinstance(publication_ids, dict):
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} has invalid publication_ids."
        )
    apple = _publication_identity(publication_ids, "apple", registry_path, course_id)
    kindle = _publication_identity(publication_ids, "kindle", registry_path, course_id)

    documents = raw_course["documents"]
    if not isinstance(documents, list) or not documents:
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} needs a non-empty documents list."
        )
    if not all(isinstance(document, str) for document in documents):
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} has a non-string document path."
        )
    for document in documents:
        _validate_relative_path(document, registry_path, course_id, "document")
    if len(set(documents)) != len(documents):
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} contains a duplicate document path."
        )

    return Course(
        course_id=course_id,
        display_title=display_title,
        source=source,
        reading_order=reading_order,
        author=_string_field(raw_course, "author", registry_path, course_id),
        collection=_string_field(raw_course, "collection", registry_path, course_id),
        cover=cover,
        publication_identities=PublicationIdentities(apple=apple, kindle=kindle),
        documents=tuple(documents),
    )


def _string_field(
    raw_course: dict[str, object], field: str, registry_path: Path, course_id: str = "unknown"
) -> str:
    value = raw_course[field]
    if not isinstance(value, str) or not value.strip():
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} has an invalid {field}."
        )
    return value


def _relative_path_field(
    raw_course: dict[str, object], field: str, registry_path: Path, course_id: str
) -> str:
    value = _string_field(raw_course, field, registry_path, course_id)
    _validate_relative_path(value, registry_path, course_id, field)
    return value


def _validate_relative_path(value: str, registry_path: Path, course_id: str, field: str) -> None:
    path = PurePosixPath(value)
    if path.is_absolute() or ".." in path.parts:
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} has an unsafe {field} path {value!r}."
        )


def _publication_identity(
    publication_ids: dict[str, object], target: str, registry_path: Path, course_id: str
) -> str:
    try:
        value = publication_ids[target]
    except KeyError as error:
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} is missing "
            f"publication_ids.{target}."
        ) from error
    if not isinstance(value, str):
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} has invalid "
            f"publication_ids.{target}; it must be a UUID."
        )
    try:
        return str(UUID(value))
    except ValueError as error:
        raise RegistryError(
            f"Course registry {registry_path} course {course_id!r} has invalid "
            f"publication_ids.{target}; it must be a UUID."
        ) from error


def _validate_uniqueness(courses: tuple[Course, ...], registry_path: Path) -> None:
    _require_unique((course.course_id for course in courses), "course id", registry_path)
    _require_unique((course.reading_order for course in courses), "reading_order", registry_path)
    _require_unique((course.publication_identities.apple for course in courses), "Apple publication identity", registry_path)
    _require_unique((course.publication_identities.kindle for course in courses), "Kindle publication identity", registry_path)


def _require_unique(values: object, description: str, registry_path: Path) -> None:
    seen: set[object] = set()
    for value in values:
        if value in seen:
            raise RegistryError(f"Course registry {registry_path} has a duplicate {description}: {value!r}.")
        seen.add(value)
