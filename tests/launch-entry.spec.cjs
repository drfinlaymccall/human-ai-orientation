const { test, expect } = require('@playwright/test');

const activities = [
  ['Try AI on a useful task', 'first-task', '/first-task'],
  ['Give AI the right background', 'useful-context', '/preview'],
  ['Save your context for next time', 'portfolio', '/portfolio'],
  ['Check a result and plan your next step', 'check-and-continue', '/check-and-continue'],
  ['Files, notes and AI basics — optional help', 'before-you-start', '/before-you-start'],
];

test('closed-registration entry offers a working public start and a course preview', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make a useful start with AI.');
    const start = page.getByRole('link', { name: 'Start with a useful task', exact: true });
    await expect(start).toHaveAttribute('href', '/first-task');
    await expect(page.getByRole('link', { name: 'Preview the course journey', exact: true })).toHaveAttribute('href', '/journey');
    await expect(page.getByRole('link', { name: 'My course progress', exact: true })).toHaveAttribute('href', '/local/orientation/index.php');
    await expect(page.locator('#account-status')).toContainText('Public registration is currently closed');
    await expect(page.locator('main')).toContainText('70–95 minutes');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.screenshot({ path: `/tmp/orientation-launch-home-${width}.png` });
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

test('both atlas entries select all five activities and open their real destinations', async ({ page }) => {
  for (const route of ['/', '/journey']) {
    for (const [label, slug, destination] of activities) {
      await page.goto(route);
      const atlas = page.locator('[data-activity-atlas]');
      const choice = atlas.locator(`[data-atlas-choice="${slug}"]`);
      await choice.click();
      await expect(choice).toHaveAttribute('aria-pressed', 'true');
      await expect(atlas.locator('[data-atlas-choice][aria-pressed="true"]')).toHaveCount(1);
      const detail = atlas.locator(`[data-atlas-detail="${slug}"]`);
      await expect(detail).toBeVisible();
      await expect(atlas.locator('[data-atlas-detail]:visible')).toHaveCount(1);
      await expect(detail.getByRole('heading', { name: label, exact: true })).toBeVisible();
      await expect(detail.getByRole('heading', { name: "You'll do", exact: true })).toBeVisible();
      await expect(detail.getByRole('heading', { name: "You'll keep", exact: true })).toBeVisible();
      await expect(detail.getByRole('heading', { name: "What you'll practise", exact: true })).toBeVisible();
      await detail.getByText('Check what I can do', { exact: true }).click();
      await expect(detail.getByRole('heading', { name: 'What I can do', exact: true })).toBeVisible();
      await expect(detail).toContainText('No answer or assessment is saved here');
      await detail.getByRole('link', { name: `Open this activity: ${label}`, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${destination}$`));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  }
});

test('atlas remains usable on narrow screens and with the keyboard', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/journey');
    const choice = page.locator('[data-atlas-choice="portfolio"]');
    await choice.focus();
    await page.keyboard.press('Enter');
    await expect(choice).toBeFocused();
    await expect(choice).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-atlas-announcement]')).toContainText('Save your context for next time');
    const detail = page.locator('[data-atlas-detail="portfolio"]');
    await expect(detail).toContainText('Part of activity 2');
    await detail.getByText('Check what I can do', { exact: true }).focus();
    await page.keyboard.press('Space');
    await expect(detail.getByRole('heading', { name: 'What I can do', exact: true })).toBeVisible();
    await page.locator('[data-atlas-choice="before-you-start"]').click();
    await expect(page.locator('[data-atlas-detail="before-you-start"]')).toContainText('Optional preparation');
    await page.getByRole('link', { name: 'Set up your notes', exact: true }).click();
    await expect(page).toHaveURL(/\/notes$/);
    await page.goto('/journey');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.locator('[data-activity-atlas]').screenshot({ path: `/tmp/orientation-atlas-${width}.png` });
  }
});

test('keyboard and no-JavaScript entry retain every activity, self-check and public destination', async ({ browser, baseURL }) => {
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
    for (const route of ['/', '/journey']) {
      await page.goto(route);
      await expect(page.locator('[data-atlas-controls]')).toBeHidden();
      await expect(page.locator('[data-atlas-detail]:visible')).toHaveCount(5);
      for (const [label, slug, destination] of activities) {
        const detail = page.locator(`[data-atlas-detail="${slug}"]`);
        await detail.getByText('Check what I can do', { exact: true }).click();
        await expect(detail.getByRole('heading', { name: 'What I understand', exact: true })).toBeVisible();
        const link = detail.getByRole('link', { name: `Open this activity: ${label}`, exact: true });
        await expect(link).toHaveAttribute('href', destination);
        expect((await page.request.get(destination)).status()).toBe(200);
      }
    }
    await page.goto('/');
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /reusable context portfolio/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://orientation.finlaymccall.com/');
  } finally { await context.close(); }
});

test('a learner can enter the final activity directly with an existing note or fictional practice', async ({ page }) => {
  await page.goto('/journey');
  await page.locator('[data-atlas-choice="check-and-continue"]').click();
  await page.getByRole('link', { name: 'Open this activity: Check a result and plan your next step', exact: true }).click();
  await expect(page.locator('#starting-here')).toContainText('you do not need to complete earlier activities first');
  await expect(page.locator('#starting-here')).toContainText('date and venue are undecided');
  await page.getByText('Fictional example: checking an invitation', { exact: true }).click();
  await expect(page.getByText('Count the words and inspect the revised placeholders yourself.', { exact: false })).toBeVisible();
  await page.getByLabel('Observed result and one check').fill('Fictional practice: the draft invented a date. I checked for placeholders.');
  await page.getByLabel('My next goal', { exact: true }).fill('Try my own invitation later.');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my practice record', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.md$/);
});
