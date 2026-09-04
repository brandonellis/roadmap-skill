# /roadmap — the Horizons roadmap builder

A [Claude Code](https://claude.com/claude-code) skill that builds and maintains a
single-page roadmap artifact for any project: scan the repo, issue tracker, and
notes; ask one round of questions only for what cannot be found; synthesize
Now / Next / Later horizons with cross-cutting throughlines; publish an
interactive board with a theme filter, collapsible sections, and derived
tooltips. The page is designed so a non-technical stakeholder can scan it in a
minute and an engineer can drill into every claim.

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
| `/roadmap gantt` | Dated variant, only when commitments to external parties matter |
| `/roadmap wsjf [<source>]` | Opt in to WSJF cost-of-delay scoring: bare bootstraps a worksheet, a target reads existing scoring |
| `/roadmap grade [<baseline-url>]` | Letter-graded, evidence-cited audit of the code and infrastructure behind the roadmap; each run is a dated record, never a republish |
| `/roadmap help` | Show the mode table |

## What makes it opinionated

- **Undated by default.** Now / Next / Later, no dates anywhere. A dated gantt
  exists but only on explicit request, and every bar carries a provenance grade
  (committed / derived / unscheduled). Dates are sourced, never invented.
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

- `SKILL.md` is the skill itself: modes, the four phases, the decided rules.
- `references/page-anatomy.md` is the 15-part page spine.
- `references/wsjf.md` is the scoring layer: worksheet format, validation,
  rendering rules.
- `references/report-card.md` is `grade` mode: the auditor fan-out, the five
  dimensions, the twin verdict, and the rules for filing findings.
- `references/interaction-layer.md` is the CSS/JS the published page ships, with an
  adaptation contract (rename the hooks, keep the roles).
- `references/writing-floor.md` is the prose floor: hard rules, banned phrases,
  and the tests the finished page must pass.

A new reference or mode moves this list and the usage table in the same commit.
Whether the repo matches its own contents list is the first thing a reviewer
checks, and it is the cheapest possible way to fail: a reference the README does
not mention reads as undocumented content, not as an oversight.

## What runs

Nothing in this repo executes at install or on clone: it is Markdown, and there is
no build step, no hook, no postinstall, no binary. What it does do, once you invoke
it, is worth knowing before you import it:

- **The published page ships client-side code.** `references/interaction-layer.md`
  carries roughly 225 lines of JavaScript and 80 of CSS that get embedded in the
  artifact — the theme filter, the collapse behaviour, the derived tooltips. It runs
  in the reader's browser, not on your machine. It makes no network calls of its own:
  no `fetch`, no `eval`, no analytics, and one static `innerHTML` string with
  everything else set as `textContent`.
- **Verification runs local commands.** Headless Chrome for a DOM smoke test and
  three screenshots (`--headless=new --dump-dom`, `--screenshot`), and
  `grep -c` over the finished page for the em-dash gate.
- **Reach is tool-mediated and yours.** Whatever you have connected: the `gh` CLI,
  a Linear or Jira MCP, Drive, Slack, Fireflies, and the Artifact tool to read and
  publish. The skill carries no credentials and no endpoints of its own; where it
  needs tracker configuration it reads it from your `CLAUDE.md` at runtime.
- **Writes.** The published artifact; a memory file; `docs/roadmap-wsjf.md` into
  your repo, only in `wsjf` mode; new tickets in your tracker for findings, only in
  `grade` mode; and a local copy if you keep one.

## Versioning

Semver via git tags; see `CHANGELOG.md`.
