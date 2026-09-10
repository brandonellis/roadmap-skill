# A roadmap that shows progress

The artifact is a stakeholder communication tool, not an audit transcript.
Celebrate demonstrated progress, connect it to the system's direction and make
the next decision clear. Evidence earns the story; it need not dominate the page.
Read with `artifact-views.md` on every creation or update.

For an existing assessment, strengthen the story before adding more charts:
three to five verified outcomes, then original-cohort progress, then concise
next-proof checklists behind component grades. Ticket-volume bars are supporting
activity evidence, not the headline. `executable-grading.md` provides reusable
renderers and comparison rules. An unavailable previous finding-state snapshot
must say so; use latest verified wins, not a fabricated since-last-run delta.

Separate delivery volume, the fixed original finding cohort and last assessed
readiness visually and in their labels. A referenced-ticket fraction is not
another readiness score. Keep it in supporting detail, and put the assessment
date/ref and any later ungraded reconciliation beside the letters. See
`progress-layout.md` for the reusable composition. A reader should understand
what improved without first opening an audit or decoding engineering terms.

Theme colors are controls as well as a legend. Preserve clickable colored theme
buttons and linked item tags across board and Gantt views. See `artifact-views.md`
for the shared state and browser regression check; simplifying the layout must
not turn those controls into static labels.

Do not show anonymous open/partial counts. Each count reveals the ticket IDs and
titles; each partial finding explains what is verified and which original
acceptance remains. Place brief reasons beside the cohort visual and keep the
full requirement/evidence breakdown one click away. Tracker Done and verified
closure can disagree; label the discrepancy rather than hiding the work.

Let completed work visually recede without disappearing. Use the shared muted
completion treatment from `artifact-views.md`, with working explanation links.
For a completed core milestone, retain a visible follow-ups-remain label rather
than presenting the whole initiative as finished. Partial ticket counts alone
do not qualify an initiative for completion styling.

On every re-grade, reconcile the roadmap itself using
`roadmap-reconciliation.md`. A count of closed audit findings or recent Done
issues does not update roadmap outcomes. Show which roadmap items are completed,
which have advanced and what remains, with the same states in board and Gantt.
Credit completed work outside the grading cohort without inflating the grade.

## Contents

- Inherit the original brief
- Four different kinds of progress
- Compose visually, explain on demand
- Acceptance checks

## Inherit the original brief

Audience, purpose, disclosure boundary, desired decision, horizon, visual
direction and requested views are creation-time decisions. Persist them as
`artifactBrief` in the direction contract with their confirmation source.
Every mode inherits that brief. Grade mode does not switch the audience to
engineering, and an update does not choose a new executive default.

Resolve the existing artifact, saved brief, original creation answers and memory
before asking anything. Never re-ask settled questions. Migrate recovered choices
with their source; do not call inferred values user-confirmed. If a lost choice
materially affects sharing safety, ask only for that missing choice.

Adapt to the established audience, without automatically building every edition:

| Audience | Lead with | Keep in referenced detail |
|---|---|---|
| Investor | Demonstrated capabilities, traction evidence, strategic milestones, risks to the thesis | Internal tickets, service identities, implementation narrative |
| Executive team | Outcomes delivered, progress against plan, next commitments, decisions and material risks | Component findings, test logs, rubric mechanics |
| Company | What changed for teams/customers, wins, next work and dependencies | Audit mechanics, restricted customer or security detail |

Separate audiences may require separate allowlisted exports of the same model.
Hidden tabs and client-side filters are not permission boundaries. Never embed
restricted evidence in an external edition, even collapsed. Do not republish or
broaden sharing merely because an audience name is in the brief.

## Four different kinds of progress

Keep these measures distinct, labelled and source-linked:

1. **Work completed:** unique tracker items currently Done within an explicit
   completion window. Use completion timestamps, not just updates; finish
   pagination and disclose exclusions. Not effort, deployment or impact.
2. **Roadmap outcomes completed:** current source-backed completion of the whole
   roadmap, with original acceptance, reported completion and verified delivery
   distinguished. Not limited to the audit cohort or recent ticket window.
3. **Original findings addressed:** the fixed baseline cohort's tracker status
   and, separately, verified closures. A recoverable ticketed subset is labelled
   a subset, never substituted for the entire assessment inventory.
4. **Operational readiness:** evidence against the frozen grading contract,
   scoped to code or a named environment. Done does not automatically raise it.

A flat or unavailable grade must not erase measured delivery. Name the actual
reason: unchanged limiting criterion, unverified deployment, insufficient proof,
or no reassessment performed. No reassessment does not mean no progress.
Never invent scores, revenue, customer impact or forecasts to improve the story.

## Compose visually, explain on demand

Lead with one evidence-backed progress statement, meaningful wins and the
forward plan. Keep delivery counts and the original-cohort comparison as
supporting context rather than competing headline metrics. Follow
`stakeholder-hierarchy.md` for the three-view composition. Methods, repeated caveats, revision
tables and full audit reports belong in Evidence.

For a combined roadmap, the roadmap is the primary landing view. Put its board
or Gantt and a compact visual scorecard in the foreground; delivery progress is
an adjacent view or concise supporting visual. A grade-only invocation can lead
with its scorecard, but adding audit data must not turn a roadmap into an audit.
Descriptions explain the figures, never displace them. Full audit detail is a
deliberate secondary drill-down, not a default-open section.

Keep letter grades visually legible. A last-recorded grade may remain visible
with its date, original scope and `Not reassessed` label. Never call it a current
verified result, relabel a blended grade as one environment, or draw a trend
across incompatible instruments. Unknown current coverage need not replace
every known historical letter with a page of blank states.

Each visual links to source records. Each win names the change, intended benefit,
actual delivery stage and proof. Tracker-only evidence says `Marked Done`, not
`Live` or `Impact measured`. Reuse the evidence across editions while adapting
its prominence and vocabulary.

Inventory existing visuals before changing layout: Gantt, NNL, architecture,
progress charts, legends and drill-down anchors. A layout rebuild must not remove
one because a newer source omits its data. Recover the original source and retain
its dates/assumptions, or name the recovery gap. Replacing charts with paragraphs
about charts is not an improvement.

For inherited Gantts, follow `gantt.md`: retain source-stated windows and label
old scenarios. No silent conversion to all-unscheduled, invented dates or fresh
Today line over unrefreshed evidence.

## Acceptance checks

- Readers see what improved, where the roadmap goes and the next decision
  without opening an audit. Figures agree with the source ID sets.
- Completed work outside the baseline counts in delivery, not baseline closure.
  Done-but-unverified baseline work earns delivery credit, not A+.
- Repeated runs retain the original brief without re-asking audience.
- Existing charts survive migration; scenario bars remain distinct.
- Charts have readable labels and evidence links. Filters cannot change the
  baseline denominator or overall grade.
- External exports contain only their allowlisted payload, not hidden private
  data. The invoked skill mode never selects a different audience.
