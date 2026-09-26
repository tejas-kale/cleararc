from click.testing import CliRunner
import pytest

from cleararc.cli import main


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
