# Refresh includes relevant reassessment

A refresh of an assessed artifact reconciles delivery and asks whether the
changed evidence affects its grading criteria. Do this in the same run, not as
an optional follow-up after leaving a stale scorecard in place. Preserve the
artifact's audience, baseline, immutable history and planning decisions.

## Decide what needs checking

1. Read the original baseline, previous assessment, criterion/finding links and
   complete delivery reconciliation. Include changes outside the original
   finding cohort. Relevant changes can improve or lower readiness.
2. Match changed issues, verified outcomes and source changes to existing
   finding requirements or criterion IDs. Use confirmed links, original
   acceptance and inspected implementation, not title similarity or Done counts.
   Record unmapped work as delivery with a mapping gap; do not discard it.
3. Build a relevance record with issue/outcome ID, criterion or finding ID,
   component, scope, mapping evidence, previous observation and checks required.
   Include reopenings, changed acceptance, new blocking findings and changed
   deployed/configured state. Updated timestamps alone do not imply a fix.
4. No affected criteria means delivery-only changes and `No grading evidence
   changed`. An ungraded artifact stays ungraded. An explicit request to refresh
   delivery only is honored and says `Grading not reassessed`.

## Verify, then grade

Use `report-card.md`, `grade-anchors.md`, `baseline-ledger.md` and
`executable-grading.md` for affected scopes. For bounded reassessments, auditors
receive the relevant original acceptance and unchanged calibration, not previous
letters. A changed dependency can require checking consumers and standing
constraints beyond the closed ticket itself.

Verify each original requirement against exact code or runtime identity. Test
source, test execution, deployment and observed customer behavior are distinct
evidence. Record verified, still failing and unknown checks. A newly filed
follow-up cannot retroactively change the original acceptance.

Select the established method using `letter-reassessment.md`. An approved,
supported contract can compute deterministic letters. A recovered qualitative
method can issue fresh evidence-backed judgments without adopting a proposed
replacement contract. A request to regrade does not approve that draft. Missing
calibration, provenance or required verification becomes an explicit blocker.
Record verified improvements even while a letter is blocked. Do not call an
acceptance review a completed regrade or imply an old letter was recomputed.

Evaluate all mandatory checks for any grade being reported. Reuse evidence only
when the contract permits its age, scope, revision and observation identity.
Fresh-check requirements still require fresh checks. A partial component review
does not refresh the entire component or estate. Keep untouched results dated
as `Not reassessed`; do not average a fresh subset into a new overall.

For each affected result, persist one clear outcome:

- `Improved` or `Regressed`: old and new letters under the same approved contract,
  with the exact criteria and evidence responsible.
- `Unchanged after reassessment`: verified improvements, the limiting criterion
  that still holds the grade, and its next passing check.
- `Blocked`: work verified where possible, the missing approval or proof, and a
  dated last-reported letter shown separately.
- `Not reassessed`: irrelevant scope, explicit delivery-only request or a named
  coverage limit. Never a current-grade claim.

Append dated observations and any supported assessment before regenerating the
artifact. No evidence change means no duplicate assessment. Repeated rendering
reuses the saved observation ID, not another regrade. Arrays of source IDs drive
counts and labels in every view; do not hard-code observed totals into generation
scripts or treat previous-run counts as invariants.

## Artifact checks

- Roadmap, Gantt and Progress use the same completion observations, with canceled
  work separate and explanation links intact.
- Changed grading evidence is visible beside progress even if a letter is held.
- No claimed improvement comes only from a ticket count or a reduced denominator.
- Historical grades, original baseline and schedule commitments are unchanged.
- A draft contract cannot compute a fresh letter or veto a recovered existing
  qualitative method. Render the actual new assessment, not a previous snapshot.
- New operational letters require operational proof, not source-only repairs.
