import test from 'node:test';
import assert from 'node:assert/strict';
import { renderLetterReassessment } from './render-letter-reassessment.mjs';
import { renderEvidenceGroups } from './render-evidence-groups.mjs';

const component = (id, grade, previousGrade) => ({ id, name: id, status: 'assessed-qualitative-snapshot', grade, previousGrade, observedAt: '2026-01-02T12:00:00Z', rationale: 'Reviewed code', verifiedImprovements: ['Verified requirement'], nextGradeRequirements: ['Remaining requirement'], evidenceRefs: ['source.ts:1'], coverage: { limitations: [] } });

test('movement distinguishes reassessed changes from unchanged and carried-forward grades', () => {
  const assessment = { components: [component('platform', 'B', 'B-'), component('quality', 'B', 'B'), { id: 'web', name: 'Web', status: 'not-reassessed', lastReportedGrade: 'C+', lastObservedAt: '2026-01-01' }] };
  const original = structuredClone(assessment);
  const result = renderLetterReassessment(assessment);
  assert.match(result.movement, /B- <span aria-label="to">→<\/span> B/);
  assert.match(result.movement, /Unchanged · see what remains/);
  assert.doesNotMatch(result.movement, /grade-web/);
  assert.match(result.tiles, /Last reported · Jan 1, 2026/);
  assert.match(result.tiles, /Rechecked · Jan 2, 2026/);
  assert.match(result.details, /2026-01-02T12:00:00Z/);
  assert.deepEqual(assessment, original);
  assert.equal(renderLetterReassessment({ components: [] }).movement, '');
});

test('evidence groups preserve rendered records exactly and start collapsed', () => {
  const record = { id: 'source-record', html: '<details id="source-record"><summary>Original record</summary><details id="nested-proof"><summary>Proof</summary></details></details>' };
  const groups = [{ id: 'proof', title: 'Why this <grade>?', description: 'Dated assessments', records: [record] }];
  const result = renderEvidenceGroups(groups);
  assert.ok(result.includes(record.html));
  assert.match(result, /Why this &lt;grade&gt;\?/);
  assert.doesNotMatch(result, /<details[^>]*\bopen\b/);
  assert.throws(() => renderEvidenceGroups([...groups, ...groups]), /unique/);
  assert.throws(() => renderEvidenceGroups([{ ...groups[0], records: [record, record] }]), /exactly once/);
  assert.throws(() => renderEvidenceGroups([{ ...groups[0], records: [] }]), /empty/);
  assert.throws(() => renderEvidenceGroups([{ ...groups[0], records: [{ ...record, id: 'missing' }] }]), /anchor/);
});
