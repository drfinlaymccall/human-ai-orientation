// Synthetic WB10 rehearsal. Operator setup is confined to the capture-only fixture;
// learners create accounts, confirm, enrol, practise and recover through visible controls.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'trial/launch-fixture');
const base = 'http://127.0.0.1:18802';
if (fs.lstatSync(fixture).isSymbolicLink()) throw new Error('Independent non-symlink fixture required.');
const course = JSON.parse(fs.readFileSync(path.join(fixture, 'course.json')));
if (!course.course_url.startsWith(base + '/')) throw new Error('Independent 18802 fixture required.');
const env = { ...process.env, ORIENTATION_TRIAL_DIR: fixture };
const stamp = Date.now();
const password = 'Synthetic-Rehearsal-74!';
const recoveredPassword = 'Recovered-Rehearsal-81!';
const users = ['check', 'skip'].map(kind => ({ username: `wb10${kind}${stamp}`, email: `wb10${kind}${stamp}@example.test` }));
const about = 'Fictional WB10 book-swap organiser. I need help drafting welcoming invitations.';
const privateResult = 'PRIVATE-WB10-PRACTICE: fictional draft invented a venue; I replaced it with [venue].';
const receipt = path.join(fixture, `wb10-readiness-${stamp}.json`);
const addresses = path.join(fixture, `wb10-addresses-${stamp}.json`);
let original;
let historical;
function php(code) {
  const prelude = `define('CLI_SCRIPT',true); require ${JSON.stringify(path.join(root, 'scripts/moodle-environment.php'))}; require_once ${JSON.stringify(path.join(root, 'scripts/synthetic-fixture.php'))}; if($CFG->wwwroot!=='${base}' || !orientation_is_synthetic_fixture($orientationtrial,$CFG) || !empty($CFG->smtphosts) || !empty($CFG->divertallemailsto) || !empty($CFG->noemailever) || realpath($CFG->dataroot)!==realpath($orientationtrial.'/data') || realpath($CFG->dirroot)!==realpath($orientationtrial.'/moodle') || ini_get('sendmail_path')!=='/usr/bin/python3 '.$orientationtrial.'/capture-mail.py') throw new RuntimeException('Capture-only fixture required'); `;
  return execFileSync(path.join(root, 'scripts/fixture-php'), ['-r', prelude + code], { cwd: root, env, encoding: 'utf8' });
}
function configure(action, options = []) {
  return JSON.parse(execFileSync(path.join(root, 'scripts/fixture-php'), ['scripts/configure-onboarding.php', action, ...options], { cwd: root, env, encoding: 'utf8' }));
}
function phpValue(value) { return `json_decode(base64_decode('${Buffer.from(JSON.stringify(value)).toString('base64')}'))`; }
function history(ids) {
  return JSON.parse(php(`$out=[];$ids=${ids ? phpValue(ids) : 'null'};foreach(['lesson_attempts','lesson_grades','lesson_branch','lesson_timer','lesson_answers','course_modules_completion','course_completions','course_completion_criteria','course_modules'] as $t){$rows=$ids?($ids->$t?$DB->get_records_list($t,'id',$ids->$t,'id'):[]):$DB->get_records($t,null,'id');$out[$t]=['ids'=>array_keys($rows),'hash'=>hash('sha256',serialize($rows))];}echo json_encode($out);`));
}
function messages(user) {
  // Decode actual captured MIME; never log messages, reset/confirmation URLs or private credentials.
  const source = `import email.policy,email.parser,json,pathlib,sys
out=[]
for p in sorted(pathlib.Path(sys.argv[1]).glob('*.eml'),key=lambda p:p.stat().st_mtime):
 m=email.parser.BytesParser(policy=email.policy.default).parsebytes(p.read_bytes())
 if sys.argv[2] not in str(m.get('To','')): continue
 body=''.join(part.get_content() for part in m.walk() if part.get_content_type()=='text/plain')
 out.append(dict(subject=str(m.get('Subject','')),body=body))
print(json.dumps(out))`;
  return JSON.parse(execFileSync('python3', ['-c', source, path.join(fixture, 'mail'), user.email], { encoding: 'utf8' }));
}
function mailLink(user, endpoint) {
  for (const message of messages(user).reverse()) {
    const url = (message.body.match(/http:\/\/127\.0\.0\.1:18802\/[^\s<>"']+/g) || []).find(value => new URL(value).pathname === endpoint);
    if (url) return url;
  }
  throw new Error('Expected synthetic captured-message link missing.');
}
function welcomes(user) { return messages(user).filter(message => message.body.includes('Learn to team with AI:')); }
async function ready(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => !window.M?.util?.pending_js?.length);
  const tour = page.getByRole('button', { name: 'Got it', exact: true });
  if (await tour.isVisible()) await tour.click();
}
async function journey(page) {
  await page.locator('.primary-navigation').getByRole('menuitem', { name: 'Your course journey', exact: true }).click();
  await ready(page);
}
async function activity(page, slug) {
  const choice = page.locator(`[data-atlas-choice="${slug}"]`);
  if (await choice.isVisible()) await choice.click();
  await page.locator(`#region-main [data-atlas-open="${slug}"]`).click();
  await ready(page);
}
async function signOut(page) {
  await page.locator('.usermenu .dropdown-toggle').click();
  await page.getByRole('menuitem', { name: /Log out/ }).click();
  await ready(page);
}
async function signIn(page, user, pass = password) {
  await page.goto('/');
  await ready(page);
  await page.locator('header [data-account-link]').click();
  await ready(page);
  await page.locator('#username').fill(user.username);
  await page.locator('#password').fill(pass);
  await page.locator('#loginbtn').click({ timeout: 30000 });
  await ready(page);
  await expect(page).toHaveURL(base + '/local/orientation/index.php');
}
async function signupFromHome(page, user) {
  await page.goto('/');
  await ready(page);
  await page.getByRole('link', { name: 'Explore your course', exact: true }).click();
  await ready(page);
  await page.getByRole('link', { name: 'Find my starting point', exact: true }).click();
  await ready(page);
  await page.getByRole('link', { name: 'Create new account', exact: true }).click();
  await ready(page);
  for (const [id, value] of Object.entries({ username: user.username, password, email: user.email, email2: user.email, firstname: 'Synthetic', lastname: 'Rehearsal' })) await page.locator('#id_' + id).fill(value);
  await page.locator('#id_policyagreed').check();
  await page.locator('#id_submitbutton').click();
  await expect(page.locator('body')).toContainText('An email should have been sent');
  expect(welcomes(user)).toHaveLength(0);
}
async function confirmAndEnrol(page, user) {
  await page.goto(mailLink(user, '/login/confirm.php'));
  await expect(page.locator('body')).toContainText('registration has been confirmed');
  expect(welcomes(user)).toHaveLength(0);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Enrol me', exact: true }).click();
  await ready(page);
  await expect(page).toHaveURL(base + '/local/orientation/startingpoint.php');
  expect(welcomes(user)).toHaveLength(1);
}
async function welcome(page) {
  await ready(page);
  await expect(page.locator('[data-context-panel]').getByRole('link', { name: 'Open My context', exact: true })).toBeVisible();
  const panel = page.locator('[data-course-welcome]');
  await panel.locator('summary').first().focus();
  await page.keyboard.press('Enter');
  await expect(panel).toHaveAttribute('open', '');
  await expect(panel).toContainText('Learn to team with AI');
  await expect(panel).toContainText('Choose a worthwhile task');
}
async function noOverflow(page) { expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false); }

test.describe.serial('WB10 complete synthetic learner rehearsal', () => {
  test.beforeAll(() => {
    original = JSON.parse(php(`echo json_encode(['sitepolicy'=>get_config(null,'sitepolicy'),'noreplyaddress'=>get_config(null,'noreplyaddress'),'self'=>$DB->get_record('enrol',['courseid'=>${Number(course.course_id)},'enrol'=>'self'],'*',MUST_EXIST)]);`));
    const status = configure('status');
    expect(status.registration_open).toBe(false);
    expect(status.new_enrolments_open).toBe(false);
    historical = history();
    php(`set_config('sitepolicy',$CFG->wwwroot.'/privacy');set_config('noreplyaddress','synthetic-noreply@example.test');`);
    fs.writeFileSync(addresses, JSON.stringify(users.map(user => user.email)), { mode: 0o600 });
    fs.writeFileSync(receipt, JSON.stringify({ site: base, course_id: Number(course.course_id), synthetic: true, pilot_only: true, reviewed_by: 'Synthetic test only', reviewed_at: new Date().toISOString(), evidence_note: 'WB10 captured-mail rehearsal only; no genuine delivery, human pilot or owner approval', privacy_reviewed: true, support_reviewed: true, operating_reviewed: true, retention_before_broad_launch: true }), { mode: 0o600 });
    configure('welcome-enable');
    configure('pilot', ['--receipt=' + receipt, '--pilot-emails=' + addresses]);
  });
  test.afterAll(() => {
    try {
      if (historical) expect(history(Object.fromEntries(Object.entries(historical).map(([table, value]) => [table, value.ids])))).toEqual(historical);
    } finally {
      if (original) {
        configure('configure-closed');
        php(`$self=${phpValue(original.self)};$DB->update_record('enrol',$self);`);
        for (const key of ['sitepolicy', 'noreplyaddress']) php(original[key] === false ? `unset_config('${key}');` : `set_config('${key}',${phpValue(original[key])});`);
      }
      fs.rmSync(receipt, { force: true }); fs.rmSync(addresses, { force: true });
    }
  });

  test('checked path completes three activities, deliberately saves reviewed context, copies selectively and recovers in a fresh browser', async ({ browser }, testInfo) => {
    const contexts = [];
    async function fresh() { const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] }); contexts.push(context); return context.newPage(); }
    const user = users[0];
    try {
      await signupFromHome(await fresh(), user);
      const page = await fresh();
      await confirmAndEnrol(page, user);
      await page.getByRole('link', { name: 'Open the optional check', exact: true }).click();
      await page.getByRole('button', { name: /^Attempt quiz/ }).click();
      await ready(page);
      for (let number = 0; number < 3; number++) {
        const questions = page.locator('.que.multichoice');
        await expect(questions).toHaveCount(4);
        for (const question of await questions.all()) await question.locator('input[type=radio]:not([value="-1"])').nth(1).check();
        await page.getByRole('button', { name: number < 2 ? 'Next page' : 'Finish attempt ...', exact: true }).click();
        await ready(page);
      }
      await page.getByRole('button', { name: 'Submit all and finish', exact: true }).click();
      await page.getByRole('dialog').getByRole('button', { name: 'Submit all and finish', exact: true }).click();
      await page.waitForURL('**/mod/quiz/review.php?**'); await ready(page);
      await page.locator('[data-starting-navigation]').getByRole('link').click();
      await expect(page.locator('[data-starting-suggestion]')).toHaveAttribute('data-starting-suggestion', 'first-task');
      await welcome(page);
      await page.screenshot({ path: testInfo.outputPath('welcome-desktop-expanded.png'), fullPage: true });
      await activity(page, 'first-task');
      await page.getByText('If you cannot use an AI today', { exact: true }).click();
      await expect(page.locator('#region-main')).toContainText('invents a date and venue');
      await page.getByRole('button', { name: /^Mark .* as done$/ }).click(); await ready(page);
      await journey(page);
      await expect(page.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
      await activity(page, 'useful-context');
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await expect(page.locator('#region-main')).toContainText('2. See what context changes');
      await journey(page);
      await expect(page.locator('[data-atlas-progress="useful-context"]')).toHaveText('In progress');
      await activity(page, 'portfolio');
      await page.locator('[data-portfolio-field="about"]').fill(about);
      await page.locator('[data-portfolio-field="preferences"]').fill('Short practical steps, with an example before I try.');
      await page.locator('[data-portfolio-field="boundaries"]').fill('Ask me to confirm dates and venues. Leave unknown details as placeholders.');
      await page.getByLabel('I have reviewed these context documents').check();
      await page.getByRole('button', { name: 'Save to My context', exact: true }).click();
      await expect(page.locator('[data-context-save-status]')).toContainText('Saved to Moodle');
      await journey(page);
      await activity(page, 'useful-context');
      await page.locator('#region-main').getByRole('link', { name: 'Yes', exact: true }).click();
      await expect(page.locator('#region-main')).toContainText('2. See what context changes');
      for (const heading of ['3. Build your small context brief', '4. Try it, check it, improve it', '5. Keep instructions you can reuse', 'This is practice, not a graded exam.']) {
        await ready(page); await page.getByRole('button', { name: 'Continue', exact: true }).click();
        await expect(page.locator('#region-main')).toContainText(heading);
      }
      await page.getByLabel('Check what context the tool actually has, share the relevant brief deliberately, and inspect the result.', { exact: true }).check();
      await page.getByRole('button', { name: 'Submit', exact: true }).click(); await ready(page);
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await page.locator('#region-main textarea').fill('Fictional rehearsal: I checked the invented venue against the undecided arrangements and kept an instruction to use placeholders.');
      await page.getByRole('button', { name: 'Submit', exact: true }).click(); await ready(page);
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await expect(page.locator('#region-main')).toContainText('Your lesson is complete');
      await journey(page);
      await activity(page, 'check-and-continue');
      await page.getByText('Fictional example: checking an invitation', { exact: true }).click();
      await expect(page.locator('#region-main')).toContainText('Saturday at the library');
      await page.locator('[data-portfolio-field="result"]').fill(privateResult);
      await page.locator('[data-portfolio-field="nextGoal"]').fill('Try a real invitation and inspect the date and venue placeholders.');
      await page.locator('[data-portfolio-field="nextStep"]').fill('Draft two opening sentences; keep them welcoming and under 100 words.');
      await page.getByRole('button', { name: 'Save to My context', exact: true }).click();
      await expect(page.locator('[data-context-save-status]')).toContainText('Saved to Moodle');
      await page.getByRole('button', { name: /^Mark .* as done$/ }).click(); await ready(page);
      await journey(page);
      await expect(page.locator('#region-main')).toContainText('Your three core activities are recorded as complete');
      await page.locator('#region-main a.btn-primary').filter({ hasText: /^Open My context$/ }).click(); await ready(page);
      await expect(page.getByLabel('Relevant background', { exact: true })).toHaveValue(about);
      await page.getByRole('button', { name: 'Copy', exact: true }).focus(); await page.keyboard.press('Enter');
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      expect(copied).toContain(about); expect(copied).toContain('reviewed by the learner'); expect(copied).not.toContain(privateResult);
      const pending = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Download Markdown (.md)', exact: true }).click();
      const download = await pending;
      expect(download.suggestedFilename()).toBe('orientation-working.md');
      expect(fs.readFileSync(await download.path(), 'utf8')).toBe(copied);
      await page.getByRole('link', { name: 'Private practice record', exact: true }).click();
      await expect(page.getByLabel('Observed result and one check', { exact: true })).toHaveValue(privateResult);
      await page.screenshot({ path: testInfo.outputPath('saved-practice-desktop.png'), fullPage: true });
      await signOut(page);
      const returning = await fresh(); await signIn(returning, user);
      await expect(returning.locator('#region-main')).toContainText('Your three core activities are recorded as complete');
      await returning.locator('#region-main a.btn-primary').filter({ hasText: /^Open My context$/ }).click();
      await expect(returning.getByLabel('Relevant background', { exact: true })).toHaveValue(about);
      await signOut(returning);
      await returning.locator('header [data-account-link]').click(); await ready(returning);
      await returning.locator('a[href$="/login/forgot_password.php"]').first().click(); await ready(returning);
      await returning.locator('#id_username').fill(user.username); await returning.locator('#id_submitbuttonusername').click();
      await expect(returning.locator('body')).toContainText('If you supplied a correct username');
      const recovery = await fresh(); await recovery.goto(mailLink(user, '/login/forgot_password.php')); await ready(recovery);
      await recovery.locator('#id_password').fill(recoveredPassword); await recovery.locator('#id_password2').fill(recoveredPassword);
      await recovery.locator('#id_submitbutton').click(); await ready(recovery);
      await expect(recovery.locator('#region-main')).toContainText('Your three core activities are recorded as complete');
      await signOut(recovery);
      const recovered = await fresh(); await signIn(recovered, user, recoveredPassword);
      await recovered.locator('#region-main a.btn-primary').filter({ hasText: /^Open My context$/ }).click();
      await expect(recovered.getByLabel('Relevant background', { exact: true })).toHaveValue(about);
      expect(welcomes(user)).toHaveLength(1);
    } finally { for (const context of contexts) await context.close(); }
  });

  test('mobile skip path stays independent; no-JavaScript learner edits saved context and uses the copy fallback', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    try {
      const user = users[1]; const page = await context.newPage();
      await signupFromHome(page, user); await confirmAndEnrol(page, user);
      await page.getByRole('link', { name: 'Skip this check / Back to your course journey', exact: true }).click();
      await welcome(page); await noOverflow(page);
      await page.screenshot({ path: testInfo.outputPath('welcome-mobile-expanded.png'), fullPage: true });
      await expect(page.locator('[data-starting-suggestion]')).toHaveCount(0);
      await expect(page.locator('[data-atlas-progress="first-task"]')).toHaveText('Not yet complete');
      await page.locator('#region-main a.btn-primary').filter({ hasText: /^Open My context$/ }).click();
      await expect(page.getByLabel('Relevant background', { exact: true })).toHaveValue('');
      await expect(page.locator('#region-main')).not.toContainText(about);
      await signOut(page);
      const plain = await nojs.newPage(); await signIn(plain, user);
      const panel = plain.locator('[data-course-welcome]'); await panel.locator('summary').first().click();
      await expect(panel).toContainText('Learn to team with AI');
      await plain.locator('#region-main a.btn-primary').filter({ hasText: /^Open My context$/ }).click();
      const ownText = 'Fictional second learner: use plain language and leave unknown times undecided.';
      await plain.getByLabel('Relevant background', { exact: true }).fill(ownText);
      await plain.getByRole('button', { name: 'Save changes', exact: true }).click();
      await expect(plain.locator('#region-main')).toContainText('Saved to Moodle');
      await expect(plain.getByRole('button', { name: 'Copy', exact: true })).toBeHidden();
      // Playwright's generic element-text matcher omits NOSCRIPT descendants.
      // Assert the actual rendered fallback paragraph and its visible text instead.
      await expect(plain.locator('noscript p')).toBeVisible();
      await expect(plain.locator('noscript p')).toHaveText('Select the text above and use your device’s Copy command.');
      await expect(plain.getByLabel('Text to copy', { exact: true })).toHaveValue(new RegExp(ownText));
      await expect(plain.getByLabel('Text to copy', { exact: true })).not.toHaveValue(new RegExp(about));
      await noOverflow(plain);
      await plain.getByRole('link', { name: 'Private practice record', exact: true }).click();
      await expect(plain.getByLabel('Observed result and one check', { exact: true })).toHaveValue('');
      await expect(plain.locator('#region-main')).not.toContainText(privateResult);
      await plain.getByRole('link', { name: 'Back to your course', exact: true }).click();
      await expect(plain.locator('[data-atlas-progress="first-task"]')).toHaveText('Not yet complete');
      await plain.screenshot({ path: testInfo.outputPath('nojs-mobile-independent-journey.png'), fullPage: true });
      await plain.locator('#region-main a.btn-primary').filter({ hasText: /^Open My context$/ }).click();
      await expect(plain.getByLabel('Relevant background', { exact: true })).toHaveValue(ownText);
      expect(welcomes(user)).toHaveLength(1);
    } finally { await context.close(); await nojs.close(); }
  });
});
