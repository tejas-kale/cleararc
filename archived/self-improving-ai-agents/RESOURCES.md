# Resources

Ordered by trust. Anything used to make a claim in a lesson should appear here.

---

## Tier 1 — The spine

### Stanford CS329A, *Self-Improving AI Agents* (Fall 2026)
- **What:** Graduate course by **Azalia Mirhoseini** (Stanford CS, ex-Google Brain / DeepMind / Anthropic) and **Ankur Tandon** (adjunct, Reflection AI). Second time taught; 2026 edition updated throughout.
- **Where:** [course site](https://cs329a.stanford.edu/) · [lecture playlist](https://www.youtube.com/playlist?list=PLangBM27OtEA)
- **Why trusted:** taught by people who built the systems, with a reading list of primary papers rather than blog posts. It is also *current* — the through-line (pre-training scaling flattening, returns moving to inference-time compute and verification) is the actual state of the field, not a retrospective.
- **Local transcripts:** `transcripts/Stanford CS329A Part 0*.md` in this workspace (all nine lectures, clipped 2026-08-21).

| # | Lecture | Feeds lessons |
|---|---------|---------------|
| 1 | Course Overview | 01, and the project standard in 15 |
| 2 | Test-Time Compute Scaling | 02, 03, 06 |
| 3 | Robust Verification | 04, 05 |
| 4 | Learning from Feedback with Tools/Code | 07 |
| 5 | Planning and Multi-Step Reasoning | 08, 09 |
| 6 | Train-Time Scaling / Scaling RL | 09 |
| 7 | Self-Improvement and Deep Research Agents | 10, 11 |
| 8 | Agentic Evaluations and Long-Horizon Tasks | 12, 13 |
| 9 | Future Research Areas | 14, and the project shortlist in 15 |

Lessons 16 and 17 draw on experimental method rather than on a lecture. See Tier 4 below.

---

## Tier 2 — Primary papers

Grouped by the lesson that leans on them.

**Scaling, and why it changed**
- Kaplan et al., *Scaling Laws for Neural Language Models* — [arXiv:2001.08361](https://arxiv.org/abs/2001.08361)
- Wei et al., *Emergent Abilities of Large Language Models* — [arXiv:2206.07682](https://arxiv.org/abs/2206.07682)
- Wei et al., *Chain-of-Thought Prompting* — [arXiv:2201.11903](https://arxiv.org/abs/2201.11903)

**Test-time compute**
- Brown et al., *Large Language Monkeys: Scaling Inference Compute with Repeated Sampling* — [arXiv:2407.21787](https://arxiv.org/abs/2407.21787). The coverage-vs-pass@1 result the course builds on.
- Snell et al., *Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Parameters* — [arXiv:2408.03314](https://arxiv.org/abs/2408.03314)
- Wang et al., *Self-Consistency Improves Chain of Thought Reasoning* — [arXiv:2203.11171](https://arxiv.org/abs/2203.11171)
- Yao et al., *Tree of Thoughts* — [arXiv:2305.10601](https://arxiv.org/abs/2305.10601)

**Verification**
- Cobbe et al., *Training Verifiers to Solve Math Word Problems* (GSM8K; the original verifier recipe) — [arXiv:2110.14168](https://arxiv.org/abs/2110.14168)
- Lightman et al., *Let's Verify Step by Step* (process vs outcome reward models) — [arXiv:2305.20050](https://arxiv.org/abs/2305.20050)
- Wang et al., *Math-Shepherd* — rollout-based step labelling, no human annotators — [arXiv:2312.08935](https://arxiv.org/abs/2312.08935)
- Ratner et al., *Snorkel* — the weak-supervision label model Weaver borrows — [arXiv:1711.10160](https://arxiv.org/abs/1711.10160)
- Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena* — [arXiv:2306.05685](https://arxiv.org/abs/2306.05685). Read the bias sections, not the leaderboard.
- Mirhoseini lab, *Weaver* — combining many weak verifiers to shrink the generation–verification gap — [arXiv search](https://arxiv.org/a/mirhoseini_a_1)
- *CodeMonkeys* — generating tests alongside code as a verification signal — [arXiv search](http://arxiv.org/a/search?searchtype=all&query=CodeMonkeys)
- Bai et al., *Constitutional AI* — [arXiv:2212.08073](https://arxiv.org/abs/2212.08073). Rubric-as-verifier, done at scale.

**Tools, feedback, planning**
- Yao et al., *ReAct: Synergizing Reasoning and Acting* — [arXiv:2210.03629](https://arxiv.org/abs/2210.03629)
- Schick et al., *Toolformer* — [arXiv:2302.04761](https://arxiv.org/abs/2302.04761)
- Shinn et al., *Reflexion: Language Agents with Verbal Reinforcement Learning* — [arXiv:2303.11366](https://arxiv.org/abs/2303.11366)
- Gehring et al., *RLEF: Grounding Code LLMs in Execution Feedback* — [arXiv:2410.02089](https://arxiv.org/abs/2410.02089). Source of the public/private check split.
- Zhou et al., *Language Agent Tree Search (LATS)* — [arXiv:2310.04406](https://arxiv.org/abs/2310.04406)
- Wang et al., *Mixture-of-Agents*, layered fusion across model families. [arXiv:2406.04692](https://arxiv.org/abs/2406.04692)
- Madaan et al., *Self-Refine: Iterative Refinement with Self-Feedback* — [arXiv:2303.17651](https://arxiv.org/abs/2303.17651). Read the negative results too.

**Self-improvement and training**
- Zelikman et al., *STaR: Bootstrapping Reasoning with Reasoning* — [arXiv:2203.14465](https://arxiv.org/abs/2203.14465)
- DeepSeek-AI, *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL* — [arXiv:2501.12948](https://arxiv.org/abs/2501.12948). The most legible public account of large-scale reasoning RL.
- Shao et al., *DeepSeekMath* — GRPO, and the majority@k-vs-pass@k finding — [arXiv:2402.03300](https://arxiv.org/abs/2402.03300)
- Yu et al., *DAPO* — why scaled RL runs collapse, and the fixes — [arXiv:2503.14476](https://arxiv.org/abs/2503.14476)
- Goldie et al., *SWiRL* — multi-step RL, synthetic data, cross-tool generalisation — [arXiv:2504.04736](https://arxiv.org/abs/2504.04736)
- Wang et al., *Voyager: An Open-Ended Embodied Agent with LLMs* — [arXiv:2305.16291](https://arxiv.org/abs/2305.16291). Skill-library memory.

**Search, selection and research agents**
- Li et al., *Competition-Level Code Generation with AlphaCode* — [arXiv:2203.07814](https://arxiv.org/abs/2203.07814). Filtering and behavioural clustering under a submission budget.
- Li et al., *Search-o1: Agentic Search-Enhanced Large Reasoning Models* — [arXiv:2501.05366](https://arxiv.org/abs/2501.05366). The reason-in-documents module.
- Jin et al., *Search-R1* — the same search behaviour learned via RL — [arXiv:2503.09516](https://arxiv.org/abs/2503.09516)

**Evaluation and long-horizon**
- Jimenez et al., *SWE-bench* — [arXiv:2310.06770](https://arxiv.org/abs/2310.06770)
- Yao et al., *τ-bench: Tool-Agent-User Interaction in Real-World Domains* — [arXiv:2406.12045](https://arxiv.org/abs/2406.12045). Source of the pass^k reliability metric.
- Mialon et al., *GAIA: A Benchmark for General AI Assistants* — [arXiv:2311.12983](https://arxiv.org/abs/2311.12983)
- Kwa et al., *Measuring AI Ability to Complete Long Tasks* (METR) — [arXiv:2503.14499](https://arxiv.org/abs/2503.14499). The 50% vs 80% horizon gap; the single most decision-relevant chart in agent evaluation.
- OpenAI, *GDPval* — win rate against industry professionals on real work — [openai.com/index/gdpval](https://openai.com/index/gdpval/)
- Stanford, *DeepScholarBench* — live benchmark for research synthesis; three-axis decomposition — [arXiv:2508.20033](https://arxiv.org/abs/2508.20033)

**The frontier (Lecture 9)**
- Subramaniam et al., *Multiagent Finetuning: Self Improvement with Diverse Reasoning Chains* — [arXiv:2501.05707](https://arxiv.org/abs/2501.05707)
- DeepSeek-AI, *DeepSeekMath-V2* — meta-verification — [arXiv:2511.20835](https://arxiv.org/abs/2511.20835)
- Zhao et al., *Absolute Zero: Reinforced Self-play Reasoning with Zero Data* — self-proposed curricula — [arXiv:2505.03335](https://arxiv.org/abs/2505.03335)

---

## Tier 3 — Practitioner references

- Anthropic, [*Building Effective Agents*](https://www.anthropic.com/engineering/building-effective-agents) — the workflow taxonomy (chaining, routing, parallelisation, orchestrator–worker, evaluator–optimiser) that Lecture 1 uses directly.
- Anthropic engineering blog, [context engineering and agent tooling posts](https://www.anthropic.com/engineering). The closest thing to a practitioner manual for the context-management material in Lesson 13.
- OpenAI, [*A Practical Guide to Building Agents*](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)
- [BIG-bench / HELM](https://crfm.stanford.edu/helm/) for how serious eval harnesses are structured.

---

## Tier 4 — Running your own experiment

For Arc V. These are read for their method rather than their findings.

- Brown et al., *Large Language Monkeys* — [arXiv:2407.21787](https://arxiv.org/abs/2407.21787). Reread for design rather than result. It separates coverage from selection carefully, which is the paired-comparison discipline in practice.
- Snell et al., *Scaling LLM Test-Time Compute* — [arXiv:2408.03314](https://arxiv.org/abs/2408.03314). A model of matched-budget comparison, where the difficulty binning is what makes the claims survive scrutiny.
- Kwa et al., *Measuring AI Ability to Complete Long Tasks* (METR) — [arXiv:2503.14499](https://arxiv.org/abs/2503.14499). Read the limitations section as a model of how to state the scope of a finding.
- [The CS329A course site](https://cs329a.stanford.edu/) publishes previous years' student projects, which are the closest available worked examples at this scale.

---

## Communities

Wisdom, not knowledge — for testing ideas against people who ship agents.

- **[r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/)** — noisy but the fastest signal on what actually works at inference time; strong empirical culture around sampling, quantisation and eval.
- **[Latent Space](https://www.latent.space/)** (podcast + Discord) — practitioner-oriented, engineering-first, good for agent architecture debates.
- **[EleutherAI Discord](https://discord.gg/eleutherai)** — research-adjacent but welcoming; the `#interpretability` and eval channels are unusually high signal.
- **AI Engineer conference talks** ([YouTube](https://www.youtube.com/@aiDotEngineer)) — the closest thing to a practitioner conference for this exact job.
- Local: any **AI evals meetup** or a workplace reading group. The eval material in Lessons 12 to 14 gets much better when argued about with people who have their own data, and an Arc V writeup is a good thing to bring.
