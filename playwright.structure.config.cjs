const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'course-structure.spec.cjs', workers: 1,
  use: { launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM || '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' } },
  reporter: 'list',
});
