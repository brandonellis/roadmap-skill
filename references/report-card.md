# Grade mode — the report card

A letter-graded, evidence-cited audit of a project's code and infrastructure at
a moment in time (proven in production use — provenance only, not a
dependency). The report card answers three questions a roadmap never does: how
good is this, compared to when, and does anything found block the decision at
hand. It is shape-agnostic: a single service, a monorepo, or a many-repo
estate all grade the same way once carved into components.

## When it runs, and what it is

Run it before a consequential moment: a deploy, a funding conversation, a
quarter close, or right after a remediation program lands. Each run produces a
**dated record, never a living page** — a NEW artifact every time, never a
republish of a prior card. The chain of cards IS the trend line; updating an
old card in place would destroy the baseline the next run compares against.
This is the opposite of the horizons page's update-in-place rule, on purpose.

**Baseline resolution.** Bare `grade` finds the baseline itself: the newest
prior card recorded in project memory, or failing that the artifact list. An
explicit `grade <baseline-card-url>` overrides it (comparing against an older
card is legitimate — "since the funding round" is a different question than
"since last month"). A first run has no baseline and says so; it becomes one.
**Every card links its predecessor in the footer**, so the chain is walkable
from any card without the memory file.

**Components come from the project, not from this file.** A component is a
unit someone could own and grade in isolation: a repo in a multi-repo org, a
service or major module inside a monorepo, the infrastructure/estate, a
mobile app beside its backend. Discover them from the project's own structure
(workspace layout, tracker, docs) the same way Phase 1 discovers sources —
never assume a shape. **Scale the fan-out to the component count**: a
many-component estate wants an auditor per component; a single-service
project wants two or three (the code, the estate if one exists, and always
the cross-cutting lens). One auditor grading everything is not a panel —
below two components, question whether the mode fits at all.

## The auditor fan-out

One auditor agent per component, plus at least one cross-cutting lens that no
single component owns (testing & CI is the proven one; security or data
governance fit the same slot). Rules that make the grades trustworthy:

- **Read-only.** Auditors grade; they never fix. Cheap read commands (grep,
  wc, ls) are fine; running test suites or writing files is not.
- **Blind against the baseline.** Auditors never see prior grades — an
  anchored grader reproduces the anchor. Tell them a program happened so they
  audit current state, not history; the before/after comparison happens in
  synthesis only.
- **Evidence-cited.** Every grade carries 3-5 bullets citing file and line.
  A grade without a citation is an opinion; the report ships facts.
- **Tough, fair bar, stated in the prompt:** an A means you would show this
  to an outside CTO without caveats. Grades cluster honest at B when the bar
  is explicit; without it they cluster flattering at A-.

**What every auditor prompt carries** (each ingredient earned its place by
being load-bearing in a real run):
1. The component's path and "audit exactly what is there now".
2. What recently landed there, named — so the auditor verifies current state
   instead of narrating history, and cannot grade the program's reputation.
3. The dimension list with any component-specific relabeling.
4. The output shape: letter + 3-5 cited evidence bullets + gaps-to-next-grade
   per dimension, then an overall letter with a one-paragraph justification.
5. The bar, verbatim.
6. The read-only rule, including "no test runs" — a suite run is an hour of
   wall clock and proves nothing a green CI badge doesn't already.
7. For estate-touching components: the as-written vs applied distinction,
   and instructions to grade both honestly.

## The dimensions

Default five, per component: **Architecture · Performance & efficiency · Code
quality & conventions · Testing · Security & operational readiness.** Adapt
labels to the component (an infrastructure component grades IaC coverage, DR,
observability instead), but keep the count near five and keep them identical
across runs — the matrix only reads as a trend if the columns hold still.

Every dimension gets the letter, the evidence, AND **the gaps to the next
grade up** — the burn-down list is the actionable half of the report, and it
should name tickets where they exist (file the missing ones before
publishing, so the card cites live refs, not intentions).

## The twin verdict (the load-bearing idea)

One grade lies. Two tell the truth:

1. **As written** — the code and configuration on the default branch.
2. **Operational reality** — what is actually deployed, applied, installed,
   and able to page a human today.

This is the measured-vs-attested rule applied to estates: merged-but-not-
deployed work is an **activation gap, not absence**, and it must be graded as
both (credit in "as written", debit in "operational reality"). A project can
honestly hold a B+ and a C at the same time; hiding either number is how a
team believes its own merge history instead of its production posture.

When the run gates a decision, add the third verdict cell: the **gate answer**
(GO / HOLD, with the sequencing cautions enumerated). A report card that
gates nothing still ships the first two.

## Counts are grades

Shrink-only lists (file-size pins, allowlists, quarantines, suppressed-error
baselines) are the honest quality metric: report their sizes and their
direction, both. "87 → 80, shrink-only, CI-enforced" is a grade in itself.
A debt that moved from unmeasured to pinned deserves explicit credit in the
"what changed" prose even when the letter does not move — the composition of
a grade changing is often the entire story of a program.

## Page anatomy

Masthead (project · occasion · date · method one-liner) → **verdict band**
(as-written / operational / gate) → **grade board** (components × dimensions
matrix, letter chips) → **what changed since the baseline** (prose, the
composition argument) → **per-component verdict cards** (grade, one-paragraph
verdict, "to next grade" burn-downs, "watch" items) → **new findings** (only
things the project did not already know, severity-tagged, tickets filed and
cited) → **the gate, answered** (ordered checklist when gating) → **path to
the next letter** → methodology footer (auditor count, blind rule, bar,
baseline named, what could NOT be verified and why) → stamp.

The "new findings" section earns the run even when the letter holds: a
re-grade that surfaces nothing the team didn't know was run too soon.

## Visual and prose rules

- Hue encodes the **grade tier and nothing else** (A greens, B blues, C
  ambers, D/F red). Do not reuse the horizons throughline palette — the two
  pages encode different things and must not look like siblings.
- The readiness type register and the writing floor
  (`references/writing-floor.md`) apply in full: zero em dashes, grep-gated;
  no disguised assertions — "could not be verified this session (auth
  expired)" is honest, "is applied" without checking is not.
- Static page; no interaction layer needed. Both themes via tokens.

## Synthesis rules

- The overall letter is judgment, not arithmetic — but it must be defensible
  against the per-component letters, and inflation is the failure mode. If
  most components grade B+, the project is B+ regardless of how good the
  trajectory feels; put the trajectory in the prose.
- **Letter-move accounting.** A letter that moved since the baseline gets one
  sentence naming what earned or lost it — never just the new letter. A
  letter that HELD gets the composition story ("same letter, different
  substance") when the substance changed; a program can succeed completely
  without moving a letter, and the prose is where that shows.
- **The outlier rule.** A letter that does not follow from its own evidence
  bullets goes back to its auditor with the question, or ships with the
  tension noted — the synthesizer never silently adjusts a grade. Adjusted
  grades are the fastest way to make the next blind run worthless.
- Name what the auditors could not reach (expired credentials, unreachable
  estates) in the footer as first-class findings.
- Record the card's URL in project memory as a dated pointer next to the
  baseline's, and note the next natural re-grade trigger.
- **The roadmap-drift handoff.** A grade run almost always moves roadmap
  themes: programs complete, findings become tickets, gaps become work. End
  the run by diffing the card's findings against the horizons page's claims
  and offering the refresh — the two artifacts describing different worlds
  is the staleness failure both exist to prevent.
