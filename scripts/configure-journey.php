<?php
// Deliberate additive landing configuration; never alters enrolment, authentication or native wantsurl.
define('CLI_SCRIPT', true);
require __DIR__ . '/moodle-environment.php';
$action = $argv[1] ?? 'status';
if (!in_array($action, ['status', 'configure', 'check'], true)) throw new RuntimeException('Use status, configure or check.');
if ((int)get_config('local_orientation', 'version') < 2026102302) throw new RuntimeException('Install/upgrade the journey plugin first.');
\local_orientation\catalogue::course();
$destination = '/local/orientation/index.php';
if ($action === 'configure') {
    if (get_config('local_orientation', 'previous_homepage') === false) {
        set_config('previous_homepage', json_encode($CFG->defaulthomepage ?? null), 'local_orientation');
    }
    // Refresh only the exact link emitted by configure-onboarding, retaining all acquisition wording.
    $instructions = $CFG->auth_instructions ?? '';
    $ownedlink = '<a href="/course/view.php?id=' . (int)\local_orientation\catalogue::course()->id . '">Open your course</a>';
    $updated = str_replace($ownedlink, '<a href="/local/orientation/index.php">Your course journey</a>', $instructions);
    // Supported hooks now own the journey entry; remove only this project's obsolete custom-menu link.
    $oldmenu = $CFG->custommenuitems ?? '';
    $lines = array_filter(explode("\n", $oldmenu), function($line) use ($CFG) {
        $parts = explode('|', $line);
        if (count($parts) < 2 || !in_array(trim($parts[0]), ['Read the lesson', 'My orientation progress', 'Open my orientation progress'], true)) return true;
        return !in_array(trim($parts[1]), ['/preview', $CFG->wwwroot . '/preview', '/local/orientation/index.php', $CFG->wwwroot . '/local/orientation/index.php'], true);
    });
    if (get_config('local_orientation', 'previous_journey_navigation') === false) {
        set_config('previous_journey_navigation', json_encode(['auth_instructions' => $instructions, 'custommenuitems' => $oldmenu]), 'local_orientation');
    }
    if ($updated !== $instructions) set_config('auth_instructions', $updated);
    $newmenu = implode("\n", $lines);
    if ($newmenu !== $oldmenu) set_config('custommenuitems', $newmenu);
    set_config('defaulthomepage', $destination);
}
$status = ['default_homepage' => $CFG->defaulthomepage ?? null,
    'journey_homepage_configured' => ($CFG->defaulthomepage ?? null) === $destination,
    'previous_homepage' => json_decode(get_config('local_orientation', 'previous_homepage') ?: 'null', true),
    'rollback' => 'Restore the recorded previous_homepage in Moodle Site administration > Appearance > Navigation > Default home page. The original owned login/menu settings are retained privately as local_orientation/previous_journey_navigation for selective restoration. Keep the plugin and native records; do not reseed.'];
echo json_encode($status, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
if ($action === 'check' && !$status['journey_homepage_configured']) exit(1);
