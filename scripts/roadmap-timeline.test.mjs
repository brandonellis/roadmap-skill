import test from 'node:test';
import assert from 'node:assert/strict';
import { renderRoadmapTimeline } from './render-roadmap-timeline.mjs';

const fixture = () => ({
  months: ['Jan', 'Feb', 'Mar'], quarters: [{ label: 'Q1', months: 3 }],
  groups: [{ name: 'Now', items: [{ id: 'delivery', title: 'Reliable delivery', themeId: 't1', themeName: 'Trust', start: 0, duration: 2, windowType: 'scenario', windowLabel: 'Planning scenario', sourceNote: 'Original planning workshop', statusLabel: '2/3 cited tickets Done' }] }],
});

test('compact timeline keeps windows, theme controls and completion scope separate', () => {
  const html = renderRoadmapTimeline(fixture());
  assert.match(html, /--start:0%;--duration:66\.666/);
  assert.match(html, /class="rm-gantt-bar is-scenario"/);
  assert.match(html, /2\/3 cited tickets Done/);
  assert.match(html, /data-roadmap-theme-choice="t1"/);
  assert.match(html, /href="#delivery"/);
  assert.doesNotMatch(html, /width:66|progressbar/);
});

test('timeline rejects invalid dates, missing provenance and duplicate IDs', () => {
  for (const change of [item => { item.duration = 4; }, item => { item.start = NaN; }, item => { item.windowType = ''; }, item => { item.sourceNote = ''; }, item => { item.themeId = 'bad"id'; }]) {
    const model = fixture(); change(model.groups[0].items[0]);
    assert.throws(() => renderRoadmapTimeline(model));
  }
  const model = fixture(); model.groups[0].items.push({ ...model.groups[0].items[0] });
  assert.throws(() => renderRoadmapTimeline(model), /unique/);
});

test('timeline escapes text and rejects calendar mismatch', () => {
  const model = fixture(); model.groups[0].items[0].title = '<script>unsafe</script>';
  assert.doesNotMatch(renderRoadmapTimeline(model), /<script>/);
  model.quarters[0].months = 4;
  assert.throws(() => renderRoadmapTimeline(model), /calendar/);
});

test('reprioritized unscheduled work stays linked without inventing a date bar', () => {
  const model = fixture();
  Object.assign(model.groups[0].items[0], { windowType: 'unscheduled', start: null, duration: null, windowLabel: 'Now · dates not set', sourceNote: 'User raised the priority; no dates supplied' });
  const html = renderRoadmapTimeline(model);
  assert.match(html, /rm-gantt-unscheduled/);
  assert.match(html, /Now · dates not set/);
  assert.match(html, /href="#delivery"/);
  assert.doesNotMatch(html, /class="rm-gantt-bar|--start:|--duration:/);
  model.groups[0].items[0].start = 0;
  assert.throws(() => renderRoadmapTimeline(model), /cannot carry a dated window/);
});
