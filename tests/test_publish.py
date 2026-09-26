from datetime import UTC, date, datetime
from pathlib import Path
from zipfile import ZipFile

import pytest

from cleararc.apple import Edition, build_apple_pilot
from cleararc.config import DeliveryConfig
from cleararc.delivery import DeliveryError, DeliveryRecord, import_into_books, save_delivery_record, send_to_kindle
from cleararc.publication import PublicationError, publish_course
from cleararc.registry import load_course_registry
from cleararc.validation import PublicationGateError, ValidatedEditions
from cleararc.cli import main
from click.testing import CliRunner
import cleararc.cli as cli


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def test_published_edition_carries_a_human_readable_date_and_distinct_filename() -> None:
    course = next(
        course
        for course in load_course_registry()
        if course.course_id == "datavizlib-source-walkthrough"
    )

    edition = build_apple_pilot(course, PROJECT_ROOT, publication_date=date(2026, 9, 26))

    assert edition.name == "datavizlib-source-walkthrough.2026-09-26.apple.epub"
    with ZipFile(edition) as archive:
        package = archive.read("OEBPS/content.opf").decode()
        title_page = archive.read("OEBPS/text/title.xhtml").decode()
    assert "<dc:date>2026-09-26</dc:date>" in package
    assert "Edition date: 26 September 2026" in title_page


def test_publish_records_each_target_after_the_paired_gate_passes(tmp_path: Path) -> None:
    course = next(
        course
        for course in load_course_registry()
        if course.course_id == "datavizlib-source-walkthrough"
    )
    editions = ValidatedEditions(tmp_path / "apple.epub", tmp_path / "kindle.epub")
    delivered: list[Edition] = []
    records: list[DeliveryRecord] = []

    result = publish_course(
        course,
        PROJECT_ROOT,
        date(2026, 9, 26),
        targets=tuple(Edition),
        build_and_validate=lambda *_args, **_kwargs: editions,
        deliver={
            Edition.APPLE: lambda _path: delivered.append(Edition.APPLE),
            Edition.KINDLE: lambda _path: delivered.append(Edition.KINDLE),
        },
        save_record=records.append,
        recorded_at=lambda: datetime(2026, 9, 26, 12, tzinfo=UTC),
    )

    assert delivered == [Edition.APPLE, Edition.KINDLE]
    assert [record.target for record in result] == [Edition.APPLE, Edition.KINDLE]
    assert [record.outcome for record in records] == ["delivered", "delivered"]
    assert all(record.edition_date == date(2026, 9, 26) for record in records)


def test_publish_keeps_a_successful_record_when_the_other_delivery_fails(tmp_path: Path) -> None:
    course = next(
        course
        for course in load_course_registry()
        if course.course_id == "datavizlib-source-walkthrough"
    )
    editions = ValidatedEditions(tmp_path / "apple.epub", tmp_path / "kindle.epub")
    delivered: list[Edition] = []
    records: list[DeliveryRecord] = []

    with pytest.raises(PublicationError, match="--only apple"):
        publish_course(
            course,
            PROJECT_ROOT,
            date(2026, 9, 26),
            targets=tuple(Edition),
            build_and_validate=lambda *_args, **_kwargs: editions,
            deliver={
                Edition.APPLE: lambda _path: (_ for _ in ()).throw(RuntimeError("Books unavailable")),
                Edition.KINDLE: lambda _path: delivered.append(Edition.KINDLE),
            },
            save_record=records.append,
            recorded_at=lambda: datetime(2026, 9, 26, 12, tzinfo=UTC),
        )

    assert delivered == [Edition.KINDLE]
    assert [(record.target, record.outcome) for record in records] == [
        (Edition.APPLE, "failed"),
        (Edition.KINDLE, "delivered"),
    ]


def test_publish_only_delivers_the_requested_target_after_validating_both_editions(tmp_path: Path) -> None:
    course = next(
        course
        for course in load_course_registry()
        if course.course_id == "datavizlib-source-walkthrough"
    )
    editions = ValidatedEditions(tmp_path / "apple.epub", tmp_path / "kindle.epub")
    validated: list[date] = []
    delivered: list[Edition] = []

    publish_course(
        course,
        PROJECT_ROOT,
        date(2026, 9, 26),
        targets=(Edition.KINDLE,),
        build_and_validate=lambda *_args, publication_date: (
            validated.append(publication_date) or editions
        ),
        deliver={Edition.KINDLE: lambda _path: delivered.append(Edition.KINDLE)},
        save_record=lambda _record: None,
        recorded_at=lambda: datetime(2026, 9, 26, 12, tzinfo=UTC),
    )

    assert validated == [date(2026, 9, 26)]
    assert delivered == [Edition.KINDLE]


def test_delivery_adapters_use_replaced_books_and_smtp_process_boundaries(tmp_path: Path) -> None:
    edition = tmp_path / "dated.edition.epub"
    edition.write_bytes(b"EPUB")
    books_calls: list[object] = []
    smtp_calls: list[object] = []

    class FakeSmtp:
        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

        def starttls(self, *, context):
            smtp_calls.append(("starttls", context))

        def login(self, username, password):
            smtp_calls.append(("login", username, password))

        def sendmail(self, sender, recipients, message):
            smtp_calls.append(("sendmail", sender, recipients, message))

    config = DeliveryConfig(
        kindle_address="reader@kindle.example",
        sender="sender@example.com",
        smtp_host="smtp.example.com",
        smtp_port=587,
        username="sender@example.com",
        password_command="security find-generic-password -s test -w",
    )

    import_into_books(edition, run=lambda *args, **kwargs: books_calls.append((args, kwargs)))
    send_to_kindle(
        config,
        edition,
        password_resolver=lambda _config: "fake-password",
        smtp_factory=lambda *_args: FakeSmtp(),
    )

    assert books_calls == [((['open', '-a', 'Books', str(edition)],), {'check': True, 'text': True})]
    assert ("login", "sender@example.com", "fake-password") in smtp_calls
    assert smtp_calls[-1][0] == "sendmail"
    assert "dated.edition.epub" in smtp_calls[-1][3]


def test_delivery_records_are_stored_by_course_date_and_target(tmp_path: Path) -> None:
    record = DeliveryRecord(
        "datavizlib-source-walkthrough",
        Edition.KINDLE,
        date(2026, 9, 26),
        tmp_path / "kindle.epub",
        "delivered",
        datetime(2026, 9, 26, 12, tzinfo=UTC),
    )

    path = save_delivery_record(record, tmp_path / "records")

    assert path == tmp_path / "records/datavizlib-source-walkthrough/2026-09-26/kindle.json"
    assert '"outcome": "delivered"' in path.read_text()


def test_publish_cli_validates_both_editions_before_delivering_only_requested_target(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    course = next(
        course
        for course in load_course_registry()
        if course.course_id == "datavizlib-source-walkthrough"
    )
    editions = ValidatedEditions(tmp_path / "apple.epub", tmp_path / "kindle.epub")
    events: list[str] = []
    records: list[DeliveryRecord] = []
    config = DeliveryConfig(
        kindle_address="reader@kindle.example",
        sender="sender@example.com",
        smtp_host="smtp.example.com",
        smtp_port=587,
        username="sender@example.com",
        password_command="security find-generic-password -s test -w",
    )
    monkeypatch.setattr(cli, "load_course_registry", lambda: (course,))
    monkeypatch.setattr(cli, "build_and_validate_course", lambda *_args, **_kwargs: (events.append("gate") or editions))
    monkeypatch.setattr(cli, "load_config", lambda: config)
    monkeypatch.setattr(cli, "send_to_kindle", lambda _config, path: events.append(f"kindle:{path.name}"))
    monkeypatch.setattr(cli, "import_into_books", lambda _path: events.append("apple"))
    monkeypatch.setattr(cli, "save_delivery_record", records.append)

    result = CliRunner().invoke(
        main, ["publish", course.course_id, "--date", "2026-09-26", "--only", "kindle"]
    )

    assert result.exit_code == 0, result.output
    assert events == ["gate", "kindle:kindle.epub"]
    assert [(record.target, record.outcome) for record in records] == [(Edition.KINDLE, "delivered")]


def test_publish_cli_gate_failure_never_invokes_a_delivery_adapter(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    course = next(
        course
        for course in load_course_registry()
        if course.course_id == "datavizlib-source-walkthrough"
    )
    events: list[str] = []
    monkeypatch.setattr(cli, "load_course_registry", lambda: (course,))

    def fail_gate(*_args, **_kwargs):
        events.append("gate")
        raise PublicationGateError(())

    monkeypatch.setattr(cli, "build_and_validate_course", fail_gate)
    monkeypatch.setattr(cli, "import_into_books", lambda _path: events.append("apple"))
    monkeypatch.setattr(cli, "send_to_kindle", lambda *_args: events.append("kindle"))

    result = CliRunner().invoke(main, ["publish", course.course_id])

    assert result.exit_code != 0
    assert events == ["gate"]


def test_publish_cli_apple_only_retry_does_not_load_kindle_configuration(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    course = next(
        course
        for course in load_course_registry()
        if course.course_id == "datavizlib-source-walkthrough"
    )
    editions = ValidatedEditions(tmp_path / "apple.epub", tmp_path / "kindle.epub")
    events: list[str] = []
    records: list[DeliveryRecord] = []
    monkeypatch.setattr(cli, "load_course_registry", lambda: (course,))
    monkeypatch.setattr(cli, "build_and_validate_course", lambda *_args, **_kwargs: editions)
    monkeypatch.setattr(cli, "load_config", lambda: pytest.fail("Apple retry must not load SMTP config"))
    monkeypatch.setattr(cli, "send_to_kindle", lambda *_args: events.append("kindle"))
    monkeypatch.setattr(cli, "import_into_books", lambda path: events.append(f"apple:{path.name}"))
    monkeypatch.setattr(cli, "save_delivery_record", records.append)

    result = CliRunner().invoke(
        main, ["publish", course.course_id, "--date", "2026-09-26", "--only", "apple"]
    )

    assert result.exit_code == 0, result.output
    assert events == ["apple:apple.epub"]
    assert [(record.target, record.outcome) for record in records] == [(Edition.APPLE, "delivered")]


def test_publish_cli_reports_partial_failure_with_a_dated_retry_command(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    course = next(
        course
        for course in load_course_registry()
        if course.course_id == "datavizlib-source-walkthrough"
    )
    editions = ValidatedEditions(tmp_path / "apple.epub", tmp_path / "kindle.epub")
    records: list[DeliveryRecord] = []
    config = DeliveryConfig(
        kindle_address="reader@kindle.example",
        sender="sender@example.com",
        smtp_host="smtp.example.com",
        smtp_port=587,
        username="sender@example.com",
        password_command="security find-generic-password -s test -w",
    )
    monkeypatch.setattr(cli, "load_course_registry", lambda: (course,))
    monkeypatch.setattr(cli, "build_and_validate_course", lambda *_args, **_kwargs: editions)
    monkeypatch.setattr(cli, "load_config", lambda: config)
    monkeypatch.setattr(
        cli,
        "import_into_books",
        lambda _path: (_ for _ in ()).throw(DeliveryError("Books unavailable")),
    )
    monkeypatch.setattr(cli, "send_to_kindle", lambda *_args: None)
    monkeypatch.setattr(cli, "save_delivery_record", records.append)

    result = CliRunner().invoke(
        main, ["publish", course.course_id, "--date", "2026-09-26"]
    )

    assert result.exit_code != 0
    assert "Retry with cleararc publish datavizlib-source-walkthrough --date 2026-09-26 --only apple" in result.output
    assert [(record.target, record.outcome) for record in records] == [
        (Edition.APPLE, "failed"),
        (Edition.KINDLE, "delivered"),
    ]
