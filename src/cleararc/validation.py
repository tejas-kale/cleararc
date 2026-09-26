"""Validate built course editions before the publication gate opens."""

from __future__ import annotations

from collections.abc import Callable, Mapping
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path, PurePosixPath
import posixpath
import re
from urllib.parse import urlsplit
from xml.etree import ElementTree
from zipfile import ZIP_STORED, BadZipFile, ZipFile

from cleararc.apple import Edition, EditionBuildError, build_apple_pilot, build_kindle_pilot
from cleararc.registry import Course


_CONTAINER_NAMESPACE = "{urn:oasis:names:tc:opendocument:xmlns:container}"
_OPF_NAMESPACE = "{http://www.idpf.org/2007/opf}"
_DC_NAMESPACE = "{http://purl.org/dc/elements/1.1/}"
_FORBIDDEN_KINDLE_CONTENT = re.compile(
    r"<(?:script|form|button|canvas|iframe|audio|video|style|object|embed|input|select|textarea)\b"
    r"|\bon[a-z]+\s*=|javascript\s*:|\banimation(?:-name|-duration|-delay|-iteration-count)?\s*:",
    re.IGNORECASE,
)
_REFERENCE_ATTRIBUTE = re.compile(
    r"\b(?:href|src)=(?P<quote>[\"'])(?P<value>.*?)(?P=quote)", re.IGNORECASE
)
_ANCHOR_REFERENCE = re.compile(
    r"<a\b[^>]*\bhref=(?P<quote>[\"'])(?P<value>.*?)(?P=quote)", re.IGNORECASE
)
_KINDLE_ALTERNATIVE = re.compile(
    r"<(?P<tag>[a-z0-9]+)\b(?P<attributes>[^>]*)>",
    re.IGNORECASE,
)
_KINDLE_EDITION = re.compile(r"\bdata-edition=(?P<quote>[\"'])kindle(?P=quote)", re.IGNORECASE)
_ARIA_LABEL = re.compile(r"\baria-label=(?P<quote>[\"'])(?P<value>.*?)(?P=quote)", re.IGNORECASE)
_CLASS_ATTRIBUTE = re.compile(r"\bclass=(?P<quote>[\"'])(?P<value>.*?)(?P=quote)", re.IGNORECASE)


class PublicationGateError(ValueError):
    """One or both course editions did not pass the publication gate."""

    def __init__(self, diagnostics: tuple["ValidationDiagnostic", ...]) -> None:
        self.diagnostics = diagnostics
        super().__init__("\n".join(diagnostic.render() for diagnostic in diagnostics))


@dataclass(frozen=True)
class ValidationDiagnostic:
    """One actionable publication-gate failure."""

    course_id: str
    target: Edition
    source_document: str
    rule: str
    detail: str

    def render(self) -> str:
        """Return the stable operator-facing diagnostic."""
        return (
            f"course={self.course_id} target={self.target.value} "
            f"source={self.source_document} rule={self.rule}: {self.detail}"
        )


@dataclass(frozen=True)
class ValidatedEditions:
    """The paired local editions which passed the publication gate together."""

    apple: Path
    kindle: Path

    def path_for(self, target: Edition) -> Path:
        """Return the validated edition for one target."""
        return self.apple if target is Edition.APPLE else self.kindle


EditionBuilder = Callable[[Course, Path], Path]


def build_and_validate_course(
    course: Course,
    repository_root: Path,
    builders: Mapping[Edition, EditionBuilder] | None = None,
) -> ValidatedEditions:
    """Build both editions, then return them only when the paired gate passes."""
    edition_builders = builders or {
        Edition.APPLE: build_apple_pilot,
        Edition.KINDLE: build_kindle_pilot,
    }
    paths: dict[Edition, Path] = {}
    diagnostics: list[ValidationDiagnostic] = []
    for target in Edition:
        try:
            paths[target] = edition_builders[target](course, repository_root)
        except EditionBuildError as error:
            diagnostics.append(
                _diagnostic(course, target, course.source, "edition-build", str(error))
            )
    if diagnostics:
        raise PublicationGateError(tuple(diagnostics))
    return validate_publication_gate(course, repository_root, paths)


def validate_publication_gate(
    course: Course, repository_root: Path, edition_paths: Mapping[Edition, Path]
) -> ValidatedEditions:
    """Validate both target editions as one all-or-nothing publication gate."""
    diagnostics: list[ValidationDiagnostic] = []
    for target in Edition:
        try:
            path = edition_paths[target]
        except KeyError:
            diagnostics.append(
                _diagnostic(course, target, course.source, "paired-edition", "edition was not provided")
            )
            continue
        diagnostics.extend(_validate_edition(course, repository_root, target, path))
    if diagnostics:
        raise PublicationGateError(tuple(diagnostics))
    return ValidatedEditions(apple=edition_paths[Edition.APPLE], kindle=edition_paths[Edition.KINDLE])


def _validate_edition(
    course: Course, repository_root: Path, target: Edition, path: Path
) -> list[ValidationDiagnostic]:
    if not path.is_file():
        return [_diagnostic(course, target, str(path), "edition-file", "EPUB file is missing")]
    try:
        with ZipFile(path) as archive:
            return _validate_archive(course, repository_root, target, archive)
    except BadZipFile:
        return [_diagnostic(course, target, str(path), "epub-structure", "file is not a readable EPUB archive")]


def _validate_archive(
    course: Course, repository_root: Path, target: Edition, archive: ZipFile
) -> list[ValidationDiagnostic]:
    diagnostics = _validate_archive_structure(course, target, archive)
    names = set(archive.namelist())
    if "META-INF/container.xml" not in names:
        return diagnostics
    package_path = _package_path(course, target, archive, diagnostics)
    if package_path is None:
        return diagnostics
    package = _xml_file(course, target, archive, package_path, diagnostics, "epub-structure")
    if package is None:
        return diagnostics
    manifest, spine = _validate_package(course, target, package_path, package, names, diagnostics)
    _validate_cover(course, target, archive, package_path, package, manifest, diagnostics)
    _validate_spine(course, target, package_path, manifest, spine, diagnostics)
    _validate_documents(course, repository_root, target, archive, package_path, manifest, diagnostics)
    return diagnostics


def _validate_archive_structure(course: Course, target: Edition, archive: ZipFile) -> list[ValidationDiagnostic]:
    diagnostics: list[ValidationDiagnostic] = []
    entries = archive.infolist()
    if not entries or entries[0].filename != "mimetype":
        diagnostics.append(_diagnostic(course, target, "archive", "epub-structure", "mimetype must be the first archive entry"))
    else:
        mimetype = archive.read("mimetype")
        if mimetype != b"application/epub+zip":
            diagnostics.append(_diagnostic(course, target, "mimetype", "epub-structure", "must equal application/epub+zip"))
        if entries[0].compress_type != ZIP_STORED:
            diagnostics.append(_diagnostic(course, target, "mimetype", "epub-structure", "must be stored without compression"))
    if "META-INF/container.xml" not in archive.namelist():
        diagnostics.append(_diagnostic(course, target, "META-INF/container.xml", "epub-structure", "container document is missing"))
    return diagnostics


def _package_path(
    course: Course, target: Edition, archive: ZipFile, diagnostics: list[ValidationDiagnostic]
) -> str | None:
    container = _xml_file(course, target, archive, "META-INF/container.xml", diagnostics, "epub-structure")
    if container is None:
        return None
    rootfile = container.find(f".//{_CONTAINER_NAMESPACE}rootfile")
    if rootfile is None or not rootfile.get("full-path"):
        diagnostics.append(_diagnostic(course, target, "META-INF/container.xml", "epub-structure", "rootfile declaration is missing"))
        return None
    path = rootfile.get("full-path")
    assert path is not None
    if not _is_safe_archive_path(path):
        diagnostics.append(_diagnostic(course, target, "META-INF/container.xml", "safe-archive-path", f"unsafe package path {path!r}"))
        return None
    if path not in archive.namelist():
        diagnostics.append(_diagnostic(course, target, "META-INF/container.xml", "epub-structure", f"package document {path!r} is missing"))
        return None
    return path


def _xml_file(
    course: Course,
    target: Edition,
    archive: ZipFile,
    name: str,
    diagnostics: list[ValidationDiagnostic],
    rule: str,
) -> ElementTree.Element | None:
    try:
        return ElementTree.fromstring(archive.read(name))
    except (KeyError, ElementTree.ParseError, UnicodeDecodeError) as error:
        diagnostics.append(_diagnostic(course, target, name, rule, f"is not well-formed XML: {error}"))
        return None


def _validate_package(
    course: Course,
    target: Edition,
    package_path: str,
    package: ElementTree.Element,
    names: set[str],
    diagnostics: list[ValidationDiagnostic],
) -> tuple[dict[str, str], list[str]]:
    _validate_metadata(course, target, package_path, package, diagnostics)
    manifest: dict[str, str] = {}
    package_root = PurePosixPath(package_path).parent
    for item in package.findall(f"{_OPF_NAMESPACE}manifest/{_OPF_NAMESPACE}item"):
        identifier, href = item.get("id"), item.get("href")
        if not identifier or not href:
            diagnostics.append(_diagnostic(course, target, package_path, "epub-structure", "manifest item needs id and href"))
            continue
        if not _is_safe_archive_path(href):
            diagnostics.append(_diagnostic(course, target, package_path, "safe-archive-path", f"manifest href {href!r} is unsafe"))
            continue
        archive_path = str(package_root / PurePosixPath(href))
        manifest[identifier] = archive_path
        if archive_path not in names:
            diagnostics.append(_diagnostic(course, target, package_path, "embedded-asset", f"manifest resource {href!r} is missing"))
    spine = [item.get("idref", "") for item in package.findall(f"{_OPF_NAMESPACE}spine/{_OPF_NAMESPACE}itemref")]
    if not spine:
        diagnostics.append(_diagnostic(course, target, package_path, "spine-order", "spine is missing"))
    for identifier in spine:
        if identifier not in manifest:
            diagnostics.append(_diagnostic(course, target, package_path, "spine-order", f"spine item {identifier!r} is not in the manifest"))
    return manifest, spine


def _validate_metadata(
    course: Course,
    target: Edition,
    package_path: str,
    package: ElementTree.Element,
    diagnostics: list[ValidationDiagnostic],
) -> None:
    metadata = package.find(f"{_OPF_NAMESPACE}metadata")
    if metadata is None:
        diagnostics.append(_diagnostic(course, target, package_path, "metadata", "metadata is missing"))
        return
    expected_identity = course.publication_identities.apple if target is Edition.APPLE else course.publication_identities.kindle
    expected = {
        f"{_DC_NAMESPACE}identifier": f"urn:uuid:{expected_identity}",
        f"{_DC_NAMESPACE}title": course.display_title,
        f"{_DC_NAMESPACE}creator": course.author,
        f"{_DC_NAMESPACE}publisher": course.collection,
        f"{_DC_NAMESPACE}language": "en-GB",
    }
    for element, value in expected.items():
        if metadata.findtext(element) != value:
            name = element.rsplit("}", maxsplit=1)[-1]
            diagnostics.append(_diagnostic(course, target, package_path, "metadata", f"{name} must be {value!r}"))
    modified = metadata.find(f"{_OPF_NAMESPACE}meta[@property='dcterms:modified']")
    if modified is None or not modified.text:
        diagnostics.append(_diagnostic(course, target, package_path, "metadata", "dcterms:modified is missing"))
    else:
        try:
            datetime.fromisoformat(modified.text.replace("Z", "+00:00"))
        except ValueError:
            diagnostics.append(_diagnostic(course, target, package_path, "metadata", "dcterms:modified must be an ISO-8601 timestamp"))


def _validate_cover(
    course: Course,
    target: Edition,
    archive: ZipFile,
    package_path: str,
    package: ElementTree.Element,
    manifest: Mapping[str, str],
    diagnostics: list[ValidationDiagnostic],
) -> None:
    cover_items = [
        item
        for item in package.findall(f"{_OPF_NAMESPACE}manifest/{_OPF_NAMESPACE}item")
        if "cover-image" in item.get("properties", "").split()
    ]
    if len(cover_items) != 1:
        diagnostics.append(_diagnostic(course, target, package_path, "cover-declaration", "exactly one cover-image manifest item is required"))
        return
    cover = cover_items[0]
    identifier = cover.get("id")
    if not identifier or identifier not in manifest:
        diagnostics.append(_diagnostic(course, target, package_path, "cover-declaration", "cover-image manifest item is incomplete"))
        return
    metadata = package.find(f"{_OPF_NAMESPACE}metadata")
    declared_cover = metadata.find(f"{_OPF_NAMESPACE}meta[@name='cover']") if metadata is not None else None
    if declared_cover is None or declared_cover.get("content") != identifier:
        diagnostics.append(_diagnostic(course, target, package_path, "cover-declaration", "metadata must declare the cover-image item"))
    if cover.get("media-type") != "image/jpeg":
        diagnostics.append(_diagnostic(course, target, package_path, "image-constraints", "cover must be a JPEG"))
        return
    cover_path = manifest[identifier]
    try:
        dimensions, components = _jpeg_properties(archive.read(cover_path))
    except ValueError as error:
        diagnostics.append(_diagnostic(course, target, cover_path, "image-constraints", str(error)))
        return
    if dimensions != (1575, 2520):
        diagnostics.append(_diagnostic(course, target, cover_path, "image-constraints", "cover must be 1575 by 2520 pixels"))
    if components != 3:
        diagnostics.append(_diagnostic(course, target, cover_path, "image-constraints", "cover must use three colour components"))
    if archive.getinfo(cover_path).file_size >= 5 * 1024 * 1024:
        diagnostics.append(_diagnostic(course, target, cover_path, "image-constraints", "cover must be smaller than 5 MB"))


def _validate_spine(
    course: Course,
    target: Edition,
    package_path: str,
    manifest: Mapping[str, str],
    spine: list[str],
    diagnostics: list[ValidationDiagnostic],
) -> None:
    expected_documents = [_target_for_document(course, document) for document in course.documents]
    expected_paths = [
        "OEBPS/text/cover.xhtml",
        "OEBPS/text/title.xhtml",
        "OEBPS/text/contents.xhtml",
        *expected_documents,
    ]
    spine_paths = [manifest[identifier] for identifier in spine if identifier in manifest]
    if spine_paths != expected_paths:
        diagnostics.append(_diagnostic(course, target, package_path, "spine-order", "spine must follow the registered document order"))


def _validate_documents(
    course: Course,
    repository_root: Path,
    target: Edition,
    archive: ZipFile,
    package_path: str,
    manifest: Mapping[str, str],
    diagnostics: list[ValidationDiagnostic],
) -> None:
    source_by_target = {
        _target_for_document(course, document): document for document in course.documents
    }
    for path in manifest.values():
        if not path.endswith(".xhtml"):
            _validate_kindle_resource(course, target, archive, path, diagnostics)
            continue
        source = source_by_target.get(path, path)
        document = _xml_file(course, target, archive, path, diagnostics, "epub-structure")
        if document is None:
            continue
        content = archive.read(path).decode("utf-8")
        _validate_references(course, target, source, path, content, archive, diagnostics)
        _validate_accessible_images(course, target, source, document, diagnostics)
        _validate_kindle_content(course, target, source, content, diagnostics)
    _validate_navigation(course, target, archive, manifest, diagnostics)
    if target is Edition.KINDLE:
        _validate_kindle_alternatives(course, repository_root, archive, diagnostics)


def _validate_kindle_resource(
    course: Course, target: Edition, archive: ZipFile, path: str, diagnostics: list[ValidationDiagnostic]
) -> None:
    if target is not Edition.KINDLE:
        return
    if path.endswith(".js"):
        diagnostics.append(_diagnostic(course, target, path, "kindle-forbidden-content", "JavaScript assets are unsupported"))
        return
    if path.endswith(".css"):
        _validate_kindle_content(course, target, path, archive.read(path).decode("utf-8"), diagnostics)


def _validate_kindle_content(
    course: Course,
    target: Edition,
    source: str,
    content: str,
    diagnostics: list[ValidationDiagnostic],
) -> None:
    if target is Edition.KINDLE and _FORBIDDEN_KINDLE_CONTENT.search(content):
        diagnostics.append(_diagnostic(course, target, source, "kindle-forbidden-content", "contains unsupported Kindle content"))


def _validate_accessible_images(
    course: Course,
    target: Edition,
    source: str,
    document: ElementTree.Element,
    diagnostics: list[ValidationDiagnostic],
) -> None:
    for element in document.iter():
        tag = element.tag.rsplit("}", maxsplit=1)[-1]
        if tag == "img" and not element.get("alt", "").strip():
            diagnostics.append(_diagnostic(course, target, source, "accessible-image", "image needs non-empty alt text"))
        if tag == "svg" and (
            element.get("role") != "img" or not element.get("aria-label", "").strip()
        ):
            diagnostics.append(
                _diagnostic(
                    course,
                    target,
                    source,
                    "accessible-diagram",
                    "diagram needs role=img and a non-empty aria-label",
                )
            )


def _validate_references(
    course: Course,
    target: Edition,
    source: str,
    archive_path: str,
    content: str,
    archive: ZipFile,
    diagnostics: list[ValidationDiagnostic],
) -> None:
    for match in _REFERENCE_ATTRIBUTE.finditer(content):
        reference = match.group("value")
        parts = urlsplit(reference)
        if parts.scheme or parts.netloc or not parts.path:
            continue
        resolved = _resolve_archive_path(archive_path, parts.path)
        if resolved is None:
            diagnostics.append(_diagnostic(course, target, source, "safe-archive-path", f"local reference {reference!r} escapes the EPUB"))
        elif resolved not in archive.namelist():
            diagnostics.append(_diagnostic(course, target, source, "internal-link", f"local reference {reference!r} is missing"))
        elif parts.fragment and resolved.endswith(".xhtml") and not _has_fragment(archive, resolved, parts.fragment):
            diagnostics.append(
                _diagnostic(course, target, source, "internal-link", f"fragment {parts.fragment!r} is missing from {parts.path!r}")
            )


def _validate_navigation(
    course: Course,
    target: Edition,
    archive: ZipFile,
    manifest: Mapping[str, str],
    diagnostics: list[ValidationDiagnostic],
) -> None:
    nav_path = next((path for path in manifest.values() if path.endswith("/nav.xhtml")), None)
    contents_path = "OEBPS/text/contents.xhtml"
    expected = ["OEBPS/text/title.xhtml", contents_path, *[_target_for_document(course, document) for document in course.documents]]
    if nav_path is None:
        diagnostics.append(_diagnostic(course, target, "OEBPS/content.opf", "navigation-order", "native navigation document is missing"))
        return
    if nav_path not in archive.namelist():
        return
    if contents_path not in archive.namelist():
        return
    nav_references = _local_anchor_references(archive.read(nav_path).decode("utf-8"), nav_path)
    if nav_references != expected:
        diagnostics.append(_diagnostic(course, target, nav_path, "navigation-order", "native navigation must follow the registered document order"))
    contents_references = _local_anchor_references(
        archive.read(contents_path).decode("utf-8"), contents_path
    )
    if contents_references != expected[2:]:
        diagnostics.append(_diagnostic(course, target, contents_path, "navigation-order", "visible contents must follow the registered document order"))


def _validate_kindle_alternatives(
    course: Course, repository_root: Path, archive: ZipFile, diagnostics: list[ValidationDiagnostic]
) -> None:
    for source_document in course.documents:
        source_path = repository_root / source_document
        target_path = _target_for_document(course, source_document)
        source = source_path.read_text(encoding="utf-8")
        edition = archive.read(target_path).decode("utf-8")
        labels = [
            label.group("value")
            for block in _KINDLE_ALTERNATIVE.finditer(source)
            if _KINDLE_EDITION.search(block.group("attributes"))
            if (label := _ARIA_LABEL.search(block.group("attributes"))) is not None
        ]
        for label in labels:
            if label not in edition:
                diagnostics.append(_diagnostic(course, Edition.KINDLE, source_document, "kindle-static-alternative", f"missing visible alternative {label!r}"))
        quiz_count = sum(
            "quiz" in match.group("value").split() for match in _CLASS_ATTRIBUTE.finditer(source)
        )
        if quiz_count and edition.count('class="quiz-static"') < quiz_count:
            diagnostics.append(_diagnostic(course, Edition.KINDLE, source_document, "kindle-static-alternative", "each quiz needs a visible static alternative"))


def _local_anchor_references(content: str, source_path: str) -> list[str]:
    references: list[str] = []
    for match in _ANCHOR_REFERENCE.finditer(content):
        parts = urlsplit(match.group("value"))
        if parts.scheme or parts.netloc or not parts.path:
            continue
        resolved = _resolve_archive_path(source_path, parts.path)
        if resolved is not None:
            references.append(resolved)
    return references


def _has_fragment(archive: ZipFile, path: str, fragment: str) -> bool:
    try:
        document = ElementTree.fromstring(archive.read(path))
    except ElementTree.ParseError:
        return False
    return any(element.get("id") == fragment for element in document.iter())


def _target_for_document(course: Course, document: str) -> str:
    relative = PurePosixPath(document).relative_to(course.source)
    if relative == PurePosixPath("index.html"):
        return "OEBPS/text/introduction.xhtml"
    return str(PurePosixPath("OEBPS/text") / relative.with_suffix(".xhtml"))


def _is_safe_archive_path(path: str) -> bool:
    pure_path = PurePosixPath(path)
    return bool(path) and not pure_path.is_absolute() and ".." not in pure_path.parts


def _resolve_archive_path(source_path: str, reference_path: str) -> str | None:
    if PurePosixPath(reference_path).is_absolute():
        return None
    resolved = posixpath.normpath(posixpath.join(posixpath.dirname(source_path), reference_path))
    return None if resolved == ".." or resolved.startswith("../") else resolved


def _jpeg_properties(contents: bytes) -> tuple[tuple[int, int], int]:
    if not contents.startswith(b"\xff\xd8"):
        raise ValueError("cover is not a JPEG file")
    position = 2
    while position + 9 < len(contents):
        if contents[position] != 0xFF:
            position += 1
            continue
        marker = contents[position + 1]
        position += 2
        if marker in {0xD8, 0xD9} or 0xD0 <= marker <= 0xD7:
            continue
        length = int.from_bytes(contents[position : position + 2], "big")
        if length < 2 or position + length > len(contents):
            break
        if marker in {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}:
            height = int.from_bytes(contents[position + 3 : position + 5], "big")
            width = int.from_bytes(contents[position + 5 : position + 7], "big")
            return (width, height), contents[position + 7]
        position += length
    raise ValueError("cover has no readable JPEG dimensions")


def _diagnostic(course: Course, target: Edition, source: str, rule: str, detail: str) -> ValidationDiagnostic:
    return ValidationDiagnostic(course.course_id, target, source, rule, detail)
