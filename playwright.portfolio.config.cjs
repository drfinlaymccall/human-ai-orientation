const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'portfolio.spec.cjs', timeout: 30000,
  workers: 1, retries: 0, outputDir: '/tmp/orientation-portfolio-results',
  use: {
    baseURL: 'http://127.0.0.1:8796',
    launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM || (require('node:fs').existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined) },
  },
  webServer: { command: 'python3 scripts/serve-public.py --port 8796', url: 'http://127.0.0.1:8796', reuseExistingServer: false },
  reporter: 'list',
});
