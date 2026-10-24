const { defineConfig } = require('@playwright/test');
const fs = require('node:fs');

module.exports = defineConfig({
  testDir: './tests', testMatch: 'metadata.spec.cjs', timeout: 30000,
  workers: 1, retries: 0, outputDir: '/tmp/orientation-metadata-results',
  use: {
    baseURL: 'http://127.0.0.1:18803',
    launchOptions: {
      executablePath: process.env.ORIENTATION_CHROMIUM || (fs.existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined),
    },
  },
  webServer: {
    command: 'python3 scripts/serve-public.py --port 18803',
    url: 'http://127.0.0.1:18803', reuseExistingServer: false,
  },
  reporter: 'list',
});
