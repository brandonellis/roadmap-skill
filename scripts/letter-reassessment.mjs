import assert from 'node:assert/strict';
import { fingerprint } from './assessment-engine.mjs';

const letters = ['F', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const stringList = value => Array.isArray(value) && value.length > 0 && value.every(nonempty);
const dated = value => nonempty(value) && /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));

export function recordLetterReassessment({ method, previous, assessment }) {
  assert.equal(method.kind, 'established-qualitative', 'Use the contract evaluator for deterministic grading');
  assert(nonempty(method.id) && nonempty(method.baselineId));
  assert(nonempty(method.calibration) && stringList(method.sourceRefs), 'Recover the established method, not a draft replacement');
  assert.equal(previous.baselineId, method.baselineId, 'Do not replace the original baseline');
  assert.equal(assessment.baselineId, method.baselineId, 'Do not replace the original baseline');
  const methodHash = fingerprint(method);
  if (previous.methodHash) assert.equal(previous.methodHash, methodHash, 'Established grading method changed');
  assert(nonempty(assessment.id) && assessment.id !== previous.id, 'A reassessment needs its own identity');
  assert(dated(assessment.observedAt), 'A reassessment needs a dated observation');
  if (previous.observedAt) assert(Date.parse(assessment.observedAt) >= Date.parse(previous.observedAt));
  assert(Array.isArray(previous.components) && previous.components.length > 0);
  assert.equal(new Set(previous.components.map(component => component.id)).size, previous.components.length);
  assert(stringList(assessment.requestedComponentIds), 'Declare the reassessment scope');
  assert.equal(new Set(assessment.requestedComponentIds).size, assessment.requestedComponentIds.length);
  assert(Array.isArray(assessment.reviews));
  assert.equal(new Set(assessment.reviews.map(review => review.componentId)).size, assessment.reviews.length);
  assert.deepEqual(assessment.reviews.map(review => review.componentId).sort(), [...assessment.requestedComponentIds].sort(), 'Every requested component needs a review or an explicit blocker');
  const knownIds = new Set(previous.components.map(component => component.id));
  assert(assessment.requestedComponentIds.every(id => knownIds.has(id)), 'A refresh cannot silently change the component panel');
  assert(Array.isArray(assessment.sourceCodeRefs) && assessment.sourceCodeRefs.length > 0);
  for (const reference of assessment.sourceCodeRefs) assert(nonempty(reference.repository) && nonempty(reference.branch) && /^[a-f0-9]{40}$/.test(reference.commit), 'Use exact code identities');
  const reviews = new Map(assessment.reviews.map(review => [review.componentId, review]));
  const components = previous.components.map(component => {
    const review = reviews.get(component.id);
    if (!review) return { id: component.id, name: component.name, grade: null, lastReportedGrade: component.grade ?? component.lastReportedGrade, lastObservedAt: component.observedAt ?? component.lastObservedAt ?? previous.observedAt, status: 'not-reassessed' };
    assert(['assessed', 'blocked'].includes(review.status), 'Ticket acceptance review alone is not a letter assessment');
    if (review.status === 'blocked') {
      assert.equal(review.grade, null);
      assert(nonempty(review.reason), 'Name the missing evidence, not just blocked');
      return { id: component.id, name: component.name, grade: null, lastReportedGrade: component.grade ?? component.lastReportedGrade, lastObservedAt: component.observedAt ?? component.lastObservedAt ?? previous.observedAt, status: 'blocked', reason: review.reason };
    }
    assert.equal(review.scope, 'code', 'Qualitative source review cannot certify a runtime environment');
    assert(letters.includes(review.grade), 'The auditor must supply an actual letter');
    assert(nonempty(review.rationale) && stringList(review.evidenceRefs), 'A letter needs a rationale and cited evidence');
    assert(Array.isArray(review.verifiedImprovements) && review.verifiedImprovements.every(nonempty));
    assert(stringList(review.nextGradeRequirements), 'Explain remaining requirements, including unchanged letters');
    assert(review.coverage?.componentComplete === true && stringList(review.coverage.pathsRead), 'Review the component, not only a completed ticket');
    assert.equal(review.coverage.runtimeVerified, false);
    const previousGrade = component.grade ?? component.lastReportedGrade;
    assert(letters.includes(previousGrade), 'Preserve a valid last-reported letter');
    const movement = Math.sign(letters.indexOf(review.grade) - letters.indexOf(previousGrade));
    return { ...review, id: component.id, name: component.name, observedAt: assessment.observedAt, assessmentId: assessment.id, previousGrade, letterMovement: movement > 0 ? 'higher' : movement < 0 ? 'lower' : 'same', status: 'assessed-qualitative-snapshot', comparableTrend: false, aPlusCertified: false };
  });
  return { schemaVersion: 1, id: assessment.id, baselineId: method.baselineId, previousAssessmentId: previous.id, observedAt: assessment.observedAt, methodId: method.id, methodHash, method, sourceCodeRefs: assessment.sourceCodeRefs, relevantIssueIds: assessment.relevantIssueIds ?? [], status: components.some(component => component.status === 'blocked') ? 'partial-with-blockers' : 'assessed-with-stated-scope', components, grade: null, operationalGrade: null, aPlusCertified: false, comparability: 'Fresh qualitative component judgments under the recovered method, not deterministic score deltas. Untouched components retain their dates. No aggregate or operational grade is inferred from a partial panel.' };
}
