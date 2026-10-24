// Synthetic native Moodle account journeys. Never point this suite at a deployed database or SMTP.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'trial/launch-fixture');
const base = process.env.ORIENTATION_FIXTURE_URL || 'http://127.0.0.1:18802';
if (!['http://127.0.0.1:18802', 'http://127.0.0.1:18812'].includes(base)) throw new Error('Guarded synthetic fixture URL required.');
if (base.endsWith(':18812')) {
  const marker = JSON.parse(fs.readFileSync(path.join(fixture, 'synthetic-fixture.json')));
  if (fs.lstatSync(fixture).isSymbolicLink() || marker.synthetic !== true || marker.wwwroot !== base || marker.database !== 'orientation_journey_fixture') throw new Error('Independent synthetic fixture marker required.');
}
const course = JSON.parse(fs.readFileSync(path.join(fixture, 'course.json')));
if (!course.course_url.startsWith(base + '/')) throw new Error('Synthetic localhost fixture required.');
const env = { ...process.env, ORIENTATION_TRIAL_DIR: fixture };
const receipt = path.join(fixture, 'onboarding-readiness-synthetic.json');
const password = 'Synthetic-Only-74!';
const stamp = Date.now();
const learner = { username: `onboard${stamp}`, email: `onboard${stamp}@example.test` };
let confirmLink;
let priorSitePolicy;
function configure(mode, options = []) {
  const result = spawnSync(path.join(root, 'scripts/php'), ['scripts/configure-onboarding.php', mode, ...options], { cwd: root, env, encoding: 'utf8' });
  return { status: result.status, output: result.stdout + result.stderr };
}
function fixturePhp(code) {
  const prelude = `define('CLI_SCRIPT',true); require ${JSON.stringify(path.join(root, 'scripts/moodle-environment.php'))}; require_once ${JSON.stringify(path.join(root, 'scripts/synthetic-fixture.php'))}; if ($CFG->wwwroot !== '${base}' || !orientation_is_synthetic_fixture($orientationtrial, $CFG)) throw new RuntimeException('Fixture only'); `;
  return execFileSync(path.join(root, 'scripts/php'), ['-r', prelude + code], { cwd: root, env, encoding: 'utf8' });
}
function snapshot() {
  return JSON.parse(fixturePhp(`$keys=['smtphosts','smtpsecure','smtpuser','smtppass','sendmailpath','noemailever','divertallemailsto']; $mail=[]; foreach($keys as $key) $mail[$key]=$CFG->$key??null; echo json_encode(['mail'=>hash('sha256',serialize($mail)), 'manual_users'=>$DB->get_records_menu('user',['auth'=>'manual','deleted'=>0],'id','id,username'), 'enrolments'=>$DB->get_records_menu('user_enrolments',null,'id','id,enrolid'), 'auth'=>$CFG->auth??'', 'plugins'=>$CFG->enrol_plugins_enabled??'']);`));
}
function messageLink(username, endpoint) {
  const folder = path.join(fixture, 'mail');
  const names = fs.readdirSync(folder).sort((a,b) => fs.statSync(path.join(folder,b)).mtimeMs - fs.statSync(path.join(folder,a)).mtimeMs);
  for (const name of names) {
    const raw = fs.readFileSync(path.join(folder,name), 'utf8');
    const body = raw.replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex,16))).replace(/&amp;/g, '&');
    if (!body.includes(username)) continue;
    const urls = body.match(/http:\/\/127\.0\.0\.1:\d+\/[^\s<>"']+/g) || [];
    const found = urls.find(url => url.startsWith(base + '/') && new URL(url).pathname === endpoint);
    if (found) return found;
  }
  throw new Error('Expected synthetic capture not found for requested message type.');
}
async function ready(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => !window.M?.util?.pending_js?.length);
  const tour = page.getByRole('button', {name:'Got it', exact:true});
  if (await tour.isVisible()) await tour.click();
}
async function signup(page, user, acceptPolicy = true) {
  await page.goto('/login/signup.php'); await ready(page);
  await fillSignup(page, user, acceptPolicy);
}
async function fillSignup(page, user, acceptPolicy = true) {
  for (const [id,value] of Object.entries({username:user.username,password,email:user.email,email2:user.email,firstname:'Synthetic',lastname:'Onboarding'})) await page.locator('#id_'+id).fill(value);
  if (acceptPolicy) await page.locator('#id_policyagreed').check();
  await page.locator('#id_submitbutton').click();
}
async function login(page, user, pass = password) {
  await page.goto('/login/index.php'); await ready(page);
  await page.locator('#username').fill(user.username); await page.locator('#password').fill(pass); await page.locator('#loginbtn').click({timeout:30000});
}
async function recover(page, user) {
  await page.goto('/login/forgot_password.php'); await ready(page);
  await page.locator('#id_username').fill(user.username); await page.locator('#id_submitbuttonusername').click();
  await expect(page.locator('body')).toContainText('If you supplied a correct username');
}
test.describe.serial('isolated native onboarding', () => {
  test.beforeAll(() => {
    priorSitePolicy = JSON.parse(fixturePhp(`echo json_encode(get_config(null,'sitepolicy'));`));
    fixturePhp(`set_config('sitepolicy',$CFG->wwwroot.'/privacy');`);
  });
  test.afterAll(() => {
    configure('configure-closed');
    if (priorSitePolicy === false) fixturePhp(`unset_config('sitepolicy');`);
    else fixturePhp(`set_config('sitepolicy',${JSON.stringify(priorSitePolicy)});`);
  });
  test('requires a valid private receipt; closed setup is additive, idempotent and keeps existing enrolments', async ({ page }) => {
    const before = snapshot();
    const missing = configure('open', ['--receipt='+path.join(fixture,'missing-readiness.json')]);
    expect(missing.status).not.toBe(0); expect(missing.output).toContain('Registration retained unchanged');
    for (let run=0; run<2; run++) expect(configure('configure-closed').status).toBe(0);
    const originalPolicy = JSON.parse(fixturePhp(`$out=[]; foreach(['minpasswordlength','minpassworddigits','lockoutthreshold','lockoutwindow','lockoutduration'] as $key) $out[$key]=(int)($CFG->$key??0); echo json_encode($out);`));
    try {
      fixturePhp(`foreach(['minpasswordlength'=>16,'minpassworddigits'=>2,'lockoutthreshold'=>3,'lockoutwindow'=>3600,'lockoutduration'=>7200] as $key=>$value) set_config($key,$value);`);
      expect(configure('configure-closed').status).toBe(0);
      const stricter = JSON.parse(fixturePhp(`$out=[]; foreach(['minpasswordlength','minpassworddigits','lockoutthreshold','lockoutwindow','lockoutduration'] as $key) $out[$key]=(int)$CFG->$key; echo json_encode($out);`));
      expect(stricter).toEqual({minpasswordlength:16,minpassworddigits:2,lockoutthreshold:3,lockoutwindow:3600,lockoutduration:7200});
      fixturePhp(`set_config('lockoutduration',0);`);
      expect(configure('configure-closed').status).toBe(0);
      expect(Number(fixturePhp(`echo (int)$CFG->lockoutduration;`))).toBe(0);
    } finally {
      fixturePhp(`foreach(json_decode('${JSON.stringify(originalPolicy)}',true) as $key=>$value) set_config($key,$value);`);
    }
    const check = configure('check'); expect(check.status).toBe(0);
    const status = JSON.parse(check.output); expect(status.registration_open).toBe(false); expect(status.self_instance_enabled).toBe(true); expect(status.new_enrolments_open).toBe(false);
    const after = snapshot();
    expect(after.mail).toBe(before.mail); expect(after.manual_users).toEqual(before.manual_users); expect(after.enrolments).toEqual(before.enrolments);
    for (const key of ['auth','plugins']) for (const plugin of before[key].split(',').filter(Boolean)) expect(after[key].split(',')).toContain(plugin);
    await page.goto('/login/signup.php'); await expect(page.locator('body')).not.toContainText('Choose your username and password');
    await page.goto('/login/index.php');
    for (const href of ['/journey','/help','/ai/','/privacy','/login/forgot_password.php']) await expect(page.locator('#region-main a[href="'+href+'"]')).toBeVisible();
    fs.writeFileSync(receipt, JSON.stringify({site:base,course_id:Number(course.course_id),synthetic:true,reviewed_by:'Synthetic test only',reviewed_at:new Date().toISOString(),evidence_note:'Captured-mail fixture; not genuine delivery or owner approval',privacy_reviewed:true,support_reviewed:true,operating_reviewed:true,mail:{confirmation_received:true,recovery_received:true,recipient_scope:'synthetic-capture'}}));
    try {
      fixturePhp(`$DB->set_field('enrol','password','Synthetic-restriction-only',['courseid'=>${Number(course.course_id)},'enrol'=>'self']);`);
      const restricted = JSON.parse(configure('status').output);
      expect(restricted.acquisition_blockers).toContain('enrolment_key_required');
      expect(configure('open', ['--receipt='+receipt]).status).not.toBe(0);
    } finally {
      fixturePhp(`$DB->set_field('enrol','password','',['courseid'=>${Number(course.course_id)},'enrol'=>'self']);`);
    }
    expect(configure('open', ['--receipt='+receipt]).status).toBe(0);
    expect(configure('open', ['--receipt='+receipt]).status).toBe(0);
  });
  test('signup sends captured confirmation and unconfirmed access is denied; missing mail can be resent', async ({ page }) => {
    await page.goto(course.lesson_url);
    await signup(page, learner, false);
    await expect(page.locator('#id_error_policyagreed')).toBeVisible();
    expect(fixturePhp(`echo $DB->record_exists('user',['username'=>'${learner.username}'])?'created':'not-created';`)).toBe('not-created');
    await page.locator('#id_policyagreed').check();
    await page.locator('#id_submitbutton').click();
    await expect(page.locator('body')).toContainText('An email should have been sent');
    confirmLink = messageLink(learner.username, '/login/confirm.php');
    const countBefore = fs.readdirSync(path.join(fixture,'mail')).length;
    await login(page, learner); await expect(page.locator('body')).toContainText('confirm');
    await page.goto(course.lesson_url); await expect(page.locator('#loginbtn')).toBeVisible();
    await recover(page, learner);
    expect(fs.readdirSync(path.join(fixture,'mail')).length).toBeGreaterThan(countBefore);
  });
  test('invalid confirmation has a next step; native capture link confirms in a fresh browser and enrols', async ({ browser }) => {
    const context = await browser.newContext(); const page = await context.newPage();
    const bad = new URL(confirmLink); bad.searchParams.set('data','invalidsecret/'+learner.username); bad.searchParams.delete('p'); bad.searchParams.delete('s');
    await page.goto(bad.toString()); await expect(page.locator('body')).toContainText('Invalid confirmation data');
    await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeVisible();
    await page.goto(confirmLink); await expect(page.locator('body')).toContainText('registration has been confirmed');
    await page.getByRole('button',{name:'Continue',exact:true}).click();
    await expect(page.getByRole('button',{name:'Enrol me',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Enrol me',exact:true}).click();
    // No explicit GET workaround: confirmation POST must survive native enrolment.
    await expect(page).toHaveURL(course.lesson_url);
    await expect(page.locator('body')).toContainText('1. Choose something worth doing');
    await page.goto(course.course_url); await expect(page.getByRole('button',{name:'Enrol me',exact:true})).toHaveCount(0);
    await context.close();
  });
  test('repeated confirmation is safe and existing/duplicate accounts are guided back to access recovery', async ({ page }) => {
    await page.goto(confirmLink); await expect(page.locator('body')).toContainText('Registration has already been confirmed');
    await signup(page, learner); await expect(page.locator('body')).toContainText('username already exists');
    const duplicate = {username:`duplicate${stamp}`,email:learner.email};
    await signup(page, duplicate); await expect(page.locator('body')).toContainText('email address is already registered');
    await page.goto('/login/index.php'); await expect(page.locator('body')).toContainText('Recover your account rather than create another');
  });
  test('old confirmation for an account removed by cleanup is rejected safely', async ({ page }) => {
    const old = {username:`oldconfirm${stamp}`,email:`oldconfirm${stamp}@example.test`};
    await signup(page, old); await expect(page.locator('body')).toContainText('An email should have been sent');
    const oldLink = messageLink(old.username, '/login/confirm.php');
    fixturePhp(`require_once($CFG->dirroot.'/user/lib.php'); $user=$DB->get_record('user',['username'=>'${old.username}'],'*',MUST_EXIST); delete_user($user);`);
    await page.goto(oldLink); await expect(page.locator('body')).toContainText('Invalid confirmation data');
    await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeVisible();
  });
  test('native login returns to intended protected lesson and existing enrolment works', async ({ page }) => {
    await page.goto(course.lesson_url); await expect(page.locator('#loginbtn')).toBeVisible();
    await ready(page); await page.locator('#username').fill(learner.username); await page.locator('#password').fill(password); await page.locator('#loginbtn').click();
    await expect(page.locator('body')).toContainText('1. Choose something worth doing');
    await expect(page.getByRole('button',{name:'Enrol me',exact:true})).toHaveCount(0);
  });
  test('recovery works in another browser; consumed and expired recovery links cannot reset twice', async ({ page, browser }) => {
    await recover(page, learner); const resetLink = messageLink(learner.username, '/login/forgot_password.php');
    const context = await browser.newContext(); const fresh = await context.newPage();
    await fresh.goto(resetLink); await ready(fresh);
    await fresh.locator('#id_password').fill('Recovered-Synthetic-81!'); await fresh.locator('#id_password2').fill('Recovered-Synthetic-81!'); await fresh.locator('#id_submitbutton').click();
    await fresh.goto(course.lesson_url); await expect(fresh.locator('body')).toContainText('1. Choose something worth doing');
    await context.close();
    await page.goto(resetLink); await expect(page.locator('body')).toContainText('There is no record of that reset request');
    await recover(page, learner); const expired = messageLink(learner.username,'/login/forgot_password.php');
    fixturePhp(`$user=$DB->get_record('user',['username'=>'${learner.username}'],'*',MUST_EXIST); $DB->set_field('user_password_resets','timerequested',time()-($CFG->pwresettime??1800)-60,['userid'=>$user->id]);`);
    await page.goto(expired); await expect(page.locator('body')).toContainText('expired');
    await page.goto('/login/index.php'); await expect(page.locator('#loginbtn')).toBeVisible();
  });
  test('closing enrolment preserves confirmed accounts and enrolled learner access', async ({ page }) => {
    const before = snapshot(); expect(configure('configure-closed').status).toBe(0); expect(configure('check').status).toBe(0);
    const after = snapshot(); expect(after.enrolments).toEqual(before.enrolments); expect(after.mail).toBe(before.mail);
    await login(page, learner, 'Recovered-Synthetic-81!'); await page.goto(course.lesson_url);
    await expect(page.locator('body')).toContainText('1. Choose something worth doing');
    const status = JSON.parse(configure('status').output); expect(status.registration_open).toBe(false); expect(status.new_enrolments_open).toBe(false); expect(status.self_instance_enabled).toBe(true);
  });
  test('pilot acquisition admits only exact private addresses while broad registration stays closed', async ({page})=>{
    const invited={username:`pilot${stamp}`,email:`pilot${stamp}@example.test`};
    const pilotReceipt=path.join(fixture,'pilot-readiness-synthetic.json');const addressFile=path.join(fixture,'pilot-addresses-synthetic.json');
    fs.writeFileSync(addressFile,JSON.stringify([invited.email]));
    fs.writeFileSync(pilotReceipt,JSON.stringify({site:base,course_id:Number(course.course_id),synthetic:true,pilot_only:true,reviewed_by:'Synthetic test only',reviewed_at:new Date().toISOString(),evidence_note:'Synthetic pilot gate only; no owner approval or genuine delivery',privacy_reviewed:true,support_reviewed:true,operating_reviewed:true,retention_before_broad_launch:true}));
    expect(configure('pilot',['--receipt='+path.join(fixture,'missing.json'),'--pilot-emails='+addressFile]).status).not.toBe(0);
    expect(configure('pilot',['--receipt='+pilotReceipt,'--pilot-emails='+addressFile]).status).toBe(0);
    const status=JSON.parse(configure('status',['--receipt='+pilotReceipt]).output);expect(status.acquisition_mode).toBe('pilot');expect(status.broad_registration_open).toBe(false);
    await signup(page,{username:`outside${stamp}`,email:`outside${stamp}@example.test`});await expect(page.locator('#region-main')).toContainText('limited to invited pilot learners');
    await expect(page.locator('#region-main')).not.toContainText(invited.email);
    await signup(page,invited);await expect(page.locator('body')).toContainText('An email should have been sent');
    await page.goto(messageLink(invited.username,'/login/confirm.php'));await expect(page.locator('body')).toContainText('registration has been confirmed');
    // An unapproved broader opening remains gated by genuine representative mail evidence.
    expect(configure('open',['--receipt='+pilotReceipt]).status).not.toBe(0);
  });

  test('a fresh learner follows visible entry through confirmation, optional check, practice, saved return and captured recovery', async ({browser}) => {
    test.setTimeout(180000);
    const user = {username:`journey${stamp}`, email:`journey${stamp}@example.test`};
    const pilotReceipt = path.join(fixture, 'journey-readiness-synthetic.json');
    const addresses = path.join(fixture, 'journey-addresses-synthetic.json');
    fs.writeFileSync(addresses, JSON.stringify([user.email]));
    fs.writeFileSync(pilotReceipt, JSON.stringify({site:base, course_id:Number(course.course_id), synthetic:true, pilot_only:true, reviewed_by:'Synthetic test only', reviewed_at:new Date().toISOString(), evidence_note:'Captured-mail learner rehearsal only; no genuine delivery or owner review', privacy_reviewed:true, support_reviewed:true, operating_reviewed:true, retention_before_broad_launch:true}));
    expect(configure('pilot', ['--receipt='+pilotReceipt, '--pilot-emails='+addresses]).status).toBe(0);
    const contexts = [];
    async function freshPage() { const context = await browser.newContext(); contexts.push(context); return context.newPage(); }
    async function signOut(page) {
      await page.locator('.usermenu .dropdown-toggle').click();
      await page.getByRole('menuitem', {name:/Log out/}).click();
      await ready(page);
    }
    async function enterFromHome(page, pass) {
      await page.goto('/');
      await page.locator('header [data-account-link]').click();
      await expect(page.locator('#loginbtn')).toBeVisible();
      await ready(page);
      await page.locator('#username').fill(user.username);
      await page.locator('#password').fill(pass);
      await page.locator('#loginbtn').click({timeout:30000});
      await ready(page);
      await expect(page).toHaveURL(base+'/local/orientation/index.php');
    }
    try {
      const newcomer = await freshPage();
      await newcomer.goto('/');
      await newcomer.getByRole('link', {name:'Explore your course', exact:true}).click();
      await newcomer.getByRole('link', {name:'Find my starting point', exact:true}).click();
      await ready(newcomer);
      await expect(newcomer.locator('#loginbtn')).toBeVisible();
      await newcomer.getByRole('link', {name:'Create new account', exact:true}).click();
      await ready(newcomer);
      await fillSignup(newcomer, user); // Complete the real native policy checkbox.
      await expect(newcomer.locator('body')).toContainText('An email should have been sent');
      expect(fixturePhp(`$u=$DB->get_record('user',['username'=>'${user.username}'],'*',MUST_EXIST);echo get_user_preferences('auth_email_wantsurl','',$u);`)).toBe(base+'/local/orientation/startingpoint.php');
      const confirmed = await freshPage();
      await confirmed.goto(messageLink(user.username, '/login/confirm.php'));
      await expect(confirmed.locator('body')).toContainText('registration has been confirmed');
      await expect(confirmed.locator('form').filter({has:confirmed.getByRole('button',{name:'Continue',exact:true})})).toHaveAttribute('action', base+'/local/orientation/startingpoint.php');
      await confirmed.getByRole('button', {name:'Continue', exact:true}).click();
      await confirmed.getByRole('button', {name:'Enrol me', exact:true}).click();
      // No inserted navigation: the requested check must survive confirmation and native enrolment.
      await expect(confirmed).toHaveURL(base+'/local/orientation/startingpoint.php');
      await confirmed.getByRole('link', {name:'Open the optional check', exact:true}).click();
      await confirmed.getByRole('button', {name:/^Attempt quiz/}).click();
      await ready(confirmed);
      for (let pageNumber=0; pageNumber<3; pageNumber++) {
        await expect(confirmed.locator('.que.multichoice')).toHaveCount(4);
        for (const question of await confirmed.locator('.que.multichoice').all()) {
          await question.locator('input[type=radio]:not([value="-1"])').nth(1).check();
        }
        await confirmed.getByRole('button', {name:pageNumber<2?'Next page':'Finish attempt ...', exact:true}).click();
        await ready(confirmed);
      }
      await confirmed.getByRole('button', {name:'Submit all and finish', exact:true}).click();
      await confirmed.getByRole('dialog').getByRole('button', {name:'Submit all and finish', exact:true}).click();
      await confirmed.waitForURL('**/mod/quiz/review.php?**');
      await ready(confirmed);
      await confirmed.locator('[data-starting-navigation]').getByRole('link').click();
      await expect(confirmed.locator('[data-starting-suggestion]')).toHaveAttribute('data-starting-suggestion', 'first-task');
      await expect(confirmed.locator('[data-atlas-progress="first-task"]')).toHaveText('Not yet complete');
      await confirmed.locator('#region-main').getByRole('link', {name:'Continue: Try AI on a useful task', exact:true}).click();
      await ready(confirmed);
      await confirmed.getByText('If you cannot use an AI today', {exact:true}).click();
      await expect(confirmed.getByText('Use this invented response for practice.', {exact:false})).toBeVisible();
      await expect(confirmed.locator('#region-main')).toContainText('invents a date and venue');
      await expect(confirmed.getByRole('button', {name:/^Mark .* as done$/})).toBeVisible();
      await confirmed.getByRole('button', {name:/^Mark .* as done$/}).click();
      await ready(confirmed);
      await confirmed.locator('.primary-navigation').getByRole('menuitem', {name:'Your course journey', exact:true}).click();
      await expect(confirmed.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
      await confirmed.screenshot({path:path.join(fixture,'u9-fresh-learner-journey.png'), fullPage:true});
      await signOut(confirmed);

      const returning = await freshPage();
      await enterFromHome(returning, password);
      await expect(returning.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
      await expect(returning.locator('[data-starting-suggestion]')).toHaveText('Revisit: Try AI on a useful task');
      await expect(returning.locator('#region-main').getByRole('link', {name:'Continue: Give AI the right background', exact:true})).toBeVisible();
      await signOut(returning);
      await returning.locator('header [data-account-link]').click();
      await ready(returning);
      await returning.locator('a[href$="/login/forgot_password.php"]').first().click();
      await ready(returning);
      await returning.locator('#id_username').fill(user.username);
      await returning.locator('#id_submitbuttonusername').click();
      await expect(returning.locator('body')).toContainText('If you supplied a correct username');
      const recovery = await freshPage();
      await recovery.goto(messageLink(user.username, '/login/forgot_password.php'));
      await ready(recovery);
      const recovered = 'Recovered-Journey-92!';
      await recovery.locator('#id_password').fill(recovered);
      await recovery.locator('#id_password2').fill(recovered);
      await recovery.locator('#id_submitbutton').click();
      await ready(recovery);
      await expect(recovery).toHaveURL(base+'/local/orientation/index.php');
      await expect(recovery.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
      await signOut(recovery);
      const passwordCheck = await freshPage();
      await enterFromHome(passwordCheck, recovered);
      await expect(passwordCheck.locator('[data-starting-suggestion]')).toHaveText('Revisit: Try AI on a useful task');
      await expect(passwordCheck.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
    } finally {
      for (const context of contexts) await context.close();
    }
  });

});
