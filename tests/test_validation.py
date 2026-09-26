from __future__ import annotations

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZIP_STORED, ZipFile

import pytest
from click.testing import CliRunner

from cleararc.apple import Edition, build_apple_pilot, build_kindle_pilot
from cleararc.cli import main
from cleararc.registry import load_course_registry
from cleararc.validation import PublicationGateError, validate_publication_gate


PROJECT_ROOT = Path(__file__).resolve().parents[1]
COURSE_ID = "datavizlib-source-walkthrough"


def _pilot_course():
    return next(course for course in load_course_registry() if course.course_id == COURSE_ID)


def _edition_copy(tmp_path: Path, edition: Edition) -> Path:
    course = _pilot_course()
    builder = {
        Edition.APPLE: build_apple_pilot,
        Edition.KINDLE: build_kindle_pilot,
    }[edition]
    built = builder(course, PROJECT_ROOT)
    copied = tmp_path / built.name
    copied.write_bytes(built.read_bytes())
    return copied


def _rewrite_epub(path: Path, change) -> None:
    with ZipFile(path) as archive:
        files = {name: archive.read(name) for name in archive.namelist()}
    change(files)
    with ZipFile(path, "w", compression=ZIP_DEFLATED) as archive:
        archive.writestr("mimetype", files.pop("mimetype"), compress_type=ZIP_STORED)
        for name, contents in files.items():
            archive.writestr(name, contents)


def _gate(course, target: Edition, epub: Path) -> None:
    valid_other = _edition_copy(epub.parent, Edition.KINDLE if target is Edition.APPLE else Edition.APPLE)
    validate_publication_gate(
        course,
        PROJECT_ROOT,
        {
            target: epub,
            Edition.KINDLE if target is Edition.APPLE else Edition.APPLE: valid_other,
        },
    )


def test_validate_reports_both_course_editions() -> None:
    result = CliRunner().invoke(main, ["validate", COURSE_ID])

    assert result.exit_code == 0, result.output
    assert "Validated Apple edition:" in result.output
    assert "Validated Kindle edition:" in result.output


@pytest.mark.parametrize(
    ("target", "change", "rule", "source_document"),
    [
        (
            Edition.APPLE,
            lambda files: files.pop("OEBPS/assets/lesson.css"),
            "embedded-asset",
            "OEBPS/content.opf",
        ),
        (
            Edition.APPLE,
            lambda files: files.__setitem__(
                "OEBPS/content.opf",
                files["OEBPS/content.opf"].replace(b'assets/lesson.css', b'../escaped.css'),
            ),
            "safe-archive-path",
            "OEBPS/content.opf",
        ),
        (
            Edition.APPLE,
            lambda files: files.__setitem__(
                "OEBPS/text/lessons/0001-src-layout-and-public-api.xhtml",
                files["OEBPS/text/lessons/0001-src-layout-and-public-api.xhtml"].replace(
                    b"../../assets/lesson.css", b"../../assets/missing.css"
                ),
            ),
            "internal-link",
            "completed/datavizlib-source-walkthrough/lessons/0001-src-layout-and-public-api.html",
        ),
        (
            Edition.KINDLE,
            lambda files: files.__setitem__(
                "OEBPS/text/lessons/0006-measure-then-shift.xhtml",
                files["OEBPS/text/lessons/0006-measure-then-shift.xhtml"].replace(
                    b"Static coordinate guide", b"Coordinate guide"
                ),
            ),
            "kindle-static-alternative",
            "completed/datavizlib-source-walkthrough/lessons/0006-measure-then-shift.html",
        ),
        (
            Edition.APPLE,
            lambda files: files.__setitem__(
                "OEBPS/nav.xhtml",
                files["OEBPS/nav.xhtml"].replace(
                    b'text/contents.xhtml', b'text/lessons/0010-extend-basechart.xhtml', 1
                ),
            ),
            "navigation-order",
            "OEBPS/nav.xhtml",
        ),
        (
            Edition.KINDLE,
            lambda files: files.__setitem__(
                "OEBPS/text/lessons/0001-src-layout-and-public-api.xhtml",
                files["OEBPS/text/lessons/0001-src-layout-and-public-api.xhtml"].replace(
                    b"</body>", b"<script>unsafe()</script></body>"
                ),
            ),
            "kindle-forbidden-content",
            "completed/datavizlib-source-walkthrough/lessons/0001-src-layout-and-public-api.html",
        ),
        (
            Edition.KINDLE,
            lambda files: files.__setitem__(
                "OEBPS/assets/lesson.css",
                files["OEBPS/assets/lesson.css"] + b"\n.book { animation: pulse 1s; }\n",
            ),
            "kindle-forbidden-content",
            "OEBPS/assets/lesson.css",
        ),
        (
            Edition.APPLE,
            lambda files: files.__setitem__(
                "OEBPS/text/lessons/0001-src-layout-and-public-api.xhtml",
                files["OEBPS/text/lessons/0001-src-layout-and-public-api.xhtml"].replace(
                    b"</body>",
                    b'<a href="0002-basechart-contract.xhtml#missing-section">Next</a></body>',
                ),
            ),
            "internal-link",
            "completed/datavizlib-source-walkthrough/lessons/0001-src-layout-and-public-api.html",
        ),
        (
            Edition.APPLE,
            lambda files: files.pop("OEBPS/nav.xhtml"),
            "embedded-asset",
            "OEBPS/content.opf",
        ),
    ],
    ids=(
        "missing-embedded-asset",
        "unsafe-manifest-path",
        "broken-internal-link",
        "missing-kindle-fallback",
        "invalid-navigation",
        "forbidden-kindle-content",
        "forbidden-kindle-animation",
        "broken-internal-fragment",
        "missing-navigation-document",
    ),
)
def test_publication_gate_reports_realistic_broken_edition_fixture(
    tmp_path: Path, target: Edition, change, rule: str, source_document: str
) -> None:
    course = _pilot_course()
    epub = _edition_copy(tmp_path, target)
    _rewrite_epub(epub, change)

    with pytest.raises(PublicationGateError) as raised:
        _gate(course, target, epub)

    diagnostic = next(item for item in raised.value.diagnostics if item.rule == rule)
    assert diagnostic.course_id == COURSE_ID
    assert diagnostic.target is target
    assert diagnostic.source_document == source_document
