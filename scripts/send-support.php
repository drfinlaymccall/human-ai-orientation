<?php
// Internal transport for scripts/support.py. CLI operator access is trusted.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require $root . '/trial/moodle/config.php';
$packet = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
$reply = [];
foreach (['recipient', 'subject', 'body', 'synthetic'] as $key) $reply[$key] = $packet[$key];
// Approval digest is checked by the locked Python queue. Require approved dispatch state as defence in depth.
if (($packet['state'] ?? '') !== 'dispatching' || empty($packet['approval']) || $packet['synthetic'] !== false) throw new RuntimeException('Invalid dispatch.');
if (empty($CFG->smtphosts) || !empty($CFG->divertallemailsto) || !empty($CFG->noemailever)) throw new RuntimeException('Live email is not enabled.');
if (!validate_email($packet['recipient']) || preg_match('/[\r\n]/', $packet['subject'])) throw new RuntimeException('Invalid recipient or subject.');
$recipient = (object)['id' => -99, 'email' => $packet['recipient'], 'firstname' => 'Course', 'lastname' => 'learner', 'maildisplay' => 0,
    'mailformat' => 0, 'mailcharset' => 'UTF-8', 'emailstop' => 0, 'deleted' => 0, 'suspended' => 0, 'auth' => 'manual'];
$sender = core_user::get_support_user();
if (!email_to_user($recipient, $sender, $packet['subject'], $packet['body'], '', '', '', true, 'hi@finlaymccall.com', 'Finlay McCall')) throw new RuntimeException('Email handoff failed.');
echo "Accepted by mail server; inbox receipt not asserted.\n";
