# Cleararc

Cleararc is a private learning library organised into self-contained courses and published to Apple Books (iPad) and Kindle (Colorsoft).

Canonical lesson content is authored in semantic, static HTML. Complete courses are compiled into platform-tailored EPUB course editions using the repository-local `cleararc` CLI.

## Repository layout

- `completed/`: Finished courses eligible for publication.
- `planned/`: Courses actively being authored or structured.
- `archived/`: Deprecated or paused courses excluded from publication.
- `assets/`: Shared catalogue styles, scripts, and reviewed course covers.
- `src/cleararc/`: CLI, EPUB builders, publication gate validators, and delivery tooling.
- `src/cleararc/course_registry.toml`: Authoritative catalogue of active courses, reading order, and document manifests.
- `docs/`: Architecture decision records (`docs/adr/`) and operational guides (`docs/cleararc-operations.md`).

A course directory typically contains:
- `index.html`: Course introduction and reading arc.
- `lessons/`: Sequenced lessons (`0001-<name>.html`).
- `exercises/`: Optional exercise sheets (`0001-<name>.html`).
- `reference/`: Reference materials (glossaries, cheat sheets).
- `assets/`: Shared course stylesheets and scripts.

---

## Authoring an HTML lesson

Lessons are single, self-contained HTML files placed in `lessons/` within the course directory.

### 1. File placement and naming
Number files sequentially with four digits:
```text
planned/<course-id>/lessons/0002-mechanisms-of-action.html
```

### 2. Markup template
Lessons use semantic HTML and shared CSS from `../assets/`:

```html
<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lesson 2 · Mechanisms of Action</title>
  <link rel="stylesheet" href="../assets/lesson.css">
  <link rel="stylesheet" href="../assets/quiz.css">
</head>
<body>
<main class="page">

<header class="masthead">
  <p class="eyebrow">Lesson 2 of 6 · Course Title</p>
  <h1>Mechanisms of action</h1>
  <p class="standfirst">Core conceptual thesis in one sentence.</p>
  <p class="meta">≈6 minutes · What this unlocks</p>
</header>

<p>Lesson content begins here. Introduce specialised vocabulary with <em class="term">italicised terms</em>.</p>

<p class="sidenote">Sidenotes supply supplementary detail without breaking the reading flow.</p>

<div class="quiz" data-answer="b">
  <span class="label">Check yourself</span>
  <p class="q">Question testing retrieval of the core concept?</p>
  <div class="opts">
    <button class="opt">Plausible distractor A.</button>
    <button class="opt">The correct answer.</button>
    <button class="opt">Plausible distractor B.</button>
  </div>
  <div class="answer-reveal">
    <p>Explanation of why option B is correct.</p>
  </div>
</div>

</main>
</body>
</html>
```

### 3. Registering documents
Add newly created lesson files to `src/cleararc/course_registry.toml` in reading order:

```toml
[[courses]]
id = "my-course"
title = "My Course Title"
source = "planned/my-course"
reading_order = 5
author = "Tejas Kale"
collection = "Cleararc"
cover = "assets/covers/my-course.jpg"
publication_ids = { apple = "<uuid>", kindle = "<uuid>" }
documents = [
  "planned/my-course/index.html",
  "planned/my-course/lessons/0001-intro.html",
  "planned/my-course/lessons/0002-mechanisms-of-action.html",
]
```

---

## Building and publishing EPUB course editions

EPUBs are built per course edition (never per individual lesson). Cleararc generates two targets:
- **Apple edition**: Supports interactive JavaScript quiz widgets and touch disclosure.
- **Kindle edition**: Replaces interactive elements with static print-style fallbacks and conforms to Kindle Colorsoft constraints.

All CLI commands require `uv` and Python 3.12+.

### List active courses
```sh
uv run cleararc list
```

### Build local EPUBs
Builds output to the `build/` directory without delivering to devices:

```sh
# Build Apple edition (default)
uv run cleararc build <course-id>

# Build Kindle edition
uv run cleararc build <course-id> --target kindle

# Build and validate all active courses
uv run cleararc build --all
```

### Validate against the publication gate
Ensure both targets pass XHTML compliance, asset link checks, and platform constraints:

```sh
uv run cleararc validate <course-id>
```

### Publish to devices
Publishing validates both editions, opens the Apple EPUB in Books (syncing via iCloud), and sends the Kindle EPUB via SMTP:

```sh
uv run cleararc publish <course-id> --date YYYY-MM-DD
```

Configure delivery credentials first with:
```sh
uv run cleararc config init
uv run cleararc config check
```
See `docs/cleararc-operations.md` for full delivery configuration and failure recovery procedures.
