<?php
// Credentials belong in Moodle admin, never CLI arguments or source.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require $root . '/trial/moodle/config.php';
$action = $argv[1] ?? 'status';
if (!in_array($action, ['status', 'activate'], true)) throw new RuntimeException('Use status or activate.');
if ($CFG->wwwroot !== 'https://orientation.finlaymccall.com') throw new RuntimeException('This targets the orientation pilot only.');
$ready = !empty($CFG->smtphosts) && !empty($CFG->smtpuser) && !empty($CFG->smtppass) && in_array($CFG->smtpsecure, ['tls', 'ssl'], true);
if ($action === 'activate') {
    if (!$ready) throw new RuntimeException('Save SMTP credentials with TLS in Moodle admin first.');
    // Do not release old queued mail by enabling transport.
    $queued = $DB->count_records_select('task_adhoc', 'classname LIKE :mail', ['mail' => '%email%']);
    if ($queued) throw new RuntimeException('Queued email needs operator review before activation.');
    $path = $root . '/trial/moodle/config.php';
    $config = file_get_contents($path);
    $pattern = '~\\$CFG->divertallemailsto\\s*=\\s*[^;]+;~';
    $config = preg_replace($pattern, '$CFG->divertallemailsto = \'\';', $config, -1, $count);
    if ($count !== 1) throw new RuntimeException('Expected one mail diversion setting; inspect private config.');
    $temporary = tempnam(dirname($path), '.orientation-mail-');
    if ($temporary === false) throw new RuntimeException('Unable to prepare private config update.');
    try {
        if (!chmod($temporary, 0600) || file_put_contents($temporary, $config, LOCK_EX) !== strlen($config)) {
            throw new RuntimeException('Config write incomplete; original config retained.');
        }
        if (!rename($temporary, $path)) throw new RuntimeException('Config replacement failed; original config retained.');
    } finally {
        if (file_exists($temporary)) unlink($temporary);
    }
    foreach ([
        'noreplyaddress' => 'hi@finlaymccall.com', 'supportemail' => 'hi@finlaymccall.com', 'supportname' => 'Finlay McCall',
        'auth_instructions' => '<p>Sign in with the pilot account Finlay gave you. Use “Lost password?” to request a reset email for your account. Public sign-up is not open yet.</p><p><a href="/journey">Use the course without an account</a> · <a href="/help">Ask for help</a></p>',
    ] as $key => $value) set_config($key, $value);
    echo "Mail activated for the invitation-only pilot. Registration unchanged.\n";
} else {
    echo json_encode(['smtp_configured_with_encryption' => $ready, 'diversion_enabled' => !empty($CFG->divertallemailsto), 'outgoing_disabled' => !empty($CFG->noemailever), 'registration_enabled' => !empty($CFG->registerauth)], JSON_PRETTY_PRINT) . "\n";
}
