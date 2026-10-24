/* Real, isolated Moodle HTTP/browser integration with fictional users and synthetic audio.
 * Provision using tests/feedback-integration.php first. Each complete run creates two teacher
 * submissions and one peer submission; reprovision before exceeding five/hour per learner.
 */
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const fixtures = JSON.parse(fs.readFileSync(process.env.FEEDBACK_FIXTURES || 'trial/feedback-fixtures.json', 'utf8'));
const formPath = `/local/orientationfeedback/index.php?courseid=${fixtures.courseid}&cmid=${fixtures.cmid}`;
const wav = Buffer.alloc(8044, 128);
wav.write('RIFF', 0); wav.writeUInt32LE(8036, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(8000, 28); wav.writeUInt16LE(1, 32); wav.writeUInt16LE(8, 34);
wav.write('data', 36); wav.writeUInt32LE(8000, 40);

async function loginReady(page) {
  // Core asynchronously replaces the password input while adding its visibility
  // toggle. Fill the finished form so that replacement cannot erase the password.
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => !window.M?.util?.pending_js?.length);
}

async function login(page, kind) {
  await page.goto('/login/index.php');
  await loginReady(page);
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

test('without JavaScript, native text and five-minute WAV submissions reach saved receipts', async ({ browser }) => {
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
  const fiveMinuteWav = Buffer.alloc(44 + 300 * 16000 * 2);
  wav.copy(fiveMinuteWav, 0, 0, 44);
  fiveMinuteWav.writeUInt32LE(fiveMinuteWav.length - 8, 4);
  fiveMinuteWav.writeUInt32LE(16000, 24); fiveMinuteWav.writeUInt32LE(32000, 28);
  fiveMinuteWav.writeUInt16LE(2, 32); fiveMinuteWav.writeUInt16LE(16, 34);
  fiveMinuteWav.writeUInt32LE(fiveMinuteWav.length - 44, 40);
  await page.locator('input[name=audio]').setInputFiles({ name: 'fictional-five-minute-feedback.wav', mimeType: 'audio/wav', buffer: fiveMinuteWav });
  await page.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Feedback saved', exact: true })).toBeVisible();
  const audio = await page.request.get(await page.locator('audio').getAttribute('src'));
  expect(audio.ok()).toBe(true);
  expect((await audio.body()).equals(fiveMinuteWav)).toBe(true);
  await context.close();
});

test('activity context, actual MediaRecorder upload, playable private receipt and reviewer inbox agree', async ({ page, browser }) => {
  await login(page, 'peer');
  await page.goto(`/mod/page/view.php?id=${fixtures.cmid}`);
  const link = page.getByRole('link', { name: 'Give feedback', exact: true });
  await expect(link).toHaveAttribute('href', new RegExp(`courseid=${fixtures.courseid}.*cmid=${fixtures.cmid}`));
  await page.goto(await link.getAttribute('href'));
  const form = page.locator('form[data-voice-feedback]');
  await expect(form.locator('input[name=courseid]')).toHaveValue(String(fixtures.courseid));
  await expect(form.locator('input[name=cmid]')).toHaveValue(String(fixtures.cmid));
  await expect(form.getByText('Up to five minutes.', { exact: false })).toBeVisible();
  await form.getByText('Upload audio or add a heading', { exact: true }).click();
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


test('Moodle feedback panel preserves context and draft, stops the microphone on close and saves inside the panel', async ({ page }) => {
  await page.addInitScript(() => {
    if (!navigator.mediaDevices) return;
    const get = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    window.panelTracks = [];
    navigator.mediaDevices.getUserMedia = async (...args) => {
      const stream = await get(...args); window.panelTracks.push(...stream.getTracks()); return stream;
    };
  });
  await login(page, 'author');
  await page.goto(`/mod/page/view.php?id=${fixtures.cmid}`);
  const original = page.url();
  const launch = page.getByRole('link', { name: 'Give feedback', exact: true });
  await launch.click();
  const dialog = page.getByRole('dialog', { name: 'Give feedback', exact: true });
  await expect(dialog).toBeVisible();
  const frame = page.frameLocator('iframe[title="Private feedback to Finlay"]');
  await expect(frame.getByRole('heading', { name: 'What would you like to share?', exact: true })).toBeVisible();
  await expect(frame.locator('nav.navbar')).toHaveCount(0);
  await expect(frame.locator('input[name=cmid]')).toHaveValue(String(fixtures.cmid));
  await frame.locator('textarea').fill('Synthetic compact-panel feedback');
  await frame.getByRole('button', { name: 'Record', exact: true }).click();
  await expect(frame.getByRole('button', { name: 'Stop', exact: true })).toBeVisible();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect.poll(() => frame.locator('body').evaluate(() => window.panelTracks.every(t => t.readyState === 'ended'))).toBe(true);
  await launch.click();
  await expect(frame.locator('textarea')).toHaveValue('Synthetic compact-panel feedback');
  await expect(frame.locator('audio')).toBeVisible();
  expect(page.url()).toBe(original);
  await page.screenshot({ path: '/tmp/orientation-feedback-panel-desktop.png', fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '/tmp/orientation-feedback-panel-mobile.png', fullPage: false });
  await frame.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(frame.getByRole('heading', { name: 'Feedback saved', exact: true })).toBeVisible();
  await expect(page.locator('iframe')).toHaveAttribute('src', /embedded=1/);
  expect(page.url()).toBe(original);
  const receiptAudio = frame.locator('audio');
  await expect.poll(() => receiptAudio.evaluate(a => a.readyState)).toBeGreaterThanOrEqual(2);
  await receiptAudio.evaluate(async a => { a.loop = true; await a.play(); });
  expect(await receiptAudio.evaluate(a => a.paused)).toBe(false);
  await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
  await expect.poll(() => receiptAudio.evaluate(a => a.paused)).toBe(true);
});

test('embedded signed-out feedback offers sign-in without loading a full login form inside the panel', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/local/orientationfeedback/index.php?embedded=1&source=home');
  await expect(page.getByRole('heading', { name: 'Help make the course better', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign in to give feedback', exact: true })).toHaveAttribute('target', '_top');
  await expect(page.locator('input[type=password]')).toHaveCount(0);
  await context.close();
});


for (const entry of ['anonymous', 'guest']) test(entry + ' Moodle sign-in redirects to the allowlisted public page and rejects external destinations', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  if (entry === 'guest') {
    await page.goto('/login/index.php');
    await page.locator('#guestlogin button').click();
  }
  await page.goto('/local/orientationfeedback/signin.php?source=journey');
  await expect(page).toHaveURL(/\/login\/index.php/);
  await loginReady(page);
  await page.locator('#username').fill(fixtures.users.author.username);
  await page.locator('#password').fill(fixtures.password);
  // Assert core's actual HTTP return; this isolated host does not serve the public
  // router. The complete rendered public round trip is checked against live HTTPS.
  const returned = page.waitForResponse(r => [302, 303].includes(r.status()) &&
    r.headers()['location'] === `${fixtures.wwwroot}/journey#feedback`);
  await page.locator('#loginbtn').click();
  expect((await returned).headers()['location']).toBe(`${fixtures.wwwroot}/journey#feedback`);
  await page.goto('/local/orientationfeedback/signin.php?source=https%3A%2F%2Fexample.test');
  await expect(page).toHaveURL(/\/local\/orientationfeedback\/index.php$/);
  await expect(page.getByRole('heading', { name: 'What would you like to share?' })).toBeVisible();
  await context.close();
});

// Only the parent shell is synthetic HTML: identity, login, form and receipt use real Moodle HTTP.
// This deliberately models privacy/recovery pages which have no course-context.js account event.
async function feedbackSessionShell(page) {
  await page.route('**/__synthetic-feedback-session-shell', route => route.fulfill({
    contentType: 'text/html', body: '<!doctype html><h1>Synthetic privacy page</h1><a data-feedback-launcher href="' + formPath.replaceAll('&', '&amp;') + '">Give feedback</a>',
  }));
  await page.goto('/__synthetic-feedback-session-shell');
  await page.addStyleTag({ content: fs.readFileSync(path.join(__dirname, '../moodle/local/orientationfeedback/launcher.css'), 'utf8') });
  await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, '../moodle/local/orientationfeedback/launcher.js'), 'utf8') });
  expect(await page.evaluate(() => Boolean(window.OrientationContext))).toBe(false);
}
async function changeFeedbackSession(context, kind) {
  const other = await context.newPage();
  try {
    await other.goto(formPath);
    const sesskey = await other.locator('input[name=sesskey]').inputValue();
    await other.goto('/login/logout.php?sesskey=' + encodeURIComponent(sesskey));
    const signedout = await other.request.get('/local/orientationfeedback/session.php');
    expect(await signedout.json()).toEqual({ owner: null });
    expect(signedout.headers()['set-cookie']).toBeUndefined();
    await login(other, kind);
  } finally { await other.close(); }
}
for (const saved of [false, true]) test('real account switch clears cached feedback ' + (saved ? 'saved receipt' : 'unsent draft') + ' without course-context.js', async ({ page, context }) => {
  await login(page, 'author');
  const cookies = await context.cookies();
  const identity = await page.request.get('/local/orientationfeedback/session.php');
  expect(identity.status()).toBe(200);
  expect(identity.headers()['cache-control']).toContain('private');
  expect(identity.headers()['cache-control']).toContain('no-store');
  expect(identity.headers()['set-cookie']).toBeUndefined();
  const owner = await identity.json();
  expect(Object.keys(owner)).toEqual(['owner']);
  expect(owner.owner).toMatch(/^[a-f0-9]{64}$/);
  const head = await page.request.head('/local/orientationfeedback/session.php');
  expect(head.status()).toBe(200);
  expect(await head.text()).toBe('');
  expect(head.headers()['set-cookie']).toBeUndefined();
  expect(await context.cookies()).toEqual(cookies);
  expect((await page.request.post('/local/orientationfeedback/session.php')).status()).toBe(405);
  await feedbackSessionShell(page);
  const launch = page.getByRole('link', { name: 'Give feedback', exact: true });
  await launch.click();
  const iframe = page.locator('iframe[title="Private feedback to Finlay"]');
  const frame = page.frameLocator('iframe[title="Private feedback to Finlay"]');
  await expect(frame.locator('textarea[name=message]')).toBeVisible();
  let previousText;
  if (saved) {
    await iframe.evaluate((element, id) => { element.src = '/local/orientationfeedback/index.php?embedded=1&id=' + id; }, fixtures.recordid);
    await expect(frame.getByRole('heading', { name: 'Feedback saved', exact: true })).toBeVisible();
    previousText = await frame.locator('.feedback-saved-note').textContent();
    expect(previousText.length).toBeGreaterThan(0);
    await expect(frame.locator('audio')).toBeVisible();
  } else {
    previousText = 'ACCOUNT-A-PRIVATE-SYNTHETIC-DRAFT';
    await frame.locator('textarea[name=message]').fill(previousText);
  }
  await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
  await changeFeedbackSession(context, 'peer');
  expect((await (await page.request.get('/local/orientationfeedback/session.php')).json()).owner).not.toBe(owner.owner);
  await launch.click();
  await expect(frame.getByRole('heading', { name: 'What would you like to share?', exact: true })).toBeVisible();
  await expect(frame.locator('textarea[name=message]')).toHaveValue('');
  await expect(frame.locator('.feedback-saved-note')).toHaveCount(0);
  await expect(frame.locator('audio')).toHaveCount(1); // Recorder's empty, hidden preview only.
  await expect(frame.locator('audio')).not.toBeVisible();
  expect(await frame.locator('body').textContent()).not.toContain(previousText);
});

test('native feedback expiry probe preserves the retained session and prevents reopening its cached receipt', async ({ page, context }) => {
  test.setTimeout(120000);
  const root = path.resolve(__dirname, '..');
  const fixture = path.join(root, 'trial/context-fixture');
  const base = 'http://127.0.0.1:18842';
  if (fixtures.synthetic !== true || fixtures.wwwroot !== base || fs.lstatSync(fixture).isSymbolicLink()) {
    throw new Error('Expiry mutation requires the independent synthetic context fixture on port 18842.');
  }
  const prelude = `define('CLI_SCRIPT',true); require ${JSON.stringify(path.join(root, 'scripts/moodle-environment.php'))}; require_once ${JSON.stringify(path.join(root, 'scripts/synthetic-fixture.php'))}; if($CFG->wwwroot!==${JSON.stringify(base)} || !orientation_is_synthetic_fixture($orientationtrial,$CFG)) throw new RuntimeException('Fixture only'); `;
  const php = code => execFileSync(path.join(root, 'scripts/fixture-php'), ['-r', prelude + code], {
    cwd: root, env: { ...process.env, ORIENTATION_TRIAL_DIR: fixture }, encoding: 'utf8',
  });
  // Validate the actual DB, dataroot and capture transport before writing any fixture file.
  php('echo "Synthetic context fixture verified";');
  const endpoint = `feedback-session-fixture-${Date.now()}.php`;
  const endpointPath = path.join(fixture, 'moodle', endpoint);
  const pending = base + formPath;
  fs.writeFileSync(endpointPath, `<?php require __DIR__.'/config.php'; require_once ${JSON.stringify(path.join(root, 'scripts/synthetic-fixture.php'))}; if($CFG->wwwroot!==${JSON.stringify(base)} || !orientation_is_synthetic_fixture(dirname(__DIR__),$CFG)) throw new RuntimeException('Fixture only'); require_login(); $SESSION->wantsurl=${JSON.stringify(pending)}; header('Content-Type: application/json'); echo json_encode(['seeded'=>true]);`);
  try {
    await login(page, 'author');
    await feedbackSessionShell(page);
    const launch = page.getByRole('link', { name: 'Give feedback', exact: true });
    await launch.click();
    const iframe = page.locator('iframe[title="Private feedback to Finlay"]');
    const frame = page.frameLocator('iframe[title="Private feedback to Finlay"]');
    await expect(frame.locator('textarea[name=message]')).toBeVisible();
    await iframe.evaluate((element, id) => { element.src = '/local/orientationfeedback/index.php?embedded=1&id=' + id; }, fixtures.recordid);
    await expect(frame.getByRole('heading', { name: 'Feedback saved', exact: true })).toBeVisible();
    const privateText = await frame.locator('.feedback-saved-note').textContent();
    expect(privateText.length).toBeGreaterThan(0);
    await expect(frame.locator('audio')).toBeVisible();
    const cachedFrame = await iframe.elementHandle();
    await page.getByRole('button', { name: 'Close feedback', exact: true }).click();

    // Seed a real pending destination through Moodle's normal session writer, then retain its cookie.
    expect(await (await page.request.get('/' + endpoint)).json()).toEqual({ seeded: true });
    const cookies = await context.cookies();
    const cookie = cookies.find(item => item.name.startsWith('MoodleSession'));
    expect(cookie).toBeTruthy();
    expect(cookie.value).toMatch(/^[a-zA-Z0-9,-]+$/);
    const sid = JSON.stringify(cookie.value);
    const snapshot = () => JSON.parse(php(`$s=$DB->get_record('sessions',['sid'=>${sid}],'*',MUST_EXIST); $data=file_get_contents(($CFG->session_file_save_path??$CFG->dataroot.'/sessions').'/sess_'.$s->sid); echo json_encode(['userid'=>(int)$s->userid,'timestamp'=>(int)$s->timemodified,'record'=>hash('sha256',serialize($s)),'payload'=>hash('sha256',$data),'pending'=>str_contains($data,${JSON.stringify(pending)})]);`));
    const probe = async expired => {
      const before = snapshot();
      expect(before.userid).toBe(Number(fixtures.users.author.id));
      expect(before.pending).toBe(true);
      for (const method of ['GET', 'HEAD']) {
        const response = await page.request.fetch('/local/orientationfeedback/session.php', { method, maxRedirects: 0 });
        expect(response.status()).toBe(200);
        expect(response.headers()['cache-control']).toMatch(/private.*no-store/);
        expect(response.headers()['vary']).toContain('Cookie');
        expect(response.headers()['content-type']).toContain('application/json');
        expect(response.headers()['set-cookie']).toBeUndefined();
        if (method === 'HEAD') expect(await response.text()).toBe('');
        else if (expired) expect(await response.json()).toEqual({ owner: null });
        else expect(await response.json()).toEqual({ owner: expect.stringMatching(/^[a-f0-9]{64}$/) });
      }
      expect(snapshot()).toEqual(before);
      expect(await context.cookies()).toEqual(cookies);
    };
    await probe(false);
    php(`$DB->set_field('sessions','timemodified',time()-(int)$CFG->sessiontimeout-60,['sid'=>${sid}]);`);
    await probe(true);

    // Normal form navigation may now end the expired session; the cached private receipt must be discarded first.
    await launch.click();
    await expect(frame.getByRole('heading', { name: 'Help make the course better', exact: true })).toBeVisible();
    await expect(frame.getByRole('link', { name: 'Sign in to give feedback', exact: true })).toBeVisible();
    expect(await cachedFrame.evaluate(element => element.isConnected)).toBe(false);
    await expect(frame.locator('.feedback-saved-note')).toHaveCount(0);
    await expect(frame.locator('audio')).toHaveCount(0);
    expect(await frame.locator('body').textContent()).not.toContain(privateText);
  } finally {
    fs.rmSync(endpointPath, { force: true });
  }
});
