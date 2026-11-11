// Renders content/share-image.html to public/assets/share.png (1200 x 630).
// Run by hand after changing the source: node scripts/build-share-image.cjs
// It is not part of `npm run build`, because browser rendering is not byte-stable.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const local = '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
(async () => {
  const executablePath = process.env.ORIENTATION_CHROMIUM || (fs.existsSync(local) ? local : undefined);
  const browser = await chromium.launch({ executablePath });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('file://' + path.join(root, 'content/share-image.html'));
  await page.screenshot({ path: path.join(root, 'public/assets/share.png') });
  await browser.close();
})();
