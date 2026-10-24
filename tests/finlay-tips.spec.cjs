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
  page.on('request', request => sent.push(request));
  await page.locator('#brief-task').fill('PRIVATE SYNTHETIC TASK');
  const panel = page.locator('#finlay-brief-tips');
  await expect(panel.locator('[data-finlay-current]')).toHaveText('Writing: The task');
  await page.locator('#brief-task + .finlay-field-hint a').click();
  await expect(panel.locator('.finlay-voice-guide details')).toHaveAttribute('open', '');
  await expect(page.locator('#brief-task')).toHaveValue('PRIVATE SYNTHETIC TASK');
  // Account state and explicitly requested saved context are permitted background reads; editable text must never be submitted.
  for (const request of sent) {
    expect(['/local/orientation/state.php', '/local/orientation/context.php'].map(path => new URL(path, page.url()).href)).toContain(request.url());
    expect(request.method()).toBe('GET');
    expect(request.postData()).toBeNull();
    expect(JSON.stringify(await request.allHeaders())).not.toContain('PRIVATE SYNTHETIC TASK');
  }
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

test('desktop context floats right or left beside tips; smaller screens keep panels clear of the boxes', async ({ page }, testInfo) => {
  for (const width of [1920, 1440, 1100, 390, 320]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of ['/preview', '/portfolio', '/check-and-continue', '/before-you-start']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    }
    await page.goto('/first-task');
    const context = page.locator('[data-context-panel]');
    await expect(context).toBeVisible();
    const reading = await page.locator('main').boundingBox();
    const right = await context.boundingBox();
    if (width >= 1100) {
      expect(await context.evaluate(node => getComputedStyle(node).position)).toBe('fixed');
      expect(right.x).toBeGreaterThanOrEqual(reading.x + reading.width);
    } else {
      expect(await context.evaluate(node => getComputedStyle(node).position)).toBe('static');
    }
    await page.goto('/preview#page-2');
    const content = page.locator('#page-2 .finlay-writing-content');
    const panel = page.locator('#finlay-brief-tips');
    const c = await content.boundingBox();
    const p = await panel.boundingBox();
    const saved = await page.locator('[data-context-panel]').boundingBox();
    if (width >= 1100) expect(saved.x + saved.width).toBeLessThanOrEqual(c.x);
    if (width >= 1440) {
      expect(p.x).toBeGreaterThanOrEqual(c.x + c.width);
      await page.locator('#brief-prediction').focus();
      const sticky = await panel.boundingBox();
      expect(sticky.y).toBeGreaterThanOrEqual(0);
      expect(sticky.y).toBeLessThan(100);
      const floating = await page.locator('[data-context-panel]').boundingBox();
      expect(floating.y).toBeGreaterThanOrEqual(0);
      expect(floating.y + floating.height).toBeLessThanOrEqual(950);
    } else {
      expect(p.y).toBeGreaterThanOrEqual(c.y + c.height);
    }
    await panel.screenshot({ path: testInfo.outputPath(`tips-${width}.png`) });
    if (width === 1440) {
      await page.screenshot({ path: testInfo.outputPath('context-left-and-tips-right.png') });
      await page.emulateMedia({ media: 'print' });
      await expect(page.locator('[data-context-panel]')).toBeHidden();
      expect(await page.locator('body').evaluate(node => parseFloat(getComputedStyle(node).paddingLeft))).toBeLessThan(100);
      await page.emulateMedia({ media: 'screen' });
    }
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

test('without JavaScript tips appear only beside available writing fields', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 320, height: 950 } });
  try {
    const page = await context.newPage();
    await page.goto('/preview');
    await expect(page.locator('#finlay-brief-tips')).toBeHidden();
    await expect(page.locator('#finlay-try-tips')).toBeHidden();
    await expect(page.locator('[data-fallback]')).toBeVisible();
    await expect(page.locator('#page-6')).toContainText('your reflection stays in your own notes');
    for (const route of ['/portfolio', '/check-and-continue']) {
      await page.goto(route);
      await expect(page.locator('.finlay-tips')).toBeHidden();
      await expect(page.locator('[data-portfolio-fallback]')).toBeVisible();
    }
    await page.goto('/before-you-start');
    const panel = page.locator('#finlay-before-you-start-tips');
    await expect(page.locator('textarea').first()).toBeVisible();
    await panel.getByText('How to start voice typing', { exact: true }).click();
    await expect(panel).toContainText('Windows key + H');
    await panel.getByText('Help me make a clearer request', { exact: true }).click();
    await expect(panel.locator('pre').first()).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Copy clearer-request prompt' })).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  } finally { await context.close(); }
});


test('tips track hidden and unavailable fields, including a native editor outside the panel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto('/before-you-start');
  const scope = page.locator('.finlay-writing-surface');
  const panel = scope.locator('.finlay-tips');
  await scope.locator('textarea').evaluateAll(fields => fields.forEach(f => f.readOnly = true));
  await expect(panel).toBeHidden();
  expect((await page.locator('[data-context-panel]').boundingBox()).x).toBeGreaterThan(1000);
  const field = scope.locator('textarea').first();
  await field.evaluate(f => { f.readOnly = false; f.disabled = true; });
  await expect(panel).toBeHidden();
  await field.evaluate(f => { f.disabled = false; f.hidden = true; });
  await expect(panel).toBeHidden();
  await field.evaluate(f => f.hidden = false);
  await expect(panel).toBeVisible();
  expect((await page.locator('[data-context-panel]').boundingBox()).x).toBeLessThan(100);
  // Moodle puts its native essay editor outside the authored tips fragment.
  await scope.evaluate(root => {
    root.setAttribute('data-finlay-native-essay', '');
    const form = document.createElement('form'); root.before(form); form.append(root);
    root.querySelectorAll('textarea').forEach(f => f.remove());
  });
  await expect(panel).toBeHidden();
  expect((await page.locator('[data-context-panel]').boundingBox()).x).toBeGreaterThan(1000);
  await scope.evaluate(root => {
    const editor = document.createElement('textarea'); editor.name = 'answer_editor[text]';
    root.closest('form').append(editor);
  });
  await expect(panel).toBeVisible();
  await page.locator('textarea[name="answer_editor[text]"]').evaluate(f => f.disabled = true);
  await expect(panel).toBeHidden();
});
