export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function link(href, label) {
  if (!/^(?:#[\w-]+|https:\/\/[^\s]+|[\w-][\w./-]*\.(?:html|json|md)(?:#[\w-]+)?)$/.test(href) || href.split('/').includes('..')) throw new Error('Unsafe evidence link');
  return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

export function renderOutcomeStory(story) {
  if (!story.baselineId || !story.assessmentId || !story.observedAt || !story.wins.length) throw new Error('Outcomes need baseline and observation provenance');
  const wins = story.wins.map(win => {
    if (!win.id || !win.title || !win.outcome || !win.evidenceHref || !win.proofLabel || !win.scopeLabel) throw new Error('A win needs an outcome, proof and scope');
    return `<li><div class="rm-outcome-proof">${escapeHtml(win.proofLabel)} <span>${escapeHtml(win.scopeLabel)}</span></div><h3>${escapeHtml(win.title)}</h3><p>${escapeHtml(win.outcome)}</p>${link(win.evidenceHref, 'View verification')}</li>`;
  }).join('');
  return `<section class="rm-outcomes" id="verified-outcomes" aria-labelledby="verified-outcomes-heading"><div class="rm-story-heading"><h2 id="verified-outcomes-heading">${escapeHtml(story.heading)}</h2>${link(story.evidenceHref, story.observationLabel)}</div><p class="rm-description">${escapeHtml(story.summary)}</p><ol class="rm-outcome-list">${wins}</ol><details class="rm-comparison-note"><summary>Since the previous assessment</summary><p>${escapeHtml(story.sincePreviousLabel)}</p></details></section>`;
}

export function renderNextChecks(components) {
  return `<section class="rm-next-checks" id="next-grade-checks" aria-labelledby="next-grade-heading"><div class="rm-story-heading"><h3 id="next-grade-heading">What moves us forward</h3>${link('#grading-contract', 'How grades will work')}</div><p class="rm-description">Choose a component to see its next proof. These actions address known gaps, not guaranteed letter increases.</p><div class="rm-check-list">${components.map(component => {
    if (!component.id || !component.actions?.length) throw new Error('Each component needs a stable ID and next actions');
    return `<details class="rm-next-check" id="next-${escapeHtml(component.id)}"><summary><span>${escapeHtml(component.name)}</span><span class="rm-next-check-grade">${escapeHtml(component.grade)} <small>snapshot</small></span><span class="rm-next-check-preview">${escapeHtml(component.nextOutcome)}</span></summary><ol>${component.actions.map(action => {
      if (!action.acceptance || !action.owner || !action.scope || !action.evidenceHref) throw new Error('Next actions need acceptance, owner, environment and source');
      return `<li><strong>${escapeHtml(action.title)}</strong><p>${escapeHtml(action.acceptance)}</p><p class="rm-check-meta">${escapeHtml(action.owner)} · ${escapeHtml(action.scope)} · ${escapeHtml(action.status)}</p>${link(action.evidenceHref, action.sourceLabel ?? 'Source requirement')}</li>`;
    }).join('')}</ol>${link(component.auditHref, 'Read the full assessment')}</details>`;
  }).join('')}</div></section>`;
}

export function renderDeliveryMilestones(milestones) {
  const rows = milestones.map(milestone => {
    if (!milestone.title || !milestone.plannedLabel || !milestone.observedLabel || !milestone.evidenceHref) throw new Error('Milestones need explicit schedule and evidence labels');
    return `<tr><th scope="row">${escapeHtml(milestone.title)}</th><td>${escapeHtml(milestone.plannedLabel)}</td><td>${escapeHtml(milestone.observedLabel)}</td><td>${escapeHtml(milestone.scopeLabel)}</td><td>${link(milestone.evidenceHref, milestone.stateLabel)}</td></tr>`;
  }).join('');
  return `<details class="rm-milestone-comparison" id="milestone-comparison"><summary>Planned and observed delivery <span>Keep commitments separate from verification dates</span></summary><div class="rm-table-region" role="region" aria-label="Planned versus observed milestones" tabindex="0"><table class="rm-table"><thead><tr><th scope="col">Outcome</th><th scope="col">Original commitment</th><th scope="col">Observation</th><th scope="col">Scope</th><th scope="col">Evidence</th></tr></thead><tbody>${rows}</tbody></table></div><p class="rm-chart-note">An observation date is not an invented completion date. Unscheduled work stays unscheduled; historical Gantt bars retain their original geometry and scenario labels.</p></details>`;
}
