import { escapeHtml } from './render-progress.mjs';

const safeId = value => typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value);

export function renderRoadmapMatrix(model, options = {}) {
  const items = new Map(model.items.map(item => [item.id, item]));
  if (items.size !== model.items.length || !model.items.length) throw new Error('Matrix needs unique roadmap items');
  for (const collection of [model.items, model.horizons, model.streams, model.themes]) {
    if (!collection.length || new Set(collection.map(item => item.id)).size !== collection.length || collection.some(item => !safeId(item.id))) throw new Error('Matrix IDs must be safe, unique and nonempty');
  }
  const placements = new Set();
  for (const placement of model.placements) {
    const key = [placement.itemId, placement.streamId, placement.horizonId, placement.themeId].join('|');
    if (placements.has(key)) throw new Error('Duplicate matrix placement');
    placements.add(key);
    if (!items.has(placement.itemId) || !model.streams.some(stream => stream.id === placement.streamId) || !model.horizons.some(horizon => horizon.id === placement.horizonId) || !model.themes.some(theme => theme.id === placement.themeId)) throw new Error('Matrix placement has an unknown reference');
  }
  if (new Set(model.placements.map(placement => placement.itemId)).size !== items.size) throw new Error('Every roadmap item needs a matrix placement');
  const key = model.themes.map(theme => `<button class="rm-matrix-theme rm-theme-${theme.id}" type="button" data-roadmap-theme-choice="${theme.id}" data-theme-label="${escapeHtml(theme.name)}" aria-pressed="false" data-enhance-control hidden><span>${escapeHtml(theme.id.toUpperCase())}</span> ${escapeHtml(theme.name)}</button><span class="rm-matrix-theme rm-theme-${theme.id}" data-theme-filter-fallback>${escapeHtml(theme.name)}</span>`).join('');
  const rows = model.streams.map(stream => `<tr><th scope="row">${escapeHtml(stream.name)}</th>${model.horizons.map(horizon => `<td><div class="rm-matrix-cell">${model.placements.filter(placement => placement.streamId === stream.id && placement.horizonId === horizon.id).map(placement => {
    const item = items.get(placement.itemId);
    return `<a class="rm-matrix-pill rm-theme-${placement.themeId}" href="#${item.id}" data-roadmap-item="${item.id}" data-throughlines="${escapeHtml((item.throughlineIds || [placement.themeId]).join(' '))}" data-search-text="${escapeHtml([item.title, item.statusLabel, item.preview].filter(Boolean).join(' '))}" title="${escapeHtml(item.preview || item.title)}"><span>${escapeHtml(placement.label || item.title)}</span>${item.statusLabel ? `<small>${escapeHtml(item.statusLabel)}</small>` : ''}</a>`;
  }).join('') || '<span class="rm-matrix-empty">No planned item</span>'}</div></td>`).join('')}</tr>`).join('');
  const heading = options.showHeading === false ? '' : `<div class="rm-structure-heading"><h2 id="roadmap-board-heading">The board</h2><p>Streams × horizons. Select a pill for progress and evidence.</p><span>${items.size} ${items.size === 1 ? 'item' : 'items'} · ${model.placements.length} placements</span></div>`;
  const themeKey = options.showThemeKey === false ? '' : `<div class="rm-matrix-key" role="group" aria-label="Filter the board by theme"><strong>Throughlines · click filters</strong>${key}</div>`;
  return `<section class="rm-roadmap-matrix" ${heading ? 'aria-labelledby="roadmap-board-heading"' : 'aria-label="The board"'}>${heading}${themeKey}<div class="rm-matrix-scroll" role="region" aria-label="Roadmap by stream and horizon" tabindex="0"><table class="rm-matrix"><caption class="rm-visually-hidden">Roadmap by stream and horizon; completion does not move planning commitments.</caption><thead><tr><th scope="col">Stream</th>${model.horizons.map(horizon => `<th scope="col">${escapeHtml(horizon.name)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><p class="rm-chart-note">Color identifies the theme; the column identifies the horizon. Repeated placements remain one roadmap item. Completion notes do not imply that every requirement is finished.</p></section>`;
}
