# Cleararc operator guide

Cleararc builds a complete Apple edition and Kindle edition for each active course. Building and validating only create local files. Delivery happens only when an operator runs `cleararc publish` for a named course.

## Requirements and setup

Run commands from the repository root with `uv`. The project requires Python 3.12 or later. On macOS, Apple delivery opens the local EPUB in Books; Kindle delivery sends the EPUB to the configured Send to Kindle address over SMTP.

Create the private configuration template with:

```sh
uv run cleararc config init
```

The command creates `config.toml` in `${XDG_CONFIG_HOME:-~/.config}/cleararc/` with owner-only permissions, and it will not replace an existing file. Edit its `[kindle]` and `[email]` values. Set `email.password_command` to a macOS Keychain lookup. Replace `SERVICE` and `ACCOUNT` with the Keychain item values, and omit the `-a ACCOUNT` part when no account selector is needed. For example:

```toml
password_command = "security find-generic-password -s cleararc-smtp -a smtp-user -w"
```

Do not put the SMTP password in this file. `cleararc config import-readpack` can create the Cleararc file from the non-secret settings in the adjacent `readpack` configuration if Cleararc configuration does not already exist. It is a one-time copy; Cleararc does not read `readpack` configuration during normal operation.

Check configuration, Keychain command resolution, and local Books availability before delivery:

```sh
uv run cleararc config check
```

## Inspect, build, and validate

List the active courses and their accepted identifiers in reading order:

```sh
uv run cleararc list
```

Build one course's Apple edition (the default target):

```sh
uv run cleararc build football-causal-inference
```

Choose Kindle explicitly with `--target kindle`. Both target editions for all active courses can be built and validated locally with:

```sh
uv run cleararc build --all
```

`build --all` does not import books or send email. EPUBs are written to the ignored `build/` directory. Build output is reproducible for an unchanged source tree, apart from intentionally dated publication builds.

Validate both editions for one course before publication:

```sh
uv run cleararc validate football-causal-inference
```

Validation reports the course, target, source document, and failed rule. Resolve every reported issue before publishing. `publish` repeats the paired build and validation gate, so neither target is delivered unless both editions pass.

## Publish the remaining collection

The pilot, *Inside datavizlib’s Source*, was accepted on the owner’s iPad and Kindle Colorsoft on 26 September 2026. To publish the six remaining active courses, first check the course list and local builds, then check delivery configuration:

```sh
uv run cleararc list
uv run cleararc build --all
uv run cleararc config check
```

Publish one course at a time in registry reading order. Use one date for this rollout; the example below uses `2026-09-26`. If you run the commands as a block, `set -e` stops the sequence at the first failed course so that you can retry that target before continuing:

```sh
set -e
uv run cleararc publish football-causal-inference --date 2026-09-26
uv run cleararc publish fx-and-central-banks --date 2026-09-26
uv run cleararc publish iphone-air-autumn-photography --date 2026-09-26
uv run cleararc publish used-bicycle-buying-berlin --date 2026-09-26
uv run cleararc publish ice-ing-the-economy --date 2026-09-26
uv run cleararc publish paired-email-evaluation --date 2026-09-26
```

Each command gates both editions before delivery, then attempts Apple and Kindle independently and writes a record for each target. If one target fails, the command reports the course, failure, and target-only retry command. Follow that command with the same course and date, and retry only the failed target. For example:

```sh
uv run cleararc publish football-causal-inference --date 2026-09-26 --only apple
```

Do not rerun the paired publish command to recover a partial delivery: it would attempt both targets again. A target-only retry still rebuilds and validates both editions, but delivers only the selected target. A successful target does not need to be resent.

For a deliberate later revision, choose a new date. To retry an existing dated edition, retain its original date. A same-target retry replaces that target's current JSON record for the course and date.

## Delivery records and verification

Records are stored independently by course, date, and target:

```text
${XDG_CONFIG_HOME:-~/.config}/cleararc/delivery-records/<course-id>/<YYYY-MM-DD>/apple.json
${XDG_CONFIG_HOME:-~/.config}/cleararc/delivery-records/<course-id>/<YYYY-MM-DD>/kindle.json
```

Each JSON record includes the course ID, target, edition date and path, outcome, UTC record time, and failure detail when present. The two target files let an operator see which delivery needs recovery without resending the successful target.

The records describe local delivery attempts. An Apple record with outcome `delivered` means the Books import command succeeded; it does not prove that iCloud synchronisation completed. A Kindle `delivered` record means the SMTP server accepted the message; it does not prove Amazon converted it or that the book arrived on the device. After rollout, verify all six covers, contents, navigation, citations, and platform-specific content in the actual libraries and on the iPad and Kindle Colorsoft.

## Private-library limitations

These are private imports, not Apple Books Store or Kindle Store publications. Apple Books and Amazon do not provide Cleararc a documented upsert contract for these imports. Re-importing or retrying may leave an additional copy, and annotations or reading position are not guaranteed to transfer to a later dated edition. Send to Kindle also converts the submitted EPUB, so local EPUB validation cannot establish final Kindle rendering. Treat device inspection as the acceptance check; a successful command or record alone is not evidence of library arrival.
