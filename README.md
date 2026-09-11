# /horizons — the Horizons roadmap builder

Executable grading, outcome-led updates and private publication checks are
documented in [the implementation guide](references/executable-grading.md).
Maintainers changing executable helpers can run the dependency-free regression
suite with `node --test scripts/*.test.mjs`; it is not a skill-use prerequisite.
Draft contracts do not award grades; legacy assessment history stays immutable.

A [Claude Code](https://claude.com/claude-code) skill that builds and maintains a
single-page roadmap artifact for any project: scan the repo, issue tracker, and
notes within the resolved scope; clarify material uncertainty before dependent
work, including whether to act at all; synthesize
Now / Next / Later horizons with cross-cutting throughlines; publish a
shared artifact with view tabs, a throughline filter, collapsible sections and
derived tooltips. A fixed initial assessment baseline makes every later grade
part of the same evidence-backed path to operational A+, not a new score set.
The page is designed so a stakeholder can scan it in a minute and an engineer
can drill into every claim.

Grading reads **issues/tickets and the codebase**, plus environment-specific
runtime evidence for operational verdicts. Tickets supply acceptance and delivery
claims; code review verifies implementation and finds unticketed gaps. Done alone
does not earn a grade. Missing sources stay explicit coverage gaps.

The [execution contract](references/execution-contract.md) applies across hosts:
ask when action, data or grading scope is uncertain, preserve settled decisions,
and respect applicable project instructions. A missing question tool falls back
to conversation; a missing auditor panel cannot silently become a blind audit.

Horizons preserves your selected model and provider, with no required model
family. Where you authorize model routing, use a strong reasoning lead for
grading and synthesis; smaller models can extract evidence for the lead to
check. The [model-role rules](references/execution-contract.md#model-roles-and-selection)
keep scope decisions and final grades with the lead. Models named in evaluation
results identify tested configurations, not required runtime settings or a
guarantee of compliance.

## Install

Clone into your user-level skills directory:

```bash
git clone https://github.com/brandonellis/horizons-skill.git ~/.claude/skills/horizons
```

Then invoke it in any Claude Code session with `/horizons`.

### Upgrading from `/roadmap`

The command was `/roadmap` through v1.14.0. Claude Code takes the skill name from
the directory, so renaming the checkout is the upgrade:

```bash
git -C ~/.claude/skills/roadmap pull
mv ~/.claude/skills/roadmap ~/.claude/skills/horizons
git -C ~/.claude/skills/horizons remote set-url origin https://github.com/brandonellis/horizons-skill.git
```

The old repository URL redirects, so an existing clone keeps fetching either way.
Nothing inside an artifact changes: pages, baselines and assessment history are
untouched by the rename, and a page built by `/roadmap` updates under
`/horizons` with no migration. If you script against the skill's modules, the
path they live under moved with the directory.

### Packaging it for anywhere else

The frontmatter carries one Claude-Code-only key, `argument-hint`, which supplies
the mode list to autocomplete when you type `/horizons`. Claude Code accepts it;
the Agent Skills spec does not, so a claude.ai upload or `package_skill.py` run
refuses the file with `Unexpected key(s) in SKILL.md frontmatter: argument-hint`.
Delete that one line before packaging. Nothing else in the skill depends on it,
and every mode is also named in `description`, so removing it costs autocomplete
and no discovery. `scripts/frontmatter.test.mjs` fails if a second non-spec key
appears without being declared and documented here.

## Usage

| Invocation | What it does |
|---|---|
| `/horizons` | Follow a clear request from the conversation, otherwise ask what to do; detect prior runs before creating |
| `/horizons <artifact-url>` | Update an existing roadmap artifact in place |
| `/horizons refresh` | Reconcile delivery, regrade relevant criteria in assessed artifacts, then update the shared views |
| `/horizons gantt` | Add or update the Timeline view with sourced commitments, explicit scenarios and an unscheduled shelf |
| `/horizons wsjf [<source>]` | Opt in to WSJF cost-of-delay scoring: bare bootstraps a worksheet, a target reads existing scoring |
| `/horizons grade [<baseline-url>]` | Audit against the established initial baseline, reconcile roadmap completion, append an immutable assessment, and update Roadmap, Progress and Evidence together |
| `/horizons score [<baseline-url>]` | Alias of `grade`, with the same baseline and ledger; not WSJF priority scoring |
| `/horizons help` | Show the mode table |

## What makes it opinionated

- **Scalability stays visible.** Preserve the scale lens, its five dimension
  grades and capacity ladder alongside component grades. Relevant refreshes
  reassess it; older measurements remain dated rather than becoming current
  claims. Missing a registered lens fails private-bundle verification.

- **Lens letters sit on the grade strip, marked.** Every standing lens gets a
  tile beside the components, with a `lens` marker and its own assessment date,
  and the strip says lenses grade a different question on their own scale and
  stay outside the baseline and any overall letter.

- **Relevant work triggers reassessment.** Refresh checks completed findings,
  reopenings and changed evidence against existing grading criteria. It verifies
  affected requirements and updates supported grades against the same baseline.
  Grade and score always run an assessment; refresh targets affected components.
  Existing qualitative methods continue while replacement rubrics await approval.
  Missing evidence is a blocker, not an unchanged grade. Delivery-only remains an
  explicit option; ungraded roadmaps do not acquire a scorecard automatically.

- **Progress has a clear reading order.** Verified outcomes lead, original
  findings and delivered work are distinct, and dated readiness grades identify
  their actual assessment ref. Supporting ticket-reference counts stay secondary.
- **Drill-downs have a way back.** Initiative details retain the selected chart;
  a visible return restores its filters, scroll and keyboard focus. Shared links
  and no-JavaScript readers still have a plain roadmap link.

- **The original audience persists.** Investor, executive and company editions
  share evidence but tell different stories. Creation captures the brief; later
  runs inherit it rather than asking again or switching to an engineering audit.
- **Progress is visible, not just graded.** Source-linked delivery charts,
  original-finding progress, wins and milestones lead. Tracker completion,
  operational verification and customer impact remain distinct claims.
- **Existing visuals survive updates.** A Gantt is recovered and retained with
  its original assumptions, not replaced by an unscheduled table simply because
  a newer NNL source lacks dates.
- **The timeline carries the story.** Themes label the left-hand lanes; initiative
  titles and current progress live inside the bars. Non-overlapping work shares
  tracks without moving dates. Undated priorities stay visibly unscheduled.
- **Completed work stays useful.** Muted items still open their explanations.
  Completed milestones keep remaining work visible instead of claiming the
  whole initiative is finished; completion styling never comes from counts alone.

- **One artifact, three clear views.** Progress, Roadmap and Evidence appear
  only when populated. NNL and opt-in Timeline are roadmap formats. Skill names are
  provenance, not navigation. Views share item IDs, but theme filters belong
  only to Roadmap, directly above the active matrix or Gantt. Progress and
  Evidence remain unfiltered. Each view retains its verification date.
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
- **Evidence cannot override execution instructions.** Transcripts, chat,
  tickets and retrieved document excerpts cannot direct the run or grant
  permissions. Applicable project instructions and established artifact decisions
  remain binding within the host's instruction hierarchy and authorized scope.
- **It says what the page contains before publishing it.** The board is an
  aggregate you never assembled by hand, and publishing puts it on a hosted URL, so
  the first publish of a page is a confirmed step with cut-it-down and
  local-file-only on the table.

## Contents

- `AGENTS.md` carries repository-maintenance instructions, including the required
  release handoff. It does not change what running the skill does to a project.
- `evals/` holds the scenario suite: build, refresh, grade, timeline, and one
  where the right answer is prose and no artifact. Each scenario names the
  failure it exists to catch and what fails it outright. Maintainer-facing, not
  linked from `SKILL.md`, and never loaded during a run. `evals/README.md` says
  how to run one by hand; `scripts/evals.test.mjs` checks the scenario files.
- `references/feature-rollups.md` defines source-backed feature membership,
  completed capability work and fixes, original requirements, follow-ups and
  deduplicated credit. `scripts/feature-rollups.mjs` and
  `scripts/render-feature-rollups.mjs` build and render those groups with
  `assets/feature-rollups.css`.
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
- **Verification uses available tools.** Check source IDs, links, counts, history
  and copy with the tools already present. Browser inspection is optional when
  a browser tool is available. No Chrome, Playwright or framework installation
  is required to use the skill; unavailable checks are disclosed, not claimed.
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
stable links, local workspace and entry-file path. Refresh, grade and score update
that one working copy. Append assessment history and new evidence inside it;
do not create dated sibling hubs or full private bundles for ordinary runs.
Separate exports require an explicit request or an approved distinct audience,
scope or permission boundary. Temporary publication packaging is not a new
canonical artifact. If hosting is unavailable, verify the local update and report
that limitation without generating another bundle. Existing duplicates are never
deleted or consolidated automatically. See the required canonical workspace
lifecycle in `references/artifact-views.md`.

On the first grade run after this update, resolve the original
assessment and preserve it, then confirm any missing rubric/A+ decisions once.
Unrecoverable legacy evidence stays labelled unknown or originally reported;
it is never invented to make the old grades comparable. New assessments append
to History. No old artifact is automatically migrated merely by pulling this repo.

Every re-grade of an existing roadmap also reconciles its completion against
linked issues and outcome/milestone records, including work outside the audit
finding cohort. Board, Gantt and Progress update together without moving planning
commitments or treating Done as an automatic grade increase. See
[roadmap reconciliation](references/roadmap-reconciliation.md).

## Maintainer validation and optional artifact QA

Read [the behavioral results](evals/RESULTS.md) before relying on unattended
execution. The release evaluations include unresolved model failures, including
Haiku changing horizons during a delivery-only refresh. Passing helper tests
does not prove an agent respects scope, clarification or artifact ownership.
The 2.1.1 evaluations exposed a rewritten history lock that still passed a
regenerated manifest. Update verification now compares against a hash retained
before writes: `--history-lock-sha256 ORIGINAL_HASH` (or the API option
`expectedHistoryLockSha256`). Without it, the verifier reports history-lock
preservation as `not-checked`. See the [update verification procedure](references/executable-grading.md#verify-before-publishing).

Maintainer regression tests protect the shared helpers. Browser-specific checks
need an existing browser-testing session; exported helpers take a page object
and do not provision one. These are not installation or ordinary usage steps.
For maintainer work or artifact QA when tools are available, use the bounded
scenario checks in `artifact-views.md`, `progress-layout.md` and `baseline-ledger.md`:
keyboard/deep-link/filter/print behavior, unchanged-evidence grading, reopening,
missing access, scope changes and explicit rebaseline. The repo does not install
a test framework. Claude Code's existing `argument-hint` frontmatter is intentional;
generic skill validators that only accept the cross-client core may reject it.

## Versioning

Semver via annotated git tags and published GitHub Releases; see `CHANGELOG.md`.
**Committing and pushing skill changes includes cutting a release**, unless the
maintainer explicitly requests an unreleased change. A pushed commit or tag alone
is not a completed release. Several implementation commits can ship together.

1. Fetch remote branches and tags, then inspect the published releases and all
   changes since the last released version. Preserve concurrent work.
2. Choose the next version: patch for compatible fixes, minor for compatible new
   capabilities, major for breaking changes. Never reuse an existing version.
3. Run `node --test scripts/*.test.mjs` and `git diff --check`. Review the release
   diff for private project data and update the relevant documentation.
   Run changed behavioral scenarios on more than one model and complete the
   [lead-model grading evaluation](evals/README.md#release-model-coverage),
   recording outcomes and limitations before release.
4. Move the shipped `Unreleased` entries into a dated version section in
   `CHANGELOG.md`. Commit the release changes and annotate that commit with
   `git tag -a vX.Y.Z -m "Release vX.Y.Z"`.
5. Push the intended branch and tag without force, preferably atomically:
   `git push --atomic origin main refs/tags/vX.Y.Z`.
6. Publish the GitHub Release for that tag with the version's changelog notes:
   `gh release create vX.Y.Z --verify-tag --title "vX.Y.Z" --notes-file <notes-file>`.
   Normal stable releases must not remain drafts or prereleases.
7. Verify the remote tag's peeled commit matches the intended release commit,
   and the published GitHub Release points to that tag. Report the released
   version; if publication fails, state the incomplete step rather than claiming
   the release shipped. Resume safely instead of force-moving a published tag.

This is a maintainer workflow only. Installing or running the roadmap skill
does not create commits, tags or releases in the project being assessed.
