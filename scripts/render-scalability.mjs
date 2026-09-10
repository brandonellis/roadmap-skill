import assert from 'node:assert/strict';
import { escapeHtml as escape } from './render-progress.mjs';

const dimensionIds = ['data', 'compute', 'shared', 'operations', 'cost'];
const verdicts = ['holds', 'degrades', 'breaks', 'unknown'];
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value));
const identifier = value => typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value);
const grade = value => typeof value === 'string' && /^(?:[ABCD][+-]?|F)$/.test(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const sourceLink = value => text(value) && !value.includes('\\') && (/^https?:\/\//i.test(value) || (!/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(value) && !value.split('/').includes('..')));

export function renderScalability(lens) {
  assert(identifier(lens.id) && text(lens.baselineId));
  assert(date(lens.firstAssessedOn));
  assert(['historical', 'assessed', 'reassessment-required'].includes(lens.status));
  const observation = lens.lastAssessment;
  assert(observation && date(observation.observedOn) && grade(observation.grade));
  assert(observation.observedOn >= lens.firstAssessedOn);
  assert(sourceLink(observation.sourceHref), 'Use a safe archived assessment reference');
  assert(text(observation.unit) && text(observation.method));
  assert.deepEqual(observation.dimensions.map(dimension => dimension.id).sort(), [...dimensionIds].sort(), 'Keep all five scale dimensions');
  for (const dimension of observation.dimensions) assert(text(dimension.name) && grade(dimension.grade));
  assert(observation.rungs.length >= 2);
  assert.equal(new Set(observation.rungs.map(rung => rung.id)).size, observation.rungs.length);
  for (const rung of observation.rungs) assert(identifier(rung.id) && text(rung.label) && Number.isFinite(rung.count) && rung.count >= 0 && ['measured', 'scenario'].includes(rung.kind));
  assert.equal(observation.rungs[0].kind, 'measured');
  assert(observation.rungs.slice(1).every(rung => rung.kind === 'scenario'));
  assert(observation.constraints.length > 0);
  for (const constraint of observation.constraints) {
    assert(text(constraint.name));
    assert.deepEqual(Object.keys(constraint.verdicts).sort(), observation.rungs.map(rung => rung.id).sort(), 'Every constraint needs every preserved rung');
    assert(Object.values(constraint.verdicts).every(verdict => verdicts.includes(verdict)), 'Unknown is not holds');
  }
  assert(text(lens.statusReason));
  assert(Array.isArray(lens.nextChecks) && lens.nextChecks.length > 0 && lens.nextChecks.every(text));
  const observedLabel = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(observation.observedOn));
  const historical = lens.status !== 'assessed';
  const title = historical ? 'Last assessed scalability' : 'Assessed scalability';
  const badge = historical ? 'Not remeasured' : 'Dated capacity assessment';
  const detailsId = `${lens.id}-evidence`;
  const snapshots = lens.history ?? [observation];
  assert(snapshots.length > 0);
  for (const snapshot of snapshots) assert(date(snapshot.observedOn) && grade(snapshot.grade) && sourceLink(snapshot.sourceHref));
  const history = '<p>Preserved qualitative snapshots, not a calculated grade trend:</p><ul class="rm-scale-history">' + snapshots.map(snapshot => `<li><a href="${escape(snapshot.sourceHref)}">${escape(snapshot.observedOn)} · ${escape(snapshot.grade)}</a></li>`).join('') + '</ul>';
  const table = `<div class="rm-scale-scroll" role="region" aria-label="Dated capacity ladder" tabindex="0"><table class="rm-scale-table"><caption>${historical ? 'Historical capacity map' : 'Capacity map'} · ${escape(observedLabel)} · ${escape(observation.unit)}</caption><thead><tr><th scope="col">Constraint</th>${observation.rungs.map(rung => `<th scope="col"><span>${escape(rung.label)}</span><strong>${rung.count.toLocaleString('en-US')}</strong><small>${rung.kind === 'measured' ? 'Measured then' : 'Fixed scenario'}</small></th>`).join('')}</tr></thead><tbody>${observation.constraints.map(constraint => `<tr><th scope="row">${escape(constraint.name)}</th>${observation.rungs.map(rung => `<td data-scale-verdict="${constraint.verdicts[rung.id]}">${constraint.verdicts[rung.id]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const progress = `<section id="${lens.id}" data-assessment-lens="${lens.id}" class="rm-scalability" aria-labelledby="${lens.id}-heading"><div class="rm-structure-heading"><h2 id="${lens.id}-heading">Scalability</h2><p>Headroom for the next growth stage</p></div><div class="rm-scale-summary"><a href="#${detailsId}" class="rm-scale-overall"><span>${title}</span><strong>${escape(observation.grade)}</strong><span>${escape(observedLabel)}</span></a><div><strong>${badge}</strong><p>${historical ? 'Capacity has not been remeasured for this revision.' : 'Capacity evidence belongs to this dated assessment.'}</p><a href="#${detailsId}">Assessment history and next checks</a></div></div><details class="rm-scale-breakdown"><summary>Capacity dimensions and growth scenarios</summary><div class="rm-scale-dimensions">${observation.dimensions.map(dimension => `<a href="#${detailsId}"><span>${escape(dimension.name)}</span><strong>${escape(dimension.grade)}</strong></a>`).join('')}</div>${table}<p class="rm-assessment-context">${historical ? 'The map records what was observed then, not current outages or verified capacity today. ' : ''}The first growth scenario is fixed, not recalculated from a changing account count. <a href="${escape(observation.sourceHref)}">Original assessment</a>.</p></details></section>`;
  const evidence = `<details id="${detailsId}"><summary>Scalability: source, grading method and next checks</summary><p>${escape(observation.method)}</p><p>This lens was first assessed on ${escape(lens.firstAssessedOn)}. It stays separate from the original component panel and does not change baseline ${escape(lens.baselineId)} or its finding denominator.</p><p>${escape(lens.statusReason)}</p><ul>${lens.nextChecks.map(check => `<li>${escape(check)}</li>`).join('')}</ul><p><a href="${escape(observation.sourceHref)}">Read the source assessment and its measurement details</a></p></details>`;
  return { progress, evidence: evidence.replace('<p>This lens was first assessed', history + '<p>This lens was first assessed') };
}
