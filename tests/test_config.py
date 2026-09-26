from pathlib import Path

from click.testing import CliRunner
import pytest

import cleararc.config as config_module
from cleararc.cli import main
from cleararc.config import ConfigError, DeliveryConfig, resolve_smtp_password


def _config_home(monkeypatch, tmp_path: Path) -> Path:
    config_home = tmp_path / "config-home"
    monkeypatch.setenv("XDG_CONFIG_HOME", str(config_home))
    return config_home


def _write_readpack_config(
    config_home: Path,
    password_command: str = "security find-generic-password -s readpack-smtp -a readpack-account -w",
) -> Path:
    source = config_home / "readpack" / "config.toml"
    source.parent.mkdir(parents=True)
    source.write_text(
        """\
[kindle]
address = "reader@kindle.example"

[email]
sender = "sender@example.com"
smtp_host = "smtp.example.com"
smtp_port = 2525
username = "sender@example.com"
password_command = """ + repr(password_command) + "\n"
    )
    source.write_text(source.read_text() + 'password = "secret-never-copy"\n')
    return source


def test_config_init_creates_private_template_and_does_not_overwrite(
    monkeypatch, tmp_path: Path
) -> None:
    config_home = _config_home(monkeypatch, tmp_path)

    first = CliRunner().invoke(main, ["config", "init"])
    config_path = config_home / "cleararc" / "config.toml"
    original = config_path.read_text()
    config_path.write_text("keep this configuration\n")
    second = CliRunner().invoke(main, ["config", "init"])

    assert first.exit_code == 0, first.output
    assert "password_command" in original
    assert "cleararc-smtp" in original
    assert config_path.stat().st_mode & 0o777 == 0o600
    assert second.exit_code == 1
    assert "already exists" in second.output
    assert config_path.read_text() == "keep this configuration\n"


def test_config_check_explains_which_template_settings_need_values(
    monkeypatch, tmp_path: Path
) -> None:
    config_home = _config_home(monkeypatch, tmp_path)
    monkeypatch.setattr(config_module, "books_app_available", lambda: True)
    initialised = CliRunner().invoke(main, ["config", "init"])

    checked = CliRunner().invoke(main, ["config", "check"])

    assert initialised.exit_code == 0, initialised.output
    assert checked.exit_code == 1
    assert "kindle.address" in checked.output
    assert "email.sender" in checked.output
    assert "email.smtp_host" in checked.output
    assert "email.username" in checked.output
    assert "password_command" not in checked.output


def test_import_readpack_copies_only_non_secret_delivery_settings(
    monkeypatch, tmp_path: Path
) -> None:
    config_home = _config_home(monkeypatch, tmp_path)
    source = _write_readpack_config(config_home)

    result = CliRunner().invoke(main, ["config", "import-readpack"])
    imported = (config_home / "cleararc" / "config.toml").read_text()

    assert result.exit_code == 0, result.output
    assert str(source) in result.output
    assert 'address = "reader@kindle.example"' in imported
    assert 'sender = "sender@example.com"' in imported
    assert 'smtp_host = "smtp.example.com"' in imported
    assert "smtp_port = 2525" in imported
    assert 'username = "sender@example.com"' in imported
    assert 'password_command = "security find-generic-password -s readpack-smtp -a readpack-account -w"' in imported
    assert "password =" not in imported
    assert "secret-never-copy" not in imported


def test_import_readpack_refuses_to_replace_cleararc_configuration(
    monkeypatch, tmp_path: Path
) -> None:
    config_home = _config_home(monkeypatch, tmp_path)
    _write_readpack_config(config_home)
    target = config_home / "cleararc" / "config.toml"
    target.parent.mkdir(parents=True)
    target.write_text("existing\n")

    result = CliRunner().invoke(main, ["config", "import-readpack"])

    assert result.exit_code == 1
    assert "already exists" in result.output
    assert target.read_text() == "existing\n"


def test_import_readpack_reports_missing_source_without_creating_target(
    monkeypatch, tmp_path: Path
) -> None:
    config_home = _config_home(monkeypatch, tmp_path)

    result = CliRunner().invoke(main, ["config", "import-readpack"])

    assert result.exit_code == 1
    assert "readpack" in result.output.lower()
    assert "config init" in result.output
    assert not (config_home / "cleararc" / "config.toml").exists()


def test_config_check_reports_missing_addresses_sender_and_keychain_command(
    monkeypatch, tmp_path: Path
) -> None:
    config_home = _config_home(monkeypatch, tmp_path)
    monkeypatch.setattr(config_module, "books_app_available", lambda: False)
    target = config_home / "cleararc" / "config.toml"
    target.parent.mkdir(parents=True)
    target.write_text("[kindle]\n[email]\n")

    result = CliRunner().invoke(main, ["config", "check"])

    assert result.exit_code == 1
    assert "kindle.address" in result.output.lower()
    assert "sender" in result.output.lower()
    assert "smtp_host" in result.output.lower()
    assert "password_command" in result.output.lower()
    assert "Books" in result.output


def test_config_check_does_not_run_or_reveal_keychain_output(
    monkeypatch, tmp_path: Path
) -> None:
    monkeypatch.setattr(config_module, "books_app_available", lambda: True)
    config_home = _config_home(monkeypatch, tmp_path)
    bin_dir = tmp_path / "bin"
    bin_dir.mkdir()
    marker = tmp_path / "command-ran"
    fake_security = bin_dir / "security"
    fake_security.write_text(f"#!/bin/sh\ntouch {marker}\necho secret-value\n")
    fake_security.chmod(0o755)
    monkeypatch.setenv("PATH", str(bin_dir))
    target = config_home / "cleararc" / "config.toml"
    target.parent.mkdir(parents=True)
    target.write_text(
        """\
[kindle]
address = "reader@kindle.example"
[email]
sender = "sender@example.com"
smtp_host = "smtp.example.com"
username = "sender@example.com"
password_command = "security find-generic-password -s cleararc-smtp -w"
"""
    )

    result = CliRunner().invoke(main, ["config", "check"])

    assert result.exit_code == 0, result.output
    assert "secret-value" not in result.output
    assert not marker.exists()


def test_config_check_rejects_arbitrary_password_shell_commands(
    monkeypatch, tmp_path: Path
) -> None:
    monkeypatch.setattr(config_module, "books_app_available", lambda: True)
    config_home = _config_home(monkeypatch, tmp_path)
    target = config_home / "cleararc" / "config.toml"
    target.parent.mkdir(parents=True)
    target.write_text(
        """\
[kindle]
address = "reader@kindle.example"
[email]
sender = "sender@example.com"
smtp_host = "smtp.example.com"
username = "sender@example.com"
password_command = "security find-generic-password -s cleararc-smtp -w; echo leaked"
"""
    )

    result = CliRunner().invoke(main, ["config", "check"])

    assert result.exit_code == 1
    assert "email.password_command must be" in result.output
    assert "leaked" not in result.output


def test_config_check_accepts_imported_readpack_service_and_account_command(
    monkeypatch, tmp_path: Path
) -> None:
    monkeypatch.setattr(config_module, "books_app_available", lambda: True)
    config_home = _config_home(monkeypatch, tmp_path)
    bin_dir = tmp_path / "bin"
    bin_dir.mkdir()
    fake_security = bin_dir / "security"
    fake_security.write_text("#!/bin/sh\nexit 0\n")
    fake_security.chmod(0o755)
    monkeypatch.setenv("PATH", str(bin_dir))
    _write_readpack_config(config_home)

    imported = CliRunner().invoke(main, ["config", "import-readpack"])
    checked = CliRunner().invoke(main, ["config", "check"])

    assert imported.exit_code == 0, imported.output
    assert checked.exit_code == 0, checked.output
    assert "Keychain" not in checked.output


@pytest.mark.parametrize(
    "command",
    [
        "security find-generic-password -s readpack-smtp -a account -w; echo leaked",
        "security find-generic-password -s readpack-smtp -a account -g",
        "security find-generic-password -s readpack-smtp -a -w",
        "security find-generic-password -s readpack-smtp -a first -a second -w",
    ],
)
def test_config_check_rejects_unsafe_or_malformed_keychain_options(
    monkeypatch, tmp_path: Path, command: str
) -> None:
    monkeypatch.setattr(config_module, "books_app_available", lambda: True)
    config_home = _config_home(monkeypatch, tmp_path)
    target = config_home / "cleararc" / "config.toml"
    target.parent.mkdir(parents=True)
    target.write_text(
        """\
[kindle]
address = "reader@kindle.example"
[email]
sender = "sender@example.com"
smtp_host = "smtp.example.com"
username = "sender@example.com"
password_command = """ + repr(command) + "\n"
    )

    result = CliRunner().invoke(main, ["config", "check"])

    assert result.exit_code == 1
    assert "email.password_command must be" in result.output
    assert "leaked" not in result.output


def test_password_resolution_uses_fake_keychain_command_and_keeps_output_private(
    monkeypatch, tmp_path: Path
) -> None:
    bin_dir = tmp_path / "bin"
    bin_dir.mkdir()
    fake_security = bin_dir / "security"
    arguments_log = tmp_path / "keychain-arguments"
    fake_security.write_text(f"#!/bin/sh\nprintf '%s\\n' \"$@\" > {arguments_log}\necho fake-secret\n")
    fake_security.chmod(0o755)
    monkeypatch.setenv("PATH", str(bin_dir))
    config = DeliveryConfig(
        kindle_address="reader@kindle.example",
        sender="sender@example.com",
        smtp_host="smtp.example.com",
        smtp_port=587,
        username="sender@example.com",
        password_command="security find-generic-password -s test-service -a test-account -w",
    )

    assert resolve_smtp_password(config) == "fake-secret"
    assert arguments_log.read_text().splitlines() == [
        "find-generic-password",
        "-s",
        "test-service",
        "-a",
        "test-account",
        "-w",
    ]


def test_password_resolution_redacts_keychain_error_output(monkeypatch, tmp_path: Path) -> None:
    bin_dir = tmp_path / "bin"
    bin_dir.mkdir()
    fake_security = bin_dir / "security"
    fake_security.write_text("#!/bin/sh\necho fake-secret >&2\nexit 7\n")
    fake_security.chmod(0o755)
    monkeypatch.setenv("PATH", str(bin_dir))
    config = DeliveryConfig(
        kindle_address="reader@kindle.example",
        sender="sender@example.com",
        smtp_host="smtp.example.com",
        smtp_port=587,
        username="sender@example.com",
        password_command="security find-generic-password -s test-service -w",
    )

    try:
        resolve_smtp_password(config)
    except ConfigError as error:
        assert "exit code 7" in str(error)
        assert "fake-secret" not in str(error)
    else:
        raise AssertionError("a failed Keychain command should produce a configuration error")
