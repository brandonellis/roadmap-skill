# WSJF scoring — worksheet format, validation, rendering

The optional cost-of-delay layer. WSJF (weighted shortest job first):

This is priority ranking, not the letter-grade assessment. `/horizons score`
aliases `grade`; it never changes WSJF or its confirmed worksheet. WSJF is an
overlay on roadmap/timeline views, not a competing Scorecard tab.

```
WSJF = (business value + time criticality + risk reduction / opportunity enablement) / job size
```

Components are scored on the Fibonacci scale `1, 2, 3, 5, 8, 13, 20` and are
RELATIVE, not absolute: the smallest item in each column anchors the scale.
A component column with no `1` anywhere is unanchored — flag it in the
confirmation round rather than silently accepting scores that have drifted
upward together.

## Canonical worksheet

Default home: `docs/roadmap-wsjf.md` in the project repo — versioned, diffable,
record-tier by construction (git history shows who scored what and when).
Pointer mode accepts any markdown table, CSV, or connected sheet with the same
columns.

```markdown
# Roadmap WSJF scoring — <project>
status: confirmed 2026-09-02        <!-- or "proposed" — a proposed sheet never renders -->
scale: fibonacci

| id | theme | bv | tc | rroe | size | fixed-date | notes |
|---|---|---|---|---|---|---|---|
| pricing-v2 | Pricing engine v2 | 8 | 13 | 3 | 5 | | window closes with Q4 renewals |
| soc2-gap | SOC-2 gap closure | 5 | 8 | 13 | 8 | 2026-11-01 audit | cliff, not slope |
```

- `id` is the theme's card anchor id on the roadmap page — the join key.
  `theme` (the title) is the human check on the join, never the key.
- `bv` / `tc` / `rroe` / `size` from the Fibonacci set; `size` ≥ 1.
- A row is all-blank (unscored — legitimate) or all-filled. **Partial rows are
  refused by name**, not defaulted: a missing component silently read as 0 or 1
  changes the ranking.
- `fixed-date`: blank, or a date plus one word of what it is (`2026-11-01
  audit`). A fixed-date row has a cliff-shaped delay curve that the flat score
  hides — it outranks scores in the strip and carries the cliff marker.

## Bootstrap (bare `wsjf`, no source on record)

Generate the table from the synthesized themes with PROPOSED component scores
derived from the sources, `status: proposed`. Present it for ONE confirmation
round (the same infer-then-confirm shape as source authority tiers): the driver
blesses or corrects, the sheet is written `status: confirmed <ISO date>`, and
the location is recorded in the DIRECTION CONTRACT. If the driver wants to
score offline, leave it `proposed` — a proposed sheet renders NOTHING on the
page. A proposal presented as a ranking is an invented number.

## Validation on read (pointer mode and inherited runs)

1. Required columns present; component values in the Fibonacci set; no partial
   rows (name the offender).
2. Join check: every row `id` matches a theme. Rows matching no theme are
   **orphans** (drift, reported); themes with no row are **unscored** (fine,
   rendered as such).
3. Anchoring check per component column (see above).
4. `status: confirmed <date>` present — else treat as proposed, render nothing,
   say so.

## Rendering

- **Card chip**: `wsjf 4.8` (one decimal), same small mono register as ticket
  refs. Only on scored cards.
- **Within-horizon order**: scored cards sort by WSJF descending; unscored
  cards keep their prior order below them. Unscored is information — never
  invent a score, never bury the fact that most of the board is unscored.
- **The cost-of-delay strip** (see page anatomy): top 3–5 scored themes across
  all horizons, fixed-date rows first with the cliff marker, each linking to
  its card; footer line `N of M themes scored · confirmed <date>`.
- **Scores rank, they never place.** An item's horizon comes from what the
  sources state; a score moving an item between horizons would be an invented
  commitment. If the scores scream that a Later item belongs in Now, that is a
  finding for the drift report and a human decision, not an automatic move.
- **Gantt reuse**: if a scoring source is on record, gantt rows show the same
  chip. There is never a second scoring source.

## Refresh drift classes (when scoring is active)

- **Stale score**: a scored theme whose evidence changed since the confirmed
  date (a cited ref closed, reopened, or was added). Flagged, never re-scored
  silently — re-scoring is a human decision the drift report requests, same
  rule as the gantt's slipped bars.
- **Orphan row** and **unscored new theme**, from the join check.
- The strip's `confirmed <date>` ages in plain sight; a refresh that changes
  theme states without re-confirmation must keep the old date, not refresh it.
