const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'trial.spec.cjs', timeout: 120000, workers: 1, retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:8787', actionTimeout: 15000, navigationTimeout: 30000,
    launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM || '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' },
    screenshot: 'only-on-failure',
  },
  reporter: [['list'], ['json', { outputFile: 'trial/test-report.json' }]],
});
