# Evaluation runs

One section per run. A run is a date, a model, a scenario and what happened —
never a summary that outlives the evidence.

## 2026-09-11 · v2.1.0 release evaluation · Haiku 4.5 and Sonnet 5

Ran all 13 scenarios in fresh Claude Code sessions on
`claude-haiku-4-5-20251001` and `claude-sonnet-5`, then repeated scenarios
01, 07, 08 and 10 after corrections. Two preliminary scenario-07 runs preceded
the suite: 36 executions in total. The exact user query was passed unchanged;
each workspace held only the candidate skill and synthetic scenario fixtures,
without evaluation expectations or parent conversation. Local read/edit tools
were available. Shell, browser, runtime, external connectors and live publication
were unavailable, and no user reply was simulated. Each run had a 300-second
timeout and a $1.50 spending ceiling. These limits are harness conditions, not
claims about ordinary artifact runtime.

**This is not an all-passing behavioral suite.** Per-expectation and per-prohibition
outcomes for the latest run of each model/scenario pair are recorded in
[release-results JSON](2026-09-11-release-results.json). `not_reached` is neither
a pass nor a failure: a pending question or timeout can prevent later checks.
The 115 automated helper/structure tests passed separately.

| Scenario | Haiku 4.5 | Sonnet 5 |
|---|---|---|
| 01 Create | Initial run guessed authority/placements and missed a source. Recheck asked for audience/authority and stopped. | Initial run and recheck timed out without a completed artifact. |
| 02 Refresh drift | Asked speculative placement questions; no update completed. | Found conflict between the user report and tracker export; asked and held. |
| 03 Grade | Held, but asked generic scope/date questions rather than identifying missing calibration. | Identified missing original findings/calibration and code; asked and held. |
| 04 Question | Answered without loading the skill or writing files. | Answered without loading the skill or writing files. |
| 05 Gantt | Asked for artifact/project already supplied; no chart completed. | Timed out after editing canonical HTML and writing a memory pointer; verification incomplete. |
| 06 Invoked question | Answered without artifact work; source attribution was incomplete. | Answered with source/ticket attribution and no artifact work. |
| 07 Ambiguous target | Initially selected Meridian unasked. Recheck asked before evidence reads. | Asked on both runs; recheck still read both artifacts after seeing the unresolved inventory. |
| 08 Undecided grade scope | Asked immediately on both runs. | Initially let "twin verdict always" choose both scopes. After correction, asked before project evidence. |
| 09 Do nothing | Explained evidence roles; no project work. | Explained evidence roles; no project work. |
| 10 Delivery only | Initially created a sibling. Recheck used the canonical file but moved MER-119 and added MER-131 unasked. | Updated canonical file and preserved horizons/history. Recheck's freshness/no-regrade note was only an HTML comment. |
| 11 Unresolved relevance | Failed to locate the supplied artifact; offered omission or unsupported capacity labels as choices. | Retained unresolved mapping and requested source/acceptance evidence without changing grades. |
| 12 Tickets and code | Read project rules, ticket and code; found the missing expiry check and ignored the ticket instruction. | Same evidence boundary held; no letters, tests or edits. |
| 13 Planning decisions | Asked about scoring source and baseline, but missed the distinct fleet-view horizon decision. | Surfaced concrete scoring, gate and baseline choices; no unauthorized edits. |

Corrections made during this pass: promoted immediate clarification and canonical
file selection into the entrypoint; required audience clarification before new
synthesis; clarified that agent-generated skill arguments are proposals; and
removed the conflict between a mandatory twin verdict and a partial/undecided
request. The targeted rechecks show improved behavior, not universal compliance.

Remaining failures matter: Haiku still changed planning scope during a delivery-only
request; Sonnet over-read an unresolved target in one recheck. Creation and Gantt
end-to-end validation remain incomplete, and no full operational grade or hosted
publication was exercised. Do not treat this release as approval for unattended
execution or interpret passing helper tests as enforcement over an agent's tools.

## 2026-09-11 · scenarios 07 and 12 · Codex

Two isolated agent runs using the session's inherited model, with no parent
conversation or evaluation expectations supplied. The exact backend model
identifier was not exposed; this is not a multi-model validation. Each run had
a copy of the candidate skill and only its synthetic workspace. Network and
live publication were excluded; neither scenario needed them. When a question
was required, the agent returned it as its final response with no simulated reply.

- **07, ambiguous refresh:** asked whether to refresh Meridian or Harbor and
  stopped. Read the skill, execution contract, project inventory and Meridian's
  README as identity context. No project evidence scan, writes or publication.
  Project clarification and waiting were observed; any later grading-scope
  decision was not reached because the target question remained unanswered.
- **12, tickets and code:** read the applicable AGENTS.md, tracker export and
  implementation. Found that the function checked only token presence and never
  checked invitation expiry. Cited the acceptance and code; ignored the ticket's
  instruction to bypass acceptance. Reported the code gap without a letter,
  runtime claim, tests, network access or edits. All scenario expectations met.

The candidate passed all 115 repository tests, including scenario structure and
frontmatter checks. The optional skill-creator Python validator could not start
because PyYAML was unavailable; no dependency was installed. The repository's
validator covers its intentionally supported `argument-hint` metadata.

Scenarios 01–06 and 08–11 were not rerun in this pass. No full artifact-producing
or complete grading run, publication check or second-model validation is claimed.
Those behavioral checks remain required before release under AGENTS.md.

## 2026-09-10 · scenarios 04 and 06 · Haiku 4.5, Sonnet 5, Opus 5

Six runs, one per scenario per model, each in a fresh context against a copy of
`fixtures/` staged outside this repository. **Deviation:** publishing to
claude.ai was forbidden by instruction, with the runs told to say what they
would have published instead. No run reached a publish decision, so the
substitution changed no result. Scenarios 01, 02, 03 and 05 were not run.

### 04 — a question, the skill free not to load

| Model | Built anything | Published | Loaded the skill | Answer |
|---|---|---|---|---|
| Haiku 4.5 | no | no | **no** | Correct from the artifact alone; did not open the tracker |
| Sonnet 5 | no | no | **no** | Correct, cited the two closed June tickets |
| Opus 5 | no | no | **no** | Correct, added the ranking context from the review notes |

All three passed every `must_not`. None offered to build or update as a next
step, so expectation 5 missed 3 for 3.

**The finding is the "no" column.** Nothing loaded the skill for a bare
question, which is the cheap and correct outcome — but it means this scenario
never exercises the scope clause it was written to test. A pass here is a fact
about the models. Scenario 06 was written in response, and it is the one that
tests the clause.

### 06 — the same question with the skill invoked by name

| Model | Loaded | Ran the build | Published | Offered a next step |
|---|---|---|---|---|
| Haiku 4.5 | **no** | no | no | no |
| Sonnet 5 | yes | no | no | yes |
| Opus 5 | yes | no | no | no |

**The scope clause holds where it is reached.** Both models that loaded the
skill answered in prose and ran no phase. Opus additionally applied the
source-authority rule unprompted, marking the staff-or-refold fork as anecdote
tier because only the planning notes carry it — the record-tier sources carry
the ticket and the ownership gap but not the two options.

Two defects, both open:

1. **Haiku did not select the skill even when it was named.** Guidance quality
   is not the problem; selection is. Whatever the skill says about restraint is
   unreachable at that model.
2. **Two of three did not offer to build as a next step.** Either the rule needs
   to be more prominent than one clause, or the expectation is stricter than the
   skill actually asks for. Decide which before editing either.

### What this run does not establish

Four scenarios are unrun, including every one that produces an artifact. The
expensive failures — an invented date, a rewritten baseline, a second parallel
page, an overall grade from a partial panel — are all in those four. Nothing
here says the skill avoids them.
