const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const course = JSON.parse(fs.readFileSync(path.join(root, 'trial/course.json')));
const mailDir = path.join(root, 'trial/mail');
function messageLink(username, endpoint) {
  const filenames = fs.readdirSync(mailDir).sort((a,b) =>
    fs.statSync(path.join(mailDir,b)).mtimeMs - fs.statSync(path.join(mailDir,a)).mtimeMs);
  for (const filename of filenames) {
    const raw = fs.readFileSync(path.join(mailDir,filename),'utf8');
    const body = raw.replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex,16))).replace(/&amp;/g, '&');
    if (!body.includes(username)) continue;
    const urls = body.match(/http:\/\/127\.0\.0\.1:8787\/[^\s<>"']+/g) || [];
    const url = urls.find(u => u.includes(endpoint));
    if (url) return url;
  }
  throw new Error('Expected local test email link: '+endpoint);
}
async function login(page, username, password) {
  await page.goto('/login/index.php');
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => window.M?.util?.pending_js?.length === 0);
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#loginbtn').click();
  await expect(page.locator('#user-menu-toggle')).toBeVisible();
}
async function logout(page) {
  await page.locator('#user-menu-toggle').click();
  await page.getByRole('menuitem', { name: 'Log out', exact: true }).click();
  await expect(page.locator('#loginbtn')).toBeVisible();
}
for (const device of ['desktop','mobile']) {
 test(`${device}: register, enrol, leave, resume, reflect and return`, async ({ page }) => {
  await page.setViewportSize(device==='mobile'?{width:390,height:844}:{width:1440,height:1000});
  const username = `trial${device}${Date.now()}`;
  const password = 'Synthetic-Trial-Only-74!';
  await page.goto('/login/signup.php');
  await page.waitForLoadState('networkidle');
  for(const [id,value] of Object.entries({username,password,email:username+'@example.test',email2:username+'@example.test',firstname:'Synthetic',lastname:device})) {
    await page.locator('#id_'+id).fill(value);
  }
  await page.locator('#id_submitbutton').click();
  await expect(page.locator('body')).toContainText('An email should have been sent');
  await page.goto(messageLink(username, 'login/confirm.php'));
  await page.goto(course.course_url);
  if (await page.getByRole('button',{name:'Enrol me'}).count()) await page.getByRole('button',{name:'Enrol me'}).click();
  await page.goto(course.lesson_url);
  await expect(page.locator('body')).toContainText('1. Choose something worth doing');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.locator('body')).toContainText('2. See what context changes');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.locator('body')).toContainText('3. Build your small context brief');
  await page.screenshot({path:path.join(root,`docs/trial/${device}-lesson.png`),fullPage:true});
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  expect(overflow).toBe(false);
  await logout(page);
  await login(page,username,password);
  await page.goto(course.lesson_url);
  await page.getByRole('link',{name:'Yes',exact:true}).click();
  await expect(page.locator('body')).toContainText('3. Build your small context brief');
  for(const heading of ['4. Try it, check it, improve it','5. Keep instructions you can reuse','This is practice, not a graded exam.']) {
   await page.getByRole('button',{name:'Continue',exact:true}).click();
   await expect(page.locator('body')).toContainText(heading);
  }
  await page.getByLabel('Assume every file on my device is available to the AI.',{exact:true}).check();
  await page.getByRole('button',{name:'Submit',exact:true}).click();
  await expect(page.locator('body')).toContainText('A saved file is not automatically shared');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.getByLabel('Check what context the tool actually has, share the relevant brief deliberately, and inspect the result.',{exact:true}).check();
  await page.getByRole('button',{name:'Submit',exact:true}).click();
  await expect(page.locator('body')).toContainText('Your saved notes, this chat and any memory features are different');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.locator('body')).toContainText('In a few sentences, record:');
  const reflection=`Synthetic ${device} worked-example route. I included the undecided venue and omitted an address. I expected placeholders but observed an invented venue. I kept the instruction to ask before guessing. Next I will try a study plan.`;
  await page.locator('textarea').fill(reflection);
  await page.getByRole('button',{name:'Submit',exact:true}).click();
  await expect(page.locator('#region-main')).toContainText('Your reflection has been saved');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.locator('#region-main')).toContainText('Your lesson is complete');
  await expect(page.locator('#region-main')).not.toContainText('will be graded');
  await page.goto(course.course_url);
  await page.screenshot({path:path.join(root,`docs/trial/${device}-complete.png`),fullPage:true});
  await expect(page.locator('body')).toContainText('Done');
  await logout(page);
  await login(page,username,password);
  await page.goto(course.course_url);
  await expect(page.locator('body')).toContainText('Done');
  fs.writeFileSync(path.join(root,`trial/${device}-learner.json`),JSON.stringify({username,password,reflection}));
 });
}

test('signed-out access and account recovery preserve progress', async ({ page }) => {
  await page.goto(course.lesson_url);
  await expect(page).toHaveURL(/\/login\/index.php/);
  const secretPath=path.join(root,'trial/desktop-learner.json');
  const learner=JSON.parse(fs.readFileSync(secretPath));
  await page.goto('/login/forgot_password.php');
  await page.locator('#id_username').fill(learner.username);
  await page.locator('#id_submitbuttonusername').click();
  await expect(page.locator('body')).toContainText('If you supplied a correct username');
  await page.goto(messageLink(learner.username,'login/forgot_password.php'));
  await page.locator('#id_password').fill('Recovered-Synthetic-Trial-81!');
  await page.locator('#id_password2').fill('Recovered-Synthetic-Trial-81!');
  await page.locator('#id_submitbutton').click();
  await page.goto(course.course_url);
  await expect(page.locator('body')).toContainText('Done');
  learner.password='Recovered-Synthetic-Trial-81!';
  fs.writeFileSync(secretPath,JSON.stringify(learner));
  await logout(page);
  await login(page,learner.username,learner.password);
  await page.goto(course.course_url);
  await expect(page.locator('body')).toContainText('Done');
});

test('administrator can author the lesson; learner cannot', async ({ page }) => {
  const admin=JSON.parse(fs.readFileSync(path.join(root,'trial/credentials.json')));
  await login(page,admin.admin_username,admin.admin_password);
  await page.goto(`/mod/lesson/edit.php?id=${course.lesson_cmid}`);
  await expect(page.locator('#region-main')).toContainText('1. Choose something worth doing');
  await expect(page.locator('#region-main')).toContainText('7. Save what you learned');
  await page.goto(`/mod/lesson/report.php?id=${course.lesson_cmid}`);
  await expect(page.locator('#region-main')).toContainText('Synthetic');
  await logout(page);
  const learner=JSON.parse(fs.readFileSync(path.join(root,'trial/desktop-learner.json')));
  await login(page,learner.username,learner.password);
  await page.goto(`/mod/lesson/edit.php?id=${course.lesson_cmid}`);
  await expect(page.locator('#region-main')).toContainText('Sorry');
  expect(messageLink(learner.username,'course/view.php')).toBe(course.course_url);
});
