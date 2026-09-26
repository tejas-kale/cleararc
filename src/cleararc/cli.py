"""The public Cleararc command-line interface."""

from pathlib import Path

import click

from cleararc.apple import AppleBuildError, build_apple_pilot
from cleararc.registry import RegistryError, load_course_registry


@click.group()
def main() -> None:
    """Build and publish private Cleararc course editions."""


@main.command()
@click.option(
    "--registry",
    "registry_path",
    type=click.Path(path_type=Path, dir_okay=False),
    help="Validate and list a specified course registry instead of Cleararc's registry.",
)
def list(registry_path: Path | None) -> None:
    """List active courses in their declared reading order."""
    try:
        courses = load_course_registry(registry_path)
    except RegistryError as error:
        raise click.ClickException(str(error)) from error

    for course in courses:
        click.echo(f"{course.reading_order}\t{course.course_id}\t{course.display_title}")


@main.command()
@click.argument("course_id")
def build(course_id: str) -> None:
    """Build the Apple edition for the supported pilot COURSE_ID."""
    try:
        course = next(course for course in load_course_registry() if course.course_id == course_id)
    except StopIteration as error:
        raise click.ClickException(f"Unknown course {course_id!r}.") from error
    except RegistryError as error:
        raise click.ClickException(str(error)) from error

    repository_root = Path(__file__).resolve().parents[2]
    try:
        destination = build_apple_pilot(course, repository_root)
    except AppleBuildError as error:
        raise click.ClickException(str(error)) from error
    click.echo(f"Built Apple edition: {destination}")
