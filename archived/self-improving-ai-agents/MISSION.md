# Mission: Self-improving AI agents

## Why
Tejas is a data scientist who runs AI agents every day as tools. Over the last two years the field stopped improving agents mainly by making the base model bigger, and moved to spending compute at inference, verifying the output, and letting the system learn from its own results. Stanford's CS329A, Self-Improving AI Agents (Fall 2026, Azalia Mirhoseini and Ankur Tandon), is the most complete public map of that shift, and this workspace turns its nine lectures into a course for someone who uses agents rather than studies them.

The goal is to tune the agents he already runs, measure whether they got better, and answer one open question with an experiment he runs himself. That last part is new. He does not want to write papers or do a PhD, but he does want the thing a CS329A student gets from the course project: a question, an experiment with a control, and a real result on his own workflows.

## Success looks like
- Can explain the difference between train-time scaling, test-time scaling, and self-improvement in one sentence each, and say which of the three a product claim is really about.
- Can name the generation-verification gap and explain why it, and not model quality, is usually what limits an agentic workflow.
- Can look at a failing agent run and place the failure on a short list: bad plan, missing tool feedback, weak verifier, degraded context, or a capability the model does not have.
- Can design a verifier for a task at work, whether a rubric, a unit test, or a judge, and state how it will fail before trusting it.
- Can build a small eval set for one real workflow, with a metric that would change a decision, and read pass@k and pass^k correctly.
- Can decide when a problem needs more inference compute, better context, or a fine-tune, and explain why the third is almost never the first answer.
- **Can scope a question small enough to answer in two to four weeks part-time, run it with a control condition, and write up what happened, including when the result is negative.**
- Can read an agents paper from arXiv, place it on the course's map, and say what it would take to test its claim on his own data.

## Constraints
- **Strong ML and data science baseline.** Comfortable with transformers, training loops, sampling, evaluation metrics, and statistics. Do not re-teach gradient descent or what a token is.
- **A project, not a research career.** The target is the scale of a CS329A course project: one hypothesis, one experiment, two to four weeks part-time, run alone. Baselines and ablations only where they change what he would conclude.
- **Lessons stay short.** Eight to twelve minutes each, one idea per lesson, finishable in a sitting.
- **Every lesson ends with something he can apply** to an agent he already runs, and with a question that lesson raises which could be tested.
- **Plain prose.** Everyday words, complete sentences, one name for one thing. No metaphors standing in for mechanisms.

## Out of scope
- Writing a paper, or aiming at a conference or workshop submission.
- Training or post-training a model from scratch, and anything at the GPU infrastructure level.
- The course's homework track and its group-of-four team structure.
- Prompt-engineering folklore that no course material or primary source supports.
- Vendor tutorials, except as concrete examples of a general mechanism.

## Primary source
Stanford CS329A, Self-Improving AI Agents (Fall 2026). [Course site](https://cs329a.stanford.edu/) and [lecture playlist](https://www.youtube.com/playlist?list=PLangBM27OtEA). Transcripts of all nine lectures are in `transcripts/`. See `RESOURCES.md`.
