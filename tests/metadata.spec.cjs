const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const courseMap = JSON.parse(fs.readFileSync('content/course-map.json'));
const base = 'https://orientation.finlaymccall.com';
const localPath = url => new URL(url).pathname;

test('signed-out metadata describes the same five activities and working reading routes', async ({ page, request }) => {
  await page.goto('/ai/');
  const manifest = await (await request.get('/ai/course.json')).json();
  expect(manifest.authentication_required).toBe(false);
  expect(manifest.saved_progress_authentication_required).toBe(true);
  expect(manifest.saved_progress_url).toBe(base + '/local/orientation/index.php');
  expect(manifest.baseline_slugs).toEqual(courseMap.baseline_slugs);
  expect(manifest.activities).toHaveLength(courseMap.activities.length);
  const schema = await (await request.get(localPath(manifest.$schema))).json();
  expect(schema.properties.schema_version.const).toBe(manifest.schema_version);
  expect(schema.required).toContain('activities');
  const structured = await page.locator('script[type="application/ld+json"]').textContent();
  const metadata = JSON.parse(structured);
  expect(metadata.hasPart).toHaveLength(courseMap.activities.length);
  for (const [index, activity] of courseMap.activities.entries()) {
    const published = manifest.activities[index];
    for (const key of ['slug', 'label', 'version', 'updated_at', 'outcomes', 'role', 'baseline', 'optional']) {
      expect(published[key], `${activity.slug}: ${key}`).toEqual(activity[key]);
    }
    expect(published.public_url).toBe(base + activity.public_url);
    expect(metadata.hasPart[index].name).toBe(activity.label);
    expect(metadata.hasPart[index].url).toBe(published.public_url);
    const response = await request.get(activity.public_url);
    expect(response.status(), activity.public_url).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    await expect(page.getByRole('link', { name: activity.label, exact: true })).toHaveAttribute('href', published.public_url);
  }
  const latest = await (await request.get('/ai/context.md')).text();
  expect(await (await request.get(localPath(manifest.context_url))).text()).toBe(latest);
  expect(latest).toContain('Do not sign in to Moodle, submit answers, mark progress');
  expect(latest).toContain('not the edition a person previously practised');
  await page.goto('/');
  await expect(page.locator('link[rel="describedby"]')).toHaveAttribute('href', '/ai/course.json');
});

test('copy failure leaves all context selectable and no-JavaScript reading works on a phone', async ({ page, context, browser }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/ai/');
  await page.getByRole('button', { name: 'Copy starter prompt', exact: true }).click();
  const starter = await page.locator('#starter').inputValue();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(starter);
  expect(starter).toContain('/ai/releases/2026-10-24.1/context.md');
  await page.evaluate(() => Object.defineProperty(navigator.clipboard, 'writeText', {
    value: async () => { throw new Error('Synthetic clipboard denial'); },
  }));
  await page.getByText('Context text to read or paste', { exact: true }).click();
  const text = await page.locator('#context-text').textContent();
  await page.getByRole('button', { name: 'Copy context text', exact: true }).click();
  await expect(page.locator('#copy-status')).toContainText('Automatic copying is unavailable');
  expect((await page.evaluate(() => window.getSelection().toString())).trimEnd()).toBe(text.trimEnd());
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const plain = await nojs.newPage();
    await plain.goto('http://127.0.0.1:18803/ai/');
    await expect(plain.locator('#starter')).toHaveValue(starter);
    await plain.getByText('Context text to read or paste', { exact: true }).click();
    await expect(plain.locator('#context-text')).toBeVisible();
    await expect(plain.locator('#context-text')).toHaveText(text);
    expect(await plain.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  } finally { await nojs.close(); }
});
