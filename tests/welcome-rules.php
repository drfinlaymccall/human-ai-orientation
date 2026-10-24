<?php
// Source-only welcome rendering checks: no Moodle database, mail transport or learner records.
require __DIR__ . '/../moodle/local/orientation/classes/welcome.php';
$assert = function (bool $condition, string $label): void {
    if (!$condition) throw new RuntimeException('FAIL: ' . $label);
    echo "PASS: $label\n";
};
$data = \local_orientation\welcome::data();
$assert(count($data['objectives']) === 6, 'shared welcome has the six existing practice outcomes');
$html = \local_orientation\welcome::email('https://orientation.example.test');
foreach ($data['email_paragraphs'] as $paragraph) {
    $assert(str_contains($html, '<span class="nolink">' . htmlspecialchars($paragraph, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</span>'),
        'email renders a shared paragraph without automatic course links');
}
foreach ($data['links'] as $link) {
    $url = 'https://orientation.example.test' . $link['path'];
    $assert(str_contains($html, 'href="' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '"'),
        'email link uses the installation base and the shared path');
    $assert(str_contains($html, '>' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '</a>'),
        'each destination is visibly a full URL for the native plain-text conversion');
}
$assert(!str_contains($html, '{$a->'), 'welcome contains no private user placeholders');
$assert(\local_orientation\welcome::email('https://orientation.example.test/') === $html,
    'a trailing slash cannot change the rendered destinations');
foreach (['javascript:alert(1)', 'https://orientation.example.test/?token=secret', 'https://user:secret@orientation.example.test', 'https://orientation.example.test/#private'] as $base) {
    try { \local_orientation\welcome::email($base); }
    catch (InvalidArgumentException $e) { continue; }
    throw new RuntimeException('FAIL: unsafe installation base accepted');
}
echo "PASS: unsafe installation bases are rejected\n";
