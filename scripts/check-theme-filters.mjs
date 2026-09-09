import assert from 'node:assert/strict';

export async function checkThemeFilters(page) {
  const passed = [];
  const bar = page.locator('.rm-theme-filterbar');
  const buttons = bar.locator('[data-roadmap-theme-choice]');
  const shell = page.locator('.roadmap-shell');
  const originalLedger = await page.locator('#roadmap-history').textContent();
  const records = await page.locator('[data-roadmap-item]').evaluateAll(elements => elements.filter(element => !element.closest('[data-view="history"]')).map(element => ({ id: element.dataset.roadmapItem, throughlines: (element.dataset.throughlines || '').split(/\s+/) })));
  const themeIds = [...new Set(records.flatMap(record => record.throughlines).filter(Boolean))];
  assert(themeIds.length > 1, 'Exercise real cross-theme filtering, not a one-theme fixture');
  assert.equal(await buttons.count(), themeIds.length + 1);
  assert.equal(await bar.evaluate(element => element.closest('[data-view]')?.getAttribute('data-view')), 'roadmap');
  await page.locator('#tab-roadmap').click();
  const reset = async () => {
    if (await page.locator('[data-roadmap-clear]').isEnabled()) await page.locator('[data-roadmap-clear]').click();
  };
  await reset();
  for (const theme of themeIds) {
    await bar.locator(`[data-roadmap-theme-choice="${theme}"]`).click();
    const expected = [...new Set(records.filter(record => record.throughlines.includes(theme)).map(record => record.id))].sort();
    for (const format of ['nnl', 'timeline']) {
      await page.locator('[data-roadmap-format-select]').selectOption(format);
      const visible = await page.locator(`[data-roadmap-format="${format}"] [data-roadmap-item]:visible`).evaluateAll(elements => [...new Set(elements.map(element => element.dataset.roadmapItem))].sort());
      assert.deepEqual(visible, expected, `${theme} must select the same items in ${format}`);
    }
    assert.equal(await bar.locator(`[data-roadmap-theme-choice="${theme}"]`).getAttribute('aria-pressed'), 'true');
    assert.equal(await bar.locator(`[data-roadmap-theme-choice="${theme}"] [data-theme-choice-count]`).textContent(), String(expected.length));
    await reset();
  }
  passed.push('Every colored theme control selects the same unique items in NNL and Gantt');

  await bar.locator(`[data-roadmap-theme-choice="${themeIds[0]}"]`).click();
  for (const view of ['overview', 'history', 'roadmap']) {
    await page.locator(`#tab-${view}`).click();
    assert.equal(await bar.isVisible(), view === 'roadmap');
    assert.equal(await shell.getAttribute('data-active-throughline'), themeIds[0]);
  }
  passed.push('Roadmap retains its selection while Progress and Evidence hide theme controls');

  await reset();
  await page.locator('[data-roadmap-format-select]').selectOption('nnl');
  const detail = page.locator('[data-view="roadmap"] details[data-roadmap-item]').filter({ has: page.locator('[data-roadmap-theme-choice]') }).first();
  await detail.evaluate(element => {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) if (parent.tagName === 'DETAILS') parent.open = true;
    element.open = true;
  });
  const tag = detail.locator('[data-roadmap-theme-choice]').first();
  const chosenTheme = await tag.getAttribute('data-roadmap-theme-choice');
  await tag.click();
  assert.equal(await bar.locator(`[data-roadmap-theme-choice="${chosenTheme}"]`).getAttribute('aria-pressed'), 'true');
  const siblingStates = await page.locator(`[data-roadmap-theme-choice="${chosenTheme}"]`).evaluateAll(elements => elements.map(element => element.getAttribute('aria-pressed')));
  assert(siblingStates.every(state => state === 'true'));
  await page.locator('[data-roadmap-format-select]').selectOption('timeline');
  const ganttTag = page.locator(`.rm-gantt-row [data-roadmap-theme-choice="${chosenTheme}"]:visible`).first();
  await ganttTag.click();
  assert.equal(await shell.getAttribute('data-active-throughline'), '');
  passed.push('Board tags, Gantt tags and the theme bar cross-filter and toggle each other');

  await bar.locator(`[data-roadmap-theme-choice="${themeIds[0]}"]`).click();
  await page.locator('[data-roadmap-search]').fill('__no_roadmap_item_can_match_this__');
  assert.equal(await page.locator('.rm-gantt-row:visible').count(), 0);
  assert.equal(await bar.locator('[data-roadmap-theme-choice=""] [data-theme-choice-count]').textContent(), '0');
  assert.equal(await shell.getAttribute('data-active-throughline'), themeIds[0]);
  await reset();
  assert.equal(await page.locator('.rm-gantt-row:visible').count(), new Set(records.map(record => record.id)).size);
  passed.push('Search intersects the theme filter; clear restores the full unchanged denominator');

  const keyboardChoice = bar.locator(`[data-roadmap-theme-choice="${themeIds[0]}"]`);
  await keyboardChoice.focus(); await page.keyboard.press('Space');
  assert.equal(await shell.getAttribute('data-active-throughline'), themeIds[0]);
  await page.keyboard.press('Enter');
  assert.equal(await shell.getAttribute('data-active-throughline'), '');
  passed.push('Theme controls work with Space and Enter, including toggle-off');
  assert.equal(await page.locator('#roadmap-history').textContent(), originalLedger);
  passed.push('Filtering never edits grade results, assessment scope or the original baseline');
  return passed;
}
