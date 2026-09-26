"""The public Cleararc command-line interface."""

from pathlib import Path

import click

from cleararc.apple import EditionBuildError, build_apple_pilot, build_kindle_pilot
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
@click.option("--target", type=click.Choice(["apple", "kindle"]), default="apple", show_default=True)
@click.argument("course_id")
def build(target: str, course_id: str) -> None:
    """Build a supported Apple or Kindle edition for COURSE_ID."""
    try:
        course = next(course for course in load_course_registry() if course.course_id == course_id)
    except StopIteration as error:
        raise click.ClickException(f"Unknown course {course_id!r}.") from error
    except RegistryError as error:
        raise click.ClickException(str(error)) from error

    repository_root = Path(__file__).resolve().parents[2]
    try:
        builder = build_apple_pilot if target == "apple" else build_kindle_pilot
        destination = builder(course, repository_root)
    except EditionBuildError as error:
        raise click.ClickException(str(error)) from error
    click.echo(f"Built {target.title()} edition: {destination}")
