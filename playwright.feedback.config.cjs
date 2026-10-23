const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'feedback-recorder.spec.cjs', timeout: 20000,
  workers: 1, retries: 0, outputDir: '/tmp/orientation-feedback-results',
  use: {
    baseURL: 'http://127.0.0.1:8798', permissions: ['microphone'],
    launchOptions: {
      executablePath: process.env.ORIENTATION_CHROMIUM || (require('node:fs').existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined),
      args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
    },
    screenshot: 'only-on-failure',
  },
  reporter: 'list',
});
