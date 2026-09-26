"""Build Apple and Kindle EPUB pilots from canonical course HTML."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, date, datetime
from enum import StrEnum
from html import escape, unescape
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
import posixpath
import re
from tempfile import NamedTemporaryFile
from urllib.parse import urlsplit, urlunsplit
from zipfile import ZIP_DEFLATED, ZIP_STORED, ZipFile

from cleararc.registry import Course


class EditionBuildError(ValueError):
    """A pilot course edition cannot be built safely."""


class Edition(StrEnum):
    """A supported reading platform for a course edition."""

    APPLE = "apple"
    KINDLE = "kindle"


_VOID_ELEMENTS = frozenset({"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"})
_EXTERNAL_SCHEMES = frozenset({"data", "http", "https", "mailto", "tel"})
_ATTRIBUTE = re.compile(r"(?P<name>href|src)=(?P<quote>[\"'])(?P<value>.*?)(?P=quote)", re.IGNORECASE)
_H1 = re.compile(r"<h1\b[^>]*>(?P<title>.*?)</h1>", re.IGNORECASE | re.DOTALL)
_TAGS = re.compile(r"<[^>]+>")

_APPLE_QUIZ_SCRIPT = """(function () {
  function bindQuiz(root) {
    var answered = false;
    var answer = root.getAttribute("data-answer");
    var buttons = root.querySelectorAll("button[data-choice]");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        var correct = button.getAttribute("data-choice") === answer;
        buttons.forEach(function (other) {
          var right = other.getAttribute("data-choice") === answer;
          other.setAttribute("data-state", right ? "right" : "wrong");
          other.disabled = true;
        });
        var feedback = document.createElement("p");
        feedback.className = "feedback";
        feedback.textContent = correct
          ? root.getAttribute("data-ok") || "Correct."
          : root.getAttribute("data-no") || "Not quite — look at the highlighted answer.";
        root.appendChild(feedback);
      });
    });
  }

  document.querySelectorAll(".quiz").forEach(bindQuiz);
})();
"""

_EPUB_STYLE = """

img, svg {
  max-width: 100%;
  height: auto;
}

pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  vertical-align: top;
  overflow-wrap: anywhere;
}

.cover-page {
  margin: 0;
  padding: 0;
  text-align: center;
}

.cover-page img {
  width: 100%;
  max-height: 100vh;
  object-fit: contain;
}

.title-page, .contents-page {
  margin: 12vh auto;
  max-width: 34rem;
  padding: 1.5rem;
}
"""


def build_apple_pilot(
    course: Course, repository_root: Path, publication_date: date | None = None
) -> Path:
    """Build the supported Apple edition for the first end-to-end course pilot."""
    return _build_pilot(course, repository_root, Edition.APPLE, publication_date)


def build_kindle_pilot(
    course: Course, repository_root: Path, publication_date: date | None = None
) -> Path:
    """Build the supported static Kindle edition for the first course pilot."""
    return _build_pilot(course, repository_root, Edition.KINDLE, publication_date)


def _build_pilot(
    course: Course,
    repository_root: Path,
    edition: Edition,
    publication_date: date | None,
) -> Path:
    if course.course_id != "datavizlib-source-walkthrough":
        raise EditionBuildError(
            f"Course {course.course_id!r} is not the supported pilot; only "
            "'datavizlib-source-walkthrough' can be built at this stage."
        )

    source_root = repository_root / course.source
    cover = repository_root / course.cover
    if not source_root.is_dir():
        raise EditionBuildError(f"Course {course.course_id!r} source directory {source_root} is missing.")
    if not cover.is_file():
        raise EditionBuildError(f"Course {course.course_id!r} cover {cover} is missing.")

    documents = _load_documents(course, repository_root, source_root, edition)
    assets = _load_assets(source_root, edition)
    dated_suffix = f".{publication_date.isoformat()}" if publication_date else ""
    destination = repository_root / "build" / f"{course.course_id}{dated_suffix}.{edition.value}.epub"
    destination.parent.mkdir(parents=True, exist_ok=True)

    with NamedTemporaryFile(dir=destination.parent, suffix=".epub", delete=False) as temporary_file:
        temporary_path = Path(temporary_file.name)
    try:
        _write_epub(temporary_path, course, documents, assets, cover, edition, publication_date)
        temporary_path.replace(destination)
    finally:
        temporary_path.unlink(missing_ok=True)
    return destination


def _load_documents(
    course: Course, repository_root: Path, source_root: Path, edition: Edition
) -> tuple["EpubDocument", ...]:
    source_paths = tuple(PurePosixPath(document) for document in course.documents)
    relative_paths = tuple(path.relative_to(course.source) for path in source_paths)
    targets = {relative_path: _document_target(relative_path) for relative_path in relative_paths}
    documents: list[EpubDocument] = []
    for relative_path in relative_paths:
        source_path = source_root / relative_path
        if not source_path.is_file():
            raise EditionBuildError(
                f"Course {course.course_id!r} source document {repository_root / course.source / relative_path} is missing."
            )
        source = source_path.read_text(encoding="utf-8")
        title = _document_title(source, source_path)
        transformed = _normalise_xhtml(
            _rewrite_local_references(source, relative_path, targets, targets[relative_path]), edition
        )
        documents.append(
            EpubDocument(
                relative_path,
                targets[relative_path],
                title,
                transformed,
                edition is Edition.APPLE and "<script" in source.lower(),
            )
        )
    return tuple(documents)


def _load_assets(source_root: Path, edition: Edition) -> dict[PurePosixPath, bytes]:
    assets_root = source_root / "assets"
    if not assets_root.is_dir():
        raise EditionBuildError(f"Course source {source_root} has no assets directory.")
    assets: dict[PurePosixPath, bytes] = {}
    for path in sorted(asset for asset in assets_root.rglob("*") if asset.is_file()):
        relative_path = PurePosixPath(path.relative_to(assets_root).as_posix())
        if edition is Edition.KINDLE and relative_path.suffix.lower() == ".js":
            continue
        contents = path.read_bytes()
        if relative_path == PurePosixPath("lesson.css"):
            contents += _EPUB_STYLE.encode()
        if relative_path == PurePosixPath("quiz.js"):
            contents = _APPLE_QUIZ_SCRIPT.encode()
        assets[relative_path] = contents
    return assets


def _document_target(relative_path: PurePosixPath) -> PurePosixPath:
    if relative_path == PurePosixPath("index.html"):
        return PurePosixPath("text/introduction.xhtml")
    return PurePosixPath("text") / relative_path.with_suffix(".xhtml")


def _document_title(source: str, source_path: Path) -> str:
    match = _H1.search(source)
    if not match:
        raise EditionBuildError(f"Source document {source_path} has no h1 for EPUB navigation.")
    title = unescape(_TAGS.sub("", match.group("title"))).strip()
    if not title:
        raise EditionBuildError(f"Source document {source_path} has an empty h1 for EPUB navigation.")
    return title


def _rewrite_local_references(
    source: str,
    source_path: PurePosixPath,
    document_targets: dict[PurePosixPath, PurePosixPath],
    target_path: PurePosixPath,
) -> str:
    def replace(match: re.Match[str]) -> str:
        value = match.group("value")
        rewritten = _rewrite_reference(value, source_path, target_path, document_targets)
        return f'{match.group("name")}={match.group("quote")}{rewritten}{match.group("quote")}'

    return _ATTRIBUTE.sub(replace, source)


def _rewrite_reference(
    value: str,
    source_path: PurePosixPath,
    target_path: PurePosixPath,
    document_targets: dict[PurePosixPath, PurePosixPath],
) -> str:
    parts = urlsplit(value)
    if parts.scheme or parts.scheme.lower() in _EXTERNAL_SCHEMES or parts.netloc or not parts.path:
        return value

    resolved = PurePosixPath(posixpath.normpath(str(source_path.parent / parts.path)))
    if resolved in document_targets:
        target = document_targets[resolved]
    elif resolved.parts and resolved.parts[0] == "assets":
        target = PurePosixPath("assets") / PurePosixPath(*resolved.parts[1:])
    else:
        target = PurePosixPath("text/contents.xhtml")
    relative = posixpath.relpath(str(target), start=str(target_path.parent))
    return urlunsplit(("", "", relative, parts.query, parts.fragment))


def _normalise_xhtml(source: str, edition: Edition = Edition.APPLE) -> str:
    parser = _XhtmlNormaliser(edition)
    parser.feed(source)
    parser.close()
    return '<?xml version="1.0" encoding="utf-8"?>\n' + parser.xhtml()


class _XhtmlNormaliser(HTMLParser):
    """Render the canonical HTML as XHTML while retaining its teaching content."""

    def __init__(self, edition: Edition) -> None:
        super().__init__(convert_charrefs=True)
        self._edition = edition
        self._parts: list[str] = []
        self._open_elements: list[str] = []
        self._ignored_elements: list[str] = []
        self._quiz_attributes: dict[str, str] | None = None
        self._quiz_parts: list[str] = []
        self._quiz_depth = 0

    def _append(self, content: str) -> None:
        if self._quiz_attributes is None:
            self._parts.append(content)
        else:
            self._quiz_parts.append(content)

    def handle_decl(self, declaration: str) -> None:
        if self._ignored_elements:
            return
        if declaration.lower() != "doctype html":
            self._append(f"<!{declaration}>")

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = list(attrs)
        values = dict(attributes)
        if self._ignored_elements:
            if tag not in _VOID_ELEMENTS:
                self._ignored_elements.append(tag)
            return
        target = values.get("data-edition")
        if target and target != self._edition:
            if tag not in _VOID_ELEMENTS:
                self._ignored_elements.append(tag)
            return
        if self._edition is Edition.KINDLE and (
            tag in {
                "script",
                "style",
                "form",
                "canvas",
                "iframe",
                "audio",
                "video",
                "object",
                "embed",
                "animate",
                "animatecolor",
                "animatemotion",
                "animatetransform",
                "discard",
                "marquee",
                "set",
            }
        ):
            if tag not in _VOID_ELEMENTS:
                self._ignored_elements.append(tag)
            return
        if self._edition is Edition.KINDLE and tag == "div" and "quiz" in values.get("class", "").split():
            self._quiz_attributes = {
                key: values[key]
                for key in ("data-answer", "data-ok")
                if values.get(key) is not None
            }
            self._quiz_parts = []
            self._quiz_depth = 1
            return
        if self._quiz_attributes is not None and tag == "div":
            self._quiz_depth += 1
        if self._edition is Edition.KINDLE:
            attributes = [(name, value) for name, value in attributes if name != "style"]
        if tag == "svg":
            attributes = [("viewBox" if name == "viewbox" else name, value) for name, value in attributes]
        if tag == "html" and not any(name == "xmlns" for name, _ in attributes):
            attributes.append(("xmlns", "http://www.w3.org/1999/xhtml"))
        if tag == "svg" and not any(name == "xmlns" for name, _ in attributes):
            attributes.append(("xmlns", "http://www.w3.org/2000/svg"))
        attributes = [(name, value) for name, value in attributes if name != "data-edition"]
        rendered_attributes = "".join(
            f' {name}="{escape(value if value is not None else name, quote=True)}"'
            for name, value in attributes
        )
        if tag in _VOID_ELEMENTS:
            if self._edition is not Edition.KINDLE or tag not in {"input", "button"}:
                self._append(f"<{tag}{rendered_attributes} />")
            return
        if self._edition is Edition.KINDLE and tag == "button":
            self._append(f"<span{rendered_attributes}>")
        else:
            self._append(f"<{tag}{rendered_attributes}>")
        self._open_elements.append(tag)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag not in _VOID_ELEMENTS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        if self._ignored_elements:
            if tag == self._ignored_elements[-1]:
                self._ignored_elements.pop()
            return
        if self._quiz_attributes is not None:
            if tag == "button":
                self._append("</span>")
            elif tag == "div":
                if self._quiz_depth == 1:
                    self._finish_quiz()
                    return
                self._quiz_depth -= 1
        self._append(f"</{tag}>")
        if self._open_elements and self._open_elements[-1] == tag:
            self._open_elements.pop()

    def handle_data(self, data: str) -> None:
        if self._ignored_elements:
            return
        if self._open_elements and self._open_elements[-1] in {"script", "style"}:
            self._append(data)
        else:
            self._append(escape(data))

    def handle_comment(self, data: str) -> None:
        if not self._ignored_elements:
            self._append(f"<!--{data}-->")

    def _finish_quiz(self) -> None:
        source = "".join(self._quiz_parts)
        question_match = re.search(r'<p\b[^>]*class="quiz-q"[^>]*>(.*?)</p>', source, re.DOTALL)
        choices = re.findall(r'<span[^>]*data-choice="([^"]+)"[^>]*>(.*?)</span>', source, re.DOTALL)
        answer = self._quiz_attributes.get("data-answer", "")
        correct = next((content for choice, content in choices if choice == answer), "")
        question = _plain_text(question_match.group(1)) if question_match else "Question"
        rendered_choices = "\n".join(f"<li>{content}</li>" for _, content in choices)
        answer_text = _plain_text(correct)
        explanation = escape(self._quiz_attributes.get("data-ok", ""))
        self._parts.append(
            '<section class="quiz-static"><h3>Question</h3>'
            f"<p>{question}</p><h4>Choices</h4><ol>{rendered_choices}</ol>"
            f"<p><strong>Answer:</strong> {answer_text}</p>"
            f"<p><strong>Explanation:</strong> {explanation}</p></section>"
        )
        self._quiz_attributes = None
        self._quiz_parts = []
        self._quiz_depth = 0

    def xhtml(self) -> str:
        return "".join(self._parts)


def _plain_text(source: str) -> str:
    return escape(unescape(_TAGS.sub("", source)).strip())


@dataclass(frozen=True)
class EpubDocument:
    """A transformed canonical document ready for an EPUB manifest."""

    source: PurePosixPath
    target: PurePosixPath
    title: str
    content: str
    scripted: bool


def _write_epub(
    destination: Path,
    course: Course,
    documents: tuple[EpubDocument, ...],
    assets: dict[PurePosixPath, bytes],
    cover: Path,
    edition: Edition,
    publication_date: date | None,
) -> None:
    with ZipFile(destination, "w", compression=ZIP_DEFLATED) as archive:
        archive.writestr("mimetype", "application/epub+zip", compress_type=ZIP_STORED)
        archive.writestr("META-INF/container.xml", _container_xml())
        archive.writestr(
            "OEBPS/content.opf",
            _package_document(course, documents, assets, edition, publication_date),
        )
        archive.writestr("OEBPS/nav.xhtml", _navigation_document(course, documents))
        archive.writestr("OEBPS/text/cover.xhtml", _cover_page())
        archive.writestr("OEBPS/text/title.xhtml", _title_page(course, publication_date))
        archive.writestr("OEBPS/text/contents.xhtml", _contents_page(documents))
        for document in documents:
            archive.writestr(f"OEBPS/{document.target}", document.content)
        for relative_path, contents in assets.items():
            archive.writestr(f"OEBPS/assets/{relative_path}", contents)
        archive.write(cover, "OEBPS/images/cover.jpg")


def _container_xml() -> str:
    return """<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles>
</container>
"""


def _package_document(
    course: Course,
    documents: tuple[EpubDocument, ...],
    assets: dict[PurePosixPath, bytes],
    edition: Edition,
    publication_date: date | None,
) -> str:
    modified = datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    manifest = [
        '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />',
        '<item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image" />',
        '<item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml" />',
        '<item id="title" href="text/title.xhtml" media-type="application/xhtml+xml" />',
        '<item id="contents" href="text/contents.xhtml" media-type="application/xhtml+xml" />',
    ]
    spine = ["cover", "title", "contents"]
    for index, document in enumerate(documents, start=1):
        identifier = f"document-{index}"
        scripted = ' properties="scripted"' if document.scripted else ""
        manifest.append(
            f'<item id="{identifier}" href="{escape(str(document.target), quote=True)}" '
            f'media-type="application/xhtml+xml"{scripted} />'
        )
        spine.append(identifier)
    for index, path in enumerate(sorted(assets), start=1):
        manifest.append(
            f'<item id="asset-{index}" href="assets/{escape(str(path), quote=True)}" '
            f'media-type="{_media_type(path)}" />'
        )
    dated_metadata = f"    <dc:date>{publication_date.isoformat()}</dc:date>\n" if publication_date else ""
    return f"""<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="en-GB">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">urn:uuid:{escape(_publication_identity(course, edition))}</dc:identifier>
    <dc:title>{escape(course.display_title)}</dc:title>
    <dc:creator>{escape(course.author)}</dc:creator>
    <dc:publisher>{escape(course.collection)}</dc:publisher>
    <dc:language>en-GB</dc:language>
{dated_metadata}    <meta property="dcterms:modified">{modified}</meta>
    <meta name="cover" content="cover-image" />
  </metadata>
  <manifest>
    {'\n    '.join(manifest)}
  </manifest>
  <spine>
    {'\n    '.join(f'<itemref idref="{identifier}" />' for identifier in spine)}
  </spine>
</package>
"""


def _publication_identity(course: Course, edition: Edition) -> str:
    if edition is Edition.APPLE:
        return course.publication_identities.apple
    return course.publication_identities.kindle


def _media_type(path: PurePosixPath) -> str:
    media_types = {
        ".css": "text/css",
        ".js": "text/javascript",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".gif": "image/gif",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
    }
    try:
        return media_types[path.suffix.lower()]
    except KeyError as error:
        raise EditionBuildError(f"Cannot package local asset {path}: unsupported media type.") from error


def _navigation_document(course: Course, documents: tuple[EpubDocument, ...]) -> str:
    entries = "\n".join(
        f'      <li><a href="{escape(posixpath.relpath(str(document.target), start="."), quote=True)}">{escape(document.title)}</a></li>'
        for document in documents
    )
    return f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en-GB">
  <head><title>{escape(course.display_title)} navigation</title></head>
  <body>
    <nav epub:type="toc" id="toc">
      <h1>{escape(course.display_title)}</h1>
      <ol>
        <li><a href="text/title.xhtml">Title page</a></li>
        <li><a href="text/contents.xhtml">Contents</a></li>
{entries}
      </ol>
    </nav>
  </body>
</html>
"""


def _cover_page() -> str:
    return """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">
  <head><title>Cover</title><link rel="stylesheet" href="../assets/lesson.css" /></head>
  <body class="cover-page"><img src="../images/cover.jpg" alt="Cover artwork for Inside datavizlib’s Source" /></body>
</html>
"""


def _title_page(course: Course, publication_date: date | None) -> str:
    dated_edition = (
        f"<p>Edition date: {_human_date(publication_date)}</p>" if publication_date else ""
    )
    return f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">
  <head><title>{escape(course.display_title)}</title><link rel="stylesheet" href="../assets/lesson.css" /></head>
  <body><main class="title-page"><p class="kicker">{escape(course.collection)}</p><h1>{escape(course.display_title)}</h1><p>By {escape(course.author)}</p>{dated_edition}</main></body>
</html>
"""


def _human_date(publication_date: date) -> str:
    months = (
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    )
    return f"{publication_date.day} {months[publication_date.month - 1]} {publication_date.year}"


def _contents_page(documents: tuple[EpubDocument, ...]) -> str:
    entries = "\n".join(
        f'      <li><a href="{escape(posixpath.relpath(str(document.target), start="text"), quote=True)}">{escape(document.title)}</a></li>'
        for document in documents
    )
    return f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">
  <head><title>Contents</title><link rel="stylesheet" href="../assets/lesson.css" /></head>
  <body><main class="contents-page"><h1>Contents</h1><ol>
{entries}
    </ol></main></body>
</html>
"""
