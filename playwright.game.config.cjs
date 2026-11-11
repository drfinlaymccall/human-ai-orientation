const { defineConfig } = require('@playwright/test');
const fs = require('node:fs');

module.exports = defineConfig({
  testDir: './tests', testMatch: 'context-game.spec.cjs', timeout: 60000,
  workers: 1, retries: 0, outputDir: '/tmp/orientation-game-results',
  use: {
    baseURL: 'http://127.0.0.1:18821',
    launchOptions: {
      executablePath: process.env.ORIENTATION_CHROMIUM || (fs.existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined),
    },
  },
  webServer: {
    command: 'python3 scripts/serve-public.py --port 18821',
    url: 'http://127.0.0.1:18821', reuseExistingServer: false,
  },
  reporter: 'list',
});
