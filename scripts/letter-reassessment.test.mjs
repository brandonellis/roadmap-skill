import assert from 'node:assert/strict';
import test from 'node:test';
import { recordLetterReassessment } from './letter-reassessment.mjs';
import { fingerprint } from './assessment-engine.mjs';
import { renderLetterReassessment } from './render-letter-reassessment.mjs';

function fixture() {
  return {
    method: { kind: 'established-qualitative', id: 'original-method', baselineId: 'original-baseline', calibration: 'An A has no material review caveats.', sourceRefs: ['archive/original-prompt.json'] },
    previous: { id: 'previous', baselineId: 'original-baseline', observedAt: '2026-01-01T12:00:00Z', components: [{ id: 'core', name: 'Core', grade: 'B-' }, { id: 'ui', name: 'UI', grade: 'B' }] },
    assessment: {
      id: 'current', baselineId: 'original-baseline', observedAt: '2026-01-02T12:00:00Z', requestedComponentIds: ['core'], sourceCodeRefs: [{ repository: 'example', branch: 'staging', commit: 'a'.repeat(40) }], relevantIssueIds: ['TASK-1'],
      reviews: [{ componentId: 'core', status: 'assessed', scope: 'code', grade: 'B', rationale: 'Verified isolation repair removes a material caveat.', verifiedImprovements: ['Cross-scope reads rejected.'], evidenceRefs: ['src/isolation.ts:20'], nextGradeRequirements: ['Prove bounded retry handling.'], coverage: { componentComplete: true, pathsRead: ['src/isolation.ts', 'src/retries.ts'], testsExecuted: false, runtimeVerified: false } }],
    },
  };
}

test('new judgments update letters without replacing the baseline or changing history', () => {
  const input = fixture();
  const original = structuredClone(input);
  const result = recordLetterReassessment(input);
  assert.equal(result.baselineId, input.previous.baselineId);
  assert.equal(result.components[0].grade, 'B');
  assert.equal(result.components[0].previousGrade, 'B-');
  assert.equal(result.components[0].letterMovement, 'higher');
  assert.equal(result.components[1].grade, null);
  assert.equal(result.components[1].lastReportedGrade, 'B');
  assert.equal(result.components[1].lastObservedAt, input.previous.observedAt);
  assert.equal(result.grade, null);
  assert.equal(result.operationalGrade, null);
  assert.equal(result.aPlusCertified, false);
  assert.deepEqual(input, original);
});

test('a draft replacement does not veto an established qualitative method', () => {
  const input = fixture();
  input.proposedContract = { status: 'draft' };
  assert.equal(recordLetterReassessment(input).components[0].grade, 'B');
  assert.equal(input.proposedContract.status, 'draft');
});

test('rendering uses the new assessment letter and preserves dated untouched results', () => {
  const result = recordLetterReassessment(fixture());
  const rendered = renderLetterReassessment(result);
  assert.match(rendered.tiles, /data-component-id="core"[^]*?<strong>B<\/strong>/);
  assert.match(rendered.tiles, /Regraded · Jan 2, 2026/);
  assert.match(rendered.movement, /B- <span aria-label="to">→<\/span> B/);
  assert.match(rendered.tiles, /Last reported · Jan 1, 2026/);
  assert.match(rendered.details, /Core · B- → B/);
  assert.match(rendered.details, /Prove bounded retry handling/);
  assert.match(rendered.details, /UI · Not reassessed/);
  result.components[0].rationale = '<script>unsafe</script>';
  assert(!renderLetterReassessment(result).details.includes('<script>'));
});

test('same and lower letters are possible despite completed work', () => {
  for (const [grade, movement] of [['B-', 'same'], ['C+', 'lower']]) {
    const input = fixture();
    input.assessment.reviews[0].grade = grade;
    const component = recordLetterReassessment(input).components[0];
    assert.equal(component.letterMovement, movement);
    assert.equal(component.verifiedImprovements.length, 1);
    assert.equal(component.nextGradeRequirements.length, 1);
  }
});

test('Done counts cannot replace an actual letter review', () => {
  const input = fixture();
  input.assessment.reviews = [];
  input.assessment.completedTickets = 50;
  assert.throws(() => recordLetterReassessment(input), /Every requested component/);
  input.assessment.reviews = fixture().assessment.reviews;
  input.assessment.reviews[0].grade = null;
  assert.throws(() => recordLetterReassessment(input), /actual letter/);
});

test('unchanged letters need evidence and a next-grade explanation', () => {
  const input = fixture();
  input.assessment.reviews[0].grade = 'B-';
  input.assessment.reviews[0].nextGradeRequirements = [];
  assert.throws(() => recordLetterReassessment(input), /remaining requirements/);
});

test('explicit blockers preserve old dates without calling them new grades', () => {
  const input = fixture();
  input.assessment.reviews = [{ componentId: 'core', status: 'blocked', grade: null, reason: 'Required source tree unavailable.' }];
  const result = recordLetterReassessment(input);
  assert.equal(result.status, 'partial-with-blockers');
  assert.equal(result.components[0].grade, null);
  assert.equal(result.components[0].lastReportedGrade, 'B-');
  assert.equal(result.components[0].lastObservedAt, input.previous.observedAt);
});

test('baseline, method, coverage and source identity cannot silently change', () => {
  const mutations = [
    input => { input.assessment.baselineId = 'replacement'; },
    input => { input.previous.methodHash = fingerprint(input.method); input.method.calibration = 'An easier bar.'; },
    input => { input.assessment.reviews[0].coverage.componentComplete = false; },
    input => { input.assessment.reviews[0].scope = 'production'; },
    input => { input.assessment.sourceCodeRefs[0].commit = 'main'; },
    input => { input.assessment.reviews.push(input.assessment.reviews[0]); },
    input => { input.assessment.observedAt = 'tomorrow'; },
    input => { input.method.kind = 'draft'; },
  ];
  for (const mutate of mutations) {
    const input = fixture();
    mutate(input);
    assert.throws(() => recordLetterReassessment(input));
  }
});
