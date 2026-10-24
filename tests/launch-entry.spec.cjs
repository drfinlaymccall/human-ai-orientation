const { test, expect } = require('@playwright/test');
const welcome = require('../content/student-welcome.json');

const activities = [
  ['Try AI on a useful task', 'first-task', '/first-task'],
  ['Give AI the right background', 'useful-context', '/preview'],
  ['Save your context for next time', 'portfolio', '/portfolio'],
  ['Check a result and plan your next step', 'check-and-continue', '/check-and-continue'],
  ['Files, notes and AI basics — optional help', 'before-you-start', '/before-you-start'],
];

test('closed-registration splash leads to the public journey and complete activity sequence', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Human AI Orientation');
    await expect(page.locator('.hero-tagline')).toHaveText('Learn to team with AI.');
    await expect(page.locator('[data-activity-atlas]')).toHaveCount(0);
    const start = page.getByRole('link', { name: 'Explore your course', exact: true });
    await expect(start).toHaveAttribute('href', '/journey');
    await expect(page.locator('header [data-account-link]')).toHaveText('Check sign-in / Your course journey');
    await expect(page.locator('#account-status')).toContainText('Public registration is currently closed');
    await expect(page.locator('main')).toContainText('70–95 minutes');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.screenshot({ path: `/tmp/orientation-launch-home-${width}.png` });
    await start.click();
    await page.locator('[data-atlas-detail="first-task"] a.button').click();
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

test('public purpose and six practice objectives remain available by keyboard without JavaScript', async ({ browser, baseURL }) => {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ javaScriptEnabled, baseURL, viewport: { width: 390, height: 960 } });
    try {
      const page = await context.newPage();
      for (const route of ['/', '/journey']) {
        await page.goto(route);
        const objectives = page.locator('[data-course-objectives]');
        const summary = objectives.locator('summary');
        await expect(summary).toHaveText("What you'll practise");
        await expect(objectives).not.toHaveAttribute('open');
        await summary.focus();
        await page.keyboard.press('Enter');
        await expect(objectives).toHaveAttribute('open', '');
        await expect(objectives.locator('li')).toHaveText(welcome.objectives);
        await expect(objectives.locator('li').first()).toBeVisible();
        await page.keyboard.press('Enter');
        await expect(objectives).not.toHaveAttribute('open');
        await expect(page.locator('main')).toContainText('70–95 minutes');
        await expect(page.getByRole('link', { name: 'Human AI Orientation', exact: true })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
      }
    } finally { await context.close(); }
  }
});

test('public journey selects all five activities and opens their real destinations', async ({ page }) => {
  for (const route of ['/journey']) {
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
    const geometry = await choice.evaluate(button => {
      const detail = document.querySelector('[data-atlas-detail="portfolio"]');
      const action = detail.querySelector('a.button');
      const b = button.getBoundingClientRect(), d = detail.getBoundingClientRect(), a = action.getBoundingClientRect();
      return { buttonBottom: b.bottom, detailTop: d.top, detailLeft: d.left, buttonRight: b.right, actionBottom: a.bottom, viewport: innerHeight, adjacent: button.parentElement.nextElementSibling === detail };
    });
    if (width > 1000) expect(geometry.detailLeft).toBeGreaterThan(geometry.buttonRight);
    else {
      expect(geometry.adjacent).toBe(true);
      expect(geometry.buttonBottom).toBeGreaterThan(0);
      expect(geometry.detailTop - geometry.buttonBottom).toBeLessThan(40);
    }
    expect(geometry.actionBottom).toBeLessThanOrEqual(geometry.viewport);
    for (let tabs = 0; tabs < (width > 1000 ? 4 : 1); tabs++) await page.keyboard.press('Tab');
    await expect(detail.locator('a.button')).toBeFocused();
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

test('natural keyboard traversal reaches all five atlas choices and the selected action', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/journey');
    const choices = page.locator('[data-atlas-choice]');
    await choices.first().focus();
    for (let index = 0; index < activities.length; index++) {
      const choice = choices.nth(index);
      await expect(choice).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(choice).toHaveAttribute('aria-pressed', 'true');
      const slug = await choice.getAttribute('data-atlas-choice');
      const action = page.locator(`[data-atlas-open="${slug}"]`);
      if (width <= 1000) {
        await page.keyboard.press('Tab');
        await expect(action).toBeFocused();
      }
      if (index < activities.length - 1) {
        // Follow the browser's native order; never focus the next choice by script.
        for (let tabs = 0; tabs < 10 && !(await choices.nth(index + 1).evaluate(el => el === document.activeElement)); tabs++) {
          await page.keyboard.press('Tab');
          if (width > 1000) break;
        }
        await expect(choices.nth(index + 1)).toBeFocused();
      } else if (width > 1000) {
        await page.keyboard.press('Tab'); // The optional newcomer suggestion.
        await expect(page.locator('[data-atlas-start]')).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(action).toBeFocused();
      }
    }
  }
});

test('keyboard and no-JavaScript entry retain every activity, self-check and public destination', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('[data-activity-atlas]')).toHaveCount(0);
    await expect(page.locator('header [data-account-link]')).toHaveText('Check sign-in / Your course journey');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Explore your course', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/journey$/);
    await page.locator('[data-atlas-detail="first-task"] a.button').click();
    await page.getByText('If you cannot use an AI today', { exact: true }).click();
    await expect(page.getByText('Use this invented response for practice.', { exact: false })).toBeVisible();
    for (const route of ['/journey']) {
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


test('account state resolves safely on every public course header', async ({ page }) => {
  let response = { state: 'signed-in', journey_url: '/local/orientation/index.php' };
  const requests = [];
  await page.route('**/local/orientation/state.php', async route => {
    requests.push({ method: route.request().method(), headers: route.request().headers() });
    await route.fulfill({ json: response, headers: { 'Cache-Control': 'private, no-store' } });
  });
  await page.goto('/');
  await expect(page.locator('[data-journey-primary]')).toHaveText('Your course journey');
  await expect(page.locator('[data-journey-primary]')).toHaveAttribute('href', '/local/orientation/index.php');
  await expect(page.locator('[data-account-state]')).toHaveText('Signed in');
  response = { state: 'signed-out', journey_url: '/local/orientation/index.php' };
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await expect(page.locator('header [data-account-link]')).toHaveText('Sign in');
  await expect(page.locator('[data-journey-primary]')).toHaveText('Explore your course');
  await expect(page.locator('[data-journey-primary]')).toHaveAttribute('href', '/journey');
  for (const route of ['/journey', '/first-task', '/preview', '/portfolio', '/check-and-continue', '/before-you-start', '/notes', '/free-tools', '/deeper-courses', '/help', '/privacy']) {
    await page.goto(route);
    await expect(page.locator('header').getByRole('link', { name: 'Course journey', exact: true })).toHaveAttribute('href', '/journey');
    await expect(page.locator('header [data-account-link]')).toHaveText('Sign in');
  }
  expect(requests.length).toBeGreaterThanOrEqual(13);
  expect(requests.every(request => request.method === 'GET' && request.headers['cache-control'] === 'no-store')).toBe(true);
});

test('slow, failed and invalid account responses retain an honest public fallback', async ({ page }) => {
  let release;
  let response = { state: 'signed-in', journey_url: 'https://example.invalid/steal' };
  await page.route('**/local/orientation/state.php', async route => {
    if (release === undefined) await new Promise(resolve => { release = resolve; });
    await route.fulfill({ json: response });
  });
  await page.goto('/');
  await expect(page.locator('[data-journey-primary]')).toHaveText('Explore your course');
  await expect(page.locator('header [data-account-link]')).toHaveText('Check sign-in / Your course journey');
  await expect(page.locator('header [data-account-link]')).toHaveAttribute('href', '/local/orientation/index.php');
  release();
  await expect(page.locator('[data-account-state]')).toContainText('unavailable');
  await expect(page.locator('[data-journey-primary]')).toHaveAttribute('href', '/journey');
  await page.unroute('**/local/orientation/state.php');
  await page.route('**/local/orientation/state.php', route => route.abort());
  await page.reload();
  await expect(page.locator('[data-account-state]')).toContainText('unavailable');
  await expect(page.locator('header [data-account-link]')).toHaveText('Check sign-in / Your course journey');
});


test('restoring a signed-in page clears stale state while the next probe is pending', async ({ page }) => {
  let pending;
  let first = true;
  await page.route('**/local/orientation/state.php', async route => {
    if (first) {
      first = false;
      await route.fulfill({ json: { state: 'signed-in', journey_url: '/local/orientation/index.php' } });
    } else {
      await new Promise(resolve => { pending = resolve; });
      await route.fulfill({ json: { state: 'signed-out', journey_url: '/local/orientation/index.php' } });
    }
  });
  await page.goto('/');
  await expect(page.locator('[data-journey-primary]')).toHaveText('Your course journey');
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await expect(page.locator('header [data-account-link]')).toHaveText('Check sign-in / Your course journey');
  await expect(page.locator('[data-journey-primary]')).toHaveText('Explore your course');
  pending();
  await expect(page.locator('[data-account-state]')).toHaveText('Signed out');
});

test('saved-context panel keeps an unresolved account neutral and resolves an actual signed-out response', async ({ page }) => {
  let release;
  await page.route('**/local/orientation/context.php', async route => {
    await new Promise(resolve => { release = resolve; });
    await route.fulfill({ status: 401, json: { error: 'Synthetic signed-out response' } });
  });
  await page.goto('/');
  const panel = page.locator('[data-context-panel]');
  await expect(panel).toContainText('Checking your saved context');
  await expect(panel.getByRole('link', { name: 'Open My context', exact: true })).toBeVisible();
  await expect(panel.getByRole('link', { name: 'Sign in to My context', exact: true })).toHaveCount(0);
  release();
  await expect(panel).toContainText('Sign in to keep your creations in Moodle.');
  await expect(panel.getByRole('link', { name: 'Sign in to My context', exact: true })).toBeVisible();
});
