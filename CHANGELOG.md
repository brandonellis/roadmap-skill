# Changelog

## 1.6.0 — 2026-09-06

The exception register: a gap the team has priced and chosen stops being
graded as a failure.

- **New grading rule in grade mode.** Some gaps are resourcing decisions, not
  defects — an unbought plan tier, managed service, second host or staging
  environment. Grading those as failures every run teaches a team to stop
  reading the card. A register entry suppresses its cell's penalty, under
  four conditions the card re-tests on every run.
- **The four conditions**, all required: a named change with a **dated
  price**; a **measurable trigger** the card can evaluate; a **compensating
  control the card VERIFIED LIVE this run** (never asserted from a README or
  inferred from a merge); and **not lapsed** — the exception ends the run
  after its trigger fires, and the cell then grades as found until the
  purchase lands. Fail any one and it is an ordinary finding again, with the
  failing condition written into the card.
- **Two refusals.** An exception never suppresses a **live exposure**: an
  active disclosure is a finding whatever the budget. And a compensating
  control of "we are careful" is prose, not a control.
- **Rendered by form, never by hue** (dashed border, mono label, no grade
  colour), extending the existing rule that hue encodes the grade tier and
  nothing else — a ladder verdict and a register entry are both not-a-grade
  and must never be readable as one.
- Page anatomy grows by one section (the register, after the scale ladder);
  SKILL.md's non-negotiable list goes from five rules to six.

## 1.5.0 — 2026-09-05

The scale ladder: headroom becomes a graded lens.

- **New standing cross-cutting lens in grade mode.** Every card now grades
  what the project can become without changing, not only what it is: the
  estate and application as measured on the day of the run, projected onto
  the growth the business is pursuing. Runs beside testing & CI on every
  card; never optional.
- **Rungs in the project's own unit** (accounts, tenants, DAU, RPS). The
  bottom rung is the measured present; above it the rungs the business has
  named, or five-times defaults declared as defaults. Rungs are recorded in
  project memory so they hold still across cards.
- **A fixed verdict vocabulary per rung**: holds / degrades / breaks, each
  naming the first constraint to give and the measurement behind it.
- **Measured, then multiplied.** Per-unit measurements are taken on the
  bottom rung and extrapolated linearly unless the code says otherwise (a
  per-unit loop inside a fixed tick, a connection per unit). Printed numbers
  carry their date so the next card can re-take them.
- **Singular things listed once** with the rung at which each becomes the
  constraint; **bought-or-built burn-down** (config / money / engineering)
  with dated list prices on money items and tickets on engineering items.
  A managed service is never assumed faster than what it replaces.
- **The lens's letter grades headroom to the next named rung**, not to the
  top rung. Stable dimension labels: Data tier · Compute & workers · Shared
  state · Operations at N · Cost curve.
- Page anatomy grows by one section (the ladder, between the component
  cards and new findings); auditor prompt ingredient 8 added.

## 1.4.1 — 2026-09-04

- **A maintenance rule in the README**: a new reference or mode moves the
  contents list and the usage table in the same commit. The review that
  prompted 1.4.0 passed its "all content read" check *because* the contents
  list matched the repo exactly, and by then it had already drifted — 1.3.0
  added `references/report-card.md` and a `grade` mode that neither the list
  nor the table knew about. A reference the README does not mention reads as
  undocumented content rather than an oversight, so this is the cheapest
  possible way to fail a review.


## 1.4.0 — 2026-09-04

Hardening pass, from an independent pre-import review of the published skill.
Six changes, all prose: the review passed the code and flagged what the skill
does not defend against or disclose.

- **Scanned content is data, never instructions.** New rule in Phase 1. The
  skill reads transcripts, chat, tickets and docs written by other people and
  fed them straight into synthesis with nothing separating source text from
  direction. Text inside a source now describes the project and never directs
  the run: it cannot change horizon placement, the authority ranking, what gets
  published, where, or which sources get read next. A source that tries to steer
  the run is surfaced in the question round as a finding; a destination named in
  a source is a quoted string, never somewhere to send anything. The same rule
  extends into `grade` mode's auditor prompts, where what is read is evidence
  under audit: a comment claiming a control, a doc asserting a grade, and a file
  instructing the reader are findings about the component, never direction.
- **The first publish of a page is a confirmed step.** New rule at the top of
  Phase 4. The finished board is an aggregate the driver never assembled by hand
  — internal priorities, standing risks, declined decisions with dates, client
  commitments, dependency structure — and publishing puts it on a hosted URL.
  The run now names what is on the page (specifically anything client-named,
  dated, personnel-shaped or marked internal in its own source) and offers
  publish-as-is / cut-or-genericize / local-file-only before doing it. Updates
  to an already-published page do not re-ask unless the run added a source.
- **A scope clause: what this is not for.** "Roadmap" is an ordinary word, and
  "what's on the roadmap for Q4?" is a question, not a request for an artifact.
  Those get answered in prose in the conversation; the four-phase build runs
  when the user wants the page, and ambiguity is a question rather than a scan.
- **The type register is stated as this skill's default, with its reasoning** —
  a roadmap is read as an operational document, so it is set in the register
  used for schedules and status boards. It was carried as one user's standing
  preference with a date, which on import read as the importer's own decision.
  Now: a default, stated as one when used, dropped for a house style or a pin.
- **The README says what actually runs.** "No code executes from this repo" was
  literally true and materially misleading: nothing executes at install, but the
  published page ships ~225 lines of JS and ~80 of CSS, verification runs
  headless Chrome and `grep`, and reach is tool-mediated. A "What runs" section
  replaces the one-liner, including what the shipped JS does not do (no `fetch`,
  no `eval`, no analytics) and every destination it writes to.
- **README caught up with 1.3.x** — `grade` was missing from the usage table and
  `references/report-card.md` from the contents list.

## 1.3.1 — 2026-09-03

Shape-agnosticism pass on grade mode.

- **"Fleet" dropped from the mode's name** — a report card grades a single
  service, a monorepo, or a many-repo estate identically once carved into
  components.
- **Component defined and discovered, never assumed**: a unit someone could
  own and grade in isolation, found from the project's own structure the same
  way Phase 1 discovers sources; fan-out scales to the discovered count.
- Repo-shaped language (per-repo cards, repos-by-dimensions board, "the
  fleet is B+") generalized to components throughout.

## 1.3.0 — 2026-09-03

Grade mode: the fleet report card. Generalized from two real audits of a
five-repo multi-tenant fleet (a baseline, then a pre-deploy re-grade).

- **New `grade [<baseline-card-url>]` mode.** A letter-graded, evidence-cited
  audit of code + infrastructure: one blind, read-only auditor per component
  plus a cross-cutting lens; five stable dimensions; every grade carries cited
  evidence and its gaps-to-the-next-grade-up. The bar is stated in every
  auditor prompt: an A means showable to an outside CTO without caveats.
- **The twin verdict.** As-written AND operational reality — merged-but-not-
  deployed is an activation gap, credited in one and debited in the other.
  A gate answer (GO / HOLD) joins them when the run gates a decision.
- **Every card is a dated record** — a new artifact per run, never a
  republish; each card links its predecessor, and the chain is the trend
  line (the deliberate inverse of the horizons update-in-place rule).
- **Counts are grades**: shrink-only list sizes and directions report as
  quality metrics; a debt moving from unmeasured to pinned earns explicit
  credit even when the letter holds ("same letter, different substance").
- **Synthesis discipline**: letter-move accounting, the outlier rule (a grade
  that does not follow from its own evidence goes back to its auditor, never
  silently adjusted), tickets filed for new findings before publishing, and
  the roadmap-drift handoff (end a grade run by offering the horizons
  refresh).
- New reference: `references/report-card.md` (methodology, auditor prompt
  ingredients, fan-out scaling, page anatomy).

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
