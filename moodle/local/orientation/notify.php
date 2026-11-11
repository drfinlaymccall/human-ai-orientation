<?php
// Public sign-up for one notice about a named topic, and its removal link. No account, no session, no mail.
define('NO_MOODLE_COOKIES', true);
define('NO_DEBUG_DISPLAY', true);
require_once(__DIR__ . '/../../config.php');
use local_orientation\notify;

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: no-referrer');

$page = function (string $title, string $body, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<meta name="robots" content="noindex"><title>' . s($title) . ' — Human AI Orientation</title>'
        . '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"></head><body>'
        . '<a class="skip" href="#main">Skip to content</a><header><a href="/">Human AI Orientation</a><a href="/journey">Course journey</a></header>'
        . '<main id="main" class="reading"><p class="eyebrow">Human AI Orientation</p><h1>' . s($title) . '</h1>' . $body . '</main>'
        . '<footer><p>Designed and built by Finlay McCall · <a href="/privacy#updates">Privacy policy</a></p></footer></body></html>';
    exit;
};
$back = '<p class="actions"><a class="button" href="/agent-basics">Back to the early reading</a><a class="button secondary" href="/journey">Open the course journey</a></p>';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && optional_param('remove', '', PARAM_ALPHANUM) !== '') {
    $removed = notify::remove(required_param('remove', PARAM_ALPHANUM));
    $page($removed ? 'You are off the list' : 'That link is no longer in use',
        '<p>' . ($removed ? 'We deleted your email address from this list. You will not get the message.'
            : 'This address is not on the list. It may already have been removed.') . '</p>' . $back);
}
if ($method === 'POST') {
    $topic = optional_param('topic', '', PARAM_ALPHANUMEXT);
    // The "website" field is hidden from people. Only automated form-fillers complete it; they get the same answer and nothing is kept.
    $result = optional_param('website', '', PARAM_RAW) !== '' ? 'added' : notify::add(optional_param('email', '', PARAM_RAW_TRIMMED), $topic);
    if ($result === 'invalid') {
        $page('Please check your email address', '<p>We could not use that address. Go back and type it again, for example <code>name@example.com</code>.</p>'
            . '<p class="actions"><a class="button" href="/agent-basics#notify">Try again</a></p>', 400);
    }
    if ($result === 'busy') {
        $page('Please try again later', '<p>The list is not taking new addresses just now. Nothing was saved. Please try again in an hour.</p>' . $back, 429);
    }
    // The same answer whether or not the address was already listed, so the form cannot be used to look someone up.
    $page('You are on the list', '<p>Finlay will send one email to this address when ' . s(notify::TOPICS[$topic]) . ' is ready.</p>'
        . '<p>That email will include a link to remove your address. You can also ask at any time: <a href="mailto:hi@finlaymccall.com">hi@finlaymccall.com</a>.</p>' . $back);
}
if ($method === 'GET' && ($token = optional_param('remove', '', PARAM_ALPHANUM)) !== '') {
    $row = notify::find($token);
    if (!$row) {
        $page('That link is no longer in use', '<p>This address is not on the list. It may already have been removed.</p>' . $back);
    }
    // A link opened by a mail scanner must not remove anyone; removal needs this button.
    $page('Remove your address?', '<p>You asked to be told when ' . s(notify::TOPICS[$row->topic] ?? 'something new') . ' is ready.</p>'
        . '<form method="post" action="/local/orientation/notify.php"><input type="hidden" name="remove" value="' . s($row->token) . '">'
        . '<p><button class="button" type="submit">Remove my address</button></p></form>');
}
redirect(new moodle_url('/agent-basics'));
