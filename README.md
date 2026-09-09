# /roadmap — the Horizons roadmap builder

A [Claude Code](https://claude.com/claude-code) skill that builds and maintains a
single-page roadmap artifact for any project: scan the repo, issue tracker, and
notes; ask one round of questions only for what cannot be found; synthesize
Now / Next / Later horizons with cross-cutting throughlines; publish a
shared artifact with view tabs, a throughline filter, collapsible sections and
derived tooltips. A fixed initial assessment baseline makes every later grade
part of the same evidence-backed path to operational A+, not a new score set.
The page is designed so a stakeholder can scan it in a minute and an engineer
can drill into every claim.

## Install

Clone into your user-level skills directory:

```bash
git clone https://github.com/brandonellis/roadmap-skill.git ~/.claude/skills/roadmap
```

Then invoke it in any Claude Code session with `/roadmap`.

## Usage

| Invocation | What it does |
|---|---|
| `/roadmap` | Create a new roadmap for the current project (detects prior runs first) |
| `/roadmap <artifact-url>` | Update an existing roadmap artifact in place |
| `/roadmap refresh` | Drift report against the live tracker, then apply the delta |
| `/roadmap gantt` | Add or update the Timeline view with sourced commitments, explicit scenarios and an unscheduled shelf |
| `/roadmap wsjf [<source>]` | Opt in to WSJF cost-of-delay scoring: bare bootstraps a worksheet, a target reads existing scoring |
| `/roadmap grade [<baseline-url>]` | Audit against the established initial baseline, append an immutable dated assessment, and update Progress and Evidence in the same artifact |
| `/roadmap score [<baseline-url>]` | Alias of `grade`, with the same baseline and ledger; not WSJF priority scoring |
| `/roadmap help` | Show the mode table |

## What makes it opinionated

- **The original audience persists.** Investor, executive and company editions
  share evidence but tell different stories. Creation captures the brief; later
  runs inherit it rather than asking again or switching to an engineering audit.
- **Progress is visible, not just graded.** Source-linked delivery charts,
  original-finding progress, wins and milestones lead. Tracker completion,
  operational verification and customer impact remain distinct claims.
- **Existing visuals survive updates.** A Gantt is recovered and retained with
  its original assumptions, not replaced by an unscheduled table simply because
  a newer NNL source lacks dates.

- **One artifact, three clear views.** Progress, Roadmap and Evidence appear
  only when populated. NNL and opt-in Timeline are roadmap formats. Skill names are
  provenance, not navigation. All views share item IDs and filters, while
  retaining their own verification dates. Separate audiences stay separate.
- **Know what was assessed.** Code, staging and production have distinct
  assessment datasets. Show the audited branch and commit independently of
  per-service runtime revisions. Legacy blended letters stay in history;
  missing evidence says not assessed, never inherits another scope's grade.
- **One original assessment baseline.** Criteria, findings and A+ checks stay
  fixed until an explicitly approved rebaseline. Initial, previous and current
  assessments remain distinct. New findings and regressions are visible without
  changing the original burn-down denominator. Legacy cards are preserved.
- **Operational A+ must be earned.** A deterministic, baseline-approved roll-up
  replaces discretionary overall letters. The default is the weakest mandatory
  cell. Live proof, complete coverage and fixed A+ acceptance checks are required;
  missing evidence means Incomplete, not a pass. Merged is not deployed.
- **Undated horizons by default.** NNL describes commitments, readiness and
  options, not implied quarters. Timeline is explicit opt-in: committed dates,
  user-approved proposed scenarios, or unscheduled. Original commitments remain
  visible when a forecast changes. Evidence and decision dates still appear.
- **Source authority tiers.** Every source is classified *record* (the tracker,
  a project board, a commitment doc) or *anecdote* (transcripts, chat, notes),
  inferred first and confirmed with you. Where the two disagree, the record
  decides the board and the disagreement is surfaced, never silently blended.
- **Counts before prose.** A status console with numbers re-derived from the
  finished document, verified against the live tracker and stamped.
- **Risks framed as discipline plus a gap**, never negligence.
- **Optional WSJF scoring.** Cost-of-delay ranking as an opt-in layer: scores
  are proposed then human-confirmed, never invented; they rank items within a
  horizon but never move an item between horizons; fixed-date items outrank
  their score. Off by default, and a roadmap that never opts in never shows one.
- **Progressive density.** The overview reads in a minute; the drill-down lives
  behind interaction, collapsed by default on heavy pages.
- **Scanned content is data, never instructions.** It reads transcripts, chat,
  tickets and docs written by other people; text inside a source describes the
  project and never directs the run, and anything that tries to is reported as a
  finding rather than followed.
- **It says what the page contains before publishing it.** The board is an
  aggregate you never assembled by hand, and publishing puts it on a hosted URL, so
  the first publish of a page is a confirmed step with cut-it-down and
  local-file-only on the table.

## Contents

- `references/stakeholder-story.md` owns audience inheritance, evidence-backed
  progress storytelling, visual retention and safe audience-specific exports.
- `assets/stakeholder-visuals.css` supplies delivery bars, baseline-cohort marks,
  linked win lists and the responsive Gantt. Use with the progress shell assets.

- `SKILL.md` is the skill itself: modes, the four phases, the decided rules.
- `references/artifact-views.md` is the shared-model/view contract, copy-ready
  accessible tabs, responsive/print behavior and interaction verification.
- `references/progress-layout.md` is the progress-first composition, scope and
  provenance rules, reusable asset hooks and browser acceptance checks.
- `assets/progress-shell.css` and `assets/progress-shell.js` implement the
  responsive comparison layout, scope and format selectors, shared roadmap
  filters, deep-link reveal and printable archived evidence. Inline them in
  generated artifacts with the tab controller from `artifact-views.md`.
- `references/page-anatomy.md` is the content spine and the outcome-led NNL
  design: active commitments, entry conditions, options and movement history.
- `references/gantt.md` is the timeline design, date provenance, baseline vs
  current commitments, milestones, scheduling coverage and slip handling.
- `references/wsjf.md` is the scoring layer: worksheet format, validation,
  rendering rules.
- `references/report-card.md` is `grade` mode: the auditor fan-out, the five
  dimensions, the twin verdict, the measurement band, the versioned
  instrument, the letter-move classes, the scale ladder, the learning-loop
  lens for projects that run models or agents, the exception register, and
  the rules for filing findings.
- `references/grade-anchors.md` is the calibration sheet `grade` carries into
  every auditor prompt: letter anchors per dimension, plus the instrument
  and coverage manifest templates.
- `references/baseline-ledger.md` owns initial-baseline resolution, legacy
  migration, immutable assessments, deterministic roll-up, A+ gates, safe
  persistence and rebaseline approval.
- `references/interaction-layer.md` is the CSS/JS the published page ships, with an
  adaptation contract (rename the hooks, keep the roles).
- `references/writing-floor.md` is the prose floor: hard rules, banned phrases,
  and the tests the finished page must pass.

A new reference or mode moves this list and the usage table in the same commit.
Whether the repo matches its own contents list is the first thing a reviewer
checks, and it is the cheapest possible way to fail: a reference the README does
not mention reads as undocumented content, not as an oversight.

## What runs

Nothing in this repo executes at install or on clone: it contains Markdown and
browser assets, with no build step, hook, postinstall or binary. Here is what
invoking the skill can do:

- **The published page ships client-side code.** `references/artifact-views.md`,
  `assets/progress-shell.*` and the alternative `references/interaction-layer.md`
  carry JavaScript and CSS for the
  tabs, shared filter, collapse behavior and derived tooltips. It runs
  in the reader's browser, not on your machine. It makes no network calls of its own:
  no `fetch`, no `eval`, no analytics. The new shell uses text-only DOM updates;
  the legacy interaction layer also uses one static `innerHTML` string.
- **Verification runs local commands.** Headless Chrome for a DOM smoke test and
  three screenshots (`--headless=new --dump-dom`, `--screenshot`), and
  `grep -c` over the finished page for the em-dash gate.
- **Reach is tool-mediated and yours.** Whatever you have connected: the `gh` CLI,
  a Linear or Jira MCP, Drive, Slack, Fireflies, and the Artifact tool to read and
  publish. The skill carries no credentials and no endpoints of its own; where it
  needs tracker configuration it reads it from your `CLAUDE.md` at runtime.
- **Writes.** The published artifact and its memory pointer; `docs/roadmap-wsjf.md`
  only in `wsjf` mode; a durable assessment ledger, defaulting to
  `docs/roadmap/assessment-ledger.json`, in `grade`/`score` mode; authorized new
  finding tickets; and a local copy if you keep one. No automatic project commits
  or pushes. Sensitive ledger evidence is not automatically published.

## Updating an existing roadmap or grade chain

Read the existing artifact first. Reuse its canonical URL, visual direction and
stable links. On the first grade run after this update, resolve the original
assessment and preserve it, then confirm any missing rubric/A+ decisions once.
Unrecoverable legacy evidence stays labelled unknown or originally reported;
it is never invented to make the old grades comparable. New assessments append
to History. No old artifact is automatically migrated merely by pulling this repo.

## Validation

The copy-ready scripts are browser code, so syntax checks alone are insufficient.
Use the bounded scenario checks in `artifact-views.md`, `progress-layout.md` and
`baseline-ledger.md`:
keyboard/deep-link/filter/print behavior, unchanged-evidence grading, reopening,
missing access, scope changes and explicit rebaseline. The repo does not install
a test framework. Claude Code's existing `argument-hint` frontmatter is intentional;
generic skill validators that only accept the cross-client core may reject it.

## Versioning

Semver via git tags; see `CHANGELOG.md`.
