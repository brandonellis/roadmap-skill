import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCohort, renderCohortSummary, renderCohortDetails } from './render-cohort-findings.mjs';

function fixture() {
  return {
    baselineId: 'initial', assessmentId: 'current', observedAt: '2026-01-02T00:00:00Z', trackerObservedLabel: 'Tracker checked January 3', initialIds: ['APP-1', 'APP-2'],
    findings: [
      { id: 'APP-1', title: 'Original cache requirement', shortTitle: 'Expire cached results', status: 'partial', reason: 'Cache exists; expiry is not implemented.', verifiedWork: 'The cache stores results.', remainingWork: 'Add expiry.', trackerStatus: 'Done', owner: 'Owner', url: 'https://example.com/issues/APP-1', steps: [{ label: 'Store results', status: 'verified' }, { label: 'Expire results', status: 'remaining' }], references: [{ href: '#proof', label: 'Original proof' }], staging: 'Partial', production: 'Not deployed' },
      { id: 'APP-2', title: 'Original retry requirement', shortTitle: 'Retry safely', status: 'fixed', reason: 'Original retry protection is verified.', verifiedWork: 'Idempotent retry guard runs.', remainingWork: 'None for the original finding.', trackerStatus: 'Todo', owner: 'Owner', url: 'https://example.com/issues/APP-2', steps: [{ label: 'Guard retries', status: 'verified' }], references: [{ href: '#proof', label: 'Original proof' }], staging: 'Verified', production: 'Not exercised' },
    ],
  };
}

test('every count and cell opens the exact finding set, not a generic audit', () => {
  const html = renderCohortSummary(fixture());
  assert.match(html, /href="#finding-APP-1"/);
  assert.match(html, /href="#finding-APP-2"/);
  assert.match(html, /data-finding-filter-target="partial">1 partial/);
  assert.match(html, /data-finding-filter-target="fixed">1 fixed/);
  assert.match(html, /Cache exists; expiry is not implemented/);
});

test('partial means verified work plus an unmet original requirement, not ticket state', () => {
  const html = renderCohortDetails(fixture());
  assert.match(html, /data-finding-id="APP-1" data-finding-status="partial"/);
  assert.match(html, /Tracker says Done; the original requirement is not fully verified/);
  assert.match(html, /Store results/); assert.match(html, /Expire results/);
  assert.match(html, /https:\/\/example.com\/issues\/APP-1/);
  assert.match(html, /Tracker checked January 3/);
});

test('a verified finding remains fixed even if the tracker has not been closed', () => {
  const html = renderCohortDetails(fixture());
  assert.match(html, /data-finding-id="APP-2" data-finding-status="fixed"/);
  assert.match(html, /Original code acceptance is verified; the tracker has not been closed/);
});

test('unexplained partials and unverified fixed findings fail validation', () => {
  const model = fixture(); model.findings[0].steps[1].status = 'verified';
  assert.throws(() => validateCohort(model), /Partial needs both/);
  model.findings[0].steps[1].status = 'remaining'; model.findings[1].steps[0].status = 'unknown';
  assert.throws(() => validateCohort(model), /fixed finding still has an unmet/);
});

test('original findings cannot disappear or be duplicated in the comparison', () => {
  const model = fixture(); model.findings.pop();
  assert.throws(() => validateCohort(model), /Every original finding/);
  model.findings.push(model.findings[0]);
  assert.throws(() => validateCohort(model), /Every original finding/);
});

test('untrusted labels are escaped and unsafe evidence navigation is refused', () => {
  const model = fixture(); model.findings[0].shortTitle = '<script>not markup</script>';
  assert.match(renderCohortDetails(model), /&lt;script&gt;/);
  model.findings[0].references[0].href = 'javascript:alert(1)';
  assert.throws(() => renderCohortDetails(model), /HTTPS or local anchors/);
});
