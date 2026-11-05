<?php
define('AJAX_SCRIPT', true);
define('NO_DEBUG_DISPLAY', true);
require_once(__DIR__ . '/../../config.php');
use local_orientation\context_store;
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, no-store');
header('Vary: Cookie');
header('X-Content-Type-Options: nosniff');
try {
    $course = context_store::authorise();
    require_login($course, false, null, false, true);
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'GET') {
        $id = optional_param('item', 0, PARAM_INT);
        if ($id) {
            $result = ['item' => context_store::item($course->id, $id)];
        } else {
            $result = ['userid' => (int)$USER->id, 'sesskey' => sesskey(), 'portfolio' => context_store::portfolio($course->id), 'items' => context_store::listing($course->id), 'progress' => \local_orientation\catalogue::progress($course)];
        }
    } else if ($method === 'POST') {
        $raw = file_get_contents('php://input', false, null, 0, 262145);
        if (strlen($raw) > 262144) throw new RuntimeException('size', 413);
        $data = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($data) || !is_string($data['sesskey'] ?? null) || !confirm_sesskey($data['sesskey'])) throw new RuntimeException('csrf', 403);
        // This token only detects a changed sign-in; ownership always comes from $USER.
        if (!is_int($data['expecteduserid'] ?? null) || $data['expecteduserid'] !== (int)$USER->id) throw new RuntimeException('owner', 403);
        if (!is_int($data['revision'] ?? null) || $data['revision'] < 0) throw new RuntimeException('invalid', 400);
        if (in_array($data['op'] ?? '', ['save-portfolio', 'save-note'], true) &&
                (!is_int($data['expecteditemid'] ?? null) || $data['expecteditemid'] < 0)) throw new RuntimeException('invalid', 400);
        switch ($data['op'] ?? '') {
            case 'save-portfolio':
                $snapshot = context_store::validate($data['snapshot'] ?? null);
                $item = context_store::save($course->id, 'portfolio', $data['revision'], 'My portfolio', json_encode($snapshot, JSON_THROW_ON_ERROR), 'portfolio', $data['expecteditemid']);
                $result = ['portfolio' => ['id' => (int)$item->id, 'revision' => (int)$item->revision, 'snapshot' => $snapshot]];
                break;
            case 'save-note':
                foreach (['title', 'body', 'source'] as $field) if (!is_string($data[$field] ?? null)) throw new RuntimeException('invalid', 400);
                $key = $data['key'] ?? ('note_' . bin2hex(random_bytes(12)));
                if (!is_string($key) || $key === 'portfolio') throw new RuntimeException('invalid', 400);
                $result = ['item' => context_store::save($course->id, $key, $data['revision'], $data['title'], $data['body'], $data['source'], $data['expecteditemid'])];
                break;
            case 'delete':
                if (!is_int($data['id'] ?? null)) throw new RuntimeException('invalid', 400);
                context_store::delete($course->id, $data['id'], $data['revision']);
                $result = ['deleted' => true];
                break;
            default: throw new RuntimeException('invalid', 400);
        }
    } else {
        header('Allow: GET, POST');
        throw new RuntimeException('method', 405);
    }
    // An observational request with an expired cookie must not replace a newer login's cookie.
    header_remove('Set-Cookie');
    echo json_encode($result, JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    $code = (int)$error->getCode();
    if (!in_array($code, [400, 401, 403, 404, 405, 409, 413, 503], true)) $code = $error instanceof JsonException ? 400 : 500;
    http_response_code($code);
    header_remove('Set-Cookie');
    echo json_encode(['error' => [400 => 'Invalid document or storage limit reached.', 401 => 'Sign in to open My context.', 403 => 'Access denied. Sign in again if your session expired.', 404 => 'Saved item not found.', 405 => 'Use GET or POST.', 409 => 'A newer saved version exists. Your draft has not replaced it.', 413 => 'This document is too large.', 503 => 'Saving is busy. Keep your draft and try again.'][$code] ?? 'Context storage is unavailable. Keep your draft and try again.']);
}
