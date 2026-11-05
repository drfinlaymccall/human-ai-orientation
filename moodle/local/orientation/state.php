<?php
// Observational session probe for same-origin public pages; deliberately no require_login or destination writes.
define('AJAX_SCRIPT', true);
define('NO_DEBUG_DISPLAY', true);
define('NO_SESSION_UPDATE', true);
define('READ_ONLY_SESSION', true);
require_once(__DIR__ . '/../../config.php');
// Bootstrap may create an anonymous cookie. A delayed probe must never replace a newer login session.
header_remove('Set-Cookie');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, no-store');
header('Pragma: no-cache');
header('Vary: Cookie');
$method = $_SERVER['REQUEST_METHOD'];
if (!in_array($method, ['GET', 'HEAD'], true)) {
    header('Allow: GET, HEAD');
    http_response_code(405);
    exit;
}
if ($method === 'GET') {
    $signedin = isloggedin() && !isguestuser();
    if ($signedin) {
        // NO_SESSION_UPDATE deliberately retains the user when native bootstrap detects expiry.
        // Mirror its timeout/authentication-hook decision without destroying or refreshing the session.
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
    // An authentication timeout hook may also emit a cookie; the probe must remain observational.
    header_remove('Set-Cookie');
    echo json_encode(['state' => $signedin ? 'signed-in' : 'signed-out',
        'journey_url' => '/local/orientation/index.php']);
}
