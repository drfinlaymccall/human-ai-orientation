const { defineConfig } = require('@playwright/test');
const fs = require('node:fs');
const baseURL = process.env.ORIENTATION_FIXTURE_URL || 'http://127.0.0.1:18802';
if (!['http://127.0.0.1:18802', 'http://127.0.0.1:18812'].includes(baseURL)) throw new Error('Guarded synthetic fixture URL required.');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'onboarding.spec.cjs', timeout: 60000,
  workers: 1, retries: 0, outputDir: 'trial/launch-fixture/test-results/onboarding',
  use: {
    baseURL, actionTimeout: 15000, navigationTimeout: 30000,
    launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM ||
      (fs.existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined) },
    trace: 'off', screenshot: 'off', video: 'off',
  },
  reporter: [['list'], ['json', { outputFile: 'trial/launch-fixture/onboarding-report.json' }]],
});
