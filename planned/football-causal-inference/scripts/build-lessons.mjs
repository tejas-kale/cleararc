import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { lessons as part1 } from './lesson-content-02-05.mjs';
import { lessons as part2 } from './lesson-content-06-09.mjs';
import { lessons as part3 } from './lesson-content-10-13.mjs';
import { lessons as part4 } from './lesson-content-14-17.mjs';

const root = resolve(import.meta.dirname, '..');
const lessons = [...part1, ...part2, ...part3, ...part4];

function render(lesson) {
  const previous = lesson.number === 2
    ? '<a href="0001-from-question-to-estimand.html">Previous lesson: Define a causal question and estimand</a>'
    : `<a href="${String(lesson.number - 1).padStart(4, '0')}-${lesson.previous}.html">Previous lesson: ${lesson.previousLabel}</a>`;
  const next = lesson.number === 17
    ? '<a href="../README.md">Return to the course index</a>'
    : `<a href="${String(lesson.number + 1).padStart(4, '0')}-${lesson.next}.html">Next lesson: ${lesson.nextLabel}</a>`;
  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>${lesson.title}</title>
  <link rel="stylesheet" href="../assets/course.css">
</head>
<body>
<header class="topbar"><div><a href="../README.md">Course index</a><span>Lesson ${lesson.number} of 17</span></div></header>
<main>
  <p class="eyebrow">${lesson.topic}</p>
  <h1>${lesson.title}</h1>
  <p class="lead">${lesson.lead}</p>
  <div class="lesson-meta"><span>${lesson.time}</span><span>Includes guided exercises</span></div>
  <section class="objective"><h2>What you will be able to do</h2><p>${lesson.objective}</p></section>
  ${lesson.body.trim()}
  <section class="summary"><h2>What to remember</h2>${lesson.summary}</section>
  <p class="citation"><strong>Primary reading.</strong> ${lesson.reading}</p>
  <p>If any step is unclear, ask your teaching agent to work through another football example with you.</p>
  <nav class="lesson-nav">${previous}${next}</nav>
</main>
<script src="../assets/quiz.js"></script>
</body>
</html>`;
}

for (const lesson of lessons) {
  const filename = `${String(lesson.number).padStart(4, '0')}-${lesson.slug}.html`;
  writeFileSync(resolve(root, 'lessons', filename), render(lesson));
}

console.log(`Built ${lessons.length} guided lessons.`);
