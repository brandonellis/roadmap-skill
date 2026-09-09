# Executable grading and outcome-led updates

Read with `baseline-ledger.md`. Use `scripts/assessment-engine.mjs` for supported
contracts instead of asking an auditor to invent an aggregate letter. The engine
has no dependencies and performs no network requests or writes. It checks the
shape, provenance, freshness and arithmetic of observations, not whether a human
or auditor's source interpretation is true. Audit the evidence before recording
pass/fail. A successful validator is not an operational test.

## Adopt once, without rewriting legacy grades

1. Preserve the original baseline, finding cohort and every dated assessment.
   `sealHistory(ledger)` creates a separate hash lock; do not edit historical
   records to add hashes. Store and independently retain the lock before updates.
   `verifyHistory(lock, updatedLedger)` permits append-only assessments.
2. Write a private contract proposal with stable scope/cell/criterion IDs. A cell
   names a component, dimension and scope; every cell has positive cumulative
   acceptance tests for D, C, B and A. F is the fallback when known evidence fails
   D. A+ needs explicit additional tests; without them the ceiling is A. Do not
   encode descriptive failure anchors as positive prerequisites for higher tiers.
3. Present missing decisions together: tests and applicability, aggregation,
   evidence windows, operating scenarios and A+ requirements. Approval to improve
   a skill does not approve newly invented thresholds. Keep the proposal `draft`
   until the user accepts the exact contract. Drafts never award letters.
4. Record `approval.reference`, `approval.approvedAt` and the hash returned by
   `contractFingerprint(contract)`, then mark it `approved`. A changed criterion,
   threshold, denominator or scope invalidates the approval hash. This instrument
   adoption is not a replacement project baseline. Retain any unmeasured legacy
   mapping as unknown; do not back-calculate earlier letters.

The supported policy is whole tiers F/D/C/B/A/A+, cumulative criteria and the
lowest mandatory cell per scope. A custom or plus/minus contract needs explicit
approval and an implementation with behavioral tests before use. Never silently
approximate it with a GPA or the nearest supported tier.

## Contract and observation interface

See the synthetic `fixture()` in `scripts/assessment-engine.test.mjs` for a complete,
executable example. It is deliberately generic, not project evidence.

Contract fields: `schemaVersion: 1`, `id`, `baselineId`, `status`, `scopes`,
`initialFindingIds`, `findingEvidenceMaxAgeHours`, `aggregation`, `cells`, `criteria`.
Each cell has `id`, `component`, `dimension`, `scope`, `mandatory`. Each criterion
has `id`, `cellId`, `tier`, `test`, `method`, `maxAgeHours`, `thisAssessment` and,
only if pre-approved, `notApplicableReason`.

Assessment fields: `id`, `baselineId`, `contractId`, `contractHash`, `observedAt`,
`sourceCodeRefs`, `runtimeRefs`, `observations`, `findings`, `coverageGaps`.
Evidence-backed observations name `criterionId`, `result`, `evidenceRefs`,
`observedAt`, `assessmentId`, `subject`. Code subjects contain `scope: code`,
`repository`, full `commit`; runtime subjects contain `scope`, `service`,
`revision`, full `commit`, and immutable `imageDigest`. A subject must exactly
match an independently collected source/runtime reference in the assessment.
Missing provenance, stale evidence, another run's evidence where this run is
required, a future timestamp or a different scope cannot pass.

Findings name `id`, `scope`, `status` (open/partial/resolved/unknown), `blocking`
and the same evidence fields for closure. Include every original finding in each
scope; use unknown rather than dropping inaccessible findings. New findings stay
outside the original denominator. Model new live exposures and activation gaps as
blocking findings; record uncovered components/tiers in `coverageGaps`. No UI
filter may be passed to the evaluator as a smaller contract.

## Progress even when the letter stays still

Use `compareFindings(initialIds, previousStatesOrNull, currentStates)` for exact
resolved, partial, open, unknown, reopened and newly discovered ID sets. Compare
like scopes and verification standards. If the previous assessment lacks finding
states, pass null and say the delta is unavailable. Never treat missing previous
data as all-open or call newly observed proof a newly shipped feature.

Use `scripts/render-progress.mjs` and `assets/progress-outcomes.css` with the existing
shell for three to five outcome-led wins, concise expandable next-check lists and
planned/observed milestone comparisons. Component grade links open next checks;
the full audit is one further deliberate step. Each win names an outcome, proof,
scope and evidence link. Each next check names owner, original acceptance, target
environment and source. Ticket counts remain a secondary activity signal.
An action list is not a promise that closing those tickets earns a particular
letter. Do not manufacture owners, dates, customer metrics or completion events.

Keep the original Roadmap/Progress/Evidence navigation, audience and Gantt
geometry. Retain initial commitments alongside later forecasts and actual dates.
When only an observation date is known, label it that way. No inferred dates on
unscheduled work. New engineering priorities can be proposed in the roadmap
without claiming they are committed, implemented or deployed.

## Verify before publishing

Run `node --test scripts/*.test.mjs`. Project artifact verification additionally
uses a private `publication-manifest.json` with `schemaVersion: 1`, `visibility:
private`, `assessmentId`, `audience`, `artifactFile`, `ledgerFile`, `historyLockFile`
and an explicit `files` array of relative `path` + SHA-256. Include linked archives
and evidence files needed for the private artifact. Do not include the publication
manifest in its own file list. Embed the same ledger in a JSON script with ID
`roadmap-history`, escaping `<` as `\u003c`.

`node scripts/verify-artifact.mjs /private/path/publication-manifest.json` verifies
file integrity, append-only history, audience and embedded/saved ledger agreement.
Use `--private-bundle NEW_DIRECTORY` to create an allowlisted owner-only copy and
reverify it. The destination must not exist. This is staging, not uploading.
Re-read remote revision before actual publication; conflicts require reconcile,
not overwrite. Advertise a hosted update only after the destination is read back.

If no authenticated private destination is available, retain the stable local hub,
prepare the private bundle and report the missing destination once. Never publish
the private hub through a public Pages site or put its data in the skill repo.
External audience exports need separately approved, allowlisted data; hiding an
Evidence tab is not sanitization. A hash is an accidental-drift guard, not a
signature or a guarantee that an intentionally edited manifest is trustworthy.
