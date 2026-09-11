# Unresolved choices are prompts, not omissions

Read when a run detects a condition it is forbidden to act on unilaterally.
Several rules in this skill forbid acting on the driver's behalf: never move a
horizon, never re-score, never rebaseline, never grade an ungraded roadmap.
Every one is correct about the ACTION and silent about the CHOICE, and that is
the failure mode.

A run that quietly does none of them, four times, reads to the driver as a skill
that has stopped doing what they asked. The evidence footnote recording what was
skipped is not a substitute: nobody reads a table to discover that the thing
they wanted did not happen. This was observed on a real hub, where one
regeneration declined a regrade, a re-score, a horizon move and a rebaseline,
and recorded all four only in Evidence.

**The rule: uncertainty surfaces as a question, never as an omission.**

The forbidden action stays forbidden without an answer. What changes is that the
driver is asked rather than told afterwards.

## The decision points

Apply `execution-contract.md` first. When an unresolved condition is detected,
ask with the host's question tool or plain conversation. Batch known questions,
including source questions, without postponing a decision until after its work.

| Condition detected | Prompt the driver with |
|---|---|
| It is unclear whether a requested refresh or regeneration includes a new assessment | Keep the dated letters / regrade now / regrade named components only |
| Evidence moved under a confirmed score, or a scored item's remaining work changed materially | Re-score these rows / keep the confirmed scores / re-score the whole sheet |
| An item's cited work closed, reopened, or its stated gate cleared, while its horizon stayed put | Move it / keep it and record why / defer to the next run |
| The instrument, scope or component set changed enough that the frozen baseline no longer describes what is being measured | Rebaseline with approval / keep the baseline and mark the discontinuity |
| A source the driver ranked record-tier could not be read | Proceed and name the gap / stop until it is reachable |

## How to write the prompt

**State the concrete finding, not the abstract choice.** Name the item, the
tickets, and what changed under them.

- A prompt: *"Five WSJF rows are stale. `hardening` had seven of nine refs close
  since the score was confirmed, so its size 8 no longer describes the remaining
  work."*
- Not a prompt: *"Would you like to re-score?"*

Offer the conservative option first and make it a real option, because holding
is frequently the right answer. A prompt that presents holding as the timid
choice is a leading question, not a decision.

## Keep questions bounded

- **Batch known questions.** Ask again if new material uncertainty appears or an
  answer leaves a required choice unresolved. Never repeat an answered question.
- **Only on a detected condition.** No condition, no prompt. Never ask
  speculatively, and never ask about something the DIRECTION CONTRACT already
  records as settled.
- A clear grade request or assessed refresh already authorizes its resolved
  assessment scope. Do not ask again because a panel has not run yet, or because
  letters held after reassessment. A presentation-only request reuses observations.
- **A recorded answer is inherited, not re-asked.** Write the decision into the
  contract and the workspace. Later runs read it rather than asking again. A
  skill that re-asks a settled question is as broken as one that never asks.

## When the driver cannot be reached

On an unattended or scheduled run, preserve the current state and report every
pending choice at the **top** of the summary. No response is not a recorded
choice to keep, regrade or publish. Continue only independent authorized work;
keep dependent work pending until the driver answers.
