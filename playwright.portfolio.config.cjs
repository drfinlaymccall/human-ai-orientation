const { defineConfig } = require('@playwright/test');
const port = Number(process.env.ORIENTATION_PORTFOLIO_PORT || 8796);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error('ORIENTATION_PORTFOLIO_PORT must be an integer from 1024 to 65535');
}
const baseURL = `http://127.0.0.1:${port}`;
module.exports = defineConfig({
  testDir: './tests', testMatch: 'portfolio.spec.cjs', timeout: 30000,
  workers: 1, retries: 0, outputDir: '/tmp/orientation-portfolio-results',
  use: {
    baseURL,
    launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM || (require('node:fs').existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined) },
  },
  webServer: { command: `python3 scripts/serve-public.py --port ${port}`, url: baseURL, reuseExistingServer: false },
  reporter: 'list',
});
