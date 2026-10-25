const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const map = require('../content/course-map.json');
const root = path.resolve(__dirname, '../public');
// Source-only browser checks. This is not a Moodle authentication or server test.
for (const javaScriptEnabled of [true, false]) {
  for (const width of [1280, 390]) {
    test(`catalogue and Unit 1 journey: JS=${javaScriptEnabled}, width=${width}`, async ({ browser }, info) => {
      const context = await browser.newContext({ javaScriptEnabled, viewport: {width, height: 900} });
      await context.route('http://curriculum.test/**', async route => {
        const url = new URL(route.request().url());
        if (url.pathname.startsWith('/local/')) return route.fulfill({status: 200, contentType: 'application/json', body: '{}'});
        let file = path.join(root, url.pathname === '/' ? 'index.html' : url.pathname);
        if (!path.extname(file)) file += '.html';
        if (!fs.existsSync(file)) return route.fulfill({status: 404, body: 'Not found'});
        await route.fulfill({path: file});
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://curriculum.test/catalogue');
      await expect(page.getByRole('heading', {name: 'Course catalogue', exact: true})).toBeVisible();
      const planned = page.locator('[data-unit="agentic-systems"]');
      await expect(planned).toContainText('Planned — not yet available');
      await expect(planned.locator('a')).toHaveCount(0);
      await page.getByRole('link', {name: 'Open Unit 1 journey', exact: true}).click();
      await expect(page.getByRole('heading', {name: 'Unit 1: Human–AI Orientation', level: 1})).toBeVisible();
      for (const activity of map.activities) {
        if (javaScriptEnabled) {
          await page.locator(`[data-atlas-choice="${activity.slug}"]`).click();
        }
        const panel = page.locator(`[data-atlas-detail="${activity.slug}"]`);
        await expect(panel).toBeVisible();
        await expect(panel.locator('[data-atlas-open]')).toHaveAttribute('href', activity.public_url);
      }
      // Syllabus links must also reveal a panel when enhancement hides other panels.
      await page.locator('[data-unit-syllabus] a[href="#atlas-detail-notes"]').click();
      await expect(page.locator('[data-atlas-detail="notes"]')).toBeVisible();
      if (javaScriptEnabled) {
        await page.locator('[data-atlas-choice="first-task"]').click();
        await expect(page.locator('[data-atlas-detail="notes"]')).toBeHidden();
        await page.locator('[data-unit-syllabus] a[href="#atlas-detail-notes"]').click();
        await expect(page.locator('[data-atlas-detail="notes"]')).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({path: info.outputPath('journey.png'), fullPage: true});
      await page.goto('http://curriculum.test/before-you-start');
      await page.locator('a[href="/desktop-workspace#meet-your-ai"]').last().click();
      await expect(page.locator('#meet-your-ai')).toBeVisible();
      expect(errors).toEqual([]);
      await context.close();
    });
  }
}
