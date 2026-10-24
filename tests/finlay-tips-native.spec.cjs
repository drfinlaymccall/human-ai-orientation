// Synthetic fixture only. Never reuse a real learner, password or mail transport.
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'trial/launch-fixture');
const base = 'http://127.0.0.1:18802';
const course = JSON.parse(fs.readFileSync(path.join(fixture, 'course.json')));
if (!course.course_url.startsWith(base + '/')) throw Error('Synthetic fixture required');
const username = `writingtips${Date.now()}`;
const password = 'Synthetic-Writing-Tips-74!';
function php(code) {
  return execFileSync(path.join(root, 'scripts/fixture-php'), ['-r', `define('CLI_SCRIPT',true);require ${JSON.stringify(path.join(root,'scripts/moodle-environment.php'))};if($CFG->wwwroot!=='${base}')throw new RuntimeException('Fixture only');` + code], { cwd: root, env: { ...process.env, ORIENTATION_TRIAL_DIR: fixture }, encoding: 'utf8' });
}
async function ready(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => !window.M?.util?.pending_js?.length);
}
async function login(page) {
  await page.goto('/login/index.php'); await ready(page);
  await page.locator('#username').fill(username); await page.locator('#password').fill(password);
  await page.locator('#loginbtn').click(); await ready(page);
}
test.describe.serial('native writing support', () => {
  test.beforeAll(() => php(`require_once($CFG->dirroot.'/user/lib.php');require_once($CFG->libdir.'/enrollib.php');$u=(object)['username'=>'${username}','email'=>'${username}@example.test','password'=>'${password}','auth'=>'manual','confirmed'=>1,'firstname'=>'Synthetic','lastname'=>'WritingTips','mnethostid'=>$CFG->mnet_localhost_id];$id=user_create_user($u);$i=$DB->get_record('enrol',['courseid'=>${Number(course.course_id)},'enrol'=>'manual'],'*',MUST_EXIST);enrol_get_plugin('manual')->enrol_user($i,$id,$DB->get_field('role','id',['shortname'=>'student'],MUST_EXIST));`));
  test('native portfolio has the shared panel and a hint beside every input', async ({ page }, testInfo) => {
    await login(page);
    const cmid = php(`echo $DB->get_field('course_modules','id',['course'=>${Number(course.course_id)},'idnumber'=>'orientation:portfolio'],MUST_EXIST);`).trim();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 950 });
      await page.goto('/mod/page/view.php?id=' + cmid); await ready(page);
      await expect(page.locator('#finlay-portfolio-tips')).toBeVisible();
      await expect(page.locator('#portfolio-about + .finlay-field-hint')).toBeVisible();
      await expect(page.locator('.finlay-field-hint')).toHaveCount(12);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
      if (width === 1440) await page.locator('#region-main').screenshot({ path: testInfo.outputPath('native-portfolio-tips.png') });
    }
  });
  test('native Lesson builder and reflection copy prompts without submitting, then retain native completion', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await login(page); await page.goto(course.lesson_url); await ready(page);
    for (let i = 0; i < 2; i++) { await page.getByRole('button', { name: 'Continue', exact: true }).click(); await ready(page); }
    await expect(page.locator('#finlay-brief-tips')).toBeVisible();
    await page.locator('#brief-task').fill('Synthetic fictional book swap.');
    const panel = page.locator('#finlay-brief-tips');
    await panel.getByText('Help me make a clearer request', { exact: true }).click();
    const here = page.url();
    await panel.getByRole('button', { name: 'Copy clearer-request prompt', exact: true }).click();
    await expect(page).toHaveURL(here);
    await expect(page.locator('#brief-task')).toHaveValue('Synthetic fictional book swap.');
    for (let i = 0; i < 3; i++) { await page.getByRole('button', { name: 'Continue', exact: true }).click(); await ready(page); }
    await page.getByLabel('Check what context the tool actually has, share the relevant brief deliberately, and inspect the result.', { exact: true }).check();
    await page.getByRole('button', { name: 'Submit', exact: true }).click(); await ready(page);
    await page.getByRole('button', { name: 'Continue', exact: true }).click(); await ready(page);
    await expect(page.locator('#finlay-reflection-tips')).toBeVisible();
    await expect(page.locator('textarea')).toHaveAttribute('aria-describedby', /finlay-reflection-tips-field-/);
    await page.locator('textarea').fill('Synthetic practice: I used a fictional task, kept the date unknown and checked my result.');
    const reflection = page.locator('#finlay-reflection-tips');
    await reflection.getByText('Interview me one question at a time', { exact: true }).click();
    const before = page.url();
    await reflection.getByRole('button', { name: 'Copy interview prompt', exact: true }).click();
    await expect(page).toHaveURL(before);
    await expect(page.locator('textarea')).toHaveValue(/Synthetic practice/);
    await page.getByRole('button', { name: 'Submit', exact: true }).click(); await ready(page);
    await page.getByRole('button', { name: 'Continue', exact: true }).click(); await ready(page);
    await expect(page.locator('#region-main')).toContainText('Your lesson is complete');
  });
});
