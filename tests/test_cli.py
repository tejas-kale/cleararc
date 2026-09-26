from click.testing import CliRunner
from html.parser import HTMLParser
import posixpath
import pytest
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree
from zipfile import ZIP_STORED, ZipFile

from cleararc.cli import main


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class _LocalReferences(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.values: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.values.extend(
            value for name, value in attrs if name in {"href", "src"} and value is not None
        )


def _course_toml() -> str:
    return """
[[courses]]
id = "test-course"
title = "Test Course"
source = "planned/test-course"
reading_order = 1
author = "Tejas Kale"
collection = "Cleararc"
cover = "assets/covers/test-course.jpg"
publication_ids = { apple = "961e229a-cec0-4da2-92f7-2d80fa8d3f4a", kindle = "d8e2be73-7650-4873-9c8c-90c40108d4a1" }
documents = ["planned/test-course/lessons/0001-test.html"]
"""


def test_list_shows_each_active_course_in_reading_order() -> None:
    result = CliRunner().invoke(main, ["list"])

    assert result.exit_code == 0
    assert result.output == (
        "1\tfootball-causal-inference\tFootball Causal Inference\n"
        "2\tfx-and-central-banks\tFX and Central Banks\n"
        "3\tiphone-air-autumn-photography\tiPhone Air Autumn Photography\n"
        "4\tused-bicycle-buying-berlin\tBerlin Used Bicycle Guide\n"
        "5\tice-ing-the-economy\tICE and the Economy\n"
        "6\tdatavizlib-source-walkthrough\tInside datavizlib’s Source\n"
        "7\tpaired-email-evaluation\tPaired Email Evaluation\n"
    )


def test_list_identifies_the_course_and_target_for_an_invalid_publication_identity(
    tmp_path,
) -> None:
    registry = tmp_path / "courses.toml"
    registry.write_text(
        """
[[courses]]
id = "test-course"
title = "Test Course"
source = "planned/test-course"
reading_order = 1
author = "Tejas Kale"
collection = "Cleararc"
cover = "assets/covers/test-course.jpg"
publication_ids = { apple = "not-a-uuid", kindle = "d8e2be73-7650-4873-9c8c-90c40108d4a1" }
documents = ["planned/test-course/lessons/0001-test.html"]
"""
    )

    result = CliRunner().invoke(main, ["list", "--registry", str(registry)])

    assert result.exit_code == 1
    assert "course 'test-course' has invalid publication_ids.apple" in result.output


@pytest.mark.parametrize(
    ("contents", "diagnostic"),
    [
        ("courses = [", "is malformed"),
        (_course_toml().replace('documents = ["planned/test-course/lessons/0001-test.html"]\n', ""), "missing required field(s): documents"),
        (_course_toml() + _course_toml().replace("reading_order = 1", "reading_order = 2"), "duplicate course id"),
    ],
)
def test_list_reports_malformed_missing_and_duplicate_registry_data(
    tmp_path, contents: str, diagnostic: str
) -> None:
    registry = tmp_path / "courses.toml"
    registry.write_text(contents)

    result = CliRunner().invoke(main, ["list", "--registry", str(registry)])

    assert result.exit_code == 1
    assert diagnostic in result.output


def test_build_creates_the_scripted_apple_pilot_epub_without_changing_lessons() -> None:
    source_lesson = PROJECT_ROOT / "completed/datavizlib-source-walkthrough/lessons/0006-measure-then-shift.html"
    source_before = source_lesson.read_bytes()

    result = CliRunner().invoke(main, ["build", "datavizlib-source-walkthrough"])

    assert result.exit_code == 0, result.output
    epub_path = PROJECT_ROOT / "build/datavizlib-source-walkthrough.apple.epub"
    assert result.output == f"Built Apple edition: {epub_path}\n"
    assert epub_path.is_file()
    assert source_lesson.read_bytes() == source_before

    with ZipFile(epub_path) as archive:
        assert archive.getinfo("mimetype").compress_type == ZIP_STORED
        assert archive.read("mimetype") == b"application/epub+zip"
        names = set(archive.namelist())
        assert "OEBPS/images/cover.jpg" in names
        assert "OEBPS/nav.xhtml" in names
        assert "OEBPS/text/title.xhtml" in names
        assert "OEBPS/text/introduction.xhtml" in names
        assert "OEBPS/text/contents.xhtml" in names
        assert "OEBPS/text/lessons/0010-extend-basechart.xhtml" in names
        assert "OEBPS/assets/lesson.css" in names
        assert "OEBPS/assets/quiz.js" in names
        assert "OEBPS/assets/coords.js" in names

        package = archive.read("OEBPS/content.opf").decode()
        assert "3937a58c-2584-46d3-9469-98f9364ec3e0" in package
        assert 'properties="cover-image"' in package
        assert 'properties="scripted"' in package
        package_root = ElementTree.fromstring(package)
        namespace = {"opf": "http://www.idpf.org/2007/opf"}
        assert [item.get("idref") for item in package_root.findall("opf:spine/opf:itemref", namespace)] == [
            "cover",
            "title",
            "contents",
            *[f"document-{number}" for number in range(1, 12)],
        ]

        navigation = archive.read("OEBPS/nav.xhtml").decode()
        assert "The five files and the public names" in navigation
        assert "A new chart type only fills the drawing hole" in navigation
        assert navigation.count('<li><a href="text/lessons/') == 10

        contents = archive.read("OEBPS/text/contents.xhtml").decode()
        assert "Contents" in contents
        assert "LineChart collects series, then plots them" in contents

        interaction = archive.read("OEBPS/text/lessons/0006-measure-then-shift.xhtml").decode()
        assert 'aria-label="Clickable figure, axes, and display spaces"' in interaction
        assert '<script src="../../assets/coords.js"></script>' in interaction
        assert "data-answer=\"2\"" in interaction

        styles = archive.read("OEBPS/assets/lesson.css").decode()
        assert "white-space: pre-wrap" in styles
        assert "max-width: 100%" in styles

        for name in (entry for entry in names if entry.endswith(".xhtml")):
            references = _LocalReferences()
            references.feed(archive.read(name).decode())
            for reference in references.values:
                parts = urlsplit(reference)
                if parts.scheme or parts.netloc or not parts.path:
                    continue
                target = posixpath.normpath(str(Path(name).parent / parts.path))
                assert target in names, f"{name} has a broken local reference: {reference}"
