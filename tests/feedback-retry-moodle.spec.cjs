// Real HTTP commit with a deliberately lost response, using only the isolated synthetic site.
// Adds two peer submissions per run; provision fresh fixtures before the combined native suite.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const fixtures = JSON.parse(fs.readFileSync(process.env.FEEDBACK_FIXTURES || 'trial/feedback-fixtures.json', 'utf8'));

test('a committed response loss followed by edits conflicts and requires an explicit separate submission', async ({ page }) => {
  await page.goto('/login/index.php');
  await page.locator('#username').fill(fixtures.users.peer.username);
  await page.locator('#password').fill(fixtures.password);
  await page.locator('#loginbtn').click();
  await expect(page.locator('#password')).toHaveCount(0);
  await page.goto(`/local/orientationfeedback/index.php?courseid=${fixtures.courseid}&cmid=${fixtures.cmid}&source=help`);
  const originalText = 'Synthetic original feedback before a deliberately lost receipt';
  const editedText = 'Synthetic edited feedback after the original was committed';
  const message = page.locator('textarea[name=message]');
  const send = page.getByRole('button', { name: 'Send feedback', exact: true });
  const token = page.locator('[name=submissiontoken]');
  await message.fill(originalText);
  await page.locator('[data-voice-record]').click();
  await expect(page.locator('[data-voice-stop]')).toBeVisible();
  await page.waitForTimeout(400);
  await page.locator('[data-voice-stop]').click();
  const playback = page.locator('[data-voice-playback]');
  await expect(playback).toBeVisible();
  const audioURL = await playback.getAttribute('src');
  const audio = Buffer.from(await playback.evaluate(async element =>
    Array.from(new Uint8Array(await (await fetch(element.src)).arrayBuffer()))));
  expect(audio.length).toBeGreaterThan(100);
  const originalToken = await token.inputValue();
  let committed, requests = 0;
  await page.route('**/local/orientationfeedback/index.php?format=json', async route => {
    requests++;
    if (requests !== 1) return route.continue();
    // Send the real multipart request to Moodle, then lose only its successful response.
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    committed = await response.json();
    await route.abort('failed');
  });
  await send.click();
  await expect(page.locator('[data-voice-status]')).toContainText('Feedback was not confirmed as saved');
  expect(committed.id).toBeGreaterThan(0);
  await expect(send).toBeEnabled();
  await expect(token).toHaveValue(originalToken);
  await message.fill(editedText);
  const conflictResponse = page.waitForResponse(response =>
    response.url().includes('/local/orientationfeedback/index.php?format=json') && response.status() === 409);
  await send.click();
  expect(await (await conflictResponse).json()).toHaveProperty('code', 'retryconflict');
  await expect(page.locator('[data-voice-status]')).toContainText('An earlier version of this feedback was saved');
  await expect(page.locator('[data-voice-status]')).toContainText('These changes have not been saved');
  await expect(message).toHaveValue(editedText);
  await expect(send).toBeEnabled();
  await expect(token).toHaveValue(originalToken);
  expect(await playback.getAttribute('src')).toBe(audioURL);
  expect(new URL(page.url()).searchParams.has('id')).toBe(false);

  const originalReceipt = await page.context().newPage();
  await originalReceipt.goto(`/local/orientationfeedback/index.php?id=${committed.id}`);
  await expect(originalReceipt.getByText(originalText, { exact: true })).toBeVisible();
  await expect(originalReceipt.getByText(editedText, { exact: true })).toHaveCount(0);
  const originalAudio = await originalReceipt.request.get(await originalReceipt.locator('audio').getAttribute('src'));
  expect(originalAudio.ok()).toBe(true);
  expect((await originalAudio.body()).equals(audio)).toBe(true);
  await originalReceipt.close();

  await page.getByRole('button', { name: 'Prepare a separate feedback message', exact: true }).click();
  const separateToken = await token.inputValue();
  expect(separateToken).toMatch(/^[a-f0-9]{32}$/);
  expect(separateToken).not.toBe(originalToken);
  expect(requests).toBe(2);
  await expect(message).toHaveValue(editedText);
  expect(await playback.getAttribute('src')).toBe(audioURL);
  await send.click();
  await expect(page).toHaveURL(/\/local\/orientationfeedback\/index.php\?id=[1-9][0-9]*$/);
  expect(Number(new URL(page.url()).searchParams.get('id'))).not.toBe(committed.id);
  await expect(page.getByText(editedText, { exact: true })).toBeVisible();
  const savedAudio = await page.request.get(await page.locator('audio').getAttribute('src'));
  expect(savedAudio.ok()).toBe(true);
  expect((await savedAudio.body()).equals(audio)).toBe(true);
  expect(requests).toBe(3);
});
