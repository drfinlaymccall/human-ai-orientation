<?php
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require $root . '/trial/moodle/config.php';
require_once $CFG->dirroot . '/user/lib.php';
$path = $root . '/trial/public-qa.json';
foreach ($DB->get_records_select('user', $DB->sql_like('username', ':prefix'), ['prefix' => 'publicqa%']) as $previous) {
    user_update_user((object)['id' => $previous->id, 'suspended' => 1], false, false);
    \core\session\manager::kill_user_sessions($previous->id);
}
if (($argv[1] ?? '') === 'suspend') {
    echo "Public QA accounts suspended.\n";
    exit;
}
$c = ['username' => 'publicqa' . time(), 'password' => bin2hex(random_bytes(18)) . 'aA1!'];
$id = user_create_user((object)[
    'username' => $c['username'], 'password' => $c['password'], 'auth' => 'manual',
    'confirmed' => 1, 'firstname' => 'Synthetic', 'lastname' => 'Public review',
    'email' => $c['username'] . '@example.test', 'maildisplay' => 0,
    'mnethostid' => $CFG->mnet_localhost_id,
]);
$course = $DB->get_record('course', ['shortname' => 'AI-ORIENTATION-TRIAL'], '*', MUST_EXIST);
$instance = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'manual'], '*', MUST_EXIST);
enrol_get_plugin('manual')->enrol_user($instance, $id, $DB->get_field('role', 'id', ['shortname' => 'student'], MUST_EXIST));
file_put_contents($path, json_encode($c));
chmod($path, 0600);
echo "Fresh synthetic QA account ready. Suspend after verification.\n";
