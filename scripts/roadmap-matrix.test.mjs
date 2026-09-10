import test from 'node:test';
import assert from 'node:assert/strict';
import { renderRoadmapMatrix } from './render-roadmap-matrix.mjs';

const fixture = () => ({
  items: [{ id: 'platform', title: 'Shared platform', throughlineIds: ['trust', 'data'], statusLabel: 'Core delivered', preview: 'Original acceptance partly verified' }],
  streams: [{ id: 'product', name: 'Product' }, { id: 'technical', name: 'Technical' }],
  horizons: [{ id: 'now', name: 'Now' }, { id: 'next', name: 'Next' }],
  themes: [{ id: 'trust', name: 'Trust' }, { id: 'data', name: 'Data' }],
  placements: [{ itemId: 'platform', streamId: 'product', horizonId: 'now', themeId: 'trust' }, { itemId: 'platform', streamId: 'technical', horizonId: 'now', themeId: 'data' }],
});
test('matrix keeps streams and horizons with one item behind repeated pills', () => {
  const html = renderRoadmapMatrix(fixture());
  assert.match(html, /1 item · 2 placements/);
  assert.equal((html.match(/href="#platform"/g) || []).length, 4);
  assert.equal((html.match(/class="rm-matrix-pill /g) || []).length, 2);
  assert.equal((html.match(/class="rm-mobile-pill /g) || []).length, 2);
  assert.match(html, /data-roadmap-mobile-group><h3>Now/);
  assert.match(html, /<th scope="row">Technical/);
  assert.match(html, /<th scope="col">Next/);
  assert.match(html, /data-throughlines="trust data"/);
  assert.match(html, /data-roadmap-theme-choice="trust"/);
  assert.match(html, /data-theme-filter-fallback/);
});
test('matrix rejects dropped, duplicated and orphaned planning records', () => {
  const missing = fixture(); missing.placements = [];
  assert.throws(() => renderRoadmapMatrix(missing), /Every roadmap item/);
  const duplicate = fixture(); duplicate.placements.push(duplicate.placements[0]);
  assert.throws(() => renderRoadmapMatrix(duplicate), /Duplicate/);
  const orphan = fixture(); orphan.placements[0].itemId = 'missing';
  assert.throws(() => renderRoadmapMatrix(orphan), /unknown reference/);
});
test('labels are escaped and unsafe identities cannot become markup', () => {
  const model = fixture(); model.items[0].title = '<script>bad()</script>';
  assert.match(renderRoadmapMatrix(model), /&lt;script&gt;/);
  model.items[0].id = '" onclick="bad()';
  assert.throws(() => renderRoadmapMatrix(model), /safe/);
});

test('shared controls can touch the chart without an intervening heading or duplicate key', () => {
  const html = renderRoadmapMatrix(fixture(), { showHeading: false, showThemeKey: false });
  assert.doesNotMatch(html, /rm-structure-heading|rm-matrix-key|aria-labelledby/);
  assert.match(html, /^<section class="rm-roadmap-matrix" aria-label="The board"><div class="rm-matrix-scroll"/);
});
