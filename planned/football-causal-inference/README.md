# Football Causal Inference

A 17-lesson path from causal questions to advanced longitudinal methods, using football applications throughout. Start with [Lesson 1](lessons/0001-from-question-to-estimand.html), take the lessons in order, and use the [glossary](reference/glossary.html) and [design field guide](reference/design-field-guide.html) for revision.

## How to use the course

1. State each answer before revealing quiz feedback.
2. Rewrite every worked example for a football question you care about.
3. Work the matching [exercise sheet](exercises/index.html) after each lesson. Each sheet is seven or eight questions, about thirty minutes, with the answers held to the end so you can mark yourself.
4. Do not choose an estimator until you can name the estimand and identification assumptions.
5. Ask your teaching agent follow-up questions whenever a step is unclear.

## Lesson, technique and source crosswalk

| Lesson | Practical win | Football paper or scenario | Authorised book chapters/sections |
|---|---|---|---|
| [01 — Define a causal question and estimand](lessons/0001-from-question-to-estimand.html) | Define potential outcomes, ATE and ATT | De Paola & Scoppa (2012), coach dismissal | *What If* Chs 1, 3; *Causal Inference for Data Science* Ch 10 |
| [02 — Analyse a cluster-randomised football trial](lessons/0002-cluster-randomisation-and-itt.html) | Respect clustered assignment and interpret ITT | Al Attar et al. (2017), FIFA 11+ | *What If* Chs 2, 9.4–9.5; *Mastering 'Metrics* Ch 1; *Experimentation for Engineers* Chs 1–2, 7–8 |
| [03 — Use a causal diagram to choose controls](lessons/0003-dags-and-back-door-identification.html) | Choose controls from paths | Constructed coach-dismissal DAG; no standalone paper located | *What If* Chs 6–7; *Causal Inference for Data Science* Chs 2–3, 7 |
| [04 — Write a target trial protocol](lessons/0004-emulate-a-target-trial.html) | Align eligibility, assignment and time zero | Constructed coach-dismissal protocol; no standalone paper located | *What If* 3.6, Ch 22 |
| [05 — Design a matched comparison](lessons/0005-matching-and-propensity-scores.html) | Design for balance and overlap | Goller & Krumer (2020), unusual match days | *What If* 4.5, Ch 15; *Causal Inference for Data Science* Ch 5; *Mastering 'Metrics* Ch 2 |
| [06 — Compare weighting, standardisation and AIPW](lessons/0006-weighting-standardisation-and-aipw.html) | Compare three adjustment routes | Bryson et al. (2024); constructed standalone AIPW extension | *What If* Chs 12–13, 15, 18.4; *Causal Inference for Data Science* 8.3 |
| [07 — Use fixed effects without mistaking recovery for impact](lessons/0007-fixed-effects-and-the-ashenfelter-dip.html) | Separate stable heterogeneity from regression to the mean | De Paola & Scoppa (2012) | *Introductory Econometrics* Chs 13–14; *Econometrics* Ch 17 |
| [08 — Estimate a difference-in-differences effect](lessons/0008-difference-in-differences.html) | Form a DiD contrast and defend parallel trends | Scoppa (2021), closed-door matches | *Mastering 'Metrics* Ch 5; *Econometrics* Ch 18; *Introductory Econometrics* Ch 13 |
| [09 — Interpret an event study with staggered timing](lessons/0009-event-studies-and-staggered-timing.html) | Interpret dynamic effects and timing hazards | Breidenbach & Mitze (2022), hosting and infections | *Econometrics* Chs 17–18; *Introductory Econometrics* Chs 13–14 |
| [10 — Estimate a local effect at a threshold](lessons/0010-regression-discontinuity.html) | Estimate and diagnose a local threshold effect | Reilly & Witt (2021); Speer (2023) | *Mastering 'Metrics* Ch 4; *Econometrics* Ch 21; *Causal Inference for Data Science* 11.2 |
| [11 — Interpret an instrumental-variable estimate](lessons/0011-instrumental-variables-and-late.html) | Defend IV assumptions and interpret compliers | Glennon et al. (2025), foreign-player restrictions | *What If* Ch 16; *Mastering 'Metrics* Ch 3; *Econometrics* Ch 12; *Causal Inference for Data Science* Ch 9 |
| [12 — Build and assess a synthetic control](lessons/0012-synthetic-control.html) | Build a donor-weighted trajectory and placebo test | Breidenbach & Mitze (2022); Kleven, Landais & Saez (2013) | *Causal Inference for Data Science* 11.3; *Econometrics* Ch 18 for comparative time designs |
| [13 — Analyse an interrupted time series](lessons/0013-interrupted-time-series.html) | Separate level and slope changes | Duque-Arias et al. (2024), muscular injuries | *Causal Inference for Data Science* Ch 11; *Econometrics* Ch 14; *Introductory Econometrics* Chs 10–12 |
| [14 — Choose a method for time-varying treatment](lessons/0014-longitudinal-g-methods.html) | Handle treatment-confounder feedback | Constructed training-load scenario; no standalone paper located | *What If* Chs 19–21; Chs 12–14 for component estimators |
| [15 — Use double machine learning for a causal effect](lessons/0015-double-machine-learning.html) | Cross-fit nuisance models and avoid bad controls | Ruiz-Menárguez & Badiella (2026), formations preprint | *What If* 18.3–18.4; *Causal Inference for Data Science* Chs 4, 8; *Econometrics* Ch 23 |
| [16 — Separate direct and indirect effects](lessons/0016-causal-mediation.html) | Distinguish direct, indirect and total effects | Røynesdal et al. (2026), EuroFIT supporters | *What If* Chs 4–8 for counterfactual identification; *Causal Inference for Data Science* Ch 6 |
| [17 — Choose a causal time-to-event estimand](lessons/0017-causal-survival-analysis.html) | Compare risk, RMST and hazards; handle censoring | Rössler et al. (2018), 11+ Kids | *What If* Ch 17 and 21.5 |

## Primary football papers

- [Al Attar et al. (2017)](https://doi.org/10.1016/j.jphys.2017.08.004) — cluster-randomised FIFA 11+ trial.
- [Goller & Krumer (2020)](https://doi.org/10.1016/j.ejor.2020.03.062) — propensity-score radius matching for unusual match days.
- [Bryson et al. (2024)](https://doi.org/10.1111/sjpe.12369) — entropy balancing and weighted regression for head-coach turnover.
- [De Paola & Scoppa (2012)](https://doi.org/10.1177/1527002511402155) — fixed effects and matching for coach dismissals.
- [Glennon et al. (2025)](https://doi.org/10.1287/mnsc.2021.03356) — IV/2SLS using foreign-player restrictions.
- [Reilly & Witt (2021)](https://eprints.lse.ac.uk/113344/1/1527002521989393.pdf) and [Speer (2023)](https://doi.org/10.1016/j.serev.2022.100003) — regression discontinuity.
- [Scoppa (2021)](https://doi.org/10.1016/j.joep.2020.102344) — DiD around closed-door matches.
- [Breidenbach & Mitze (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8411384/) — event studies and synthetic controls.
- [Kleven, Landais & Saez (2013)](https://eml.berkeley.edu/~saez/kleven-landais-saezMay12football.pdf) — synthetic countries plus DiD for tax reforms.
- [Duque-Arias et al. (2024)](https://doi.org/10.17533/udea.iatreia.238) — interrupted injury time series.
- [Ruiz-Menárguez & Badiella (2026)](https://arxiv.org/abs/2602.16830) — DML formation-effects preprint.
- [Røynesdal et al. (2026)](https://doi.org/10.1080/08870446.2026.2677081) — mediation in a football-club supporter trial.
- [Rössler et al. (2018)](https://doi.org/10.1007/s40279-017-0834-8) — causal time-to-injury analysis in a cluster trial.

## Evidence boundaries

The course found no strong standalone football paper for explicit DAG/back-door identification, longitudinal g-methods, target-trial emulation or standalone AIPW. Lessons 3, 4, 6 and 14 label their constructed scenarios accordingly. This is a limitation of the targeted source search, not proof that no such paper exists.
