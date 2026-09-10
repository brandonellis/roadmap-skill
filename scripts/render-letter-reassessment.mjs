import { escapeHtml as escape } from './render-progress.mjs';

function dateLabel(value) {
  if (!value || !Number.isFinite(Date.parse(value))) return 'date unavailable';
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}

export function renderLetterReassessment(assessment) {
  const tiles = assessment.components.map(component => {
    const assessed = component.status === 'assessed-qualitative-snapshot';
    const label = assessed ? `${component.grade === component.previousGrade ? 'Rechecked' : 'Regraded'} · ${dateLabel(component.observedAt)}` : `Last reported · ${dateLabel(component.lastObservedAt)}`;
    return `<a href="#grade-${escape(component.id)}" class="rm-grade-tile" data-component-id="${escape(component.id)}" data-grade-state="${escape(component.status)}"><span>${escape(component.name)}</span><strong>${escape(assessed ? component.grade : component.lastReportedGrade)}</strong><span>${escape(label)}</span></a>`;
  }).join('');
  const details = assessment.components.map(component => {
    if (component.status !== 'assessed-qualitative-snapshot') return `<details id="grade-${escape(component.id)}"><summary>${escape(component.name)} · ${component.status === 'blocked' ? 'Blocked' : 'Not reassessed'}</summary><p>Last reported: ${escape(component.lastReportedGrade)} at ${escape(component.lastObservedAt ?? 'an unrecorded time')}. This is not a fresh grade.</p>${component.reason ? `<p>${escape(component.reason)}</p>` : ''}</details>`;
    return `<details id="grade-${escape(component.id)}"><summary>${escape(component.name)} · ${escape(component.previousGrade)} → ${escape(component.grade)}</summary><p>${escape(component.rationale)}</p><p><strong>Verified improvements</strong></p><ul>${component.verifiedImprovements.map(text => `<li>${escape(text)}</li>`).join('')}</ul><p><strong>What still holds the grade back</strong></p><ul>${component.nextGradeRequirements.map(text => `<li>${escape(text)}</li>`).join('')}</ul><p>Qualitative code assessment on ${escape(dateLabel(component.observedAt))}. Not an operational certification.</p><details><summary>Source references and coverage</summary><p>Recorded at ${escape(component.observedAt)}.</p><ul>${component.evidenceRefs.map(reference => `<li>${escape(reference)}</li>`).join('')}</ul><p>${escape((component.coverage.limitations ?? []).join(' '))}</p></details></details>`;
  }).join('');
  const reviewed = assessment.components.filter(component => component.status === 'assessed-qualitative-snapshot');
  const movement = reviewed.length ? `<ul class="rm-grade-movement" aria-label="Changes in the latest component review">${reviewed.map(component => `<li><a href="#grade-${escape(component.id)}"><span>${escape(component.name)}</span><strong>${escape(component.previousGrade)} <span aria-label="to">→</span> ${escape(component.grade)}</strong><span>${component.grade === component.previousGrade ? 'Unchanged · see what remains' : 'Regraded · see the evidence'}</span></a></li>`).join('')}</ul>` : '';
  return { tiles: `<div class="rm-grade-grid">${tiles}</div>`, details, movement };
}
