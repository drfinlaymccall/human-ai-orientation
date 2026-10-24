const { defineConfig } = require('@playwright/test');
const port = process.env.ORIENTATION_PORTFOLIO_PORT || '8796';
if (!['8796', '18816'].includes(port)) throw new Error('Use a supported loopback portfolio preview port.');
const baseURL = `http://127.0.0.1:${port}`;
module.exports = defineConfig({
  testDir: './tests', testMatch: 'portfolio.spec.cjs', timeout: 30000,
  workers: 1, retries: 0, outputDir: port === '8796' ? '/tmp/orientation-portfolio-results' : '/tmp/orientation-portfolio-18816-results',
  use: {
    baseURL,
    launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM || (require('node:fs').existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined) },
  },
  webServer: { command: `python3 scripts/serve-public.py --port ${port}`, url: baseURL, reuseExistingServer: false },
  reporter: 'list',
});
