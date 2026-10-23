<?php
// Observational session probe for same-origin public pages; deliberately no require_login or destination writes.
define('AJAX_SCRIPT', true);
define('NO_DEBUG_DISPLAY', true);
require_once(__DIR__ . '/../../config.php');
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
    echo json_encode(['state' => isloggedin() && !isguestuser() ? 'signed-in' : 'signed-out',
        'journey_url' => '/local/orientation/index.php']);
}
