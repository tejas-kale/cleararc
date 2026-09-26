"""Private delivery configuration and its one-time readpack importer."""

from __future__ import annotations

from dataclasses import dataclass
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import tomllib


class ConfigError(ValueError):
    """A configuration file is missing, malformed, or unsafe to use."""

    def __init__(self, message: str, *, missing_settings: tuple[str, ...] = ()) -> None:
        super().__init__(message)
        self.missing_settings = missing_settings


@dataclass(frozen=True)
class DeliveryConfig:
    kindle_address: str
    sender: str
    smtp_host: str
    smtp_port: int
    username: str
    password_command: str


@dataclass(frozen=True)
class ConfigDiagnostic:
    message: str
    is_error: bool


def config_directory() -> Path:
    """Return Cleararc's XDG configuration directory."""
    xdg_config_home = os.environ.get("XDG_CONFIG_HOME")
    base = Path(xdg_config_home).expanduser() if xdg_config_home else Path.home() / ".config"
    return base / "cleararc"


def config_path() -> Path:
    return config_directory() / "config.toml"


def init_config() -> Path:
    """Create a private delivery template without replacing existing settings."""
    directory = config_directory()
    directory.mkdir(parents=True, exist_ok=True)
    destination = directory / "config.toml"
    try:
        _write_new_config(destination, _CONFIG_TEMPLATE)
    except FileExistsError as error:
        raise ConfigError(f"Cleararc configuration already exists at {destination}.") from error
    return destination


def import_readpack_config() -> tuple[Path, Path]:
    """Copy the non-secret delivery settings from readpack once."""
    source = config_path().parent.parent / "readpack" / "config.toml"
    destination = config_path()
    if destination.exists():
        raise ConfigError(f"Cleararc configuration already exists at {destination}; it was not changed.")
    if not source.is_file():
        raise ConfigError(
            f"Readpack configuration was not found at {source}. Create Cleararc configuration with 'cleararc config init' instead."
        )

    try:
        with source.open("rb") as config_file:
            data = tomllib.load(config_file)
    except (OSError, tomllib.TOMLDecodeError) as error:
        raise ConfigError(f"Could not read readpack configuration at {source}: {error}") from error

    kindle = data.get("kindle", {})
    email = data.get("email", {})
    if not isinstance(kindle, dict) or not isinstance(email, dict):
        raise ConfigError("Readpack configuration must contain [kindle] and [email] tables.")
    required = {
        "kindle.address": kindle.get("address"),
        "email.sender": email.get("sender"),
        "email.smtp_host": email.get("smtp_host"),
        "email.password_command": email.get("password_command"),
    }
    missing = _missing_settings(required)
    if missing:
        raise ConfigError(
            "Readpack configuration is missing required non-secret setting(s): "
            + ", ".join(missing)
            + ". The source was not changed.",
            missing_settings=missing,
        )

    port = _smtp_port(email)

    payload = _render_config(
        kindle["address"], email["sender"], email["smtp_host"], port,
        email.get("username", ""), email["password_command"],
    )
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        _write_new_config(destination, payload)
    except FileExistsError as error:
        raise ConfigError(f"Cleararc configuration already exists at {destination}; it was not changed.") from error
    return source, destination


def load_config(path: Path | None = None) -> DeliveryConfig:
    """Load Cleararc delivery settings without retrieving a password."""
    selected_path = path or config_path()
    if not selected_path.is_file():
        raise ConfigError(f"Configuration not found at {selected_path}. Run 'cleararc config init'.")
    try:
        with selected_path.open("rb") as config_file:
            data = tomllib.load(config_file)
    except (OSError, tomllib.TOMLDecodeError) as error:
        raise ConfigError(f"Could not read Cleararc configuration at {selected_path}: {error}") from error

    kindle = data.get("kindle", {})
    email = data.get("email", {})
    if not isinstance(kindle, dict) or not isinstance(email, dict):
        raise ConfigError("Cleararc configuration must contain [kindle] and [email] tables.")
    required = {
        "kindle.address": kindle.get("address"),
        "email.sender": email.get("sender"),
        "email.smtp_host": email.get("smtp_host"),
        "email.username": email.get("username"),
        "email.password_command": email.get("password_command"),
    }
    missing = _missing_settings(required)
    if missing:
        raise ConfigError(
            "Missing required configuration setting(s): " + ", ".join(missing) + ".",
            missing_settings=missing,
        )
    port = _smtp_port(email)

    return DeliveryConfig(
        kindle_address=kindle["address"],
        sender=email["sender"],
        smtp_host=email["smtp_host"],
        smtp_port=port,
        username=email["username"],
        password_command=email["password_command"],
    )


def validate_password_command(command: str) -> str:
    """Resolve a narrowly scoped macOS Keychain lookup without executing it."""
    try:
        parts = shlex.split(command)
    except ValueError as error:
        raise ConfigError("email.password_command must be a valid Keychain command.") from error
    valid_lookup = (
        len(parts) == 5
        and parts[2] == "-s"
        and _is_option_value(parts[3])
        and parts[4] == "-w"
    ) or (
        len(parts) == 7
        and parts[2] == "-s"
        and _is_option_value(parts[3])
        and parts[4] == "-a"
        and _is_option_value(parts[5])
        and parts[6] == "-w"
    )
    if not (
        len(parts) >= 2
        and parts[0] in {"security", "/usr/bin/security"}
        and parts[1] == "find-generic-password"
        and valid_lookup
    ):
        raise ConfigError(
            "email.password_command must be 'security find-generic-password -s SERVICE [-a ACCOUNT] -w'."
        )
    executable = shutil.which(parts[0]) if not Path(parts[0]).is_absolute() else parts[0]
    if not executable or not os.access(executable, os.X_OK):
        raise ConfigError(
            "The configured Keychain command could not be found. Install macOS Keychain access or correct email.password_command."
        )
    return executable


def _is_option_value(value: str) -> bool:
    return bool(value) and not value.startswith("-")


def resolve_smtp_password(config: DeliveryConfig) -> str:
    """Run only the configured Keychain lookup and keep its output private."""
    executable = validate_password_command(config.password_command)
    parts = shlex.split(config.password_command)
    try:
        result = subprocess.run(
            [executable, *parts[1:]], capture_output=True, text=True, check=False
        )
    except OSError as error:
        raise ConfigError("The configured Keychain command could not be started.") from error
    if result.returncode:
        raise ConfigError(
            f"The configured Keychain command failed with exit code {result.returncode}; check the service and account in email.password_command."
        )
    password = result.stdout.strip()
    if not password:
        raise ConfigError("The configured Keychain command returned no password; check its service and account.")
    return password


def configuration_diagnostics(path: Path | None = None) -> list[ConfigDiagnostic]:
    """Report missing delivery settings and local Books/Keychain availability."""
    diagnostics: list[ConfigDiagnostic] = []
    try:
        config = load_config(path)
    except ConfigError as error:
        message = str(error)
        diagnostics.append(ConfigDiagnostic(message, True))
        if path is None and not config_path().exists():
            diagnostics.append(ConfigDiagnostic("Run 'cleararc config init' to create a template.", True))
        else:
            diagnostics.extend(
                ConfigDiagnostic(f"Configure {field} in config.toml.", True)
                for field in error.missing_settings
            )
        config = None

    if config is not None:
        try:
            validate_password_command(config.password_command)
        except ConfigError as error:
            diagnostics.append(ConfigDiagnostic(str(error), True))

    if books_app_available():
        diagnostics.append(ConfigDiagnostic("Books app is available for private Apple imports.", False))
    else:
        diagnostics.append(
            ConfigDiagnostic(
                "Books app was not found. Install Apple Books on this Mac before importing an Apple edition.",
                True,
            )
        )
    return diagnostics


def books_app_available() -> bool:
    return any(Path(location).exists() for location in ("/System/Applications/Books.app", "/Applications/Books.app"))


def _missing_settings(settings: dict[str, object]) -> tuple[str, ...]:
    return tuple(
        field
        for field, value in settings.items()
        if not isinstance(value, str) or not value.strip()
    )


def _smtp_port(email_settings: dict[str, object]) -> int:
    port = email_settings.get("smtp_port", 587)
    if not isinstance(port, int) or isinstance(port, bool) or not 1 <= port <= 65535:
        raise ConfigError("email.smtp_port must be an integer from 1 to 65535.")
    return port


def _render_config(
    kindle_address: str,
    sender: str,
    smtp_host: str,
    smtp_port: int,
    username: str,
    password_command: str,
) -> str:
    return (
        "[kindle]\n"
        f"address = {json.dumps(kindle_address, ensure_ascii=False)}\n\n"
        "[email]\n"
        f"sender = {json.dumps(sender, ensure_ascii=False)}\n"
        f"smtp_host = {json.dumps(smtp_host, ensure_ascii=False)}\n"
        f"smtp_port = {smtp_port}\n"
        f"username = {json.dumps(username, ensure_ascii=False)}\n"
        f"password_command = {json.dumps(password_command, ensure_ascii=False)}\n"
    )


def _write_new_config(path: Path, contents: str) -> None:
    """Create a configuration file exclusively with owner-only permissions."""
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8") as config_file:
        config_file.write(contents)


_CONFIG_TEMPLATE = """\
[kindle]
address = ""

[email]
sender = ""
smtp_host = ""
smtp_port = 587
username = ""
# Passwords are retrieved at delivery time through this macOS Keychain command.
password_command = "security find-generic-password -s cleararc-smtp -w"
"""
