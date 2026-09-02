---
name: roadmap
description: Build or update a "Horizons" roadmap artifact for any project — scan the repo, issue tracker, knowledge vault and markdown docs, ask only for what cannot be found, synthesize Now/Next/Later horizons with cross-cutting throughlines, and publish an interactive board (theme filter, collapsible sections, derived tooltips). Use when the user asks for a roadmap, a "horizons" page, or to refresh/update an existing roadmap artifact.
argument-hint: "[<artifact-url> · refresh [<url>] · gantt · help] — no args creates a new roadmap"
---

# /roadmap — the Horizons roadmap builder

Produce (or update) a single-page roadmap artifact that a non-technical stakeholder
can scan in a minute and an engineer can drill into: counts before prose, a
streams × horizons board, cross-cutting throughlines, detail cards with ticket refs
as small tags, an explicit out-of-scope section, and a standing-risk register.
The pattern is proven on shipped roadmap pages; this skill generalizes it.

## Modes (from args)

| Args | Mode | What it does |
|---|---|---|
| *(none)* | create | New roadmap for the current project. **Prior-run detection first**: check memory and `Artifact action:"list"` for an existing roadmap; if one exists, offer *update it / start a parallel one / something else* rather than silently creating a sibling. |
| `<artifact-url>` | update | ALWAYS `action:"read"` first and adopt the remote as baseline (other sessions edit these); keep favicon and `<title>` stable; republish to the same URL. |
| `refresh` | drift report → apply | See "Refresh is a drift report" below. |
| `gantt` | dated variant | See "The dates rule" below; never choose this mode yourself. |
| `help` | show the modes | Print this table with one-line examples and stop — no scanning, no artifact work. Also the right response to any argument that matches no mode: show the table and ask, never guess a mode. |

**Refinement preserves; redesign replaces — never split the difference.** An update
keeps the page's committed visual world: read the DIRECTION CONTRACT comment at the
top of the existing page (it records the skin, interaction hooks, and standing
decisions) and honor it. A new skin happens only when the user asks for one, and then
it replaces the contract wholesale — polish applied to a discarded look is the failure
mode. The user's own words always beat both the contract and this skill's defaults.

### Refresh is a drift report, then a fix

Never silently rewrite states. First diff the page's claims against the live tracker
and report the delta — cited-open items that closed, cited-closed items that reopened,
new items the page doesn't know — then apply it: states, counts, the verified-stamp
kicker, and nothing else (no re-synthesis). Check both directions: a page calling a
closed ticket open is stale; a page calling an open ticket done is worse, especially
where ticket status feeds compliance evidence. The delta since the *sibling* artifact's
stamp is often the most valuable output — surface it, don't bury it.

## The dates rule (decided, do not re-litigate per run)

Default is **Now / Next / Later with no dates anywhere** — undated horizons are what
keep a fast-executing team from being held to a schedule it never committed to.
A dated gantt (month columns, team-colored bars, today line) is appropriate only
when the user explicitly asks for one — typically when commitments to external
parties start to matter. The Gantt mode section below is self-sufficient; its
mechanics were ported from a client gantt (Apr '26) as presentation patterns only.

## Gantt mode — the dated projection

The gantt is a **projection of the same synthesis onto a time axis**, not a second
roadmap: if a horizons artifact exists, reuse its theme set and refs — themes become
rows, published as a separate cross-linked artifact (different audience: the gantt is
for commitment conversations, the horizons page for execution). Refresh them together.

**Dates are sourced, never invented.** Every bar carries a provenance grade, and the
grades render differently — this is the "measured vs attested" distinction applied to
schedules:

1. **Committed** (solid bar): a date a human actually stated — tracker project
   target dates and milestones, issue due dates, dated commitments in docs (an audit
   date, a contract window), or windows the user gives in this run.
2. **Derived** (hatched/translucent bar, labeled): only the horizon placement —
   Now → the current quarter, Next → the next one, Later → the following half.
   Honest as a default, visibly weaker than a commitment.
3. **Unscheduled** (no bar): no signal at all — the row sits on a shelf below the
   chart. A shelf row is information; a guessed bar is a fabricated commitment.

All bars snap to **half-quarter boundaries** — the chart
must never claim day- or week-level precision nobody stated. Ask ONE round: show the
undated rows and let the user supply windows for the ones that matter or bless the
derived defaults; if the tracker is date-poor, say so plainly — the chart gets better
as target dates get filled in, and that gap is a finding worth reporting.

Structure: month columns under quarter headers, today line, collapsible row groups
(by stream, or tier×priority), the same filter/collapse/
tooltip layer. Color stays the **throughline** unless real ownership data exists —
team-colored bars only when owners are on the record; "no owner is on record" must
never become a color. Per-row **% complete is computed, not asserted**: closed refs
over total refs for that theme, shown only where refs exist. The footer's confidence
note summarizes the provenance mix (N committed / N derived / N unscheduled).

**Refreshing a gantt adds one drift class: the slip.** A bar whose window has passed
while its refs stay open is flagged *slipped* — never silently slid right. Re-dating
is a human decision the drift report requests; the today line is the only thing that
moves on its own.

## Phase 1 — discover sources (scan first, ask second)

Scan without asking, in parallel where possible:

1. **Repo docs**: `CLAUDE.md`, `AGENTS.md`, `README*`, `docs/**`, any
   `*roadmap*`, `*strategy*`, `*vision*`, `*plan*`, `*priorities*`, `PROGRESS`,
   `DECISIONS`, ADR files (case-insensitive, exclude node_modules/vendor).
2. **Issue tracker** — detect what this project actually uses:
   - Linear MCP tools available? CLAUDE.md often carries the team/status/label ids.
   - `gh` CLI + a GitHub remote → issues, milestones, labels, recent PRs.
   - Jira/other MCPs if connected.
3. **Knowledge vault / notes**: project memory directory, an Obsidian vault if one
   is known for this project, meeting-notes directories, and connected MCPs
   (Drive, Slack, Fireflies) — only if authenticated; never block on auth.
4. **Prior artifacts**: memory files and `Artifact action:"list"` for an existing
   roadmap page, plus any companion memos to link in the footer.

Then present a **source inventory table** — source, what it contains, item count,
freshness, and an **authority tier**: *record* (a source the team maintains as the
truth — the issue tracker, a project board, a commitment spreadsheet shared with a
client) or *anecdote* (transcripts, chat, meeting notes, memory files — real
signal, weaker standing). Infer each tier from how the team treats the source,
then have the driver confirm or correct the ranking in the question round — the
inventory table is the confirmation instrument. The blessed ranking persists in
the DIRECTION CONTRACT so update runs inherit it instead of re-asking.

Ask ONE round of questions (AskUserQuestion) covering only real gaps: the tier
ranking, sources you could not reach, whether meeting/offsite notes exist
somewhere you cannot see, the intended audience, and anything ambiguous about
horizon placement. A source the driver names as record-tier that you could not
read is a first-class finding — the footer must say "X is authoritative and this
page has not read it", never silently omit it. If everything needed is local and
unambiguous, skip the questions and say what you assumed (including the inferred
tiers).

## Phase 2 — synthesize (this is the actual work)

- **Items, not tickets.** Cluster tracker issues + doc claims into 15–30 *themes*.
  Every theme gets: a horizon, a stream, a throughline, a plain-language title, a
  "why" sentence a non-engineer understands, and its evidence refs.
- **Horizons**: Now (in flight or committed), Next (named, dependency-gated),
  Later (direction set, not scheduled). Place by what sources *state*; where you
  inferred, say so in the footer's confidence note.
- **The record decides; anecdote fills gaps and is marked.** Where a record-tier
  source and an anecdotal one disagree about state, ownership, or intent, the
  record wins the placement AND the disagreement is surfaced in the
  sources-disagree block (see the anatomy) — silently blending the two is how a
  transcript overwrites the tracker. A claim resting only on anecdote still
  ships, visibly marked as such on its card; a theme with no record-tier
  evidence at all is a finding about the project's bookkeeping, not a reason to
  drop the theme.
- **Streams** (board rows): default `Product / Technical / Trust & commercial`;
  derive different rows if the project's shape demands it. 2–4 rows.
- **Throughlines** (the cross-cutting themes, the synthesis heart): 4–6, each must
  span ≥2 horizons — a "throughline" confined to one column is just a group. Each
  gets a code (T1…Tn), a name, and a one-line arc. An item may sit on two lines
  (mark it `data-tl="t1 t3"`); note the double-count wherever counts appear.
- **Critical path**: only draw dependencies the sources state out loud; every edge
  needs a label naming what flows across it.
- **Out of scope**: things considered and declined, each with the reason and the
  decision date — the section exists so decisions are not re-litigated.
- **Standing risks**: cross-cutting patterns, not per-item issues. Frame each as
  *discipline plus a specific gap* — e.g. "shipping switched-off is deliberate;
  staying dark is the risk" — never as negligence or blame.
- **Confidence and propagation survive synthesis.** Source notes often carry their
  own confidence grades and internal-only markers (harvest T1/T2 tiers, "do not
  propagate until published"). Those travel WITH the claim: an inferred attribution
  never becomes a flat statement of who owns what ("no owner is on record" is a
  finding, not a blank to fill); client numbers and anecdotes marked internal stay
  internal; a corrected source claim must not resurface from an older synthesis.
- **Verify before publishing**: re-check item states against the live tracker and
  stamp the kicker `ticket state verified <ISO timestamp>`. Counts in the status
  console must be re-derived from the finished document, never carried forward.

## Phase 3 — build the page

Load the `artifact-design` skill before writing (and `artifact-diagramming` for
any figure). Design for THIS project — the page anatomy in
`references/page-anatomy.md` is the proven structure (status console → gate/posture
band → thesis strip → board → throughlines table → critical-path figure → per-horizon
detail cards → out-of-scope → risks → sources-disagree block when conflicts exist →
footer), but palette, type and voice get a fresh design pass per project. Two direction rules:

- **The brief wins.** A user-pinned aesthetic, palette, or reference beats every
  default in this skill and in the anatomy reference. Standing user preference
  (set 2026-09-01): the **readiness type register** — condensed grotesque caps
  display + workhorse grotesque body + mono tokens (Barlow Condensed / Barlow /
  JetBrains Mono is the proven set); never rounded or expressive display faces
  that read handwriting-adjacent (Bricolage Grotesque was rejected on sight).
- **When the user wants to choose the look** (they say so, or a new roadmap has
  visible stakeholders and they're present to decide): draft 2–3 one-paragraph
  direction contracts (world, palette, type, one distinguishing device each) and
  put them through AskUserQuestion with `preview` blocks — cheap divergence before
  the expensive build, not after it. Default when nobody asks: commit to one
  direction yourself and record it in the page's DIRECTION CONTRACT comment.

If a sibling roadmap artifact exists for the same project, the new page must be
visually distinct from it — two look-alike roadmaps with different states is how a
stale one gets trusted.

Non-negotiables regardless of skin:

- Plain language for the prose; ticket refs as small mono tags, explained in the
  footer ("everything load-bearing is in the plain text"). Before writing prose,
  load `references/writing-floor.md` — hard rules (zero em dashes, grep-gated;
  no disguised assertions; the banned-phrase list), the said-aloud test,
  scene-not-concept, the swap test, and sentence craft. Run its tests and the
  em-dash grep on the finished page as part of the verification round.
- Counts before prose: a status console strip with real, re-derived numbers.
- **Density is progressive.** Everything above the board is overview a first-time
  reader absorbs in a minute; the drill-down lives below and behind interaction.
  On a heavy page (roughly 20+ themes, or several projects sharing one board),
  ship the per-horizon detail sections collapsed by default so the first
  screenful is the summary — the density complaint from real readers was about
  meeting all of it at once, not about it existing.
- Color encodes the throughline and nothing else; position encodes the horizon.
- Footer: sources with dates AND their confirmed authority tier, how to read the
  tags, a confidence note that separates "stated by the team" from "synthesized
  by me", and any record-tier source the page could not read, named as a gap.
- Light + dark themes per the Artifact theming contract; self-contained page.

Then add the **interaction layer** from `references/interaction-layer.md`:
throughline filter (the color key is the control, with a fixed clear-chip),
collapsible sections with count badges (localStorage, try/catch), and tooltips
derived at load from the detail cards so they cannot drift from the content.

### Verification is bounded — one batched round, one fix batch, stop

Build the page fully, then run ONE batched inspection round; open-ended self-QA
polishing loops burn money doing worse what a human glance does better.

The round, all together (headless Chrome, wrap the content file in a doctype shell):

1. **DOM smoke**: `--headless=new --virtual-time-budget=4000 --dump-dom` — the
   interaction script ran iff the section toggles and count badges appear, and the
   badge counts must equal the status console's numbers.
2. **Three screenshots** with `--screenshot=... --window-size=...`:
   desktop light (1280×2400), desktop dark — stamp `data-theme="dark"` on the shell's
   `<html>` for an exact emulation of the toggle path — and mobile (390×2400).
   Look for the classic breaks: one theme's text on the other's ground, horizontal
   body scroll, clipped tooltips/labels, a figure overflowing its container.

Fix everything the round shows in ONE batch, re-run at most one confirming round,
then publish. Anything still imperfect after that ships and is noted — the finish
pass is the user looking at their own page.

## Phase 4 — publish and record

- New artifact: pick a short distinctive `<title>` ("<Project> Horizons" works),
  one favicon, publish. Updates: pass `url`, keep title/favicon/label discipline.
- If the user keeps a standalone local copy (e.g. on the Desktop), regenerate it in
  the same pass — wrap the same content file in a plain doctype/head/body shell.
- Write/update a memory file recording: artifact URL, local-copy path, favicon,
  editorial rules the user set, and any per-project framing decisions — future
  sessions must re-read + diff the artifact before republishing.
- **The page's DIRECTION CONTRACT comment is the durable design record** — unlike
  memory it travels with the artifact across machines and agents. Make sure it names:
  the visual world, the sources with their confirmed authority ranking (record vs
  anecdote — update runs inherit this instead of re-asking), the verification
  stamp, the interaction hooks (theme classes, `data-hz`, the localStorage key),
  and standing decisions (the dates rule, framing rules the user set). An updater
  who reads nothing else must be able to work from it.
- Hand back the URL and a two-line summary of what changed.
