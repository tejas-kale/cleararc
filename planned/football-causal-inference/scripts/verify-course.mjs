import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const lessonsDir = join(root, 'lessons');
const lessons = readdirSync(lessonsDir).filter((name) => name.endsWith('.html')).sort();
const errors = [];
if (lessons.length !== 17) errors.push(`Expected 17 lessons, found ${lessons.length}`);

for (const name of lessons) {
  const file = join(lessonsDir, name);
  const html = readFileSync(file, 'utf8');
  for (const required of ['lang="en-GB"', '../assets/course.css', 'data-quiz', 'feedback', 'Primary reading.', 'ask your teaching agent']) {
    if (!html.toLowerCase().includes(required.toLowerCase())) errors.push(`${name}: missing ${required}`);
  }
  const options = [...html.matchAll(/<label><input[^>]+>([^<]+)<\/label>/g)].map((match) => match[1].trim());
  const wordCounts = options.map((option) => option.split(/\s+/).length);
  if (options.length !== 3) errors.push(`${name}: expected 3 quiz options, found ${options.length}`);
  if (new Set(wordCounts).size !== 1) errors.push(`${name}: unequal quiz word counts ${wordCounts.join('/')}`);
  const visibleWords = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  if (visibleWords < 625) errors.push(`${name}: lesson is too short at ${visibleWords} words`);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(href)) continue;
    const target = resolve(dirname(file), href);
    if (!existsSync(target)) errors.push(`${name}: broken local link ${href}`);
  }
}

const exercisesDir = join(root, 'exercises');
const sheetFiles = readdirSync(exercisesDir).filter((name) => /^\d{4}-.*\.html$/.test(name)).sort();
if (sheetFiles.length !== 17) errors.push(`Expected 17 exercise sheets, found ${sheetFiles.length}`);
sheetFiles.forEach((name, index) => {
  const file = join(exercisesDir, name);
  const html = readFileSync(file, 'utf8');
  for (const required of ['lang="en-GB"', '../assets/course.css', 'Related reading.', 'ask your teaching agent']) {
    if (!html.includes(required)) errors.push(`${name}: missing ${required}`);
  }
  const questions = [...html.matchAll(/<span class="marks">Question \d+<\/span>/g)].length;
  const answers = [...html.matchAll(/<span class="marks">Answer \d+<\/span>/g)].length;
  if (questions < 5 || questions > 10) errors.push(`${name}: expected 5 to 10 questions, found ${questions}`);
  if (questions !== answers) errors.push(`${name}: ${questions} questions but ${answers} answers`);
  if (name.slice(0, 4) !== lessons[index].slice(0, 4)) errors.push(`${name}: does not pair with ${lessons[index]}`);
  const lessonHtml = readFileSync(join(lessonsDir, lessons[index]), 'utf8');
  if (!lessonHtml.includes(`../exercises/${name}`)) errors.push(`${lessons[index]}: does not link to its exercise sheet`);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(href)) continue;
    if (!existsSync(resolve(dirname(file), href))) errors.push(`${name}: broken local link ${href}`);
  }
});

for (const name of ['MISSION.md', 'NOTES.md', 'RESOURCES.md', 'README.md', 'index.html', 'assets/course.css', 'assets/quiz.js', 'assets/dag.svg', 'reference/glossary.html', 'reference/design-field-guide.html', 'exercises/index.html', 'scripts/build-exercises.mjs']) {
  if (!existsSync(join(root, name))) errors.push(`Missing ${name}`);
}

const indexFile = join(root, 'index.html');
if (existsSync(indexFile)) {
  const indexHtml = readFileSync(indexFile, 'utf8');
  const lessonLinks = [...indexHtml.matchAll(/href="(lessons\/[^"]+\.html)"/g)].map((match) => match[1]);
  if (lessonLinks.length !== 17) errors.push(`index.html: expected 17 lesson links, found ${lessonLinks.length}`);
  for (const [, href] of indexHtml.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(href)) continue;
    if (!existsSync(resolve(root, href))) errors.push(`index.html: broken local link ${href}`);
  }
}

for (const name of ['0003-dags-and-back-door-identification.html', '0004-emulate-a-target-trial.html', '0006-weighting-standardisation-and-aipw.html', '0014-longitudinal-g-methods.html']) {
  const html = readFileSync(join(lessonsDir, name), 'utf8');
  if (!html.toLowerCase().includes('evidence gap')) errors.push(`${name}: missing evidence-gap label`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Verified ${lessons.length} lessons, ${sheetFiles.length} exercise sheets, index links, minimum lesson length, equal-word quiz options, local links, shared assets and evidence-gap labels.`);
