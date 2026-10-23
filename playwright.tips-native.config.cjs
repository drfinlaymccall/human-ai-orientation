module.exports = {
  ...require('./playwright.progress.config.cjs'),
  testMatch: 'finlay-tips-native.spec.cjs',
  outputDir: 'trial/launch-fixture/test-results/tips',
  reporter: 'list',
};
