const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const script = path.join(__dirname, '../moodle/local/orientationfeedback/launcher.js');
const style = path.join(__dirname, '../moodle/local/orientationfeedback/launcher.css');
async function host(page, enhance = true) {
  let loads = 0;
  await page.route('http://127.0.0.1:8798/**', route => {
    if (route.request().url().includes('/local/orientationfeedback/index.php')) {
      loads++;
      return route.fulfill({ contentType: 'text/html', body: '<label>Note <textarea></textarea></label><button>Record</button>' });
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
