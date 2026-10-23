const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const credentials = JSON.parse(fs.readFileSync('trial/public-qa.json'));
// Explicit local-origin mode verifies the prepared app before DNS exists.
// Without this environment variable every request goes through public HTTPS.
test.beforeEach(async ({ context }) => {
  if (process.env.ORIENTATION_LOCAL_ORIGIN === '1') {
    await context.route('https://orientation.finlaymccall.com/**', async route => {
      const url = new URL(route.request().url());
      const response = await route.fetch({
        url: 'http://127.0.0.1:8789' + url.pathname + url.search,
        headers: { ...route.request().headers(), host: url.hostname },
        maxRedirects: 0,
      });
      await route.fulfill({ response });
    });
  }
});

test('public introduction, reading route and mobile layout', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Make a useful start with AI.' })).toBeVisible();
    await expect(page.locator('body')).toContainText('Accounts are currently provided by Finlay');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.screenshot({ path: `docs/trial/public-home-${width}.png`, fullPage: true });
    await page.getByRole('link', { name: 'Start with a useful task', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Get one useful result.', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Continue: give useful context', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Give your AI useful context', exact: true })).toBeVisible();
    await expect(page.locator('body')).toContainText('7. Save what you learned');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  }
});

test('free input comparison leads to editable instruction practice with accessible fallbacks', async ({ page, context, browser }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/free-tools');
  const table = page.getByRole('table', { name: 'Free AI tools: four ways to give an instruction' });
  await expect(table.locator('tbody tr')).toHaveCount(4);
  for (const name of ['Typed text', 'Voice', 'Files', 'Pictures']) await expect(table.getByRole('columnheader', { name, exact: true })).toBeVisible();
  await expect(table).toContainText('not the web app');
  await page.getByRole('link', { name: 'Try the guided text, voice, file and picture activities', exact: true }).click();
  await expect(page).toHaveURL(/before-you-start#meet-your-ai/);
  const practice = page.locator('.input-practice');
  for (const [title, key] of [
    ['Type or paste an instruction', 'text'], ['Speak an instruction', 'voice'],
    ['Give an instruction with a file', 'file'], ['Give an instruction with a picture', 'picture'],
  ]) {
    const panel = practice.locator('details').filter({ has: page.getByText(title, { exact: true }) });
    if (!(await panel.evaluate(el => el.open))) await panel.locator('summary').click();
    const input = panel.locator('textarea');
    await input.fill(`My useful ${key} instruction <img src=x>`);
    await panel.getByRole('button', { name: 'Copy this instruction', exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`My useful ${key} instruction <img src=x>`);
    await expect(panel.locator('img')).toHaveCount(0);
  }
  await page.evaluate(() => Object.defineProperty(navigator.clipboard, 'writeText', { value: async () => { throw new Error('Denied'); } }));
  await practice.locator('details').last().getByRole('button').click();
  await expect(practice.locator('[role="status"]')).toContainText('instruction is selected');
  expect(await practice.locator('#input-picture').evaluate(el => el.selectionEnd - el.selectionStart)).toBeGreaterThan(10);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 950 });
    for (const url of ['/free-tools', '/before-you-start#meet-your-ai']) {
      await page.goto(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    }
    await page.locator('.ai-inputs').screenshot({ path: `docs/trial/input-table-${width}.png` });
    await practice.screenshot({ path: `docs/trial/input-practice-${width}.png` });
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const fallback = await nojs.newPage();
    await fallback.goto('https://orientation.finlaymccall.com/before-you-start#meet-your-ai');
    await expect(fallback.locator('.input-table tbody tr')).toHaveCount(4);
    await fallback.getByText('Give an instruction with a picture', { exact: true }).click();
    await expect(fallback.locator('#input-picture')).toBeVisible();
    await expect(fallback.locator('[data-copy-input]').last()).toBeHidden();
  } finally { await nojs.close(); }
});

test('deeper courses are public, readable without scripts and distinguish reuse permissions', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('https://orientation.finlaymccall.com/');
    await page.getByRole('link', { name: 'Go deeper: courses and videos', exact: true }).click();
    await expect(page).toHaveURL(/deeper-courses$/);
    await expect(page.getByRole('heading', { name: 'Go deeper: courses and videos', exact: true })).toBeVisible();
    await expect(page.locator('.resource-table tbody tr')).toHaveCount(7);
    await expect(page.locator('.resource-table')).toContainText('Skilljar');
    await expect(page.locator('.resource-table')).toContainText('sign in or join');
    await page.locator('#reuse summary').click();
    await expect(page.locator('#reuse')).toContainText('not Creative Commons');
    await expect(page.locator('#reuse')).toContainText('CC BY-NC-ND 4.0');
    await expect(page.locator('#reuse')).toContainText('CC BY-NC-SA 4.0');
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 950 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
      const region = page.getByRole('region', { name: 'Deeper courses comparison' });
      await region.focus();
      await page.keyboard.press('End');
      if (width === 390) expect(await region.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
      else expect(await region.evaluate(el => el.scrollWidth > el.clientWidth + 1)).toBe(false);
      await page.screenshot({ path: `docs/trial/deeper-courses-${width}.png`, fullPage: true });
    }
    await page.getByRole('link', { name: 'the context lesson', exact: true }).click();
    await expect(page).toHaveURL(/preview$/);
  } finally { await context.close(); }
});

test('brief builder copies selected context, protects drafts and supports examples and mobile', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/preview#page-2');
  const widget = page.locator('.context-brief');
  const copy = widget.getByRole('button', { name: 'Copy context brief', exact: true });
  await expect(copy).toBeDisabled();
  await widget.getByLabel(/^The task/).fill('Draft an invitation <img src=x onerror=alert(1)>');
  await widget.getByLabel('One kind of detail I left out, and why', { exact: false }).fill('PRIVATE-LEARNING-NOTE');
  await copy.click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('Draft an invitation <img');
  expect(copied).not.toContain('PRIVATE-LEARNING-NOTE');
  await expect(widget.locator('img')).toHaveCount(0);
  await widget.getByRole('button', { name: 'Use a random example', exact: true }).click();
  await widget.getByRole('button', { name: 'Keep my entries', exact: true }).click();
  await expect(widget.locator('[data-field="omitted"]')).toHaveValue('PRIVATE-LEARNING-NOTE');
  await page.reload();
  await expect(widget.locator('[data-field="omitted"]')).toHaveValue('PRIVATE-LEARNING-NOTE');
  await widget.getByRole('button', { name: 'Use a random example', exact: true }).click();
  await widget.getByRole('button', { name: 'Yes, replace my entries', exact: true }).click();
  await expect(widget.locator('[data-output="brief"]')).toHaveValue(/Fictional practice scenario/);
  await expect(widget.locator('[data-field="omitted"]')).toBeEmpty();
  for (const name of ['included detail', 'left-out detail', 'prediction']) {
    await widget.getByRole('button', { name: `Use an example: ${name}`, exact: true }).click();
  }
  await expect(widget.locator('[data-output="notes"]')).toHaveValue(/Fictional example:/);
  await copy.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).not.toContain('Fictional example:');
  await page.evaluate(() => Object.defineProperty(navigator.clipboard, 'writeText', { value: async () => { throw new Error('Denied'); } }));
  await widget.getByRole('button', { name: 'Copy my learning notes', exact: true }).click();
  await expect(widget.locator('[data-output="notes"]')).toBeVisible();
  await expect(widget.locator('[role="status"]')).toContainText('text is selected');
  expect(await widget.locator('[data-output="notes"]').evaluate(el => el.selectionEnd - el.selectionStart)).toBeGreaterThan(20);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await widget.screenshot({ path: `docs/trial/brief-builder-${width}.png` });
  }
  await widget.getByRole('button', { name: 'Clear draft', exact: true }).click();
  await widget.getByRole('button', { name: 'Yes, replace my entries', exact: true }).click();
  await page.reload();
  await expect(widget.locator('[data-field="task"]')).toBeEmpty();
});

test('try workspace carries the brief, preserves a started comparison and copies a practice record', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/preview#page-3');
  const trial = page.locator('.context-trial');
  const builder = page.locator('.context-brief');
  const field = key => trial.locator(`[data-try-field="${key}"]`);
  await expect(trial.locator('[data-try-missing]')).toBeVisible();
  await builder.locator('[data-field="task"]').fill('Draft a short invitation');
  await builder.locator('[data-field="success"]').fill('Leave the date undecided');
  await builder.locator('[data-field="prediction"]').fill('Use a date placeholder');
  await builder.locator('[data-field="omitted"]').fill('PRIVATE-NOTE');
  const prompt = await builder.locator('[data-output="brief"]').inputValue();
  await expect(field('prompt')).toHaveValue(prompt);
  await expect(field('success')).toHaveValue('Leave the date undecided');
  await expect(field('prediction')).toHaveValue('Use a date placeholder');
  await trial.getByRole('button', { name: 'Copy brief for my AI', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(prompt);
  await field('response').fill('Come on Saturday! <img src=x onerror=alert(1)>');
  await field('observation').fill('It invented a date.');
  await builder.locator('[data-field="prediction"]').fill('Ask me for the date');
  await expect(trial.locator('[data-try-changed]')).toBeVisible();
  await expect(field('prediction')).toHaveValue('Use a date placeholder');
  await page.reload();
  await expect(field('response')).toHaveValue(/Come on Saturday!/);
  await expect(trial.locator('img')).toHaveCount(0);
  await trial.getByRole('button', { name: 'Give me a follow-up starter', exact: true }).click();
  await trial.getByRole('button', { name: 'Copy my follow-up', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Leave the date undecided');
  await trial.getByRole('button', { name: 'Copy my practice record', exact: true }).click();
  const record = await page.evaluate(() => navigator.clipboard.readText());
  expect(record).toContain('AI response (unverified)');
  expect(record).toContain('It invented a date.');
  expect(record).not.toContain('PRIVATE-NOTE');
  await trial.getByRole('button', { name: 'Use my latest brief', exact: true }).click();
  await trial.getByRole('button', { name: 'Keep this try', exact: true }).click();
  await expect(field('response')).toHaveValue(/Come on Saturday!/);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await trial.screenshot({ path: `docs/trial/try-workspace-${width}.png` });
  }
  await page.evaluate(() => Object.defineProperty(navigator.clipboard, 'writeText', { value: async () => { throw new Error('Denied'); } }));
  await trial.getByRole('button', { name: 'Copy my practice record', exact: true }).click();
  await expect(trial.locator('[data-try-report]')).toBeVisible();
  expect(await trial.locator('[data-try-report]').evaluate(el => el.selectionEnd - el.selectionStart)).toBeGreaterThan(20);
  await trial.getByRole('button', { name: 'Use my latest brief', exact: true }).click();
  await trial.getByRole('button', { name: 'Start again', exact: true }).click();
  await expect(field('response')).toBeEmpty();
  await expect(field('prediction')).toHaveValue('Ask me for the date');
  await expect(trial.locator('[data-try-changed]')).toBeHidden();
  await field('response').fill('A second response');
  await trial.getByRole('button', { name: 'Clear this try', exact: true }).click();
  await trial.getByRole('button', { name: 'Start again', exact: true }).click();
  await page.reload();
  await expect(field('response')).toBeEmpty();
  await expect(field('prompt')).toHaveValue(prompt);
});

test('brief builder retains a readable fallback and works when browser storage is unavailable', async ({ browser }) => {
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await nojs.newPage();
    await page.goto('https://orientation.finlaymccall.com/preview#page-2');
    await expect(page.locator('.context-brief [data-fallback]')).toContainText('I would like help with [small task]');
    await expect(page.getByRole('button', { name: 'Copy context brief', exact: true })).toBeHidden();
    await expect(page.locator('[data-try-fallback]')).toContainText('copy them manually');
    await expect(page.locator('#copy-paste')).toBeVisible();
  } finally { await nojs.close(); }
  const blocked = await browser.newContext();
  try {
    await blocked.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('Storage blocked'); }; });
    const page = await blocked.newPage();
    await page.goto('https://orientation.finlaymccall.com/preview#page-2');
    await page.locator('[data-field="task"]').fill('Plan a small task');
    await expect(page.locator('[data-storage]')).toContainText('cannot keep a temporary draft');
    await expect(page.locator('[data-output="brief"]')).toHaveValue(/Plan a small task/);
    await expect(page.locator('[data-try-field="prompt"]')).toHaveValue(/Plan a small task/);
    await expect(page.locator('[data-try-storage]')).toContainText('Temporary storage is unavailable');
  } finally { await blocked.close(); }
});

test('pilot login, policy, lesson completion and saved return visit', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  let carried;
  async function login() {
    await page.goto('/login/index.php');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.M?.util?.pending_js?.length === 0);
    await page.locator('#username').fill(credentials.username);
    await page.locator('#password').fill(credentials.password);
    await Promise.all([
      page.waitForURL(url => !url.pathname.endsWith('/login/index.php')),
      page.locator('#loginbtn').click(),
    ]);
    if (page.url().includes('/user/policy.php')) await page.getByRole('button', { name: 'Yes', exact: true }).click();
    await page.goto('/course/view.php?id=2');
    if (page.url().includes('/user/policy.php')) {
      await page.getByRole('button', { name: 'Yes', exact: true }).click();
      await page.goto('/course/view.php?id=2');
    }
    await expect(page.locator('#user-menu-toggle')).toBeVisible();
  }
  await login();
  await page.getByRole('link', { name: 'Go deeper: courses and videos', exact: false }).first().click();
  await expect(page).toHaveURL(/\/mod\/page\/view.php\?id=/);
  await expect(page.locator('.resource-table tbody tr')).toHaveCount(7);
  await page.getByRole('link', { name: 'files, folders and AI-interface practice', exact: true }).click();
  await expect(page).toHaveURL(/\/mod\/page\/view.php\?id=2/);
  await page.goto('/course/view.php?id=2');
  await page.getByRole('link', { name: 'Files, notes and AI basics — optional help', exact: false }).first().click();
  await expect(page.locator('#region-main')).toContainText('The find-it-again scavenger hunt');
  await expect(page.getByRole('heading', { name: 'Next: get to know your AI’s interface' })).toBeVisible();
  await expect(page.locator('.input-table tbody tr')).toHaveCount(4);
  await page.locator('.input-practice details').first().getByRole('button').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('fictional community gathering');
  await page.getByRole('link', { name: 'Set up Obsidian with the step-by-step guide', exact: true }).click();
  await expect(page).toHaveURL(/\/mod\/page\/view.php\?id=/);
  await expect(page.locator('#region-main')).toContainText('3. Make one useful note');
  await page.getByRole('link', { name: 'Continue to the AI lesson', exact: true }).click();
  await expect(page).toHaveURL(/\/mod\/lesson\/view.php\?id=1/);
  const cookie = (await context.cookies()).find(c => c.name.startsWith('MoodleSession'));
  expect(cookie.secure).toBe(true);
  expect(cookie.httpOnly).toBe(true);
  await page.goto('/mod/lesson/view.php?id=1');
  for (let i = 1; i <= 5; i++) {
    await expect(page.locator('#region-main')).toContainText(`${i}.`);
    if (i === 2) {
      await expect(page.locator('#region-main')).toContainText('Finlay’s tip · Keep notes you can reuse');
      await expect(page.getByRole('link', { name: 'Follow the Obsidian setup guide' })).toHaveAttribute('href', /\/mod\/page\/view.php\?id=/);
    }
    if (i === 3) {
      const widget = page.locator('.context-brief');
      await widget.getByRole('button', { name: 'Use a random example', exact: true }).click();
      await expect(widget.locator('[data-output="brief"]')).toHaveValue(/Fictional practice scenario/);
      await widget.getByRole('button', { name: 'Use an example: prediction', exact: true }).click();
      await expect(widget.locator('[data-field="prediction"]')).toHaveValue(/Fictional example:/);
      await widget.getByRole('button', { name: 'Copy context brief', exact: true }).click();
      await expect(widget.locator('[role="status"]')).toContainText(/copied|text is selected/);
      await page.reload();
      await expect(widget.locator('[data-field="prediction"]')).toHaveValue(/Fictional example:/);
      carried = {
        prompt: await widget.locator('[data-output="brief"]').inputValue(),
        prediction: await widget.locator('[data-field="prediction"]').inputValue(),
        success: await widget.locator('[data-field="success"]').inputValue(),
      };
      const response = page.waitForRequest(request => request.method() === 'POST' && request.url().includes('/mod/lesson/'));
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      expect([...new URLSearchParams((await response).postData()).values()].join(' ')).not.toContain('Fictional example:');
      continue;
    }
    if (i === 4) {
      const trial = page.locator('.context-trial');
      for (const key of ['prompt', 'prediction', 'success']) await expect(trial.locator(`[data-try-field="${key}"]`)).toHaveValue(carried[key]);
      await trial.getByRole('button', { name: 'Copy brief for my AI', exact: true }).click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(carried.prompt);
      await trial.locator('[data-try-field="response"]').fill('Synthetic AI response brought back from another app.');
      await trial.locator('[data-try-field="observation"]').fill('I compared this with my saved prediction.');
      await page.reload();
      await expect(trial.locator('[data-try-field="response"]')).toHaveValue('Synthetic AI response brought back from another app.');
      await trial.getByRole('button', { name: 'Give me a follow-up starter', exact: true }).click();
      await expect(trial.locator('[data-try-field="correction"]')).toHaveValue(new RegExp('Please check your answer'));
      const sent = page.waitForRequest(request => request.method() === 'POST' && request.url().includes('/mod/lesson/'));
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      expect([...new URLSearchParams((await sent).postData()).values()].join(' ')).not.toContain('Synthetic AI response');
      continue;
    }
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
  }
  await page.getByLabel('Check what context the tool actually has, share the relevant brief deliberately, and inspect the result.', { exact: true }).check();
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator('textarea').fill('Synthetic public deployment check: I included an undecided date, kept private details out, checked for placeholders and will reuse a brief.');
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.locator('#region-main')).toContainText('Your reflection has been saved');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('#region-main')).toContainText('Your lesson is complete');
  await context.clearCookies();
  await login();
  await expect(page.locator('body')).toContainText('Done');
  await page.goto('/mod/lesson/edit.php?id=1');
  await expect(page.locator('#region-main')).toContainText('Sorry');
});

test('preparation and notes guide work without JavaScript and provide a real practice file', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, acceptDownloads: true });
  try {
    const page = await context.newPage();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('https://orientation.finlaymccall.com/');
      await page.getByRole('link', { name: 'Open this activity: Files, notes and AI basics — optional help', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Find your way around files and folders', exact: true })).toBeVisible();
      await page.getByText('Windows: use File Explorer', { exact: true }).click();
      await page.getByText('Check your answer: access', { exact: true }).click();
      await expect(page.getByText('No. The path alone', { exact: false })).toBeVisible();
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('link', { name: 'Download the small practice note', exact: true }).click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('orientation-practice.md');
      expect(fs.readFileSync(await download.path(), 'utf8')).toContain('Found it again!');
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
      await page.screenshot({ path: `docs/trial/preparation-${width}.png`, fullPage: true });
      await page.getByRole('link', { name: 'Set up Obsidian with the step-by-step guide', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'A home for your notes with Obsidian', exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
      await page.screenshot({ path: `docs/trial/notes-${width}.png`, fullPage: true });
      await page.getByRole('link', { name: 'Continue to the AI lesson', exact: true }).click();
      await expect(page.locator('.finlay-tip').filter({ hasText: 'Keep notes you can reuse' })).toBeVisible();
    }
  } finally { await context.close(); }
});

test('account availability matches the expected release mode, recovery is clear and private files are denied', async ({ page }) => {
  const mode = process.env.ORIENTATION_EXPECTED_ACQUISITION || 'closed';
  expect(['closed', 'pilot', 'public']).toContain(mode);
  await page.goto('/login/index.php');
  if (mode === 'closed') await expect(page.locator('body')).toContainText('Public registration is not open yet');
  if (mode === 'pilot') await expect(page.locator('body')).toContainText('Registration is limited to invited pilot learners');
  await page.goto('/login/signup.php');
  await expect(page.locator('#id_email')).toHaveCount(mode === 'closed' ? 0 : 1);
  // This checks published availability only; the isolated native suite proves exact-address enforcement.
  await page.goto('/login/forgot_password.php');
  await expect(page.locator('body')).toContainText('Search by email address');
  for (const path of ['/.git/config', '/config.php', '/composer.json', '/vendor/autoload.php', '/admin/cli/cron.php']) {
    const response = await page.goto(path);
    expect(response.status(), path).toBe(404);
  }
});

test('public AI context accepts plain HTTP clients without a bot challenge', async ({ request }) => {
  const headers = { 'User-Agent': 'Python-urllib/3.12' };
  for (const path of ['/ai/context.md', ...['2026-10-13.1', '2026-10-13.2', '2026-10-13.3', '2026-10-23.1']
    .map(version => `/ai/releases/${version}/context.md`)]) {
    const response = await request.get(path, { headers });
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type']).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toContain('# ');
  }
  for (const path of ['/ai/', '/robots.txt']) {
    const response = await request.get(path, { headers });
    expect(response.status(), path).toBe(200);
  }
});

test('public AI context works without login, with copying and a manual fallback', async ({ page, context, browser }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/ai/');
  await expect(page.getByRole('heading', { name: 'Give your AI a little course context.' })).toBeVisible();
  const manifest = await page.evaluate(async () => (await fetch('/ai/course.json')).json());
  expect(manifest.authentication_required).toBe(false);
  expect(manifest.schema_version).toBe('1.2');
  const schema = await page.evaluate(async url => (await fetch(url)).json(), manifest.$schema);
  expect(schema.properties.schema_version.const).toBe(manifest.schema_version);
  expect(schema.required).toContain('content_license');
  expect(manifest.github_url).toBe('https://github.com/drfinlaymccall/human-ai-orientation');
  const read = await page.evaluate(async url => {
    const response = await fetch(url);
    return { status: response.status, contentType: response.headers.get('content-type'), text: await response.text() };
  }, manifest.context_url);
  expect(read.status).toBe(200);
  // Gemini URL context lists text/plain as supported; text/markdown is not listed.
  expect(read.contentType).toBe('text/plain; charset=utf-8');
  expect(read.text).toContain('Version: ' + manifest.context_version);
  expect(read.text).toContain('Do not sign in to Moodle');
  await page.getByRole('button', { name: 'Copy starter prompt', exact: true }).click();
  const prompt = await page.locator('#starter').inputValue();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(prompt);
  expect(prompt).toContain(manifest.context_url);
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', { value: async () => { throw new Error('Denied'); } });
  });
  await page.getByText('Context text to read or paste', { exact: true }).click();
  await page.getByRole('button', { name: 'Copy context text', exact: true }).click();
  await expect(page.locator('#copy-status')).toContainText('Automatic copying is unavailable');
  // Browser selections omit a final line break; all substantive text must match.
  expect((await page.evaluate(() => window.getSelection().toString())).trimEnd()).toBe(read.text.trimEnd());
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.screenshot({ path: `docs/trial/ai-context-${width}.png`, fullPage: true });
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const plain = await nojs.newPage();
  await plain.goto('/ai/');
  await expect(plain.locator('#starter')).toHaveValue(prompt);
  await plain.getByText('Context text to read or paste', { exact: true }).click();
  await expect(plain.locator('#context-text')).toBeVisible();
  await nojs.close();
});

test('portfolio journey works publicly and in Moodle with saved manual progress', async ({ page }) => {
  const ids = JSON.parse(fs.readFileSync('trial/journey.json'));
  await page.goto('/journey');
  await page.locator('[data-atlas-choice="portfolio"]').click();
  await page.getByRole('link', { name: 'Open this activity: Save your context for next time', exact: true }).click();
  await expect(page.locator('[data-portfolio-field="about"]')).toBeVisible();
  await page.locator('[data-portfolio-field="about"]').fill('Synthetic learner: a neighbourhood book swap.');
  await page.goto('/login/index.php');
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => window.M?.util?.pending_js?.length === 0);
  await page.locator('#username').fill(credentials.username);
  await page.locator('#password').fill(credentials.password);
  await Promise.all([page.waitForURL(url => !url.pathname.endsWith('/login/index.php')), page.locator('#loginbtn').click()]);
  if (page.url().includes('/user/policy.php')) await page.getByRole('button', { name: 'Yes', exact: true }).click();
  await page.goto(`/mod/page/view.php?id=${ids.journey}`);
  if (page.url().includes('/user/policy.php')) {
    await page.getByRole('button', { name: 'Yes', exact: true }).click();
    await page.goto(`/mod/page/view.php?id=${ids.journey}`);
  }
  await expect(page.getByRole('link', { name: 'Open this activity: Save your context for next time', exact: true })).toHaveAttribute('href', `/mod/page/view.php?id=${ids.portfolio}`);
  await page.getByRole('link', { name: 'Open this activity: Save your context for next time', exact: true }).click();
  await expect(page.locator('[data-portfolio-field="about"]')).toHaveValue('Synthetic learner: a neighbourhood book swap.');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    if (width === 390) {
      const close = page.locator('#theme_boost-drawers-courseindex').getByRole('button', { name: /Close/ });
      if (await close.isVisible()) await close.click();
    }
    await page.screenshot({ path: `docs/trial/native-portfolio-${width}.png`, fullPage: true });
  }
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download backup for restoring', exact: true }).click();
  const backup = fs.readFileSync(await (await download).path(), 'utf8');
  expect(JSON.parse(backup).fields.about).toContain('Synthetic learner');
  await page.goto(`/mod/page/view.php?id=${ids['first-task']}`);
  await page.getByRole('button', { name: /Mark .* as done/ }).click();
  const completed = page.locator('[data-action="toggle-manual-completion"][data-toggletype="manual:undo"]');
  await expect(completed).toBeVisible();
  await page.reload();
  await expect(completed).toBeVisible();
  await page.goto(`/mod/page/view.php?id=${ids['check-and-continue']}`);
  await expect(page.locator('[data-portfolio-field="nextGoal"]')).toBeVisible();
  await page.locator('[data-portfolio-field="nextGoal"]').fill('Synthetic next goal.');
  await page.reload();
  await expect(page.locator('[data-portfolio-field="nextGoal"]')).toHaveValue('Synthetic next goal.');
  await page.goto('/help');
  await expect(page.getByRole('link', { name: 'hi@finlaymccall.com', exact: true })).toHaveAttribute('href', /^mailto:hi@finlaymccall.com/);
});

test('captured native reset link changes a synthetic password and permits sign-in', async ({ page, browser }) => {
  const reset = JSON.parse(fs.readFileSync('trial/public-qa-reset.json'));
  await page.goto('/login/forgot_password.php?token=' + encodeURIComponent(reset.token));
  await page.locator('#id_password').fill(reset.password);
  await page.locator('#id_password2').fill(reset.password);
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.waitForLoadState('networkidle');
  const fresh = await browser.newContext();
  try {
    const login = await fresh.newPage();
    await login.goto('https://orientation.finlaymccall.com/login/index.php');
    await login.waitForLoadState('networkidle');
    await login.waitForFunction(() => window.M?.util?.pending_js?.length === 0);
    await login.locator('#username').fill(credentials.username);
    await login.locator('#password').fill(reset.password);
    await Promise.all([login.waitForURL(url => !url.pathname.endsWith('/login/index.php')), login.locator('#loginbtn').click()]);
    if (login.url().includes('/user/policy.php')) await login.getByRole('button', { name: 'Yes', exact: true }).click();
    await login.goto('https://orientation.finlaymccall.com/course/view.php?id=2');
    if (login.url().includes('/user/policy.php')) await login.getByRole('button', { name: 'Yes', exact: true }).click();
    await expect(login.locator('#user-menu-toggle')).toBeVisible();
  } finally { await fresh.close(); }
});
