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
- **Progressive density.** The overview reads in a minute; the drill-down lives
  behind interaction, collapsed by default on heavy pages.

## Contents

- `SKILL.md` is the skill itself: modes, the four phases, the decided rules.
- `references/page-anatomy.md` is the 14-part page spine.
- `references/interaction-layer.md` is the shipped CSS/JS with an adaptation
  contract (rename the hooks, keep the roles).
- `references/writing-floor.md` is the prose floor: hard rules, banned phrases,
  and the tests the finished page must pass.

## Versioning

Semver via git tags; see `CHANGELOG.md`. The skill is prompt and reference
material only: no code executes from this repo.
