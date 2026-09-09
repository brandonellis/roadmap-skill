# Reconcile roadmap delivery on every re-grade

Read for `grade`/`score`, `refresh` and updates to an existing roadmap. A new
grade with old roadmap completion is an incomplete update. Reconcile delivery
in the same artifact revision, not an offer to run another skill afterward.
A grade-only artifact with no roadmap records that fact; it does not invent one.

## Read the whole roadmap, not just the audit cohort

1. Read the current canonical artifact and its previous completion observations.
   Inventory every unique roadmap item, including previously completed work,
   stable IDs, original outcome/acceptance, linked issues, project or milestone
   records, and source authority. Board and Gantt are representations, not two
   sets of work. The initial audit finding cohort is only one source of links.
2. Read current states for all mapped issues and the original required subtasks,
   not just issues completed since the last assessment. Finish pagination and
   retain source IDs, titles, URLs, observed timestamps, completion timestamps
   where available, and the tracker's actual status types. Check reopened work
   too. An incremental query requires a complete retained snapshot; missing
   records are unknown, not open, closed or deleted by assumption.
3. Check the roadmap's own outcome or milestone completion records. A roadmap
   item can be complete without a matching audit finding or issue. Conversely,
   a Done issue need not satisfy the whole roadmap outcome. Look for completed
   work outside existing links in the relevant project/milestone sources. Use
   confirmed relationships to map it, not title similarity alone; list unmatched
   completed work as delivery with a mapping gap rather than discarding it.
4. Compare against the previous observation using stable IDs. Identify completed,
   partially completed, reopened, unchanged and not-checked items. Distinguish
   newly completed from completion first discovered this run. If previous states
   are absent, show current totals and say the change is unavailable. Work done
   before the baseline remains done; it is not a new win in every assessment.

## Credit the work at the level the evidence supports

Keep separate fields for reported roadmap completion, linked-ticket progress,
verified outcome delivery, implementation/deployment stage and grading impact.
One generic `done` flag cannot answer all of those questions.

- **Completed according to the roadmap/tracker:** credit the authoritative
  completion record with its source and date. Lack of runtime proof does not
  erase that recorded progress. Label it `Marked complete`, not `Live verified`.
- **Verified delivered:** the original outcome and its required acceptance are
  evidenced for the stated scope. Name code, staging or production explicitly.
  A new follow-up does not retroactively make a completed original outcome
  partial; show the follow-up separately unless a regression invalidates it.
- **Partial:** name the completed portion and the remaining original requirement
  with ticket references or acceptance evidence. One completed child cannot
  close an entire theme. A closed parent with unmet original child requirements
  is a discrepancy to explain, not automatic delivery.
- **Not checked:** retain the dated last-known observation and the reason access
  or mapping is missing. Do not silently carry it forward as current proof or
  change it to zero progress. An incomplete source read limits freshness claims,
  not the ability to produce a clearly labelled artifact.

Ticket progress is a deduplicated count of the declared linked work, not effort,
business impact or an outcome-completion percentage. Show canceled/duplicate
exclusions and any denominator change; neither is a completed original finding.
Do not remove a still-required acceptance condition merely because its ticket
was canceled. Resolve duplicate aliases to one canonical issue. Added follow-ups
stay separate from original scope unless a scope change is explicitly approved.

## Update every representation in the same pass

Store dated `roadmapCompletionObservations` in the shared model with item ID,
previous observation reference, linked issue states, outcome/acceptance sources,
completed work, remaining work, reported completion, verification scope, grade
criterion links and unresolved gaps. Preserve old observations and assessments;
do not retrofit data into the original baseline or enlarge its denominator.

Use that observation set for Now/Next/Later, Gantt and Progress. Put a concise
completion badge or linked-ticket count on each existing item, and surface
meaningful delivered outcomes even when its component letter holds. Keep ticket
lists and the completed/remaining breakdown in the item's existing drill-down.
Do not redesign the artifact merely to add a completion lane. Completed items
remain accessible with their proof rather than disappearing from the roadmap.

Inventory the actual visual structures before regeneration: stream-by-horizon
matrix, dependency/critical-path figure, Gantt and their detail targets. Update
their shared records without replacing a matrix with card lists or omitting the
dependency figure. Dependency nodes may gain dated status notes; do not invent
edges or remove a completed prerequisite merely to make the path look shorter.

Preserve horizons, owners, priorities and original Gantt windows. Completion
annotations may change without moving a bar or committing a new date. Label a
source's actual completion date separately from the date it was observed; an
inherited historical Gantt keeps its planning stamp and gets a separate current
completion stamp. Update only the coverage actually checked, with gaps named.

For each meaningful completed outcome, explain its grading relationship:
confirmed criteria now verified; an unchanged limiting criterion; implementation
awaiting deployment/verification; outside the frozen grading contract; or no
confirmed mapping. A roadmap status never supplies a criterion pass by itself.
Use the assessment's evidence to evaluate mapped criteria, not ticket volume.
A `refresh` also reassesses relevant criteria when the artifact already contains
an assessment, following `refresh-reassessment.md`. Do not stop at tracker
reconciliation when affected grading evidence can be checked. New letters still
require the approved contract and complete evidence for their scope.

## Before calling the update complete

- Every existing roadmap item is reconciled or explicitly marked not checked.
- Board, Gantt and Progress agree on item status, counts, proof and freshness.
- Completed issues outside the audit cohort and completed roadmap outcomes are
  represented; unmatched work and source-access gaps are visible.
- Partial items name finished and unfinished original acceptance. Reopenings and
  scope changes are not hidden in a smaller denominator.
- Delivered outcomes stay visible when grades hold, with the actual reason.
- Old assessments, baseline IDs and planning commitments are unchanged.

These are source/data checks, not a requirement to install or run browser tests.
