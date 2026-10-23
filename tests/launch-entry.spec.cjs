const { test, expect } = require('@playwright/test');

test('closed-registration entry offers a working public start and a course preview', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make a useful start with AI.');
    const start = page.getByRole('link', { name: 'Start with a useful task', exact: true });
    await expect(start).toHaveAttribute('href', '/first-task');
    await expect(page.getByRole('link', { name: 'Preview the course journey', exact: true })).toHaveAttribute('href', '/journey');
    await expect(page.getByRole('link', { name: 'Pilot sign-in', exact: true })).toHaveAttribute('href', '/course/view.php?id=2');
    await expect(page.locator('#account-status')).toContainText('Public registration is currently closed');
    await expect(page.locator('main')).toContainText('70–95 minutes');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.screenshot({ path: `/tmp/orientation-launch-home-${width}.png`, fullPage: true });
    await start.click();
    await expect(page.getByRole('heading', { name: 'Get one useful result.', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Continue: give useful context', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Give your AI useful context', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Build your three reusable context documents', exact: true }).click();
    await expect(page).toHaveURL(/\/portfolio$/);
    await page.getByRole('link', { name: 'Continue: test, improve and choose a next goal', exact: true }).click();
    await expect(page).toHaveURL(/\/check-and-continue$/);
    await expect(page.getByRole('heading', { name: 'Test it, improve it, keep going.', exact: true })).toBeVisible();
  }
});

test('preview distinguishes three activities, portfolio bridge and optional preparation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Preview the course journey', exact: true }).click();
  const activities = page.locator('.journey-activities > li');
  await expect(activities).toHaveCount(3);
  await expect(activities.nth(1)).toContainText('Portfolio bridge');
  await expect(page.locator('#optional-preparation')).toContainText('Optional preparation');
  await page.getByRole('link', { name: 'Find your way around files, notes and your AI', exact: true }).click();
  await expect(page).toHaveURL(/\/before-you-start$/);
  expect((await page.request.get('/first-task')).status()).toBe(200);
  expect((await page.request.get('/preview')).status()).toBe(200);
  expect((await page.request.get('/portfolio')).status()).toBe(200);
  expect((await page.request.get('/check-and-continue')).status()).toBe(200);
});

test('keyboard and no-JavaScript entry retain the same public route and share metadata', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Start with a useful task', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/first-task$/);
    await page.getByText('If you cannot use an AI today', { exact: true }).click();
    await expect(page.getByText('Use this invented response for practice.', { exact: false })).toBeVisible();
    await page.goto('/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Human AI Orientation/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /reusable context portfolio/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://orientation.finlaymccall.com/');
    await page.getByRole('link', { name: 'Preview the course journey', exact: true }).click();
    await expect(page.locator('.journey-activities > li')).toHaveCount(3);
  } finally { await context.close(); }
});
