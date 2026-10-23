const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const source = path.join(__dirname, '../moodle/local/orientationfeedback/recorder.js');
const css = path.join(__dirname, '../moodle/local/orientationfeedback/styles.css');
const form = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic feedback fixture</title>
<body class="orientation-feedback-page"><main class="feedback-card"><h1>Send feedback — synthetic test</h1><form method="post" enctype="multipart/form-data" action="/local/orientationfeedback/index.php" data-voice-feedback>
<input type="hidden" name="courseid" value="12"><input type="hidden" name="sesskey" value="synthetic"><input type="hidden" name="submissiontoken" value="synthetic-token">
<label for="message">Message</label><textarea id="message" name="message" rows="6"></textarea>
<div class="voice-recorder"><button type="button" data-voice-record hidden>Record</button><button type="button" data-voice-stop hidden>Stop</button><button type="button" data-voice-discard hidden>Discard recording</button><span data-voice-timer hidden>0:00</span><audio data-voice-playback controls hidden></audio><p data-voice-status role="status" aria-live="polite"></p></div>
<label for="audio">Audio file</label><input id="audio" type="file" name="audio" accept="audio/*"><p>Up to five minutes and 10 MiB.</p><button type="submit">Send feedback</button></form></main>`;

async function openForm(page) {
  await page.route('http://127.0.0.1:8798/**', async route => {
    if (route.request().method() !== 'GET') return route.abort();
    if (route.request().url().includes('?id=')) return route.fulfill({ contentType: 'text/html', body: '<h1>Saved</h1>' });
    return route.fulfill({ contentType: 'text/html', body: form });
  });
  await page.goto('/');
  if (fs.existsSync(css)) await page.addStyleTag({ content: fs.readFileSync(css, 'utf8') });
  await page.addScriptTag({ content: fs.existsSync(source) ? fs.readFileSync(source, 'utf8') : '/* Recorder not implemented. */' });
}

async function record(page) {
  await page.locator('[data-voice-record]').click();
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.waitForTimeout(400);
  await page.locator('[data-voice-stop]').click();
  await expect(page.locator('[data-voice-playback]')).toBeVisible();
}

test('explicit recording produces playable audio without sending; stop releases the microphone', async ({ page }) => {
  await page.addInitScript(() => {
    window.mediaRequests = 0; window.mediaTracks = [];
    const get = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...args) => { window.mediaRequests++; const stream = await get(...args); window.mediaTracks.push(...stream.getTracks()); return stream; };
  });
  let posts = 0; page.on('request', r => { if (r.method() === 'POST') posts++; });
  await openForm(page);
  expect(await page.evaluate(() => window.mediaRequests)).toBe(0);
  await record(page);
  expect(await page.evaluate(() => window.mediaRequests)).toBe(1);
  expect(await page.evaluate(() => window.mediaTracks.every(t => t.readyState === 'ended'))).toBe(true);
  await expect.poll(() => page.locator('audio').evaluate(a => a.readyState)).toBeGreaterThanOrEqual(2);
  expect(await page.locator('audio').evaluate(a => a.duration > 0)).toBe(true);
  await page.locator('audio').evaluate(a => a.play());
  expect(await page.locator('audio').evaluate(a => !a.paused)).toBe(true);
  expect(posts).toBe(0);
});

test('failed send retains the same audio bytes and text for explicit retry', async ({ page }) => {
  await openForm(page);
  await record(page);
  await page.locator('textarea').fill('Synthetic useful feedback');
  const before = await page.locator('audio').getAttribute('src');
  const uploads = [];
  await page.route('**/local/orientationfeedback/index.php?format=json', async route => {
    uploads.push(route.request().postDataBuffer());
    if (uploads.length === 1) return route.abort('failed');
    return route.fulfill({ json: { id: 4, redirect: '/local/orientationfeedback/index.php?id=4' } });
  });
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect(page.locator('[data-voice-status]')).toContainText(/try.*again|retry/i);
  expect(await page.locator('audio').getAttribute('src')).toBe(before);
  await expect(page.locator('textarea')).toHaveValue('Synthetic useful feedback');
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect(page).toHaveURL(/index.php\?id=4$/);
  const audioBytes = body => body.subarray(body.indexOf(Buffer.from('\r\n\r\n', 'utf8'), body.indexOf(Buffer.from('filename='))) + 4, body.lastIndexOf(Buffer.from('\r\n--')));
  expect(audioBytes(uploads[0]).length).toBeGreaterThan(100);
  expect(audioBytes(uploads[1]).equals(audioBytes(uploads[0]))).toBe(true);
});

test('permission denial leaves text and file alternatives usable', async ({ page }) => {
  await page.addInitScript(() => { navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Synthetic denial', 'NotAllowedError'); }; });
  await openForm(page);
  await page.locator('[data-voice-record]').click();
  await expect(page.getByRole('status')).toContainText('Microphone access was not allowed');
  await expect(page.locator('textarea')).toBeEnabled();
  await expect(page.locator('input[type=file]')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Send feedback' })).toBeEnabled();
});

test('cancelling pending permission stops a late real media stream', async ({ page }) => {
  await page.addInitScript(() => {
    const get = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = () => new Promise(resolve => {
      window.grantLate = async () => { const stream = await get({ audio: true }); window.lateTracks = stream.getTracks(); resolve(stream); };
    });
  });
  await openForm(page);
  await page.locator('[data-voice-record]').click();
  await expect(page.getByRole('status')).toContainText('Allow microphone');
  await page.locator('[data-voice-discard]').click();
  await page.evaluate(() => window.grantLate());
  await expect.poll(() => page.evaluate(() => window.lateTracks.every(t => t.readyState === 'ended'))).toBe(true);
  await expect(page.locator('[data-voice-stop]')).toBeHidden();
  await expect(page.locator('audio')).toBeHidden();
  await expect(page.locator('[data-voice-record]')).toBeVisible();
});

test('discard and record again replace and revoke earlier recordings', async ({ page }) => {
  await page.addInitScript(() => {
    window.revoked = [];
    const revoke = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = url => { window.revoked.push(url); revoke(url); };
  });
  await openForm(page); await record(page);
  const first = await page.locator('audio').getAttribute('src');
  await page.locator('[data-voice-discard]').click();
  await expect(page.locator('audio')).toBeHidden();
  expect(await page.evaluate(() => window.revoked)).toContain(first);
  await record(page);
  const second = await page.locator('audio').getAttribute('src');
  await record(page);
  expect(await page.locator('audio').getAttribute('src')).not.toBe(second);
  expect(await page.evaluate(() => window.revoked)).toContain(second);
});

test('automatically stops at five minutes and updates elapsed time', async ({ page }) => {
  await page.clock.install();
  await openForm(page);
  await page.locator('[data-voice-record]').click();
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.waitForTimeout(400);
  await page.clock.fastForward(119000);
  await expect(page.locator('[data-voice-timer]')).toHaveText('1:59');
  await page.clock.fastForward(1000);
  await expect(page.locator('[data-voice-timer]')).toHaveText('2:00');
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.clock.fastForward(179000);
  await expect(page.locator('[data-voice-timer]')).toHaveText('4:59');
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.clock.fastForward(1000);
  await expect(page.locator('[data-voice-stop]')).toBeHidden();
  await expect(page.locator('audio')).toBeVisible();
  await expect(page.locator('[data-voice-timer]')).toHaveText('5:00');
});

test('pagehide stops capture and cached-page restoration keeps completed audio', async ({ page }) => {
  await page.addInitScript(() => {
    window.activeTracks = [];
    const get = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...args) => { const stream = await get(...args); window.activeTracks.push(...stream.getTracks()); return stream; };
  });
  await openForm(page);
  await page.locator('[data-voice-record]').click();
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.waitForTimeout(400);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  expect(await page.evaluate(() => window.activeTracks.every(t => t.readyState === 'ended'))).toBe(true);
  await expect(page.locator('audio')).toBeVisible();
  const blob = await page.locator('audio').getAttribute('src');
  await page.evaluate(() => { window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })); window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })); });
  expect(await page.locator('audio').getAttribute('src')).toBe(blob);
  expect(await page.evaluate(() => !window.dispatchEvent(new Event('beforeunload', { cancelable: true })))).toBe(true);
});

test('sending locks changes and duplicate submits; server rejection retains the recording', async ({ page }) => {
  await openForm(page); await record(page);
  let finish; let requests = 0;
  await page.route('**/local/orientationfeedback/index.php?format=json', async route => {
    requests++; await new Promise(resolve => { finish = resolve; });
    await route.fulfill({ status: 429, json: { error: 'Please wait before sending more feedback.' } });
  });
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect.poll(() => requests).toBe(1);
  for (const selector of ['textarea', 'input[type=file]', '[data-voice-record]', '[data-voice-discard]', '[type=submit]']) {
    await expect(page.locator(selector)).toBeDisabled();
  }
  await page.locator('form').evaluate(f => f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(requests).toBe(1);
  finish();
  await expect(page.getByRole('status')).toContainText('Please wait');
  await expect(page.locator('audio')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send feedback' })).toBeEnabled();
});

test('text sends omit empty audio; selecting a file replaces a recording', async ({ page }) => {
  await openForm(page);
  const requests = [];
  await page.route('**/local/orientationfeedback/index.php?format=json', async route => {
    requests.push(route.request().postDataBuffer());
    await route.fulfill({ status: 503, json: { error: 'Synthetic retry' } });
  });
  await page.locator('textarea').fill('Synthetic text only');
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect(page.getByRole('status')).toContainText('Try sending again');
  expect(requests[0].includes(Buffer.from('name="audio"'))).toBe(false);
  await record(page);
  await page.locator('input[type=file]').setInputFiles({ name: 'synthetic.wav', mimeType: 'audio/wav', buffer: Buffer.from('Synthetic file upload bytes') });
  await expect(page.locator('audio')).toBeHidden();
  await expect(page.getByRole('status')).toContainText('replaces any earlier recording');
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect.poll(() => requests.length).toBe(2);
  expect(requests[1].includes(Buffer.from('filename="synthetic.wav"'))).toBe(true);
  expect(requests[1].includes(Buffer.from('Synthetic file upload bytes'))).toBe(true);
});

test('oversize files are blocked before network activity', async ({ page }) => {
  await openForm(page);
  let posts = 0; page.on('request', r => { if (r.method() === 'POST') posts++; });
  await page.locator('input[type=file]').setInputFiles({ name: 'too-large.wav', mimeType: 'audio/wav', buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect(page.getByRole('status')).toContainText('no larger than 10 MiB');
  expect(posts).toBe(0);
});

test('unsupported browser preserves the native text and file submission route', async ({ page }) => {
  await page.addInitScript(() => { window.MediaRecorder = undefined; });
  await openForm(page);
  await expect(page.locator('[data-voice-record]')).toBeHidden();
  await expect(page.getByRole('status')).toContainText('Recording is unavailable');
  await page.locator('textarea').fill('Synthetic native fallback');
  const request = page.waitForRequest(r => r.method() === 'POST');
  await page.getByRole('button', { name: 'Send feedback' }).click();
  const sent = await request;
  expect(sent.url()).toBe('http://127.0.0.1:8798/local/orientationfeedback/index.php');
  expect(sent.postDataBuffer().includes(Buffer.from('Synthetic native fallback'))).toBe(true);
});

test('unexpected external receipt is rejected without losing audio', async ({ page }) => {
  await openForm(page); await record(page);
  await page.route('**/local/orientationfeedback/index.php?format=json', route => route.fulfill({ json: { id: 4, redirect: 'https://example.com/local/orientationfeedback/index.php?id=4' } }));
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect(page.getByRole('status')).toContainText('unexpected receipt');
  await expect(page.locator('audio')).toBeVisible();
  expect(page.url()).toBe('http://127.0.0.1:8798/');
});

test('mobile controls remain inside the viewport and support keyboard recording', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await openForm(page);
  await page.locator('[data-voice-record]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.waitForTimeout(400);
  await page.locator('[data-voice-stop]').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('audio')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const button of await page.locator('button:visible').all()) expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await page.screenshot({ path: '/tmp/orientation-feedback-mobile-synthetic.png', fullPage: true });
});

test('a hung send times out and unlocks the retained recording for retry', async ({ page }) => {
  await page.clock.install();
  await openForm(page); await record(page);
  const audio = await page.locator('audio').getAttribute('src');
  await page.locator('textarea').fill('Synthetic timeout recovery');
  let pending;
  await page.route('**/local/orientationfeedback/index.php?format=json', route => { pending = route; });
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect.poll(() => Boolean(pending)).toBe(true);
  await page.clock.fastForward(30000);
  await expect(page.getByRole('status')).toContainText('request timed out');
  await expect(page.getByRole('button', { name: 'Send feedback' })).toBeEnabled();
  await expect(page.locator('textarea')).toHaveValue('Synthetic timeout recovery');
  expect(await page.locator('audio').getAttribute('src')).toBe(audio);
  await pending.abort().catch(() => {});
  await page.unroute('**/local/orientationfeedback/index.php?format=json');
  await page.route('**/local/orientationfeedback/index.php?format=json', route => route.fulfill({ json: { id: 9, redirect: '/local/orientationfeedback/index.php?id=9' } }));
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect(page).toHaveURL(/index.php\?id=9$/);
});

test('a recorder error releases tracks and restores recovery controls', async ({ page }) => {
  await page.addInitScript(() => {
    const RealRecorder = window.MediaRecorder;
    window.MediaRecorder = class extends RealRecorder { constructor(...args) { super(...args); window.syntheticRecorder = this; } };
    const get = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...args) => { const stream = await get(...args); window.errorTracks = stream.getTracks(); return stream; };
  });
  await openForm(page);
  await page.locator('[data-voice-record]').click();
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.evaluate(() => window.syntheticRecorder.dispatchEvent(new Event('error')));
  await expect(page.getByRole('status')).toContainText('microphone error');
  expect(await page.evaluate(() => window.errorTracks.every(t => t.readyState === 'ended'))).toBe(true);
  await expect(page.locator('[data-voice-record]')).toBeVisible();
  await expect(page.locator('input[type=file]')).toBeEnabled();
});


test('closing the feedback panel stops capture and keeps audio for reopening', async ({ page }) => {
  await page.addInitScript(() => {
    window.panelTracks = [];
    const get = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...args) => {
      const stream = await get(...args); window.panelTracks.push(...stream.getTracks()); return stream;
    };
  });
  await openForm(page);
  await page.locator('[data-voice-record]').click();
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.waitForTimeout(400);
  await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', {
    origin: location.origin, source: window.parent, data: { type: 'orientation-feedback-close' },
  })));
  await expect(page.locator('audio')).toBeVisible();
  expect(await page.evaluate(() => window.panelTracks.every(t => t.readyState === 'ended'))).toBe(true);
});

test('embedded receipt stays embedded and foreign close messages are ignored', async ({ page }) => {
  await openForm(page);
  await page.locator('form').evaluate(form => {
    form.dataset.feedbackEmbedded = '1';
    const field = document.createElement('input'); field.type = 'hidden'; field.name = 'embedded'; field.value = '1'; form.append(field);
  });
  await page.locator('[data-voice-record]').click();
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.waitForTimeout(400);
  await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', {
    origin: 'https://example.com', source: window.parent, data: { type: 'orientation-feedback-close' },
  })));
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.locator('[data-voice-stop]').click();
  await expect(page.locator('audio')).toBeVisible();
  await page.route('**/local/orientationfeedback/index.php?format=json', route => route.fulfill({ json: {
    id: 44, redirect: '/local/orientationfeedback/index.php?id=44&embedded=1',
  } }));
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect(page).toHaveURL(/index.php\?id=44&embedded=1$/);
});
