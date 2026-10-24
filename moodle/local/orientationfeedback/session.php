<?php
// Observational owner check for cached feedback frames. No login redirect or destination writes.
define('AJAX_SCRIPT', true);
define('NO_DEBUG_DISPLAY', true);
define('NO_SESSION_UPDATE', true);
define('READ_ONLY_SESSION', true);
require_once(__DIR__ . '/../../config.php');
// A delayed check must never replace a newer login cookie.
header_remove('Set-Cookie');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, no-store');
header('Pragma: no-cache');
header('Vary: Cookie');
header('X-Content-Type-Options: nosniff');
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'], true)) {
    header('Allow: GET, HEAD');
    http_response_code(405);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'HEAD') exit;
$signedin = isloggedin() && !isguestuser() && !empty($USER->sesskey);
if ($signedin) {
    // Match native expiry/authentication hooks without refreshing or destroying the session.
    $record = \core\session\manager::get_session_by_sid(session_id());
    $signedin = isset($record->sid);
    if ($signedin && $record->timemodified < \core\di::get(\core\clock::class)->time() - $CFG->sessiontimeout) {
        $signedin = false;
        foreach (get_enabled_auth_plugins() as $authname) {
            $authplugin = get_auth_plugin($authname);
            if ($authplugin->ignore_timeout_hook($_SESSION['USER'], $record->sid, $record->timecreated, $record->timemodified)) {
                $signedin = true;
                break;
            }
        }
    }
}
// The opaque token changes on sign-in and exposes no learner or document data.
$owner = $signedin ? hash('sha256', (int)$USER->id . ':' . $USER->sesskey) : null;
header_remove('Set-Cookie');
echo json_encode(['owner' => $owner]);
