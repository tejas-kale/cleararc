from pathlib import Path

from cleararc.registry import load_course_registry


PROJECT_ROOT = Path(__file__).resolve().parents[1]

EXPECTED_COVERS = {
    "football-causal-inference": "assets/covers/football-causal-inference.jpg",
    "fx-and-central-banks": "assets/covers/fx-and-central-banks.jpg",
    "used-bicycle-buying-berlin": "assets/covers/used-bicycle-buying-berlin.jpg",
    "iphone-air-autumn-photography": "assets/covers/iphone-air-autumn-photography.jpg",
    "ice-ing-the-economy": "assets/covers/ice-ing-the-economy.jpg",
    "paired-email-evaluation": "assets/covers/paired-email-evaluation.jpg",
}


def _jpeg_properties(contents: bytes) -> tuple[tuple[int, int], int]:
    assert contents.startswith(b"\xff\xd8")
    position = 2
    while position + 9 < len(contents):
        assert contents[position] == 0xFF
        marker = contents[position + 1]
        position += 2
        if marker in {0xD8, 0xD9}:
            continue
        length = int.from_bytes(contents[position : position + 2], "big")
        assert length >= 2
        if 0xC0 <= marker <= 0xC3:
            height = int.from_bytes(contents[position + 3 : position + 5], "big")
            width = int.from_bytes(contents[position + 5 : position + 7], "big")
            return (width, height), contents[position + 7]
        position += length
    raise AssertionError("JPEG has no readable dimensions")


def test_remaining_collection_covers_are_registered_as_stable_jpegs() -> None:
    covers = {course.course_id: course.cover for course in load_course_registry()}

    assert {course_id: covers[course_id] for course_id in EXPECTED_COVERS} == EXPECTED_COVERS
    for cover in EXPECTED_COVERS.values():
        contents = (PROJECT_ROOT / cover).read_bytes()
        dimensions, components = _jpeg_properties(contents)
        assert dimensions == (1575, 2520)
        assert components == 3
        assert len(contents) < 5 * 1024 * 1024
