import { escapeHtml } from './render-progress.mjs';

export function renderRoadmapTimeline(model) {
  if (!model.months?.length || !model.quarters?.length || !model.groups?.length) throw new Error('Timeline needs months, quarters and groups');
  if (model.quarters.reduce((total, quarter) => total + quarter.months, 0) !== model.months.length) throw new Error('Quarter spans must cover the calendar');
  const ids = new Set();
  const groups = model.groups.map(group => {
    const rows = group.items.map(item => {
      if (!/^[a-z][a-z0-9-]*$/.test(item.id) || ids.has(item.id)) throw new Error('Timeline needs unique safe item IDs');
      ids.add(item.id);
      if (!/^[a-z][a-z0-9-]*$/.test(item.themeId) || !item.themeName) throw new Error('Timeline needs a named theme');
      const unscheduled = item.windowType === 'unscheduled';
      if (unscheduled && (item.start != null || item.duration != null)) throw new Error('Unscheduled work cannot carry a dated window');
      if (!unscheduled && (!Number.isFinite(item.start) || !Number.isFinite(item.duration) || item.start < 0 || item.duration <= 0 || item.start + item.duration > model.months.length)) throw new Error('Timeline window is outside its calendar');
      if (!['source-stated', 'scenario', 'unscheduled'].includes(item.windowType) || !item.windowLabel || !item.sourceNote) throw new Error('Timeline needs explicit schedule provenance');
      const description = [item.title, item.statusLabel, item.windowLabel, item.windowType, item.sourceNote].filter(Boolean).join('. ');
      const window = unscheduled
        ? `<a href="#${item.id}" class="rm-gantt-unscheduled" aria-label="${escapeHtml(description)}" title="${escapeHtml(description)}">${escapeHtml(item.windowLabel)}</a>`
        : `<a href="#${item.id}" class="rm-gantt-bar${item.windowType === 'scenario' ? ' is-scenario' : ''}" style="--start:${item.start / model.months.length * 100}%;--duration:${item.duration / model.months.length * 100}%" aria-label="${escapeHtml(description)}" title="${escapeHtml(description)}">${escapeHtml(item.windowLabel)}</a>`;
      return `<div class="rm-gantt-row rm-theme-${item.themeId}" data-roadmap-item="${item.id}" data-throughlines="${escapeHtml((item.throughlineIds || [item.themeId]).join(' '))}" data-search-text="${escapeHtml([description, item.searchText].filter(Boolean).join(' '))}"><div class="rm-gantt-label"><a href="#${item.id}">${escapeHtml(item.title)}</a><button class="rm-theme-tag rm-theme-${item.themeId}" type="button" data-roadmap-theme-choice="${item.themeId}" data-theme-label="${escapeHtml(item.themeName)}" aria-pressed="false" data-enhance-control hidden title="Filter: ${escapeHtml(item.themeName)}">${escapeHtml(item.themeId.toUpperCase())}</button><span class="rm-gantt-status">${escapeHtml(item.statusLabel || 'Progress not verified')}</span></div><div class="rm-gantt-track">${window}</div></div>`;
    }).join('');
    return `<section><h4 class="rm-gantt-group">${escapeHtml(group.name)}</h4>${rows}</section>`;
  }).join('');
  return `<div class="rm-gantt-region" role="region" aria-label="${escapeHtml(model.label || 'Roadmap timeline; scroll to explore')}" tabindex="0" data-roadmap-list><div class="rm-gantt" style="--month-count:${model.months.length}"><div class="rm-gantt-axis"><strong>Initiative / current progress</strong><div class="rm-gantt-calendar">${model.quarters.map(quarter => `<span class="rm-quarter" style="grid-column:span ${quarter.months}">${escapeHtml(quarter.label)}</span>`).join('')}${model.months.map(month => `<span>${escapeHtml(month)}</span>`).join('')}</div></div>${groups}</div><p data-filter-empty hidden>No matching roadmap items. Clear the filters to show the timeline.</p></div>`;
}
