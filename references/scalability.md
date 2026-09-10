# Preserve the scalability lens

Scalability is a standing cross-cutting assessment, not a synonym for a
component's performance grade. An eight-component scorecard must not make a
previously assessed ninth lens disappear. Keep its grade and capacity ladder
visible in Progress; put the detailed measurements and evidence in Evidence.
Do not add another primary tab or apply roadmap theme filters to this assessment.

## Restore without rewriting the baseline

Recover the latest scale row, all five dimension grades, the business growth
unit, fixed scenario rungs and measurement date from the actual prior artifact.
Keep Data tier, Compute & workers, Shared state, Operations at N, and Cost curve
distinct. Preserve any additional constraint rows in the capacity map.

A lens first introduced after the initial baseline retains its own first-assessed
date. Preserve it as a later scope addition, not a new original baseline or a
retroactive member of the initial component/finding denominator. Do not blend
its grade into an aggregate with different scope. Historical qualitative letters
remain snapshots, not a fabricated comparable trend.

Keep the reported grade even when old measurements cannot establish current
headroom, but label it `Last assessed`, with its original date and `Not remeasured`.
An old broken rung is a historical finding, not a declaration of a current outage.
Never relabel yesterday's count `today`, recompute fixed scenarios from a changed
present count, or claim fresh capacity from a code-only review.

## Grade and refresh behavior

Full `grade` and `score` runs include this lens using its own unchanged scale
calibration in `report-card.md`, not the generic component bar. Refresh routes
relevant changes in data access, queue admission, worker concurrency, retention,
shared state, deployment limits, vendor constraints and unit economics to scale
reassessment too. Component audits are evidence inputs, not substitute capacity
measurements. Ticket completion triggers original-requirement verification.

Remeasure the present and per-unit demand, inspect current ceilings, and evaluate
the next preserved growth scenario. Keep measurement, static configuration and
extrapolation distinct. No unrequested load experiments, quota spending or
deployments. Missing measurement access is an explicit coverage gap with a next
check, not a silent pass, a forced downgrade or an omitted lens. Preserve any
verified implementation progress while required runtime proof is unavailable.

## Persistence and validation

Store lens observations separately from component-only assessments. The current
ledger's `assessmentLenses` lists each standing lens's `id` and allowlisted
`sourceFile`, with its first-assessed date and current assessment status. Resolve
this registry before regenerating, including on partial component refreshes.
Never build the complete assessment inventory solely from `components`.

`renderScalability` in `scripts/render-scalability.mjs` returns a compact grade
panel, five dimension grades, a dated capacity map and a linked evidence section.
Use `assets/scalability.css` alongside the incumbent progress tokens. Its input
fixture is synthetic. The renderer preserves source rungs, accepts explicit
unknowns, escapes text, and requires all dimensions and constraint/rung pairs.

`verifyArtifact` rejects a bundle that omits a registered standing lens or its
source file. Validate that regeneration keeps the lens, dates, rungs, evidence
links and original history. Browser QA is optional maintainer tooling, never a
dependency required to run this skill.
