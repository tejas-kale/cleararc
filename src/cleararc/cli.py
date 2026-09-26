"""The public Cleararc command-line interface."""

from datetime import date, datetime
from pathlib import Path

import click

from cleararc.apple import Edition, EditionBuildError, build_apple_pilot, build_kindle_pilot
from cleararc.config import (
    ConfigError,
    configuration_diagnostics,
    import_readpack_config,
    init_config,
    load_config,
)
from cleararc.delivery import DeliveryError, import_into_books, save_delivery_record, send_to_kindle
from cleararc.publication import PublicationError, publish_course
from cleararc.registry import RegistryError, load_course_registry
from cleararc.validation import PublicationGateError, build_and_validate_course


@click.group()
def main() -> None:
    """Build and publish private Cleararc course editions."""


@main.group()
def config() -> None:
    """Create and inspect private delivery configuration."""


@config.command("init")
def config_init() -> None:
    """Create a private delivery configuration template."""
    try:
        path = init_config()
    except ConfigError as error:
        raise click.ClickException(str(error)) from error
    click.echo(f"Created Cleararc configuration template: {path}")


@config.command("import-readpack")
def config_import_readpack() -> None:
    """Import non-secret settings from readpack once."""
    try:
        source, destination = import_readpack_config()
    except ConfigError as error:
        raise click.ClickException(str(error)) from error
    click.echo(f"Imported non-secret settings from {source} to {destination}.")


@config.command("check")
def config_check() -> None:
    """Check delivery settings, Keychain command resolution, and Books availability."""
    diagnostics = configuration_diagnostics()
    for diagnostic in diagnostics:
        prefix = "Error" if diagnostic.is_error else "OK"
        click.echo(f"{prefix}: {diagnostic.message}")
    if any(diagnostic.is_error for diagnostic in diagnostics):
        raise click.ClickException("Fix the configuration issues above before delivery.")


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
@click.option("--target", type=click.Choice(["apple", "kindle"]))
@click.option("--all", "build_all", is_flag=True, help="Build and validate every active course edition.")
@click.argument("course_id", required=False)
def build(target: str | None, build_all: bool, course_id: str | None) -> None:
    """Build a course edition, or all paired editions with --all."""
    try:
        courses = load_course_registry()
    except RegistryError as error:
        raise click.ClickException(str(error)) from error

    repository_root = Path(__file__).resolve().parents[2]
    if build_all:
        if course_id is not None or target is not None:
            raise click.ClickException("--all cannot be combined with COURSE_ID or --target.")
        for course in courses:
            try:
                editions = build_and_validate_course(course, repository_root)
            except PublicationGateError as error:
                raise click.ClickException(str(error)) from error
            for edition in Edition:
                click.echo(
                    f"Built and validated {edition.value.title()} edition: "
                    f"{editions.path_for(edition)}"
                )
        return

    if course_id is None:
        raise click.ClickException("COURSE_ID is required unless --all is supplied.")
    try:
        course = next(course for course in courses if course.course_id == course_id)
    except StopIteration as error:
        raise click.ClickException(f"Unknown course {course_id!r}.") from error
    try:
        edition = Edition(target or Edition.APPLE)
        builder = {
            Edition.APPLE: build_apple_pilot,
            Edition.KINDLE: build_kindle_pilot,
        }[edition]
        destination = builder(course, repository_root)
    except EditionBuildError as error:
        raise click.ClickException(str(error)) from error
    click.echo(f"Built {edition.value.title()} edition: {destination}")


@main.command()
@click.argument("course_id")
def validate(course_id: str) -> None:
    """Validate both target editions for COURSE_ID before publication."""
    try:
        course = next(course for course in load_course_registry() if course.course_id == course_id)
    except StopIteration as error:
        raise click.ClickException(f"Unknown course {course_id!r}.") from error
    except RegistryError as error:
        raise click.ClickException(str(error)) from error

    repository_root = Path(__file__).resolve().parents[2]
    try:
        editions = build_and_validate_course(course, repository_root)
    except PublicationGateError as error:
        raise click.ClickException(str(error)) from error
    for target in Edition:
        click.echo(f"Validated {target.value.title()} edition: {editions.path_for(target)}")


@main.command()
@click.option(
    "--only",
    "only_target",
    type=click.Choice([target.value for target in Edition]),
    help="Deliver only this target, after validating both editions.",
)
@click.option(
    "--date",
    "edition_date",
    type=click.DateTime(formats=["%Y-%m-%d"]),
    help="Publication date in YYYY-MM-DD format (use the original date to retry an edition).",
)
@click.argument("course_id")
def publish(only_target: str | None, edition_date: datetime | None, course_id: str) -> None:
    """Build, validate and deliver dated editions for COURSE_ID."""
    try:
        course = next(course for course in load_course_registry() if course.course_id == course_id)
    except StopIteration as error:
        raise click.ClickException(f"Unknown course {course_id!r}.") from error
    except RegistryError as error:
        raise click.ClickException(str(error)) from error

    repository_root = Path(__file__).resolve().parents[2]
    publication_date = edition_date.date() if edition_date is not None else date.today()
    targets = (Edition(only_target),) if only_target else tuple(Edition)
    deliveries = {
        Edition.APPLE: import_into_books,
        Edition.KINDLE: lambda path: send_to_kindle(load_config(), path),
    }
    try:
        records = publish_course(
            course,
            repository_root,
            publication_date,
            targets=targets,
            build_and_validate=build_and_validate_course,
            deliver=deliveries,
            save_record=save_delivery_record,
        )
    except PublicationError as error:
        raise click.ClickException(str(error)) from error
    except PublicationGateError as error:
        raise click.ClickException(str(error)) from error
    except (ConfigError, DeliveryError) as error:
        raise click.ClickException(str(error)) from error

    for record in records:
        click.echo(
            f"Delivered {record.target.value.title()} edition for {record.edition_date}: "
            f"{record.edition_path}"
        )
