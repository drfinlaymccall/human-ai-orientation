<?php
// Standalone source checks only. No Moodle config, database or runtime is loaded.
define('MOODLE_INTERNAL', true);
function s($text) { return htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); }
$root = dirname(__DIR__);
require $root . '/scripts/course-module-identity.php';
$map = json_decode(file_get_contents($root . '/content/course-map.json'), true, 512, JSON_THROW_ON_ERROR);
orientation_validate_baseline($map);
$temp = tempnam(sys_get_temp_dir(), 'orientation-structure-');
unlink($temp);
mkdir($temp); mkdir($temp . '/classes');
try {
    copy($root . '/moodle/local/orientation/classes/catalogue.php', $temp . '/classes/catalogue.php');
    file_put_contents($temp . '/course-map.json', json_encode($map));
    require $temp . '/classes/catalogue.php';
    $catalogue = \local_orientation\catalogue::syllabus();
    foreach ($map['units'] as $unit) {
        if (!str_contains($catalogue, $unit['label'])) throw new RuntimeException('Native unit label missing.');
        foreach ($unit['modules'] as $module) {
            if (!str_contains($catalogue, s($module['label']))) throw new RuntimeException('Native module label missing.');
        }
    }
    $planned = explode('data-unit="agentic-systems"', $catalogue)[1];
    if (str_contains($planned, '<a ') || !str_contains($planned, 'Planned — not yet available')) throw new RuntimeException('Planned unit has an active route.');
    $journey = \local_orientation\catalogue::syllabus([], true);
    if (str_contains($journey, 'Unit 2')) throw new RuntimeException('Planned unit in active journey.');
    foreach (['duplicate', 'missing', 'planned', 'baseline'] as $case) {
        $invalid = $map;
        if ($case === 'duplicate') $invalid['units'][0]['modules'][0]['activities'][] = 'notes';
        if ($case === 'missing') array_pop($invalid['units'][0]['modules']);
        if ($case === 'planned') $invalid['units'][1]['journey_url'] = '/not-ready';
        if ($case === 'baseline') $invalid['activities'][0]['baseline'] = false;
        file_put_contents($temp . '/course-map.json', json_encode($invalid));
        foreach (['orientation_validate_baseline', '\\local_orientation\\catalogue::map'] as $validate) {
            $failed = false;
            try { $validate($invalid); } catch (RuntimeException $e) { $failed = true; }
            if (!$failed) throw new RuntimeException('Validator accepted ' . $case);
        }
    }
    echo "PASS native catalogue, planned syllabus, no-JavaScript links and both validators\n";
} finally {
    unlink($temp . '/classes/catalogue.php'); unlink($temp . '/course-map.json');
    rmdir($temp . '/classes'); rmdir($temp);
}
