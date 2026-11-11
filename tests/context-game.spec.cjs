const { test, expect } = require('@playwright/test');
const game = require('../content/context-game.json');

// Synthetic browser checks of the end-of-unit game on the local static server. No learner used it.
const helpful = game.cards.filter(card => card.kind === 'helpful').map(card => card.id);
const rightIndex = options => options.findIndex(option => option.correct);

async function answer(page, name, options, { wrongFirst = false } = {}) {
  const quiz = page.locator('fieldset.game-quiz').filter({ has: page.locator(`input[name="${name}"]`) });
  if (wrongFirst) {
    await quiz.locator('input').nth(options.findIndex(option => !option.correct)).check();
    await quiz.getByRole('button', { name: 'Check my answer' }).click();
    await expect(quiz.getByRole('status')).toHaveText(options.find(option => !option.correct).feedback);
  }
  await quiz.locator('input').nth(rightIndex(options)).check();
  await quiz.getByRole('button', { name: 'Check my answer' }).click();
  await expect(quiz.getByRole('status')).toHaveText(options[rightIndex(options)].feedback);
}

async function pack(page, ids) {
  await expect(page.getByRole('heading', { name: '2. Choose the context' })).toBeFocused();
  for (const card of game.cards) await page.locator(`#game-card-${card.id}`).setChecked(ids.includes(card.id));
  await page.getByRole('button', { name: 'Ask the AI' }).click();
}

test('a careful player scores every star and nothing is stored or sent', async ({ page }) => {
  const requests = [];
  page.on('request', request => requests.push(new URL(request.url()).pathname));
  await page.goto('/context-game');
  await expect(page.locator('[data-game-fallback]')).toBeHidden();
  await page.getByRole('button', { name: 'Start the game' }).click();
  await expect(page.getByRole('heading', { name: '1. Set the criterion' })).toBeFocused();
  const before = requests.length;

  await answer(page, 'game-criterion', game.criteria.options);
  await page.getByRole('button', { name: 'Next: choose the context' }).click();
  await pack(page, helpful);

  // With the four helpful notes, the only problem is the detail the AI adds by itself.
  const sentences = page.locator('.game-sentences li');
  await expect(sentences).toHaveCount(4);
  await expect(page.locator('.game-reply')).not.toContainText('4471');
  await sentences.filter({ hasText: 'Morning tea' }).locator('input').check();
  await page.getByRole('button', { name: 'Check my ticks' }).click();
  await expect(page.getByText('You judged every sentence correctly.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Change the brief and ask again' })).toHaveCount(0);
  await answer(page, 'game-correction', game.correction.options);
  await expect(page.locator('blockquote.game-reply')).toHaveText(game.correction.fixed);
  await expect(page.getByText('With that correction, the notice reads:')).toBeVisible();
  await page.getByRole('button', { name: 'Next: keep what worked' }).click();

  for (const [index, item] of game.filing.items.entries()) await page.locator(`#game-file-${index}`).selectOption(String(item.answer));
  await page.getByRole('button', { name: 'Check where they go' }).click();
  await page.getByRole('button', { name: 'See my result' }).click();
  await expect(page.getByRole('heading', { name: 'Your result' })).toBeFocused();
  await expect(page.locator('.game-score')).toContainText('12 of 12 stars');
  await expect(page.locator('.game-round li a')).toHaveCount(game.takeaways.length);

  expect(requests.slice(before)).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie])).toEqual([0, 0, '']);
});

test('a careless brief shows up in the reply, and the player can change it', async ({ page }) => {
  await page.goto('/context-game');
  await page.getByRole('button', { name: 'Start the game' }).click();
  await answer(page, 'game-criterion', game.criteria.options, { wrongFirst: true });
  await page.getByRole('button', { name: 'Next: choose the context' }).click();
  await pack(page, ['birthday', 'neighbour', 'code']);

  const reply = page.locator('.game-reply');
  for (const text of ['this Saturday', '4471', 'Mrs Alvarez', 'birthday', 'AMAZING']) await expect(reply).toContainText(text);
  await expect(reply).not.toContainText('[to be confirmed]');
  await page.getByRole('button', { name: 'Check my ticks' }).click();
  await expect(page.locator('.game-verdict[data-result="wrong"]')).toHaveCount(8);
  await expect(page.locator('.game-verdict').filter({ hasText: 'made one up' })).toBeVisible();

  // Going on without changing the brief must not say the player gave the helpful notes.
  await answer(page, 'game-correction', game.correction.options);
  await expect(page.getByText('If the AI had only the four helpful notes, that correction would give this notice:')).toBeVisible();
  await page.getByRole('button', { name: 'Change the brief and ask again' }).click();
  await expect(page.locator('#game-card-code')).toBeChecked();
  await pack(page, helpful);
  await expect(page.locator('.game-sentences li')).toHaveCount(4);
  await page.getByRole('button', { name: 'Check my ticks' }).click();
  await answer(page, 'game-correction', game.correction.options, { wrongFirst: true });
  await page.getByRole('button', { name: 'Next: keep what worked' }).click();
  await page.getByRole('button', { name: 'Check where they go' }).click();
  await expect(page.getByText('Choose a place for every note first.')).toBeVisible();
  for (const index of game.filing.items.keys()) await page.locator(`#game-file-${index}`).selectOption('out');
  await page.getByRole('button', { name: 'Check where they go' }).click();
  await page.getByRole('button', { name: 'See my result' }).click();
  // Round 1: 2 (one wrong try). Round 2: 3. Round 3: 1 of 2 for ticks, 0 for the correction. Round 4: 0.
  await expect(page.locator('.game-score')).toContainText('6 of 12 stars');
  await page.getByRole('button', { name: 'Play again' }).click();
  await expect(page.getByRole('heading', { name: '1. Set the criterion' })).toBeFocused();
});

test('the game can be played with the keyboard and fits narrow screens', async ({ page }) => {
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/context-game');
    await page.getByRole('button', { name: 'Start the game' }).focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(page.locator('#game-criterion-0')).toBeFocused();
    for (let i = 0; i < rightIndex(game.criteria.options); i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Next: choose the context' })).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await expect(page.getByText('1 note is in the brief.')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.screenshot({ path: `/tmp/orientation-game-pack-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Ask the AI' }).focus();
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.screenshot({ path: `/tmp/orientation-game-reply-${width}.png`, fullPage: true });
    // Removing the pressed button must not drop focus to the top of the page.
    await page.getByRole('button', { name: 'Check my ticks' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-game-round="3"] > .game-feedback')).toBeFocused();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement.closest('[data-game-round="3"]') !== null)).toBe(true);
  }
});

test('without JavaScript the paper version carries the whole game', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto('/context-game');
    const paper = page.locator('[data-game-fallback]');
    await expect(paper.getByRole('heading', { name: 'Play on paper' })).toBeVisible();
    await expect(page.locator('[data-game-enhanced]')).toBeHidden();
    for (const card of game.cards) await expect(paper).toContainText(card.text);
    for (const item of game.filing.items) await expect(paper).toContainText(item.text);
    await expect(paper.locator('details')).toHaveCount(5);
    await expect(paper.locator('blockquote')).toContainText('this Saturday');
    await expect(paper.getByText('Find 6 sentences')).toBeVisible();
    await paper.locator('summary').nth(2).click();
    await expect(paper.locator('details').nth(2).locator('li')).toHaveCount(6);
    await expect(page.getByRole('link', { name: 'Choose your next goal' })).toHaveAttribute('href', '/check-and-continue#next-goal');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  } finally {
    await context.close();
  }
});

test('step 4 offers the game after the next goal', async ({ page }) => {
  await page.goto('/check-and-continue');
  const link = page.locator('#what-next').getByRole('link', { name: 'Play Pack the brief' });
  await expect(link).toHaveAttribute('href', '/context-game');
  await link.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pack the brief.');
});
