# Evaluation runs

One section per run. A run is a date, a model, a scenario and what happened —
never a summary that outlives the evidence.

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
