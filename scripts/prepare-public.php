<?php
// Configure the existing lesson as an invite-only public platform trial.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require $root . '/trial/moodle/config.php';
require_once $CFG->dirroot . '/user/lib.php';
require_once $CFG->dirroot . '/course/lib.php';
if ($CFG->wwwroot !== 'https://orientation.finlaymccall.com') {
    throw new RuntimeException('Set the public HTTPS wwwroot before preparing the public trial.');
}
foreach ([
    'registerauth' => '', 'auth' => 'manual', 'allowemailaddresses' => '',
    'forcelogin' => 1, 'forceloginforprofiles' => 1, 'guestloginbutton' => 0,
    'cookiesecure' => 1, 'cookiehttponly' => 1,
    'passwordpolicy' => 1, 'lockoutthreshold' => 10,
    'lockoutwindow' => 900, 'lockoutduration' => 900,
    'enrol_plugins_enabled' => 'manual', 'enablewebservices' => 0,
    'auth_instructions' => '<p>This is an early course trial. Sign in with the pilot login Finlay gave you. Public sign-up and email recovery are not available yet.</p><p><a href="/preview">Read the complete lesson without an account</a> · <a href="/privacy">How this trial uses your information</a></p>',
    'custommenuitems' => "Read the lesson|https://orientation.finlaymccall.com/preview\nContext for your AI|https://orientation.finlaymccall.com/ai/\nAbout your information|https://orientation.finlaymccall.com/privacy",
    'sitepolicy' => 'https://orientation.finlaymccall.com/privacy.html',
] as $name => $value) { set_config($name, $value); }
$site = get_site();
$site->fullname = 'Human AI Orientation';
$site->shortname = 'AI Orientation';
$site->summary = '<p>A useful start with AI, at your own pace.</p>';
$DB->update_record('course', $site);
$course = $DB->get_record('course', ['shortname' => 'AI-ORIENTATION-TRIAL'], '*', MUST_EXIST);
$course->summary = '<p>Find your way around files and notes, then choose useful context, try it with your own AI and keep guidance you can reuse.</p><p>Early prototype · 10–15-minute preparation · optional notes setup · one 25–35-minute AI lesson.</p>';
$DB->update_record('course', $course);
foreach ($DB->get_records('user', ['deleted' => 0]) as $user) {
    if (preg_match('/^trial(desktop|mobile)/', $user->username)) {
        user_update_user((object)['id' => $user->id, 'suspended' => 1], false, false);
        \core\session\manager::kill_user_sessions($user->id);
    }
}
foreach ($DB->get_records('enrol', ['courseid' => $course->id, 'enrol' => 'self']) as $instance) {
    enrol_get_plugin('self')->update_status($instance, ENROL_INSTANCE_DISABLED);
}
$path = $root . '/trial/public-reviewer.json';
if (!file_exists($path)) {
    $credentials = ['username' => 'finlayreview', 'password' => bin2hex(random_bytes(18)) . 'aA1!'];
    file_put_contents($path, json_encode($credentials, JSON_PRETTY_PRINT));
    chmod($path, 0600);
} else {
    $credentials = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
}
$reviewer = $DB->get_record('user', ['username' => $credentials['username']]);
if (!$reviewer) {
    $id = user_create_user((object)[
        'username' => $credentials['username'], 'password' => $credentials['password'],
        'auth' => 'manual', 'confirmed' => 1, 'firstname' => 'Finlay', 'lastname' => 'Reviewer',
        'email' => 'reviewer@example.test', 'maildisplay' => 0, 'mnethostid' => $CFG->mnet_localhost_id,
    ]);
} else { $id = $reviewer->id; }
$manual = enrol_get_plugin('manual');
$instances = $DB->get_records('enrol', ['courseid' => $course->id, 'enrol' => 'manual']);
$instance = $instances ? reset($instances) : $DB->get_record('enrol', ['id' => $manual->add_default_instance($course)]);
$student = $DB->get_field('role', 'id', ['shortname' => 'student'], MUST_EXIST);
$manual->enrol_user($instance, $id, $student);
rebuild_course_cache($course->id, true);
purge_all_caches();
echo "Public trial configured. Reviewer credentials are in trial/public-reviewer.json.\n";
