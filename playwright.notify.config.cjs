const { defineConfig } = require('@playwright/test');
const fs = require('node:fs');
const baseURL = process.env.ORIENTATION_FIXTURE_URL || 'http://127.0.0.1:18802';
if (baseURL !== 'http://127.0.0.1:18802') throw new Error('Exact synthetic fixture URL required.');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'notify.spec.cjs', workers: 1, retries: 0, timeout: 90000,
  outputDir: 'trial/launch-fixture/test-results/notify', reporter: [['list']],
  use: { baseURL, actionTimeout: 15000, navigationTimeout: 30000, trace: 'off', video: 'off', screenshot: 'off',
    launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM ||
      (fs.existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined) } },
});
