# Working notes

## Preferences and context

- **Practitioner first, but now with a project.** Every lecture idea must become a dial he can turn on an agent he already runs, or be dropped. As of 2026-08-23 the course also aims at one experiment at CS329A course-project scale. See [[0005-mission-widened-to-include-a-project]].
- **Strong technical baseline.** He is a data scientist and a heavy agent user. Assume transformers, sampling, metrics, and statistics. Do not explain what a token is. Do explain anything that only exists in the last eighteen months of literature.
- **Three standing asks**, in his words: stay updated with knowledge a practitioner can use, get ideas for tuning agents better, and learn to evaluate whether they work. A fourth was added on 2026-08-23: find research ideas that come out of the course and are small enough to finish.
- **Write plainly.** He asked for the whole workspace to be rewritten in plain style on 2026-08-23. Everyday words, complete sentences, one name for one thing, the point in the first sentence of a paragraph. No metaphors used in place of a mechanism.
- **He asked for all lessons up front** rather than one per session, so the arc has to read end to end without a session in between.

## Teaching notes

- The course's spine is one argument: pre-training scaling flattened, so the returns moved to inference-time compute, verification, and learning from experience. A lesson that cannot hang off that spine probably belongs in reference instead.
- The most useful idea for this reader is the **generation-verification gap**, because it turns "the model is not good enough" into "my verifier is not good enough", which is the version he can act on. Lessons 3 to 5 all orbit it.
- Next most useful is **pass@k against pass^k**. Sampling metrics flatter agents and reliability metrics do not.
- Do not teach RL internals such as GRPO or PPO detail. Lesson 9 keeps only the buy-or-tune decision.
- Quiz options must stay length-matched. See the contract at the top of `assets/quiz.js`.
- **Project hooks.** Every lesson ends with one testable question and the measurement that would answer it. Keep them small enough to run in an evening, because Arc V builds a project by combining two or three of them rather than by inventing something new.

## Open threads and candidate next sessions

- Run Arc V for real: sit down together, pick one hook, and build the harness against his own data.
- Cost modelling: dollars per solved task as the headline metric, sweeping the test-time compute dial.
- Multi-agent orchestration. The course is sceptical of it, so this is worth a lesson only if his workflows move that way.
- A reading group: pick three papers from `RESOURCES.md` and work through them together.

## Transcript provenance

- All nine transcripts live in `transcripts/`, not in the Clippings library.
- **Part 04 was re-clipped.** The first pass returned a condensed, model-written summary of 1,242 words, against roughly 10,000 for the others. The retry produced a full transcript. Lesson 7 was written from the summary and then corrected. See [[0004-part-04-correction]]. If a lesson ever feels thinly sourced, check the transcript's word count first.
