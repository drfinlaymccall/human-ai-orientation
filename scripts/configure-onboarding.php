<?php
// Additive account setup only: never reset courses, credentials, mail transports or learner records.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require __DIR__ . '/moodle-environment.php';
require_once $CFG->libdir . '/enrollib.php';

$action = $argv[1] ?? 'status';
if (!in_array($action, ['status', 'check', 'configure-closed', 'pilot', 'open'], true)) {
    throw new RuntimeException('Use status, check, configure-closed, pilot or open [--receipt=/private/path.json] [--pilot-emails=/private/path.json].');
}
require_once __DIR__ . '/synthetic-fixture.php';
$fixture = orientation_is_synthetic_fixture($orientationtrial, $CFG);
if (!$fixture && $CFG->wwwroot !== 'https://orientation.finlaymccall.com') {
    throw new RuntimeException('Unexpected installation; no configuration changed.');
}
$manifest = json_decode(file_get_contents($orientationtrial . '/course.json'), true, 512, JSON_THROW_ON_ERROR);
$course = $DB->get_record('course', ['id' => $manifest['course_id']], '*', MUST_EXIST);
$instances = $DB->get_records('enrol', ['courseid' => $course->id, 'enrol' => 'self']);
if (count($instances) > 1) throw new RuntimeException('Multiple self-enrolment methods need an explicit operator choice.');
$instance = $instances ? reset($instances) : false;
$receiptpath = $orientationtrial . '/onboarding-readiness.json';
$pilotpath = null;
foreach (array_slice($argv, 2) as $argument) {
    if (str_starts_with($argument, '--receipt=')) $receiptpath = substr($argument, 10);
    else if (str_starts_with($argument, '--pilot-emails=')) $pilotpath = substr($argument, 15);
    else throw new RuntimeException('Unknown option. Use --receipt=/private/path.json and --pilot-emails=/private/path.json.');
}
function orientation_receipt_valid(string $path, bool $fixture, int $courseid): bool {
    global $CFG, $orientationtrial;
    $real = realpath($path);
    if (!$real || !str_starts_with($real, $orientationtrial . DIRECTORY_SEPARATOR)) return false;
    $receipt = json_decode(file_get_contents($real), true);
    if (!is_array($receipt)) return false;
    if (($receipt['site'] ?? null) !== $CFG->wwwroot || ($receipt['course_id'] ?? null) !== $courseid) return false;
    if (empty($receipt['reviewed_by']) || empty($receipt['reviewed_at']) || empty($receipt['evidence_note'])) return false;
    if (!is_string($receipt['reviewed_at']) || strtotime($receipt['reviewed_at']) === false) return false;
    foreach (['privacy_reviewed', 'support_reviewed', 'operating_reviewed'] as $key) {
        if (($receipt[$key] ?? null) !== true) return false;
    }
    $mail = $receipt['mail'] ?? [];
    if (($mail['confirmation_received'] ?? null) !== true || ($mail['recovery_received'] ?? null) !== true) return false;
    if ($fixture) return ($receipt['synthetic'] ?? null) === true && ($mail['recipient_scope'] ?? '') === 'synthetic-capture';
    if (($receipt['retention_reviewed'] ?? null) !== true) return false;
    foreach (['confirmation_checked_at', 'recovery_checked_at'] as $key) {
        if (!is_string($mail[$key] ?? null) || strtotime($mail[$key]) === false) return false;
    }
    return ($receipt['synthetic'] ?? null) === false && ($receipt['reviewed_by'] ?? '') === 'Finlay McCall'
        && ($mail['recipient_scope'] ?? '') === 'representative-consenting'
        && !empty($mail['confirmation_checked_at']) && !empty($mail['recovery_checked_at']);
}
function orientation_pilot_receipt_valid(string $path, bool $fixture, int $courseid): bool {
    global $CFG, $orientationtrial;
    $real = realpath($path);
    if (!$real || !str_starts_with($real, $orientationtrial . DIRECTORY_SEPARATOR)) return false;
    $r = json_decode(file_get_contents($real), true);
    if (!is_array($r) || ($r['site'] ?? '') !== $CFG->wwwroot || ($r['course_id'] ?? null) !== $courseid) return false;
    return ($r['pilot_only'] ?? null) === true && ($r['synthetic'] ?? null) === $fixture
        && ($r['reviewed_by'] ?? '') === ($fixture ? 'Synthetic test only' : 'Finlay McCall')
        && is_string($r['reviewed_at'] ?? null) && strtotime($r['reviewed_at']) !== false
        && !empty($r['evidence_note']) && ($r['privacy_reviewed'] ?? null) === true
        && ($r['support_reviewed'] ?? null) === true && ($r['operating_reviewed'] ?? null) === true
        && ($r['retention_before_broad_launch'] ?? null) === true;
}
$pluginready = (int)get_config('local_orientation', 'version') >= 2026102301;
$pilotready = orientation_pilot_receipt_valid($receiptpath, $fixture, (int)$course->id);
$allowed = [];
if ($action === 'pilot') {
    $real = $pilotpath ? realpath($pilotpath) : false;
    if (!$real || !str_starts_with($real, $orientationtrial . DIRECTORY_SEPARATOR)) throw new RuntimeException('Pilot requires a private exact-address list within this runtime.');
    $addresses = json_decode(file_get_contents($real), true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($addresses) || !array_is_list($addresses) || !$addresses || count($addresses) > 20) throw new RuntimeException('Pilot needs 1–20 exact consented addresses.');
    foreach ($addresses as $address) {
        if (!is_string($address) || !filter_var($address, FILTER_VALIDATE_EMAIL) || str_contains($address, '*')) throw new RuntimeException('Pilot addresses must be exact valid mailboxes.');
        $allowed[] = strtolower(trim($address));
    }
    $allowed = array_values(array_unique($allowed));
}
$blockers = [];
if (!$course->visible) $blockers[] = 'course_hidden';
if (get_config('auth_email', 'recaptcha') && (empty($CFG->recaptchapublickey) || empty($CFG->recaptchaprivatekey))) $blockers[] = 'captcha_keys_incomplete';
if (!$fixture && !empty($CFG->allowemailaddresses)) $blockers[] = 'email_allowlist_requires_review';
if (!$fixture && !empty($CFG->denyemailaddresses)) $blockers[] = 'email_denylist_requires_review';
if ($instance) {
    foreach (['password' => 'enrolment_key_required', 'customint1' => 'group_key_enabled',
        'customint3' => 'enrolment_capacity_set', 'customint5' => 'cohort_restriction',
        'enrolstartdate' => 'enrolment_start_date_set', 'enrolenddate' => 'enrolment_end_date_set',
        'enrolperiod' => 'enrolment_duration_set'] as $field => $label) {
        if (!empty($instance->$field)) $blockers[] = $label;
    }
    $studentrole = $DB->get_field('role', 'id', ['shortname' => 'student'], MUST_EXIST);
    if ((int)$instance->roleid !== (int)$studentrole) $blockers[] = 'unexpected_self_enrolment_role';
}
$receiptready = orientation_receipt_valid($receiptpath, $fixture, (int)$course->id);
$mailready = $fixture || (!empty($CFG->smtphosts) && !empty($CFG->smtpuser) && !empty($CFG->smtppass)
    && in_array($CFG->smtpsecure ?? '', ['tls', 'ssl'], true)
    && empty($CFG->divertallemailsto) && empty($CFG->noemailever));
if ($action === 'open' && (!$pluginready || !$receiptready || !$mailready || $blockers)) {
    throw new RuntimeException('Registration retained unchanged: private mail/recovery and owner-review receipt plus ready transport and unrestricted course enrolment required.');
}
if ($action === 'pilot' && (!$pluginready || !$pilotready || !$mailready || $blockers)) throw new RuntimeException('Pilot retained unchanged: installed plugin, private owner pilot-review receipt, ready transport and unrestricted enrolment required.');
if (in_array($action, ['configure-closed', 'pilot', 'open'], true)) {
    if (!$pluginready) throw new RuntimeException('Install and upgrade the repository orientation plugin before configuration.');
    $open = $action !== 'configure-closed';
    $transaction = $DB->start_delegated_transaction();
    foreach (['auth' => 'email', 'enrol_plugins_enabled' => 'self'] as $setting => $addition) {
        $enabled = array_values(array_filter(explode(',', $CFG->$setting ?? '')));
        if (!in_array($addition, $enabled, true)) $enabled[] = $addition;
        set_config($setting, implode(',', $enabled));
    }
    set_config('acquisition_mode', $action === 'open' ? 'public' : ($action === 'pilot' ? 'pilot' : 'closed'), 'local_orientation');
    set_config('pilot_emails', json_encode($action === 'pilot' ? $allowed : []), 'local_orientation');
    $priorlockout = (int)($CFG->lockoutthreshold ?? 0);
    foreach (['registerauth' => $open ? 'email' : '', 'passwordpolicy' => 1,
        'minpasswordlength' => max(12, (int)($CFG->minpasswordlength ?? 0)),
        'minpassworddigits' => max(1, (int)($CFG->minpassworddigits ?? 0)),
        'minpasswordlower' => max(1, (int)($CFG->minpasswordlower ?? 0)),
        'minpasswordupper' => max(1, (int)($CFG->minpasswordupper ?? 0)),
        'minpasswordnonalphanum' => max(1, (int)($CFG->minpasswordnonalphanum ?? 0)), 'protectusernames' => 1,
        'lockoutthreshold' => $priorlockout > 0 ? min(10, $priorlockout) : 10,
        'lockoutwindow' => max(900, (int)($CFG->lockoutwindow ?? 0)),
        'lockoutduration' => $priorlockout > 0 && empty($CFG->lockoutduration) ? 0 : max(900, (int)($CFG->lockoutduration ?? 0)),
        'emailchangeconfirmation' => 1, 'allowaccountssameemail' => 0,
        'guestloginbutton' => 0] as $name => $value) set_config($name, $value);
    $instructions = '<p>' . ($open
        ? ($action === 'pilot' ? 'Registration is limited to invited pilot learners. ' : '') . 'Create an account, confirm your email, then choose Enrol me to save course progress. Check spam if confirmation is missing. Open the link in any browser; then continue to your course.'
        : 'Public registration is not open yet. Existing and invited learners can sign in; everyone can use the public course.') . '</p>'
        . '<p><a href="/login/forgot_password.php">Recover access or resend confirmation</a>: use your username or account email. '
        . 'Already registered? Recover your account rather than create another. '
        . ($open ? '' : 'Confirmation is paused while registration is closed; contact Finlay about an unconfirmed account. ') . '</p>'
        . '<p><a href="/local/orientation/index.php">Your course journey</a> · '
        . '<a href="/journey">Use the public course</a> · <a href="/help">Account help</a> · '
        . '<a href="/privacy">About your information</a> · <a href="/ai/">Guide for your AI</a></p>';
    set_config('auth_instructions', $instructions);
    $plugin = enrol_get_plugin('self');
    $settings = $instance ? clone $instance : new stdClass();
    $settings->status = ENROL_INSTANCE_ENABLED;
    $settings->customint6 = $open ? 1 : 0;
    $settings->customtext1 = 'Welcome to Human AI Orientation. Choose a useful activity and keep a personal context portfolio. '
        . 'You can leave and return with Moodle activity progress saved; download your portfolio backup separately. '
        . 'Return to your course: ' . $CFG->wwwroot . '/course/view.php?id=' . (int)$course->id;
    // Native form represents expiry notification plus notifyall as the value 2.
    if ($instance && $instance->expirynotify && $instance->notifyall) $settings->expirynotify = 2;
    if ($instance) {
        $plugin->update_instance($instance, $settings);
    } else {
        $settings->roleid = $DB->get_field('role', 'id', ['shortname' => 'student'], MUST_EXIST);
        $settings->customint1 = 0;
        $settings->customint2 = 0;
        $settings->customint3 = 0;
        $settings->customint4 = 0; // No unsolicited new welcome transport; native confirmation carries account access.
        $settings->customint5 = 0;
        $plugin->add_instance($course, (array)$settings);
    }
    $transaction->allow_commit();
    \core\session\manager::set_user(get_admin());
    purge_all_caches();
    $instance = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'self'], '*', MUST_EXIST);
}
$status = [
    'site' => $CFG->wwwroot, 'course_id' => (int)$course->id, 'synthetic_fixture' => $fixture,
    'orientation_plugin_ready' => $pluginready,
    'acquisition_mode' => get_config('local_orientation', 'acquisition_mode') ?: 'closed',
    'pilot_owner_receipt_ready' => $pilotready,
    'broad_registration_open' => get_config('local_orientation', 'acquisition_mode') === 'public' && ($CFG->registerauth ?? '') === 'email',
    'registration_open' => ($CFG->registerauth ?? '') === 'email',
    'email_auth_enabled' => is_enabled_auth('email'),
    'self_plugin_enabled' => enrol_is_enabled('self'),
    'self_instance_enabled' => $instance && (int)$instance->status === ENROL_INSTANCE_ENABLED,
    'new_enrolments_open' => $instance && !empty($instance->customint6),
    'acquisition_blockers' => $blockers,
    'owner_receipt_ready' => $receiptready, 'mail_transport_ready' => $mailready,
    'password_policy_enabled' => !empty($CFG->passwordpolicy),
    'password_minimums_ready' => (int)($CFG->minpasswordlength ?? 0) >= 12
        && (int)($CFG->minpassworddigits ?? 0) >= 1 && (int)($CFG->minpasswordlower ?? 0) >= 1
        && (int)($CFG->minpasswordupper ?? 0) >= 1 && (int)($CFG->minpasswordnonalphanum ?? 0) >= 1,
    'usernames_protected' => !empty($CFG->protectusernames),
    'email_change_confirmation_enabled' => !empty($CFG->emailchangeconfirmation),
    'duplicate_emails_disallowed' => empty($CFG->allowaccountssameemail),
    'lockout_enabled' => !empty($CFG->lockoutthreshold),
    'lockout_ready' => (int)($CFG->lockoutthreshold ?? 0) > 0 && (int)$CFG->lockoutthreshold <= 10
        && (int)($CFG->lockoutwindow ?? 0) >= 900
        && (empty($CFG->lockoutduration) || (int)$CFG->lockoutduration >= 900),
    'mail_settings_changed' => false, 'queued_mail_released' => false,
];
echo json_encode($status, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
if ($action === 'check') {
    $open = $status['registration_open'];
    $mode = $status['acquisition_mode'];
    $valid = $pluginready && $status['email_auth_enabled'] && $status['self_plugin_enabled'] && $status['self_instance_enabled']
        && in_array($CFG->registerauth ?? '', ['', 'email'], true)
        && $status['new_enrolments_open'] === $open && $status['password_policy_enabled'] && $status['password_minimums_ready']
        && $status['email_change_confirmation_enabled'] && $status['duplicate_emails_disallowed']
        && $status['usernames_protected'] && $status['lockout_ready']
        && ((!$open && $mode === 'closed') || ($open && $mailready && !$blockers &&
            (($mode === 'public' && $receiptready) || ($mode === 'pilot' && $pilotready && count(json_decode(get_config('local_orientation', 'pilot_emails') ?: '[]', true)) > 0))));
    if (!$valid) exit(1);
}
