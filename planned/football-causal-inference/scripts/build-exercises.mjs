import { writeFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const lessonFiles = readdirSync(join(root, 'lessons')).filter((n) => n.endsWith('.html')).sort();

const modules = [
  await import('./exercise-content-01-06.mjs'),
  await import('./exercise-content-07-12.mjs'),
  await import('./exercise-content-13-17.mjs')
];
const sheets = modules.flatMap((m) => m.sheets).sort((a, b) => a.n - b.n);

const pad = (n) => String(n).padStart(4, '0');

function render(sheet, index) {
  const lesson = lessonFiles[sheet.n - 1];
  const prev = index > 0 ? sheets[index - 1] : null;
  const next = index < sheets.length - 1 ? sheets[index + 1] : null;
  const questions = sheet.questions.map((q, i) => `  <details class="question">
    <summary><span class="marks">Question ${i + 1}</span><span class="q-title">${q.title}</span></summary>
${q.body}
  </details>`).join('\n\n');
  const answers = sheet.questions.map((q, i) => `      <section class="answer">
        <span class="marks">Answer ${i + 1}</span>
        <h3>${q.title}</h3>
${q.answer}
      </section>`).join('\n\n');
  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Exercise sheet ${sheet.n}: ${sheet.title}</title>
  <link rel="stylesheet" href="../assets/course.css">
</head>
<body>
<header class="topbar"><div><a href="../index.html">Course index</a><span>Exercise sheet ${sheet.n} of 17</span></div></header>
<main>
  <p class="eyebrow">Exercise sheet</p>
  <h1>${sheet.title}</h1>
  <p class="lead">${sheet.questions.length} questions drawn from <a href="../lessons/${lesson}">Lesson ${sheet.n}</a>. ${sheet.lead}</p>
  <div class="lesson-meta"><span>30 minutes</span><span>${sheet.questions.length} questions</span><span>Answers at the end</span></div>

  <section class="sheet-intro">
    <h2>How to use this sheet</h2>
    <p>Work through the questions in order and write your answers down before reading any part of the answer section. Give yourself about thirty minutes in total. If one question runs long, write what you have, mark it and move on, because the answer section explains the reasoning in full.</p>
    <p>Most questions ask for a short written answer rather than a number. The aim is a defensible statement, so a sentence or two of reasoning is worth more than a single word.</p>
    <p>The questions are collapsed so that you can take them one at a time. Open one, answer it, then open the next. The answers are held behind a single button at the foot of the page, so nothing is revealed until you choose to reveal it.</p>
  </section>

${questions}

  <section class="answers">
    <h2>Answers</h2>
    <p class="answer-note">Read these only after writing your own answers. Where an answer says "a good answer includes", treat the listed points as the marking scheme rather than as the only wording that works.</p>

    <details class="answer-reveal">
      <summary>Show all answers</summary>
${answers}
    </details>
  </section>

  <p class="citation"><strong>Related reading.</strong> ${sheet.related}</p>
  <p>If your answer and the suggested answer disagree and you cannot see why, ask your teaching agent to work through that question with you rather than assuming the sheet is right.</p>
  <nav class="lesson-nav">${prev ? `<a href="${pad(prev.n)}-${prev.slug}.html">Previous sheet: ${prev.title}</a>` : `<a href="../lessons/${lesson}">Back to Lesson ${sheet.n}</a>`}${next ? `<a href="${pad(next.n)}-${next.slug}.html">Next sheet: ${next.title}</a>` : `<a href="../index.html">Course index</a>`}</nav>
</main>
</body>
</html>
`;
}

if (sheets.length !== 17) throw new Error(`Expected 17 sheets, found ${sheets.length}`);
sheets.forEach((sheet, index) => {
  writeFileSync(join(root, 'exercises', `${pad(sheet.n)}-${sheet.slug}.html`), render(sheet, index));
});
const indexItems = sheets.map((sheet) => `    <li><a href="${pad(sheet.n)}-${sheet.slug}.html"><span><strong>${sheet.title}</strong><small>${sheet.lead}</small></span><time>30 minutes</time></a></li>`).join('\n');
writeFileSync(join(root, 'exercises', 'index.html'), `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Exercise sheets</title>
  <link rel="stylesheet" href="../assets/course.css">
</head>
<body>
<header class="topbar"><div><a href="../index.html">Course index</a><span>Exercise sheets</span></div></header>
<main>
  <p class="eyebrow">Practice</p>
  <h1>Exercise sheets</h1>
  <p class="lead">One sheet for each lesson. Every sheet holds seven or eight questions, takes about thirty minutes, and carries worked answers at the end so that you can mark your own work.</p>

  <section class="objective">
    <h2>How to work through a sheet</h2>
    <p>Read the lesson first, then attempt the sheet in one sitting without looking at the answers. Write your answers down rather than composing them in your head, because the difference between a vague sense of the argument and a defensible written statement is the thing these sheets are training. Mark yourself afterwards against the answer section, and note any question where your answer and the suggested answer disagreed for a reason you cannot articulate.</p>
  </section>

  <ol class="course-list">
${indexItems}
  </ol>
</main>
</body>
</html>
`);
console.log(`Built ${sheets.length} exercise sheets and the sheet index.`);
