const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const script = path.join(__dirname, '../moodle/local/orientationfeedback/launcher.js');
const style = path.join(__dirname, '../moodle/local/orientationfeedback/launcher.css');
async function host(page, enhance = true, session = { owner: 'a'.repeat(64) }) {
  let loads = 0;
  await page.route('http://127.0.0.1:8798/**', route => {
    if (route.request().url().includes('/local/orientationfeedback/session.php')) {
      if (session.handle) return session.handle(route);
      return route.fulfill({ status: session.fail ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ owner: session.owner }) });
    }
    if (route.request().url().includes('/local/orientationfeedback/index.php')) {
      loads++;
      return route.fulfill({ contentType: 'text/html', body: session.receipt ? '<h1>Feedback saved</h1><p>ACCOUNT-A-PRIVATE-RECEIPT</p>' : session.owner === null ? '<p>Sign in to give feedback</p>' : '<label>Note <textarea></textarea></label><button>Record</button>' });
    }
    return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><h1>Your course journey</h1><a data-feedback-launcher href="/local/orientationfeedback/index.php?source=journey">Give feedback</a>' });
  });
  await page.goto('/journey');
  if (enhance && fs.existsSync(style)) await page.addStyleTag({ content: fs.readFileSync(style, 'utf8') });
  if (enhance && fs.existsSync(script)) await page.addScriptTag({ content: fs.readFileSync(script, 'utf8') });
  return () => loads;
}
test('launcher opens a compact panel in place and keeps its draft on close/reopen', async ({ page }) => {
  const loads = await host(page);
  const launch = page.getByRole('link', { name: 'Give feedback', exact: true });
  await launch.click();
  const panel = page.getByRole('dialog', { name: 'Give feedback', exact: true });
  await expect(panel).toBeVisible();
  expect(page.url()).toBe('http://127.0.0.1:8798/journey');
  const iframe = page.locator('iframe[title="Private feedback to Finlay"]');
  await expect(iframe).toHaveAttribute('src', /embedded=1/);
  const frame = iframe.contentFrame();
  await frame.getByRole('textbox').fill('Synthetic unsent note');
  await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
  await expect(panel).not.toBeVisible();
  await expect(launch).toBeFocused();
  await launch.click();
  await expect(frame.getByRole('textbox')).toHaveValue('Synthetic unsent note');
  expect(loads()).toBe(1);
});

for (const trigger of ['reopen', 'focus', 'pageshow', 'visibilitychange', 'orientation:account-changed']) {
  test('cached feedback clears account A draft after account switch on ' + trigger, async ({ page }) => {
    const session = { owner: 'a'.repeat(64) };
    const loads = await host(page, true, session);
    expect(await page.evaluate(() => Boolean(window.OrientationContext))).toBe(false);
    const launch = page.getByRole('link', { name: 'Give feedback', exact: true });
    await launch.click();
    const frame = page.frameLocator('iframe[title="Private feedback to Finlay"]');
    await frame.getByRole('textbox').fill('ACCOUNT-A-PRIVATE-DRAFT');
    if (trigger === 'reopen') await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
    session.owner = 'b'.repeat(64);
    if (trigger === 'reopen') await launch.click();
    else await page.evaluate(name => (name === 'visibilitychange' ? document : window).dispatchEvent(new Event(name)), trigger);
    await expect(frame.getByRole('textbox')).toHaveValue('');
    expect(loads()).toBe(2);
  });
}

test('a cached saved receipt is cleared before another account reopens feedback', async ({ page }) => {
  const session = { owner: 'a'.repeat(64), receipt: true };
  await host(page, true, session);
  const launch = page.getByRole('link', { name: 'Give feedback', exact: true });
  await launch.click();
  const frame = page.frameLocator('iframe[title="Private feedback to Finlay"]');
  await expect(frame.getByText('ACCOUNT-A-PRIVATE-RECEIPT')).toBeVisible();
  await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
  session.owner = 'b'.repeat(64); session.receipt = false;
  await launch.click();
  await expect(frame.getByRole('textbox')).toBeVisible();
  await expect(frame.getByText('ACCOUNT-A-PRIVATE-RECEIPT')).toHaveCount(0);
});

for (const failure of ['signed-out', 'unavailable']) test('feedback clears a cached draft when the owner probe is ' + failure, async ({ page }) => {
  const session = { owner: 'a'.repeat(64) };
  await host(page, true, session);
  const launch = page.getByRole('link', { name: 'Give feedback', exact: true });
  await launch.click();
  const frame = page.frameLocator('iframe[title="Private feedback to Finlay"]');
  await frame.getByRole('textbox').fill('ACCOUNT-A-PRIVATE-DRAFT');
  await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
  if (failure === 'signed-out') session.owner = null;
  else session.fail = true;
  await launch.click();
  if (failure === 'signed-out') await expect(frame.getByText('Sign in to give feedback')).toBeVisible();
  else await expect(page.locator('.of-loading')).toContainText('Could not check your sign-in');
  await expect(frame.getByRole('textbox')).toHaveCount(0);
});

test('an owner probe hides cached words while pending and stale success cannot restore them after a newer failure', async ({ page }) => {
  const session = { owner: 'a'.repeat(64) };
  await host(page, true, session);
  const launch = page.getByRole('link', { name: 'Give feedback', exact: true });
  await launch.click();
  const frame = page.frameLocator('iframe[title="Private feedback to Finlay"]');
  await frame.getByRole('textbox').fill('ACCOUNT-A-PRIVATE-DRAFT');
  await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
  let release, captured;
  const pending = new Promise(resolve => { release = resolve; });
  const started = new Promise(resolve => { captured = resolve; });
  session.handle = async route => { captured(); await pending; await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ owner: 'a'.repeat(64) }) }); };
  await launch.click();
  await started;
  await expect(page.locator('iframe')).toBeHidden();
  session.handle = null; session.fail = true;
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('.of-loading')).toContainText('Could not check your sign-in');
  release();
  await expect(frame.getByRole('textbox')).toHaveCount(0);
  await expect(page.locator('iframe')).toBeHidden();
});
test('Escape returns focus and the mobile panel stays in the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await host(page);
  const launch = page.getByRole('link', { name: 'Give feedback', exact: true });
  await launch.focus(); await page.keyboard.press('Enter');
  const panel = page.getByRole('dialog', { name: 'Give feedback', exact: true });
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(320);
  expect(box.y).toBeGreaterThanOrEqual(0); expect(box.y + box.height).toBeLessThanOrEqual(640);
  await page.getByRole('button', { name: 'Close feedback', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(panel).not.toBeVisible(); await expect(launch).toBeFocused();
});
test('a no-JavaScript launcher remains a real feedback link', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await host(page, false);
  await expect(page.getByRole('link', { name: 'Give feedback', exact: true })).toHaveAttribute('href', '/local/orientationfeedback/index.php?source=journey');
  await context.close();
});


test('only the embedded feedback frame can request the allowlisted sign-in return route', async ({ page }) => {
  await host(page);
  await page.getByRole('link', { name: 'Give feedback', exact: true }).click();
  await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', {
    origin: location.origin, source: window, data: { type: 'orientation-feedback-signin' }
  })));
  expect(page.url()).toBe('http://127.0.0.1:8798/journey');
  const frame = page.frameLocator('iframe[title="Private feedback to Finlay"]');
  await frame.getByRole('textbox').evaluate(() => window.parent.postMessage({ type: 'orientation-feedback-signin' }, location.origin));
  await expect(page).toHaveURL('http://127.0.0.1:8798/local/orientationfeedback/signin.php?source=journey');
});
