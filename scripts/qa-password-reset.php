<?php
// Capture native recovery mail for the current synthetic QA account, never live SMTP.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require $root . '/trial/moodle/config.php';
require_once $CFG->dirroot . '/login/lib.php';
$c = json_decode(file_get_contents($root . '/trial/public-qa.json'), true, 512, JSON_THROW_ON_ERROR);
$user = $DB->get_record('user', ['username' => $c['username']], '*', MUST_EXIST);
if (!str_starts_with($user->username, 'publicqa') || !str_ends_with($user->email, '@example.test') || $user->suspended) throw new RuntimeException('Active synthetic QA account required.');
$CFG->smtphosts = '';
$CFG->divertallemailsto = 'recovery@example.test';
$CFG->noemailever = false;
$CFG->debugsmtp = false;
$CFG->sendmailpath = '/usr/bin/python3 ' . $root . '/scripts/capture-email.py';
$record = core_login_generate_password_reset($user);
if (!send_password_change_confirmation_email($user, $record)) throw new RuntimeException('Capture failed.');
$found = false;
foreach (glob($root . '/trial/mail/*.eml') as $path) {
    if (str_contains(quoted_printable_decode(file_get_contents($path)), $record->token)) { $found = true; break; }
}
if (!$found) throw new RuntimeException('Native reset token missing from captured mail.');
$path = $root . '/trial/public-qa-reset.json';
file_put_contents($path, json_encode(['token' => $record->token, 'password' => bin2hex(random_bytes(18)) . 'aA1!']));
chmod($path, 0600);
echo "Native recovery email captured with a valid reset link; no external delivery.\n";
