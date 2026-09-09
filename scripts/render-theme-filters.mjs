import { escapeHtml } from './render-progress.mjs';

function validateTheme(theme) {
  if (!/^[a-z][a-z0-9-]*$/.test(theme.id) || typeof theme.name !== 'string' || !theme.name.trim()) throw new Error('Themes need stable IDs and names');
}

export function renderThemeTag(theme) {
  validateTheme(theme);
  return `<span data-theme-filter-fallback>${escapeHtml(theme.name)}</span><button class="rm-theme-tag rm-theme-${theme.id}" type="button" data-roadmap-theme-choice="${theme.id}" data-theme-label="${escapeHtml(theme.name)}" aria-pressed="false" data-enhance-control hidden>${escapeHtml(theme.name)}</button>`;
}

export function renderThemeFilterBar(themes) {
  themes.forEach(validateTheme);
  if (!themes.length || new Set(themes.map(theme => theme.id)).size !== themes.length) throw new Error('Theme IDs must be unique and nonempty');
  const choices = [{ id: '', name: 'All themes' }, ...themes];
  const buttons = choices.map(theme => `<button class="rm-theme-choice${theme.id ? ` rm-theme-${theme.id}` : ''}" type="button" data-roadmap-theme-choice="${theme.id}" data-theme-label="${escapeHtml(theme.name)}" aria-pressed="${!theme.id}"><span>${escapeHtml(theme.name)}</span><span class="rm-theme-count" data-theme-choice-count aria-hidden="true"></span></button>`).join('');
  return `<section class="rm-theme-filterbar" aria-label="Explore roadmap by theme" data-enhance-control hidden><div class="rm-theme-filter-heading"><strong>Explore by theme</strong><p class="rm-count" data-roadmap-count role="status" aria-live="polite"></p><button type="button" data-roadmap-clear disabled>Clear filters</button></div><div class="rm-theme-choices" role="group" aria-label="Theme filters">${buttons}</div><p class="rm-theme-filter-note">One selection across the board, Gantt and theme tags. Grades and baseline totals stay whole-scope.</p></section>`;
}
