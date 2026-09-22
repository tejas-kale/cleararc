# Mission: Read Hernandez (2026) as a data scientist

## Why
A data scientist needs to walk a working paper on ICE raids and local economic activity without treating the abstract as the paper. The skill is to name the estimand, say why treatment assignment is not as-if random, reconstruct the two identification strategies, and keep the headline billions attached to the measurement choices that produced them.

The spine is Exequiel Hernandez, *ICE-ing the Economy: Immigration Enforcement Under Trump 2.0 and Local Economic Activity* (Wharton, draft 13 May 2026).

## Success looks like
- Can state, in one sentence, the gap: prior enforcement work is mostly labour supply and safety-net take-up; this paper estimates demand- and supply-side activity at points of interest.
- Can name the three data layers (news-geocoded raids, Advan visits, SafeGraph card spend) and why official ICE arrest files would not identify the same object.
- Can write the shift-share instrument Z = (2010 foreign-born share) × (national weekly raid count), name the first-stage logic, and say what the POI and state-by-week fixed effects absorb.
- Can contrast that design with the within-metro distance bins and CBSA-by-week fixed effects.
- Can recall the main IV magnitudes (about −2.7% visits, −6.2% spend per POI-week) and the qualitative claim that effects are general, persistent, and not offset by online substitution.
- Can list the open questions a reviewer or a follow-up project would actually pursue, including media coverage of raids, SafeGraph coverage, and what the IHS coefficients do and do not mean at national scale.

## Constraints
- Lessons are short, cumulative, interactive HTML, written for someone who already knows panels, 2SLS, and clustering.
- Claims about the paper come from the draft (including the supplement), not from pretrained summaries.
- Do not teach immigration policy as a moral brief. Teach the empirical object.

## Out of scope
- Replicating the 494 million-row panel.
- A full Bartik-identification textbook (Goldsmith-Pinkham–Sorkin–Swift vs Borusyak–Hull–Jaravel). Name the fork; do not settle it.
- Forecasting 2026–27 enforcement or building a product on Advan/SafeGraph.
