const { test, expect } = require('@playwright/test');

test('every editable course box has voice help, without changing its value or sending its text', async ({ page }) => {
  for (const route of ['/preview', '/portfolio', '/check-and-continue', '/before-you-start']) {
    await page.goto(route);
    const fields = page.locator('.finlay-writing-surface textarea:not([readonly]):not([disabled])');
    expect(await fields.count()).toBeGreaterThan(0);
    await expect(page.locator('.finlay-field-hint')).toHaveCount(await fields.count());
    for (const field of await fields.all()) {
      await expect(field).toHaveAttribute('aria-describedby', /finlay-.*-tips-field-/);
    }
    // Read-only generated output is not an input or a dictation destination.
    for (const field of await page.locator('textarea[readonly]').all()) {
      expect((await field.getAttribute('aria-describedby')) || '').not.toContain('-tips-field-');
    }
  }
  await page.goto('/preview');
  const sent = [];
  page.on('request', request => sent.push(request.url()));
  await page.locator('#brief-task').fill('PRIVATE SYNTHETIC TASK');
  const panel = page.locator('#finlay-brief-tips');
  await expect(panel.locator('[data-finlay-current]')).toHaveText('Writing: The task');
  await page.locator('#brief-task + .finlay-field-hint a').click();
  await expect(panel.locator('.finlay-voice-guide details')).toHaveAttribute('open', '');
  await expect(page.locator('#brief-task')).toHaveValue('PRIVATE SYNTHETIC TASK');
  expect(sent).toEqual([]);
});

test('a reusable prompt copies only its authored text and never submits a form', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/preview');
  await page.locator('#brief-task').fill('PRIVATE SYNTHETIC TASK');
  const panel = page.locator('#finlay-brief-tips');
  await panel.getByText('Help me make a clearer request', { exact: true }).click();
  await panel.getByRole('button', { name: 'Copy clearer-request prompt', exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('Ask me one question');
  expect(copied).not.toContain('PRIVATE SYNTHETIC TASK');
  await expect(panel.locator('[data-finlay-copy-status]')).toContainText('Prompt copied');
  await expect(page.locator('#brief-task')).toHaveValue('PRIVATE SYNTHETIC TASK');
  for (const button of await page.locator('[data-finlay-copy]').all()) await expect(button).toHaveAttribute('type', 'button');
});

test('blocked clipboard keeps a selectable prompt and the current draft', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw Error('blocked'); } } }));
  await page.goto('/portfolio');
  await page.locator('#portfolio-about').fill('Keep this draft.');
  const panel = page.locator('#finlay-portfolio-tips');
  await panel.getByText('Interview me one question at a time', { exact: true }).click();
  await panel.getByRole('button', { name: 'Copy interview prompt', exact: true }).click();
  await expect(panel.locator('[data-finlay-copy-status]')).toContainText('prompt is selected');
  expect(await page.evaluate(() => getSelection().toString())).toContain('which question I am answering');
  await expect(page.locator('#portfolio-about')).toHaveValue('Keep this draft.');
});

test('desktop tips sit beside the activity and stay in view; mobile tips never cover the boxes', async ({ page }, testInfo) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of ['/preview', '/portfolio', '/check-and-continue', '/before-you-start']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    }
    await page.goto('/preview#page-2');
    const content = page.locator('#page-2 .finlay-writing-content');
    const panel = page.locator('#finlay-brief-tips');
    const c = await content.boundingBox();
    const p = await panel.boundingBox();
    if (width === 1440) {
      expect(p.x).toBeGreaterThanOrEqual(c.x + c.width);
      await page.locator('#brief-prediction').focus();
      const sticky = await panel.boundingBox();
      expect(sticky.y).toBeGreaterThanOrEqual(0);
      expect(sticky.y).toBeLessThan(100);
    } else {
      expect(p.y).toBeGreaterThanOrEqual(c.y + c.height);
    }
    await panel.screenshot({ path: testInfo.outputPath(`tips-${width}.png`) });
  }
});

test('keyboard help and multiple panels have unique IDs and preserve the learning editors', async ({ page }) => {
  await page.goto('/preview');
  const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
  expect(new Set(ids).size).toBe(ids.length);
  const link = page.locator('#brief-task + .finlay-field-hint a');
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#finlay-brief-voice')).toBeFocused();
  await expect(page.locator('#finlay-brief-voice details')).toHaveAttribute('open', '');
  await page.locator('#brief-task').fill('Draft a fictional invitation.');
  await expect(page.locator('#brief-output')).toHaveValue(/Draft a fictional invitation/);
  await page.getByRole('button', { name: 'Copy context brief', exact: true }).click();
  await expect(page.locator('#brief-task')).toHaveValue('Draft a fictional invitation.');
});

test('without JavaScript tips, voice setup and prompt text remain usable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 320, height: 950 } });
  try {
    const page = await context.newPage();
    await page.goto('/preview');
    const panel = page.locator('#finlay-brief-tips');
    await panel.getByText('How to start voice typing', { exact: true }).click();
    await expect(panel).toContainText('Windows key + H');
    await panel.getByText('Help me make a clearer request', { exact: true }).click();
    await expect(panel.locator('pre').first()).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Copy clearer-request prompt' })).toBeHidden();
    await expect(page.locator('[data-fallback]')).toBeVisible();
    await expect(page.locator('#page-6')).toContainText('your reflection stays in your own notes');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  } finally { await context.close(); }
});
