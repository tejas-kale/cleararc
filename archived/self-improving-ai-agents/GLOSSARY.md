# Self-improving AI agents glossary

The canonical language for this workspace. Where the field uses several words for one idea, one is chosen here and the rest are listed as aliases to avoid. The rendered version, with fuller definitions, is [reference/glossary.html](reference/glossary.html); this file is the source of truth for terminology.

## Where compute goes

**Pre-training scaling**:
Improving a model by adding parameters, data, and compute before any task exists.
_Avoid_: scaling laws on its own

**Train-time scaling**:
Post-training compute, mostly reinforcement learning against checkable rewards.
_Avoid_: fine-tuning, which is narrower

**Test-time scaling**:
Compute spent during the request, through longer thinking, sampling, search, and verification.
_Avoid_: inference optimisation, which usually means the opposite

**Self-improvement**:
The loop in which test-time compute manufactures verified successes that become supervision.

**Parallel sampling**:
Drawing k independent candidates from one prompt.
_Avoid_: batching

**Sequential revision**:
One draft improved over several turns, with feedback between them.

## Measuring

**Coverage, or pass@k**:
The fraction of problems solved by at least one of k samples. An upper bound rather than a result.
_Avoid_: accuracy at k

**pass@1**:
The fraction solved on a single attempt. What you ship without a selector.

**pass^k**:
The fraction solved on all k independent attempts. The reliability number.
_Avoid_: confusing it with pass@k, which means the opposite

**Generation-verification gap**:
The distance between coverage and what your selector delivers.
_Avoid_: generator-verifier gap

**n@k**:
The fraction solved when you generate k candidates and may submit only n.

## Verification

**Verifier**:
Anything that scores an output's correctness, from a compiler to a prompted judge.

**Outcome reward model (ORM)**:
A verifier that scores the final answer only.

**Process reward model (PRM)**:
A verifier that scores each intermediate step.

**Rollout labelling**:
Scoring a step by how often completions from that point reach a correct final answer.
_Avoid_: Monte Carlo supervision

**Weak verifier**:
A verifier correlated with correctness and reliably imperfect. The realistic case.

**Verifier ensemble**:
Several weak verifiers, filtered for quality and combined with learned weights. Requires independent errors.

**Meta-verification**:
A second pass checking whether a verifier's criticism is specific and true.

**LLM-as-judge**:
Using a model to score outputs. Biased by position, verbosity, self-preference, style, and poor calibration.
_Avoid_: AI evaluator

**Public and private check split**:
Showing an agent some checks to iterate against while scoring on held-out ones.

## Architecture

**Fusion**:
Handing a model several candidates and asking it to write one answer informed by all of them.
_Avoid_: aggregation, which suggests voting

**Critic**:
An operation producing a written critique that a later ranker or fuser reads.

**Ranker**:
A prompted ordering of candidates by quality.

**ReAct loop**:
Interleaved thought, action, and observation, with each thought appended to context.

**Error cascading**:
One wrong observation contaminating every step after it.

**Constitution**:
An explicit written set of principles a good output must satisfy.

**Standing context**:
The written domain knowledge an agent needs and cannot derive. Its absence makes an agent perform like a contractor.

## Running a project

**Control condition**:
The same system as the treatment, differing in exactly one thing.

**Noise floor**:
The difference observed when one condition is run against itself, unchanged.
_Avoid_: margin of error

**Paired comparison**:
Running both conditions on the same tasks and comparing per task rather than by average.

**Pre-registration**:
A written question, prediction, falsifier, and stopping rule, recorded before data is collected.

**Null result**:
A measured absence of an effect. A real finding when the experiment could have detected one.

## Ambiguities resolved here

- **Verifier against evaluator.** A verifier runs inside the loop to select outputs. An evaluator runs outside it to measure the system. Never the same component.
- **Coverage is never called accuracy** in this workspace, however often papers do it.
- **"Fine-tune"** always means supervised fine-tuning on your own data, not post-training in general. Say train-time scaling for the latter.
