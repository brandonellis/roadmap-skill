import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { renderThemeFilterBar, renderThemeTag } from './render-theme-filters.mjs';

const { selectRoadmapItems } = createRequire(import.meta.url)('../assets/progress-shell.js');
const records = [
  { id: 'shared', text: 'Shared outcome ABC-10', throughlines: ['t1', 't3'] },
  { id: 'shared', text: 'Timeline representation', throughlines: ['t1'] },
  { id: 'second', text: 'Another outcome', throughlines: ['t3'] },
  { id: 'third', text: 'Delivery', throughlines: ['t8'] },
];

test('theme selection filters all representations by one unique item set', () => {
  const result = selectRoadmapItems(records, '', 't3');
  assert.deepEqual(result.matchingIds, ['shared', 'second']);
  assert.equal(result.total, 3);
  assert.equal(result.counts.t1, 1);
  assert.equal(result.counts.t3, 2);
  assert.equal(result.counts.t8, 1);
});

test('search and theme intersect without losing other facet counts', () => {
  const result = selectRoadmapItems(records, '  abc-10 ', 't3');
  assert.deepEqual(result.matchingIds, ['shared']);
  assert.equal(result.counts.t1, 1);
  assert.equal(result.counts.t3, 1);
  assert.equal(result.counts.t8, 0);
  assert.equal(result.counts[''], 1);
});

test('clearing a theme restores items and missing results do not shrink the total', () => {
  assert.equal(selectRoadmapItems(records, '', '').matchingIds.length, 3);
  const empty = selectRoadmapItems(records, 'not present', 't1');
  assert.equal(empty.matchingIds.length, 0);
  assert.equal(empty.total, 3);
  assert.equal(selectRoadmapItems([], '', '').total, 0);
});

test('a matching alternate representation includes the canonical item', () => {
  assert.deepEqual(selectRoadmapItems(records, 'timeline', 't3').matchingIds, ['shared']);
});

test('theme controls are real buttons with shared hooks, not an inert legend', () => {
  const html = renderThemeFilterBar([{ id: 't1', name: 'Trust & access' }, { id: 't8', name: 'Delivery' }]);
  assert.equal((html.match(/data-roadmap-theme-choice=/g) || []).length, 3);
  assert.match(html, /<button[^>]+data-roadmap-theme-choice="t1"/);
  assert.match(html, /role="group" aria-label="Theme filters"/);
  assert.match(html, /Trust &amp; access/);
  assert.doesNotMatch(html, /<select|role="tab"/);
});

test('item tags use the same filter hook and preserve a no-script label', () => {
  const html = renderThemeTag({ id: 't3', name: 'Measurement' });
  assert.match(html, /data-roadmap-theme-choice="t3"/);
  assert.match(html, /data-theme-filter-fallback/);
  assert.match(html, /data-enhance-control hidden/);
});

test('duplicate or unsafe theme IDs cannot produce ambiguous controls', () => {
  assert.throws(() => renderThemeFilterBar([{ id: 't1', name: 'One' }, { id: 't1', name: 'Two' }]), /unique/);
  assert.throws(() => renderThemeTag({ id: '"><script>', name: 'Unsafe' }), /stable IDs/);
});
