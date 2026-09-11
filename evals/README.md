# Evaluations

Maintainer-facing. Not loaded when the skill runs, and deliberately not linked
from `SKILL.md`: a scenario file read mid-run is context spent on a rehearsal of
the thing being done.

Each `*.eval.json` follows the published evaluation shape (`skills`, `query`,
`files`, `expected_behavior`) plus two fields this skill needs:

- **`gap`** — what a model does WITHOUT the skill. An evaluation that passes
  identically with and without the skill measures the model, not the skill, so
  every scenario here names the failure it exists to catch.
- **`must_not`** — behaviors that fail the scenario however good the rest is.
  Most of this skill's value is restraint: no invented dates, no second
  artifact, no rewritten baseline, no build in answer to a question.

## Running one

There is no built-in runner, by design of the format. Run a scenario by hand:

1. Start a session with the skill available and no memory of this repository.
2. Copy `fixtures/` somewhere outside the skill directory so the run cannot read
   the evaluation that grades it, and open that copy as the working directory.
3. Paste the `query` verbatim. Supply nothing else — a hint given by hand is the
   thing being tested.
4. Grade each `expected_behavior` and `must_not` line as met, missed or not
   reached. A missed line is a skill defect until proven a model defect: rerun
   it on another model before editing the skill.

`node --test scripts/evals.test.mjs` checks the scenario files themselves — the
shape, the fixtures they name, the model-independence of `gap`, and that the
fixtures stay synthetic. It cannot tell you whether the skill passes them.

## The fixture

`fixtures/meridian/` is an invented freight-telemetry project: two planning
documents that disagree in the usual way (a decided architecture memo, an
undecided set of review notes), a tracker export with **no target dates on any
open issue**, two Done tickets, and three deliberately undecided questions.
`fixtures/prior-artifact.html` is a trimmed prior page carrying a direction
contract, a permanent baseline and one dated observation, for the modes that
must update rather than rebuild.

Nothing in the fixture describes a real company, product or person, and nothing
from any user's project belongs here.

`fixtures/projects.json` and `harbor-artifact.html` add a second project with no
selected target. `fixtures/ticket-code/` pairs a Done ticket with code that fails
its acceptance, applicable repository instructions and an untrusted instruction
inside the ticket. These exercise scope clarification and the evidence boundary.

Scenarios 07–12 cover ambiguous project selection, uncertain grading scope,
explicit no-action, delivery-only scope, unresolved relevance and ticket/code
disagreement. Scenario 03 deliberately lacks a recoverable grading method: its
expected outcome is a clarification request, not a completed assessment.
Scenario 13 exercises unresolved WSJF, horizon and baseline-scope decisions.
The fresh-build case allows further clarification as new gaps emerge; question
cases do not require an unsolicited offer to create an artifact.
Question scenarios stop at the question when no answer is supplied; do not invent
an answer to make the run complete. The automated suite validates scenario files,
not these behavioral outcomes. Record any tool or model limitations in RESULTS.
