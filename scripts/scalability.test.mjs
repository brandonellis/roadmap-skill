import test from 'node:test';
import assert from 'node:assert/strict';
import { renderScalability } from './render-scalability.mjs';

function fixture() {
  return { id: 'scalability', baselineId: 'initial', firstAssessedOn: '2026-01-02', status: 'reassessment-required', statusReason: 'Capacity must be remeasured after the verified queue fix.', nextChecks: ['Measure queue wait at the preserved growth scenario.'], lastAssessment: { observedOn: '2026-01-03', grade: 'C+', sourceHref: 'archive/scale.html', unit: 'managed entities', method: 'Headroom to the next named growth scenario.', dimensions: ['data', 'compute', 'shared', 'operations', 'cost'].map(id => ({ id, name: id, grade: 'C' })), rungs: [{ id: 'present', label: 'Last measured', count: 105, kind: 'measured' }, { id: 'next', label: 'Next stage', count: 500, kind: 'scenario' }], constraints: [{ name: 'Queue capacity', verdicts: { present: 'degrades', next: 'breaks' } }] } };
}

test('restored scale grades keep their dates, all dimensions, and fixed rungs', () => {
  const lens = fixture();
  const before = structuredClone(lens);
  const { progress, evidence } = renderScalability(lens);
  assert.match(progress, /data-assessment-lens="scalability"/);
  assert.match(progress, /Last assessed scalability/);
  assert.match(progress, /<strong>C\+<\/strong>/);
  assert.match(progress, /January 3, 2026/);
  assert.match(progress, /Not remeasured/);
  assert.match(progress, /<strong>500<\/strong>/);
  assert.doesNotMatch(progress, /<strong>525<\/strong>/);
  assert.equal((progress.match(/href="#scalability-evidence"/g) ?? []).length, 7);
  assert.match(evidence, /first assessed on 2026-01-02/);
  assert.match(evidence, /Measure queue wait/);
  assert.match(evidence, /class="rm-scale-history"/);
  assert.deepEqual(lens, before);
});

test('unknown capacity is not rendered as passing, and markup is escaped', () => {
  const lens = fixture();
  lens.lastAssessment.constraints[0].verdicts.next = 'unknown';
  lens.statusReason = '<script>invalid</script>';
  const result = renderScalability(lens);
  assert.match(result.progress, /data-scale-verdict="unknown">unknown/);
  assert.doesNotMatch(result.progress, /<script>/);
  lens.lastAssessment.sourceHref = 'https://example.com/assessments/original';
  assert.match(renderScalability(lens).evidence, /href="https:\/\/example.com\/assessments\/original"/);
});

test('missing dimensions, stale shapes, unsafe links and missing dates fail clearly', () => {
  const mutations = [
    lens => lens.lastAssessment.dimensions.pop(),
    lens => { delete lens.lastAssessment.constraints[0].verdicts.next; },
    lens => { lens.lastAssessment.constraints[0].verdicts.next = 'complete'; },
    lens => { lens.lastAssessment.sourceHref = 'javascript:alert(1)'; },
    lens => { lens.lastAssessment.sourceHref = '../outside.html'; },
    lens => { lens.lastAssessment.sourceHref = '//example.com/redirect'; },
    lens => { lens.lastAssessment.observedOn = 'today'; },
    lens => { lens.lastAssessment.rungs[1].id = 'present'; },
    lens => { lens.lastAssessment.rungs[1].count = NaN; },
    lens => { lens.statusReason = ''; },
  ];
  for (const mutate of mutations) { const lens = fixture(); mutate(lens); assert.throws(() => renderScalability(lens)); }
});
