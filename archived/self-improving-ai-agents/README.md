# Self-improving AI agents, a teaching workspace

Stanford's [CS329A, *Self-Improving AI Agents*](https://www.youtube.com/playlist?list=PLangBM27OtEA) (Fall 2026, Mirhoseini and Tandon), re-cut into seventeen short lessons for a **practitioner**. That means someone who uses agents daily and wants to tune them, measure them, stay current, and answer one open question with an experiment they run themselves.

Every lesson ends with a dial to turn or a number to collect, and with a project hook, which is a testable question that lesson raises.

## Start here

```sh
open index.html
```

## The arcs

| Arc | Lessons | The question it answers |
|-----|---------|-------------------------|
| I · The map and the dial | 1 to 3 | Where does improvement come from now, and which levers are mine? |
| II · Verification | 4 to 7 | How do I tell a good output from a bad one when there is no test? |
| III · Getting better over time | 8 to 11 | How do agents plan, learn from experience, and when is tuning warranted? |
| IV · Measuring it | 12 to 14 | How do I know any of this worked? |
| V · Answering one question yourself | 15 to 17 | How do I turn a hook into an experiment I can finish? |

Arc V exists because the original course grades a project rather than an exam. It asks for a hypothesis, an experiment with a control, and a written result, and it explicitly rejects both a survey of other people's findings and an app that answers no question. Arc V aims at that shape, scaled from a team of four across a quarter to one person across a month.

## Reference

Come back to these. The lessons you read once.

- [Glossary](reference/glossary.html), the vocabulary defined once, plus the things people routinely confuse.
- [Tuning dials](reference/tuning-dials.html), every lever, its cost, and the symptom that calls for it.
- [Eval playbook](reference/eval-playbook.html), metrics, failure taxonomy, and the weekly loop.
- [Project playbook](reference/project-playbook.html), the scope test, the pre-registration template, and the writeup skeleton.

## Workspace

`MISSION.md` says why, `RESOURCES.md` lists sources ranked by trust, `GLOSSARY.md` holds the terminology in source form, `NOTES.md` records preferences and open threads, and `learning-records/` captures what is established and what changed.

Full lecture transcripts are in [`transcripts/`](transcripts/), one Markdown file per lecture, with the source URL and date in the frontmatter.

## How it is written

Lessons are static HTML with no dependencies, no build step, and no external requests. They are theme-aware and print cleanly. The prose follows a plain style: everyday words, complete sentences, one name for one thing, and no metaphor standing in for a mechanism.
