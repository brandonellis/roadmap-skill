import assert from 'node:assert/strict';
import { escapeHtml as escape } from './render-progress.mjs';

export function renderEvidenceGroups(groups) {
  const identities = new Set();
  for (const group of groups) {
    assert(/^[a-z][a-z0-9-]*$/.test(group.id) && !identities.has(group.id), 'Evidence groups need unique safe IDs');
    identities.add(group.id);
    assert(typeof group.title === 'string' && group.title.trim());
    assert(typeof group.description === 'string' && group.description.trim());
    assert(Array.isArray(group.records) && group.records.length, 'Do not render empty evidence groups');
    for (const record of group.records) {
      assert(/^[a-z][a-z0-9-]*$/.test(record.id) && !identities.has(record.id), 'Evidence records must appear exactly once');
      identities.add(record.id);
      assert(typeof record.html === 'string' && record.html.includes(`id="${record.id}"`), 'Retain each record anchor');
    }
  }
  return groups.map(group => `<details class="rm-evidence-group" id="${group.id}"><summary><strong>${escape(group.title)}</strong><span>${escape(group.description)}</span></summary><div class="rm-evidence-records">${group.records.map(record => record.html).join('')}</div></details>`).join('');
}
