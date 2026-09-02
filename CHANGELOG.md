# Changelog

## 1.2.0 — 2026-09-02

Optional WSJF cost-of-delay scoring layer.

- **New `wsjf [<path-or-url>]` mode.** Bare invocation bootstraps a scoring
  worksheet from the synthesized themes (proposed scores, one confirmation
  round — only a confirmed sheet ever renders); a target points at existing
  scoring (committed file, CSV, or connected sheet). The source is recorded in
  the DIRECTION CONTRACT and inherited by every later run.
- **Scores rank, they never place.** A `wsjf N.N` chip on scored cards,
  within-horizon ordering by score, and a cost-of-delay strip near the top of
  the page (anatomy grew from 14 to 15 parts). An item's horizon still comes
  from what the sources state.
- **Fixed-date items outrank their score** — cliff-shaped delay curves are
  what a flat score hides.
- **Refresh gains scoring drift classes**: stale scores, orphan rows, unscored
  new themes; re-scoring is a human decision the drift report requests.
- New reference: `references/wsjf.md` (worksheet format, validation, rendering).

## 1.1.0 — 2026-09-02

Feedback round from real readers of a shipped roadmap.

- **Source authority tiers.** Phase 1's source inventory classifies every source
  *record* vs *anecdote*, inferred then confirmed with the driver; the blessed
  ranking persists in the page's DIRECTION CONTRACT so update runs inherit it.
- **Conflicts surfaced, not blended.** New synthesis rule (record decides,
  anecdote fills gaps and is marked) and a new optional page section, "Where the
  sources disagree" (page anatomy grew from 13 to 14 parts). Anecdote-only
  claims carry a mono chip on their detail card.
- **Unreadable authoritative sources are a named footer gap**, never a silent
  omission.
- **Progressive density.** Detail sections ship collapsed by default on heavy
  pages (20+ themes or multi-project boards), with an interaction-layer note on
  making the loader honor a stored "expanded" over the markup default.

## 1.0.0 — 2026-09-01

Initial build, generalized from a shipped Horizons roadmap page.

- Four modes: create, update (artifact-url), refresh (drift report then fix),
  gantt (dated variant, explicit request only), plus help.
- Four phases: discover sources, synthesize (themes, horizons, streams,
  throughlines, critical path, out-of-scope, standing risks), build the page,
  publish and record.
- References: page anatomy (13 parts), interaction layer (filter, collapse,
  derived tooltips), writing floor.
- Decided rules: undated Now/Next/Later by default; dates sourced never
  invented; risks framed as discipline plus a gap; counts re-derived from the
  finished document; refinement preserves, redesign replaces.
