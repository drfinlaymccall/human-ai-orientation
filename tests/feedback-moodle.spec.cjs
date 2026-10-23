/* Real, isolated Moodle HTTP/browser integration with fictional users and synthetic audio.
 * Provision using tests/feedback-integration.php first. Each complete run creates two teacher
 * submissions and one peer submission; reprovision before exceeding five/hour per learner.
 */
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const fixtures = JSON.parse(fs.readFileSync(process.env.FEEDBACK_FIXTURES || 'trial/feedback-fixtures.json', 'utf8'));
const formPath = `/local/orientationfeedback/index.php?courseid=${fixtures.courseid}&cmid=${fixtures.cmid}`;
const wav = Buffer.alloc(8044, 128);
wav.write('RIFF', 0); wav.writeUInt32LE(8036, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(8000, 28); wav.writeUInt16LE(1, 32); wav.writeUInt16LE(8, 34);
wav.write('data', 36); wav.writeUInt32LE(8000, 40);

async function login(page, kind) {
  await page.goto('/login/index.php');
  await page.locator('#username').fill(fixtures.users[kind].username);
  await page.locator('#password').fill(kind === 'reviewer' ? (process.env.FEEDBACK_REVIEWER_PASSWORD || 'SyntheticVoice7!') : fixtures.password);
  await page.locator('#loginbtn').click();
  await expect(page.locator('#password')).toHaveCount(0);
}

async function denied(request, url) {
  const response = await request.get(url, { maxRedirects: 0 });
  expect(response.headers()['content-type'] || '').not.toMatch(/^audio\//);
  expect((await response.body()).equals(wav)).toBe(false);
  return response;
}

test('private audio HTTP endpoint permits the author and denies peers, teachers and guests', async ({ page, browser }) => {
  await login(page, 'author');
  const audio = await page.request.get(fixtures.audio);
  expect(audio.ok()).toBe(true);
  expect(audio.headers()['content-type']).toMatch(/^audio\/(wav|x-wav)/);
  expect((await audio.body()).equals(wav)).toBe(true);
  await page.goto(`/local/orientationfeedback/index.php?id=${fixtures.recordid}`);
  await expect(page.getByRole('heading', { name: 'Feedback saved', exact: true })).toBeVisible();
  for (const kind of ['peer', 'teacher']) {
    const context = await browser.newContext(); const member = await context.newPage();
    await login(member, kind);
    await denied(member.request, fixtures.audio);
    await member.goto(`/local/orientationfeedback/index.php?id=${fixtures.recordid}`);
    await expect(member.locator('audio')).toHaveCount(0);
    await expect(member.getByText('You do not have access to this private feedback.', { exact: false })).toBeVisible();
    await member.goto('/local/orientationfeedback/inbox.php');
    await expect(member.locator('article audio')).toHaveCount(0);
    await expect(member.getByRole('heading', { name: 'Private feedback inbox', exact: true })).toHaveCount(0);
    await context.close();
  }
  const guest = await browser.newContext();
  const response = await denied(guest.request, fixtures.audio);
  expect([302, 303, 401, 403]).toContain(response.status());
  const guestPage = await guest.newPage();
  await guestPage.goto('/login/index.php');
  await guestPage.locator('#guestlogin button').click();
  await denied(guest.request, fixtures.audio);
  const guestSend = await guest.request.post('/local/orientationfeedback/index.php?format=json', {
    form: { courseid: fixtures.courseid, message: 'Synthetic guest rejection check' },
  });
  expect(guestSend.status()).toBe(403);
  expect(await guestSend.json()).toHaveProperty('error', 'You do not have access to this private feedback.');
  await guest.close();
});

test('without JavaScript, native text and valid WAV file submissions reach saved receipts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await login(page, 'teacher');
  await page.goto(formPath);
  await expect(page.locator('[data-voice-record]')).toBeHidden();
  await page.locator('textarea[name=message]').fill('Synthetic native text feedback: the fictional example helped.');
  await page.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Feedback saved', exact: true })).toBeVisible();
  await expect(page.getByText('Synthetic native text feedback: the fictional example helped.', { exact: true })).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(0);
  await page.goto(formPath);
  await page.locator('input[name=audio]').setInputFiles({ name: 'fictional-feedback.wav', mimeType: 'audio/wav', buffer: wav });
  await page.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Feedback saved', exact: true })).toBeVisible();
  const audio = await page.request.get(await page.locator('audio').getAttribute('src'));
  expect(audio.ok()).toBe(true);
  expect((await audio.body()).equals(wav)).toBe(true);
  await context.close();
});

test('activity context, actual MediaRecorder upload, playable private receipt and reviewer inbox agree', async ({ page, browser }) => {
  await login(page, 'peer');
  await page.goto(`/mod/page/view.php?id=${fixtures.cmid}`);
  const link = page.getByRole('link', { name: 'Send private course feedback', exact: true });
  await expect(link).toHaveAttribute('href', new RegExp(`courseid=${fixtures.courseid}.*cmid=${fixtures.cmid}`));
  await link.click();
  const form = page.locator('form[data-voice-feedback]');
  await expect(form.locator('input[name=courseid]')).toHaveValue(String(fixtures.courseid));
  await expect(form.locator('input[name=cmid]')).toHaveValue(String(fixtures.cmid));
  const marker = `Synthetic recorded activity feedback ${Date.now()}`;
  await form.locator('input[name=section]').fill('Fictional example heading');
  await form.locator('textarea[name=message]').fill(marker);
  let posts = 0; page.on('request', r => { if (r.method() === 'POST' && r.url().includes('/local/orientationfeedback/')) posts++; });
  await page.locator('[data-voice-record]').click();
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.waitForTimeout(800);
  await page.locator('[data-voice-stop]').click();
  const playback = page.locator('[data-voice-playback]');
  await expect(playback).toBeVisible();
  await expect.poll(() => playback.evaluate(a => a.readyState)).toBeGreaterThanOrEqual(2);
  await page.setViewportSize({ width: 390, height: 844 });
  const closeIndex = page.getByRole('button', { name: 'Close course index', exact: true });
  if (await closeIndex.isVisible()) await closeIndex.click();
  await expect(closeIndex).toBeHidden();
  await expect.poll(() => form.evaluate(f => Math.ceil(f.getBoundingClientRect().right) <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/orientation-feedback-moodle-mobile-synthetic.png', fullPage: true });
  expect(posts).toBe(0);
  const recorded = Buffer.from(await playback.evaluate(async a => Array.from(new Uint8Array(await (await fetch(a.src)).arrayBuffer()))));
  expect(recorded.length).toBeGreaterThan(100);
  expect(recorded.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))).toBe(true);
  const saved = page.waitForResponse(r => r.url().includes('/local/orientationfeedback/index.php?format=json'));
  await page.getByRole('button', { name: 'Send feedback', exact: true }).click();
  const response = await saved;
  expect(response.ok()).toBe(true);
  // The recorder navigates immediately after validating JSON; Chromium can discard
  // the fetch response body during navigation. Verify the actual saved receipt instead.
  await expect(page).toHaveURL(/\/local\/orientationfeedback\/index.php\?id=[1-9][0-9]*$/);
  await expect(page.getByRole('heading', { name: 'Feedback saved', exact: true })).toBeVisible();
  await expect(page.getByText(marker, { exact: true })).toBeVisible();
  expect(posts).toBe(1);
  const privateURL = await page.locator('audio').getAttribute('src');
  const stored = await page.request.get(privateURL);
  expect(stored.ok()).toBe(true);
  // libmagic labels audio-only WebM as video/webm on some hosts; bytes and decoder
  // playback below verify the stored container is the actual recorded audio.
  expect(stored.headers()['content-type']).toMatch(/^(audio|video)\/webm/);
  expect((await stored.body()).equals(recorded)).toBe(true);
  await expect.poll(() => page.locator('audio').evaluate(a => a.readyState)).toBeGreaterThanOrEqual(2);
  await page.locator('audio').evaluate(a => a.play());
  expect(await page.locator('audio').evaluate(a => !a.paused && a.duration > 0)).toBe(true);

  const reviewerContext = await browser.newContext();
  const reviewer = await reviewerContext.newPage();
  await login(reviewer, 'reviewer');
  await reviewer.goto('/local/orientationfeedback/inbox.php');
  const entry = reviewer.locator('article').filter({ hasText: marker });
  await expect(entry).toHaveCount(1);
  await expect(entry).toContainText('Fictional example heading');
  await expect(entry.getByRole('link', { name: /Synthetic voice feedback QA.*Synthetic visible activity/ })).toHaveAttribute('href', new RegExp(`/mod/page/view.php\\?id=${fixtures.cmid}$`));
  const reviewed = await reviewer.request.get(await entry.locator('audio').getAttribute('src'));
  expect(reviewed.ok()).toBe(true);
  expect((await reviewed.body()).equals(recorded)).toBe(true);
  await reviewerContext.close();
});
