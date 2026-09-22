# ICE-ing the Economy — Resources

Curated, high-trust sources. Lessons cite from here rather than from memory.

## Knowledge

### The paper (the spine)

- Exequiel Hernandez, *ICE-ing the Economy: Immigration Enforcement Under Trump 2.0 and Local Economic Activity*, Wharton School draft, 13 May 2026 (SSRN 6759278).
  Main text plus supplementary materials on event construction, Advan/SafeGraph matching, the shift-share, spatial intensity, and robustness tables S11–S16. **Use for:** every magnitude, every specification, every caveat taught in this course.

### Identification and shift-share

- [Goldsmith-Pinkham, Sorkin & Swift — *Bartik instruments: What, when, why, and how*](https://doi.org/10.1257/aer.20181047) (*AER* 2020).
  Share-based view of Bartik designs. Hernandez cites this for the 2010 foreign-born share as the cross-sectional exposure. **Use for:** “why a 2010 share, not a 2024 share?”
- [Borusyak, Hull & Jaravel — *Quasi-experimental shift-share research designs*](https://doi.org/10.1093/restud/rdab011) (*REStud* 2022).
  Shock-based view: identification can come from as-if-random *shifts* even if shares are endogenous. **Use for:** the national weekly raid count \(R_t\) as the policy shock.
- [Card — *Immigrant inflows, native outflows, and the local labor market impacts of higher immigration*](https://doi.org/10.1086/209979) (*JLE* 2001).
  Canonical immigration shift-share. **Use for:** why this literature reaches for historical settlement shares at all.
- [Roth — *Pretest with Caution*](https://doi.org/10.1086/720034) (*JEL* 2022); [Borusyak, Jaravel & Spiess (2024)](https://doi.org/10.1093/restud/rdae007) on difference-in-differences.
  Hernandez’s pre-trend diagnostics follow these conventions (joint Wald vs linear-slope tests; power with huge \(N\)).

### Prior enforcement and immigration economics

- [East, Cox & Patler — *ICE arrests across Trump's first and second terms*](https://doi.org/10.3386/w34794) (NBER 34794, 2026).
  Documents the shift from focused (criminal-record) to general interior enforcement. **Use for:** the qualitative change the paper is measuring against.
- [East, Hines, Luck, Mansour & Velasquez — *The labor market effects of immigration enforcement*](https://doi.org/10.1086/721152) (*JLE* 2023).
  Labour-supply lens the paper is departing from.
- [Alsan & Yang — *Fear and the safety net*](https://doi.org/10.1162/rest_a_01262) (*REStat* 2024); [Watson (2014)](https://doi.org/10.1257/pol.6.3.313) on Medicaid chilling; [Dee & Murphy (2020)](https://doi.org/10.3102/0002831219860816) on school enrollment.
  Classic chilling-effect papers on *targeted* populations.
- [Peri — *Immigrants, productivity, and labor markets*](https://doi.org/10.1257/jep.30.4.3) (*JEP* 2016); [Cortes (2008)](https://doi.org/10.1086/589756) on prices.
  Theory the paper invokes: supply- and demand-side effects of immigration are not separable.

### Mobility and spend data

- Advan Weekly Patterns (via Dewey) and SafeGraph Spend — vendor products; Hernandez describes the fields (`VISITOR_HOME_CBGS`, `SPEND_BY_DAY`, `ONLINE_SPEND`, delivery-platform shares).
- [Goolsbee & Syverson (2021)](https://doi.org/10.1016/j.jpubeco.2020.104311); [Chang et al. *Nature* (2021)](https://doi.org/10.1038/s41586-020-2923-3); [Weill et al. *PNAS* (2020)](https://doi.org/10.1073/pnas.2009412117).
  Prior uses of similar foot-traffic panels. **Use for:** why POI-week visits are a serious outcome, not a gimmick.

### Event construction

- [Common Crawl News (CC-NEWS)](https://commoncrawl.org/) WARC daily crawls; LexisNexis Academic.
- [Deportation Data Project](https://deportationdata.org/) — FOIA arrest files Hernandez argues are too coarse to geocode to POIs and measure *presence* rather than *yield*.

## Wisdom

- Goldsmith-Pinkham–Sorkin–Swift vs Borusyak–Hull–Jaravel threads (often via Twitter/X and replication notebooks). **Use for:** noticing which Bartik story you are telling before you instrument.
- Dewey Data changelogs for SafeGraph Spend (Hernandez’s 1.5× non-branded adjustment after 20 Oct 2025). **Use for:** vendor breaks as first-class threats.

## Gaps

- No public replication of the 5,388-event raid file or the Advan/SafeGraph panel is cited in the draft.
- Official ICE sub-city operations data still do not exist in a form that could replace the news corpus.
- The paper does not estimate entrepreneurship, investment, or exit as longer-run outcomes; that is stated as future work, not a result.
