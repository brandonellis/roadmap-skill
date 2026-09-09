import assert from 'node:assert/strict';

const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))));
const snapshot = page => page.evaluate(() => ({
  view: document.querySelector('[data-view]:not([hidden])').id,
  format: document.querySelector('[data-roadmap-format-select]').value,
  theme: document.querySelector('.roadmap-shell').getAttribute('data-active-throughline'),
  query: document.querySelector('[data-roadmap-search]').value,
  left: window.scrollX, top: window.scrollY,
  scrolls: Array.from(document.querySelectorAll('[data-roadmap-scroll], .rm-gantt-region, .rm-matrix-scroll, .fig-scroll')).map(region => [region.scrollLeft, region.scrollTop]),
}));

export async function checkRoadmapNavigation(page) {
  const passed = [];
  let probe = 0;
  const reset = async () => {
    await page.locator('#tab-roadmap').click();
    if (await page.locator('[data-roadmap-clear]').isEnabled()) await page.locator('[data-roadmap-clear]').click();
    await page.locator('[data-roadmap-detail], .rm-planning-detail').evaluateAll(details => details.forEach(detail => { detail.open = false; }));
  };
  const roundTrip = async (selector, label, keyboard = false) => {
    const origin = page.locator(selector).first();
    const marker = String(++probe);
    await origin.evaluate((anchor, value) => { anchor.dataset.navigationProbe = value; }, marker);
    await origin.scrollIntoViewIfNeeded();
    await origin.focus();
    const before = await snapshot(page);
    const href = await origin.getAttribute('href');
    const detail = page.locator(href);
    if (keyboard) await origin.press('Enter');
    else await origin.click();
    await settle(page);
    assert.equal(await detail.isVisible(), true);
    assert.equal(await detail.evaluate(element => element.open), true);
    assert.equal(await page.locator('[data-roadmap-format-select]').inputValue(), before.format, 'Detail navigation must not switch charts');
    assert.equal(await detail.locator(':scope > summary').evaluate(element => element === document.activeElement), true, 'Detail summary receives keyboard focus');
    const back = detail.locator('[data-roadmap-return]');
    assert.equal(await back.textContent(), `Back to ${label}`);
    const assertReturned = async () => {
      await settle(page);
      assert.deepEqual(await snapshot(page), before, 'Return restores view, chart, filters and both scroll axes');
      assert.equal(await page.evaluate(value => document.activeElement?.getAttribute('data-navigation-probe') === value, marker), true, 'Return focuses the originating chart link');
    };
    await back.click();
    await page.waitForFunction(() => history.state?.roadmapNavigation?.kind === 'origin');
    await assertReturned();
    await page.goForward();
    await settle(page);
    assert.equal(await detail.isVisible(), true);
    assert.equal(await detail.locator('[data-roadmap-return]').textContent(), `Back to ${label}`);
    await page.goBack();
    await assertReturned();
    passed.push(`${label}: detail focus, explicit return, browser Back/Forward and origin restoration`);
  };

  await reset();
  await page.locator('[data-roadmap-format-select]').selectOption('timeline');
  const first = page.locator('.rm-gantt-row[data-roadmap-item]').first();
  const theme = (await first.getAttribute('data-throughlines')).split(/\s+/)[0];
  const query = (await first.getAttribute('data-search-text')).trim().split(/\s+/)[0];
  await page.locator(`.rm-theme-filterbar [data-roadmap-theme-choice="${theme}"]`).click();
  await page.locator('[data-roadmap-search]').fill(query);
  await page.locator('.rm-gantt-region').evaluate(region => region.scrollTo(120, 90));
  await roundTrip('.rm-gantt-row:visible .rm-gantt-label > a', 'Gantt', true);
  await reset();
  await page.locator('[data-roadmap-format-select]').selectOption('nnl');
  await page.locator('.rm-matrix-scroll').evaluate(region => region.scrollTo(100, 0));
  await roundTrip('.rm-matrix-pill:visible', 'Now / Next / Later');
  const diagramLink = page.locator('[data-roadmap-origin-label="Critical path"] svg a[href]').first();
  if (await diagramLink.count()) {
    await page.locator('[data-roadmap-search]').fill('not-a-matching-initiative');
    await roundTrip('[data-roadmap-origin-label="Critical path"] svg a[href]', 'Critical path');
    passed.push('A diagram link reveals a filtered-out detail, then restores the original search');
  }
  await reset();
  const modifiedClick = await page.locator('.rm-matrix-pill').first().evaluate(anchor => {
    let preventedByController;
    window.addEventListener('click', event => {
      preventedByController = event.defaultPrevented;
      event.preventDefault();
    }, { once: true });
    anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true, button: 0 }));
    return preventedByController;
  });
  assert.equal(modifiedClick, false, 'Modified clicks retain native new-tab behavior');
  passed.push('Modified-click behavior is not intercepted');
  return passed;
}
