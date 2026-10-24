// Synthetic native self-enrolment delivery only. Never uses the live runtime or real mail.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'trial/launch-fixture');
const base = 'http://127.0.0.1:18802';
if (!fs.existsSync(fixture)) throw new Error('Create the independent 18802 captured-mail fixture before running the welcome checks.');
if (fs.lstatSync(fixture).isSymbolicLink()) throw new Error('A separate synthetic fixture is required.');
if (!fs.existsSync(path.join(fixture, 'course.json'))) throw new Error('Publish the independent 18802 fixture course before running the welcome checks.');
const course = JSON.parse(fs.readFileSync(path.join(fixture, 'course.json')));
if (!course.course_url.startsWith(base + '/')) throw new Error('The captured-mail 18802 fixture is required.');
const shared = JSON.parse(fs.readFileSync(path.join(root, 'content/student-welcome.json')));
const stamp = Date.now();
const learner = { username: `welcome${stamp}`, email: `welcome${stamp}@example.test` };
const password = 'Synthetic-Welcome-74!';
const receipt = path.join(fixture, `welcome-readiness-${stamp}.json`);
const env = { ...process.env, ORIENTATION_TRIAL_DIR: fixture };
let original;
let confirmation;
let nativeSubject;
function fixturePhp(code) {
  const prelude = `define('CLI_SCRIPT',true); require ${JSON.stringify(path.join(root, 'scripts/moodle-environment.php'))}; require_once ${JSON.stringify(path.join(root, 'scripts/synthetic-fixture.php'))}; require_once $CFG->libdir.'/enrollib.php'; if ($CFG->wwwroot !== '${base}' || !orientation_is_synthetic_fixture($orientationtrial,$CFG) || !empty($CFG->smtphosts) || !empty($CFG->divertallemailsto) || realpath($CFG->dirroot)!==realpath($orientationtrial.'/moodle') || realpath($CFG->dataroot)!==realpath($orientationtrial.'/data') || !is_file($orientationtrial.'/capture-mail.py')) throw new RuntimeException('Separate captured-mail fixture only.'); `;
  return execFileSync(path.join(root, 'scripts/fixture-php'), ['-r', prelude + code], { cwd: root, env, encoding: 'utf8' });
}
function configure(action, options = []) {
  const result = spawnSync(path.join(root, 'scripts/fixture-php'), ['scripts/configure-onboarding.php', action, ...options], { cwd: root, env, encoding: 'utf8' });
  return { status: result.status, output: result.stdout + result.stderr };
}
function phpJson(value) {
  return `json_decode(base64_decode('${Buffer.from(JSON.stringify(value)).toString('base64')}'),true)`;
}
function selfUpdate(fields) {
  fixturePhp(`$i=$DB->get_record('enrol',['courseid'=>${Number(course.course_id)},'enrol'=>'self'],'*',MUST_EXIST); foreach(${phpJson(fields)} as $k=>$v) $i->$k=$v; $DB->update_record('enrol',$i);`);
}
function snapshot() {
  return JSON.parse(fixturePhp(`$i=$DB->get_record('enrol',['courseid'=>${Number(course.course_id)},'enrol'=>'self'],'*',MUST_EXIST); unset($i->customint4,$i->customtext1,$i->timemodified); $keys=['smtphosts','smtpsecure','smtpuser','smtppass','sendmailpath','noemailever','divertallemailsto','registerauth','auth','enrol_plugins_enabled','auth_instructions','passwordpolicy','minpasswordlength','sitepolicy']; $settings=[]; foreach($keys as $k) $settings[$k]=$CFG->$k??null; echo json_encode(['self'=>$i,'settings'=>hash('sha256',serialize($settings)),'mode'=>get_config('local_orientation','acquisition_mode'),'manual'=>hash('sha256',serialize($DB->get_records('enrol',['courseid'=>${Number(course.course_id)},'enrol'=>'manual']))),'enrolments'=>hash('sha256',serialize($DB->get_records('user_enrolments',null,'id')))]);`));
}
function messages() {
  // The standard MIME parser decodes multipart/quoted-printable UTF-8 without logging captured mail.
  const source = `import email.policy,email.parser,json,pathlib,sys
out=[]
for p in pathlib.Path(sys.argv[1]).glob('*.eml'):
 m=email.parser.BytesParser(policy=email.policy.default).parsebytes(p.read_bytes())
 bodies={'plain':'','html':''}
 for part in m.walk():
  if part.get_content_type()=='text/plain': bodies['plain']+=part.get_content()
  if part.get_content_type()=='text/html': bodies['html']+=part.get_content()
 out.append(dict(to=str(m.get('To','')),subject=str(m.get('Subject','')),**bodies))
print(json.dumps(out))`;
  return JSON.parse(execFileSync('python3', ['-c', source, path.join(fixture, 'mail')], { encoding: 'utf8' }));
}
function welcomes() {
  return messages().filter(m => m.to.includes(learner.email) && m.plain.replace(/\s+/g, ' ').includes(shared.email_paragraphs[1]));
}
function confirmationLink() {
  const message = messages().find(m => m.to.includes(learner.email) && m.plain.includes('/login/confirm.php'));
  const links = message?.plain.match(/http:\/\/127\.0\.0\.1:18802\/[^\s<>"']+/g) || [];
  const link = links.find(value => new URL(value).pathname === '/login/confirm.php');
  if (!link) throw new Error('Captured synthetic confirmation missing.');
  return link;
}
async function ready(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => !window.M?.util?.pending_js?.length);
  const tour = page.getByRole('button', { name: 'Got it', exact: true });
  if (await tour.isVisible()) await tour.click();
}
async function enrol(page) {
  await page.goto(course.course_url); await ready(page);
  await page.getByRole('button', { name: 'Enrol me', exact: true }).click();
  await ready(page);
  await expect(page.getByRole('button', { name: 'Enrol me', exact: true })).toHaveCount(0);
}
async function login(page) {
  await page.goto('/login/index.php'); await ready(page);
  await page.locator('#username').fill(learner.username); await page.locator('#password').fill(password);
  await page.locator('#loginbtn').click(); await ready(page);
}
test.describe.serial('WB23 synthetic native course welcome', () => {
  test.beforeAll(() => {
    original = JSON.parse(fixturePhp(`echo json_encode(['self'=>$DB->get_record('enrol',['courseid'=>${Number(course.course_id)},'enrol'=>'self'],'*',MUST_EXIST),'noreply'=>get_config(null,'noreplyaddress'),'policy'=>get_config(null,'sitepolicy')]);`));
    fixturePhp(`set_config('noreplyaddress','synthetic-noreply@example.test'); set_config('sitepolicy',$CFG->wwwroot.'/privacy');`);
    expect(configure('configure-closed').status).toBe(0);
    fs.writeFileSync(receipt, JSON.stringify({ site: base, course_id: Number(course.course_id), synthetic: true, reviewed_by: 'Synthetic test only', reviewed_at: new Date().toISOString(), evidence_note: 'Captured welcome rehearsal only; no genuine mailbox receipt or owner approval', privacy_reviewed: true, support_reviewed: true, operating_reviewed: true, mail: { confirmation_received: true, recovery_received: true, recipient_scope: 'synthetic-capture' } }));
  });
  test.afterAll(() => {
    const failures = [];
    const attempt = action => { try { action(); } catch (error) { failures.push(error); } };
    attempt(() => {
      const result = configure('configure-closed');
      expect(result.status, result.output).toBe(0);
    });
    if (original) {
      // Restore the full native instance while retaining closed new enrolments.
      attempt(() => selfUpdate({ ...original.self, customint6: 0 }));
      for (const [key, value] of [['noreplyaddress', original.noreply], ['sitepolicy', original.policy]]) {
        attempt(() => fixturePhp(value === false ? `unset_config('${key}');` : `set_config('${key}',${phpJson(value)});`));
      }
    }
    attempt(() => fs.rmSync(receipt, { force: true }));
    if (failures.length === 1) throw failures[0];
    if (failures.length) throw new AggregateError(failures, 'Welcome fixture cleanup failed.');
  });
  test('explicit welcome configuration preserves closed access, existing work, mail and manual methods', () => {
    const prior = JSON.parse(fixturePhp(`echo json_encode($DB->get_record('enrol',['id'=>${Number(original.self.id)}],'*',MUST_EXIST));`));
    try {
      selfUpdate({ password: 'Synthetic-restriction', customint1: 1, customint3: 17, customint5: 4, enrolperiod: 12345, expirynotify: 1, notifyall: 1 });
      const before = snapshot(); const mailBefore = messages().length;
      for (const action of ['welcome-enable', 'welcome-enable', 'welcome-disable', 'welcome-enable']) {
        const result = configure(action); expect(result.status, result.output).toBe(0);
        const status = JSON.parse(result.output);
        expect(status.registration_open).toBe(false); expect(status.new_enrolments_open).toBe(false);
        expect(status.self_welcome_mode).toBe(action === 'welcome-enable' ? 3 : 0);
        expect(status.manual_welcome_guidance).toBe('in-course');
        expect(snapshot()).toEqual(before); expect(messages()).toHaveLength(mailBefore);
        nativeSubject = status.welcome_subject;
      }
    } finally {
      selfUpdate(prior);
    }
    // Ordinary refresh retains every existing native send mode; it never opts a method in.
    const existingMail = messages().length;
    for (const mode of [0, 1, 2, 3]) {
      selfUpdate({ customint4: mode });
      const result = configure('configure-closed'); expect(result.status, result.output).toBe(0);
      expect(JSON.parse(result.output).self_welcome_mode).toBe(mode);
      expect(messages()).toHaveLength(existingMail);
    }
    expect(configure('welcome-enable').status).toBe(0);
    expect(configure('open', ['--receipt=' + receipt]).status).toBe(0);
    expect(messages()).toHaveLength(existingMail);
  });
  test('account creation and confirmation have no course welcome before enrolment', async ({ page }) => {
    await page.goto('/login/signup.php'); await ready(page);
    for (const [id, value] of Object.entries({ username: learner.username, password, email: learner.email, email2: learner.email, firstname: 'Synthetic', lastname: 'Welcome' })) await page.locator('#id_' + id).fill(value);
    await page.locator('#id_policyagreed').check(); await page.locator('#id_submitbutton').click();
    await expect(page.locator('body')).toContainText('An email should have been sent');
    confirmation = confirmationLink(); expect(welcomes()).toHaveLength(0);
    await login(page); await expect(page.locator('body')).toContainText('confirm');
    expect(welcomes()).toHaveLength(0);
    await page.goto(confirmation); await expect(page.locator('body')).toContainText('registration has been confirmed');
    expect(welcomes()).toHaveLength(0);
  });
  test('first confirmed self-enrolment produces readable HTML and full-link plain text', async ({ page }) => {
    await login(page); await enrol(page);
    expect(welcomes()).toHaveLength(1);
    const welcome = welcomes()[0]; expect(welcome.subject).toBe(nativeSubject);
    for (const paragraph of shared.email_paragraphs) expect(welcome.plain.replace(/\s+/g, ' ')).toContain(paragraph);
    for (const link of Object.values(shared.links)) {
      const url = base + link.path;
      expect(welcome.plain).toContain(url); expect(welcome.html).toContain('href="' + url + '"');
    }
    expect(welcome.html).not.toContain('/mod/page/view.php');
    expect(welcome.plain).not.toContain(password); expect(welcome.plain).not.toContain(confirmation);
    await page.goto(shared.links.journey.path); await expect(page.locator('body')).toContainText('Your course journey');
    await page.goto(shared.links.context.path); await expect(page.locator('body')).toContainText('My context');
  });
  test('refresh, visits, fresh sign-in and native recovery do not send another welcome', async ({ page, browser }) => {
    expect(configure('configure-closed').status).toBe(0); expect(welcomes()).toHaveLength(1);
    await login(page);
    for (const target of [shared.links.journey.path, course.course_url, shared.links.context.path, shared.links.journey.path]) await page.goto(target);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const phone = await context.newPage();
    try {
      for (const link of [shared.links.journey, shared.links.context]) {
        await phone.goto(base + link.path); await expect(phone.locator('#loginbtn')).toBeVisible();
      }
      for (const link of [shared.links.help, shared.links.ai]) {
        const response = await phone.goto(base + link.path); expect(response.status()).toBe(200);
        await expect(phone.locator('body')).toBeVisible();
      }
      await phone.goto('/login/forgot_password.php'); await ready(phone);
      await phone.locator('#id_username').fill(learner.username); await phone.locator('#id_submitbuttonusername').click();
      await expect(phone.locator('body')).toContainText('If you supplied a correct username');
      expect(messages().some(m => m.to.includes(learner.email) && m.plain.includes('/login/forgot_password.php'))).toBe(true);
      await login(phone); await phone.goto(shared.links.journey.path);
      await expect(phone.locator('body')).toContainText('Your course journey');
    } finally { await context.close(); }
    expect(welcomes()).toHaveLength(1);
  });
  test('native removal and re-enrolment is a new welcome lifecycle, while disabling stops later mail', async ({ page }) => {
    await login(page);
    const remove = () => fixturePhp(`$i=$DB->get_record('enrol',['id'=>${Number(original.self.id)}],'*',MUST_EXIST); $u=$DB->get_record('user',['username'=>'${learner.username}'],'id',MUST_EXIST); enrol_get_plugin('self')->unenrol_user($i,$u->id);`);
    expect(configure('open', ['--receipt=' + receipt]).status).toBe(0);
    remove(); await enrol(page); expect(welcomes()).toHaveLength(2);
    expect(configure('welcome-disable').status).toBe(0);
    remove(); await enrol(page); expect(welcomes()).toHaveLength(2);
    expect(configure('check', ['--receipt=' + receipt]).status).toBe(0);
  });
});
