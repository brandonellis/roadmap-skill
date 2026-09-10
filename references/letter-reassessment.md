# Run the assessment, not just the reconciliation

`grade` and `score` perform an actual assessment on every invocation. An assessed
artifact's `refresh` also reassesses the components affected by relevant changes.
Use the original baseline and the established grading method. Finishing tickets
is a reason to verify requirements, not an automatic letter increase. Regressions
and remaining blockers count too. A presentation-only rebuild reuses observations.

## Select the existing method before reviewing evidence

- **Approved deterministic contract:** call `evaluateAssessment` from
  `scripts/assessment-engine.mjs` with verified observations. Its approval and
  evidence checks still apply. Do not switch to subjective grading to bypass them.
- **Established qualitative method:** recover the original prompts, calibration,
  component panel and scope. Run blind component audits under that exact method,
  then call `recordLetterReassessment` from `scripts/letter-reassessment.mjs`.
  This records evidence-backed auditor judgments, not calculated numerical scores.
  A pending proposal for a different method does not suspend the existing one.
- **No recoverable method:** explain the missing calibration and request it. Do
  not invent thresholds, silently approve a proposal, or call old letters current.

Preserve both the initial baseline and every prior assessment. A new rubric's
approval is separate from authorizing another assessment. Legacy qualitative
letters can change on a fresh assessment, but are not reproducible numerical
trends or an operational A+ certification. Never backfill historical scores.

## Record and render the result

The qualitative recorder accepts `method`, `previous` and `assessment`; its
behavioral test fixture demonstrates their shapes. The method records the
original calibration and source references, and is fingerprinted. Each requested
component needs a complete component review with an actual letter, rationale,
verified improvements, next-grade requirements and source citations, or an
explicit blocker. An acceptance checklist for one ticket is not a component grade.

This recorder handles the component panel, not every cross-cutting lens. Merge
the standing lens registry into the current ledger and render those views too.
Follow `scalability.md` for scale-specific calibration, measurements and refresh
triggers. A component-only result must never erase a previously assessed lens.

Use the returned `components` to render current letters. The optional
`renderLetterReassessment` helper returns grade tiles and collapsed explanations
using the existing progress CSS hooks. Never select the
previous assessment unconditionally or return a blanket null because a separate
proposed contract is draft. Unreviewed components have a null current grade and
a separately dated last-reported letter. A partial panel yields no new overall.

Append the observation with its own stable ID and evidence report. On rerender,
reuse that record. Verify historical hashes and make the current pointer resolve
to the new record. For an unchanged letter, show what improved and the remaining
requirements. For a changed qualitative letter, label it a new judgment under
the same method, not a mechanically calculated score gain.

Tests must prove a new supported judgment reaches the displayed scorecard, an
unchanged grade has a reason, missing reviews cannot claim completion, and the
baseline/history remain intact. Keep fixtures anonymous and project evidence
private. Browser tools are optional artifact QA, not required skill dependencies.
