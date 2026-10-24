const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const field = (page, key) => page.locator(`[data-portfolio-field="${key}"]`);
async function download(page, name) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name, exact: true }).click();
  return fs.readFileSync(await (await pending).path(), 'utf8');
}
async function upload(page, text) {
  await page.getByLabel('Restore a portfolio backup').setInputFiles({ name: 'portfolio.json', mimeType: 'application/json', buffer: Buffer.from(text) });
}

test('portable backup restores after storage is cleared and context excludes private practice', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/portfolio.html');
  await field(page, 'about').fill('I organise a neighbourhood book swap.');
  await field(page, 'preferences').fill('Ask one question at a time.');
  await field(page, 'project').fill('Plan our next swap.');
  await page.getByLabel('I have reviewed these context documents').check();
  await page.goto('/check-and-continue.html');
  await field(page, 'result').fill('PRIVATE-PRACTICE-RECORD');
  await field(page, 'nextGoal').fill('Plan the next event.');
  await page.goto('/portfolio.html');
  const backup = await download(page, 'Download backup for restoring');
  expect(JSON.parse(backup).fields.result).toBe('PRIVATE-PRACTICE-RECORD');
  const markdown = await download(page, 'Download all context documents');
  expect(markdown).toContain('neighbourhood book swap');
  expect(markdown).not.toContain('PRIVATE-PRACTICE-RECORD');
  expect(markdown).not.toContain('Plan the next event.');
  await page.getByRole('button', { name: 'Copy selected context', exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('neighbourhood book swap');
  expect(copied).not.toContain('Plan our next swap.');
  expect(copied).not.toContain('PRIVATE-PRACTICE-RECORD');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await upload(page, backup);
  await expect(field(page, 'about')).toHaveValue('I organise a neighbourhood book swap.');
  expect(JSON.parse(await download(page, 'Download backup for restoring'))).toEqual(JSON.parse(backup));
  await field(page, 'about').fill('A current unsaved edit');
  await expect(page.getByLabel('I have reviewed these context documents')).not.toBeChecked();
  await upload(page, backup);
  await page.getByRole('button', { name: 'Keep my current entries', exact: true }).click();
  await expect(field(page, 'about')).toHaveValue('A current unsaved edit');
  await upload(page, backup);
  await page.getByRole('button', { name: 'Replace my entries', exact: true }).click();
  await expect(field(page, 'about')).toHaveValue('I organise a neighbourhood book swap.');
});

test('invalid, oversized and unsafe imports cannot destroy entries or execute markup', async ({ page }) => {
  await page.goto('/portfolio.html');
  await field(page, 'about').fill('Keep this');
  const backup = JSON.parse(await download(page, 'Download backup for restoring'));
  for (const invalid of ['{broken', JSON.stringify({ ...backup, version: 999 }), JSON.stringify({ ...backup, fields: { ...backup.fields, about: 42 } }), 'x'.repeat(262145)]) {
    await upload(page, invalid);
    await expect(page.locator('[data-portfolio-status]')).toContainText('not imported');
    await expect(field(page, 'about')).toHaveValue('Keep this');
  }
  const unsafe = { ...backup, fields: { ...backup.fields, about: '<img src=x onerror="window.injected=1">' } };
  await upload(page, JSON.stringify(unsafe));
  await page.getByRole('button', { name: 'Replace my entries', exact: true }).click();
  await expect(field(page, 'about')).toHaveValue(unsafe.fields.about);
  await expect(page.locator('.portfolio-widget img')).toHaveCount(0);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
});

test('example replacement, blocked storage and clipboard retain usable controls without network submission', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw Error('blocked'); };
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw Error('blocked'); } } });
  });
  await page.goto('/portfolio.html');
  const sent = [];
  page.on('request', request => sent.push(request));
  await field(page, 'about').fill('LOCAL-ONLY-CONTENT');
  await expect(page.locator('[data-portfolio-storage]')).toContainText('Temporary storage is unavailable');
  await page.getByRole('button', { name: 'Copy selected context', exact: true }).click();
  await expect(page.locator('[data-portfolio-status]')).toContainText('text is selected');
  expect(await page.locator('[data-portfolio-output]').evaluate(el => el.selectionEnd - el.selectionStart)).toBeGreaterThan(10);
  await page.getByRole('button', { name: 'Try a fictional example', exact: true }).click();
  await page.getByRole('button', { name: 'Keep my current entries', exact: true }).click();
  await expect(field(page, 'about')).toHaveValue('LOCAL-ONLY-CONTENT');
  await page.getByRole('button', { name: 'Try a fictional example', exact: true }).click();
  await page.getByRole('button', { name: 'Replace my entries', exact: true }).click();
  expect(await download(page, 'Download all context documents')).toContain('Fictional practice example');
  // Account state is the sole permitted background read; editable text must never be submitted.
  for (const request of sent) {
    expect(request.url()).toBe(new URL('/local/orientation/state.php', page.url()).href);
    expect(request.method()).toBe('GET');
    expect(request.postData()).toBeNull();
    expect(JSON.stringify(await request.allHeaders())).not.toContain('LOCAL-ONLY-CONTENT');
  }
});

test('clear requires confirmation and removes same-tab content', async ({ page }) => {
  await page.goto('/portfolio.html');
  await field(page, 'about').fill('Temporary content');
  await page.getByRole('button', { name: 'Clear this portfolio', exact: true }).click();
  await page.getByRole('button', { name: 'Replace my entries', exact: true }).click();
  await page.reload();
  await expect(field(page, 'about')).toBeEmpty();
});

test('course pages work on mobile and without JavaScript, with synthetic screenshots', async ({ page, browser }, testInfo) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 950 });
    for (const name of ['journey', 'first-task', 'portfolio', 'check-and-continue']) {
      await page.goto(`/${name}.html`);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    }
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/portfolio.html');
    await page.getByRole('button', { name: 'Try a fictional example', exact: true }).click();
    await page.screenshot({ path: testInfo.outputPath(`portfolio-synthetic-${width}.png`), fullPage: true });
  }
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const plain = await context.newPage();
    await plain.goto('/portfolio.html');
    await expect(plain.locator('[data-portfolio-fallback]')).toBeVisible();
    await expect(plain.locator('[data-portfolio-fallback]')).toContainText('Working with me');
    await expect(plain.getByRole('button', { name: 'Download backup for restoring' })).toBeHidden();
    await plain.goto('/check-and-continue.html');
    await expect(plain.locator('[data-portfolio-fallback]')).toContainText('My next goal');
  } finally { await context.close(); }
});

// A maximal valid draft must still be restorable under the whole-file limit.
test('all valid field content fits the portable backup size limit', async ({ page }) => {
  await page.goto('/portfolio.html');
  const data = JSON.parse(await download(page, 'Download backup for restoring'));
  for (const key of Object.keys(data.fields)) data.fields[key] = '\u0001'.repeat(2000);
  const text = JSON.stringify(data);
  expect(Buffer.byteLength(text)).toBeLessThan(262144);
  await upload(page, text);
  const exported = await download(page, 'Download backup for restoring');
  expect(Buffer.byteLength(exported)).toBeLessThan(262144);
  expect(JSON.parse(exported)).toEqual(data);
});

test('restoring a cached page refreshes newer practice and dismisses stale replacement', async ({ page }) => {
  await page.goto('/portfolio');
  await field(page, 'about').fill('Keep my own context.');
  const initial = JSON.parse(await download(page, 'Download backup for restoring'));
  await page.getByRole('button', { name: 'Try a fictional example', exact: true }).click();
  // Model a newer record written by the next activity while this document is in the browser history cache.
  await page.evaluate(data => {
    data.fields.result = 'NEWER PRIVATE RESULT';
    sessionStorage.setItem('orientation.portfolio.v1', JSON.stringify(data));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  }, initial);
  await expect(page.locator('[data-portfolio-confirm]')).toBeHidden();
  await field(page, 'preferences').fill('One question at a time.');
  expect(JSON.parse(await download(page, 'Download backup for restoring')).fields.result).toBe('NEWER PRIVATE RESULT');
  await page.evaluate(() => {
    Storage.prototype.getItem = () => { throw Error('Storage blocked'); };
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await expect(field(page, 'preferences')).toHaveValue('One question at a time.');
  await expect(page.locator('[data-portfolio-storage]')).toContainText('Temporary storage is unavailable');
});

test('late file reads cannot replace a newer import or undo a clear action', async ({ page }) => {
  await page.goto('/portfolio');
  const base = JSON.parse(await download(page, 'Download backup for restoring'));
  await page.evaluate(() => {
    window.importReads = [];
    File.prototype.text = function () { return new Promise(resolve => window.importReads.push(resolve)); };
  });
  await upload(page, 'first');
  await upload(page, 'second');
  await page.evaluate(data => window.importReads[1](JSON.stringify(data)), { ...base, fields: { ...base.fields, about: 'Latest file' } });
  await expect(field(page, 'about')).toHaveValue('Latest file');
  await page.evaluate(data => window.importReads[0](JSON.stringify(data)), { ...base, fields: { ...base.fields, about: 'Stale file' } });
  await expect(field(page, 'about')).toHaveValue('Latest file');
  await expect(page.locator('[data-portfolio-confirm]')).toBeHidden();
  await upload(page, 'third');
  await page.getByRole('button', { name: 'Clear this portfolio', exact: true }).click();
  await page.getByRole('button', { name: 'Replace my entries', exact: true }).click();
  await page.evaluate(data => window.importReads[2](JSON.stringify(data)), base);
  await expect(field(page, 'about')).toHaveValue('');
  await expect(page.locator('[data-portfolio-confirm]')).toBeHidden();
});
