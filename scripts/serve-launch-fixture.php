<?php
// Router for the isolated synthetic fixture only. Not a production web server.
$root = dirname(__DIR__);
if (realpath($_SERVER['DOCUMENT_ROOT']) !== realpath($root . '/trial/launch-fixture/moodle')) {
    http_response_code(500);
    exit('Synthetic fixture document root required.');
}
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$routes = ['/', '/journey', '/first-task', '/preview', '/portfolio', '/check-and-continue', '/help', '/privacy', '/before-you-start', '/notes', '/free-tools', '/deeper-courses'];
$public = realpath($root . '/public');
if (in_array($path, $routes, true)) {
    $relative = $path === '/' ? '/index.html' : $path . '.html';
} else if (str_starts_with($path, '/assets/') || str_starts_with($path, '/ai/')) {
    $relative = str_ends_with($path, '/') ? $path . 'index.html' : $path;
} else {
    return false;
}
$file = realpath($public . $relative);
if (!$file || !str_starts_with($file, $public . '/') || !is_file($file)) {
    http_response_code(404);
    exit;
}
$type = ['html' => 'text/html', 'css' => 'text/css', 'js' => 'text/javascript', 'json' => 'application/json', 'md' => 'text/plain', 'svg' => 'image/svg+xml'][pathinfo($file, PATHINFO_EXTENSION)] ?? 'application/octet-stream';
header('Content-Type: ' . $type . '; charset=utf-8');
readfile($file);
