const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'course-structure.spec.cjs', workers: 1,
  use: { launchOptions: process.env.ORIENTATION_CHROMIUM ? { executablePath: process.env.ORIENTATION_CHROMIUM } : {} },
  reporter: 'list',
});
