# Foreign Exchange & Central Banks — a teaching workspace

A short, self-contained course that takes an informed layperson from *"what does ¥163 to the dollar mean?"* to reading *The Economist*'s ["When Japan buys yen, it unwinds a dangerous trade"](https://www.economist.com/finance-and-economics/2026/08/13/when-japan-buys-yen-it-unwinds-a-dangerous-trade) (13 August 2026) without a single opaque sentence.

Four lessons, about thirty minutes end to end. Built with the [`teach`](https://github.com/) skill workflow: the article is the spine, and every concept earns its place by unlocking a specific sentence in it.

## Start here

Open **[`index.html`](index.html)** in a browser.

```sh
open index.html
```

## The arc

| # | Lesson | Unlocks |
|---|--------|---------|
| 1 | [The exchange rate is a price](lessons/0001-the-exchange-rate-is-a-price.html) | What ¥163 means, which direction is "weak", who sets the price |
| 2 | [Reserves, and what it means to intervene](lessons/0002-reserves-and-intervention.html) | The asymmetry, who really spends the money, the ¥5.7trn profit |
| 3 | [Bonds, and the state as one balance sheet](lessons/0003-bonds-and-the-consolidated-state.html) | Why QE shortened Japan's debt instead of shrinking it |
| 4 | [The carry trade, and why buying yen unwinds it](lessons/0004-the-carry-trade-decoded.html) | Carry, sterilisation, and the article's actual argument |

## Reference

- [Glossary](reference/glossary.html) — canonical vocabulary, with aliases to avoid
- [One-page cheat sheet](reference/cheatsheet.html) — six rules that always hold; prints to one page
- [The article, decoded](reference/article-decoded.html) — the original, sentence by sentence

## Workspace state

`MISSION.md` (why this topic), `RESOURCES.md` (trusted sources and known gaps), `GLOSSARY.md`, `NOTES.md` (preferences), `learning-records/` (what has actually been learned, which drives what comes next), `assets/` (shared stylesheet and quiz components).

Lessons are static HTML with no dependencies, no build step and no external requests. They are theme-aware and print cleanly.

## Sourcing

Claims are cited to primary institutional sources wherever possible — the [Bank of Japan's own description of its intervention operations](https://www.boj.or.jp/en/intl_finance/outline/expkainyu.htm), the [New York Fed](https://www.newyorkfed.org/aboutthefed/fedpoint/fed44.html), the [BIS](https://www.bis.org/statistics/rpfx22.htm), and [Chien, Cole & Lustig's *What About Japan?*](https://www.nber.org/papers/w31850), the paper the article is built on. Full annotated list in `RESOURCES.md`.

Short quotations from the article are reproduced for study and criticism; the piece itself is *The Economist*'s and is linked at the source.
