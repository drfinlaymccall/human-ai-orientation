const { defineConfig } = require('@playwright/test');
const fs = require('node:fs');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'progress.spec.cjs', timeout: 60000,
  workers: 1, retries: 0, outputDir: 'trial/launch-fixture/test-results/progress',
  use: {
    baseURL: 'http://127.0.0.1:18802', actionTimeout: 15000, navigationTimeout: 30000,
    launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM ||
      (fs.existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined) },
    trace: 'off', screenshot: 'off', video: 'off',
  },
  reporter: [['list'], ['json', { outputFile: 'trial/launch-fixture/progress-report.json' }]],
});
