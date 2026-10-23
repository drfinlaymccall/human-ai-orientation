const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'finlay-tips.spec.cjs', timeout: 30000,
  workers: 1, retries: 0, outputDir: '/tmp/orientation-tips-results',
  use: {
    baseURL: 'http://127.0.0.1:18798',
    launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM ||
      (require('node:fs').existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined) },
  },
  webServer: { command: 'python3 scripts/serve-public.py --port 18798', url: 'http://127.0.0.1:18798', reuseExistingServer: false },
  reporter: 'list',
});
