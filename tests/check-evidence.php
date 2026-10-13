<?php
// Verify persisted native Moodle records for the synthetic browser runs. Read-only.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require $root . '/trial/moodle/config.php';
$manifest = json_decode(file_get_contents($root . '/trial/course.json'));
$cm = get_coursemodule_from_id('lesson', $manifest->lesson_cmid, 0, false, MUST_EXIST);
$essay = $DB->get_record('lesson_pages', ['lessonid' => $cm->instance, 'qtype' => 10], '*', MUST_EXIST);
foreach (['desktop', 'mobile'] as $device) {
    $fixture = json_decode(file_get_contents($root . '/trial/' . $device . '-learner.json'));
    $user = $DB->get_record('user', ['username' => $fixture->username], '*', MUST_EXIST);
    if ((int)$user->confirmed !== 1) { throw new RuntimeException($device . ': email not confirmed'); }
    $completion = $DB->get_record('course_modules_completion', ['coursemoduleid' => $cm->id, 'userid' => $user->id], '*', MUST_EXIST);
    if ((int)$completion->completionstate !== 1) { throw new RuntimeException($device . ': completion not persisted'); }
    $attempts = $DB->get_records('lesson_attempts', ['lessonid' => $cm->instance, 'pageid' => $essay->id, 'userid' => $user->id]);
    $found = false;
    foreach ($attempts as $attempt) {
        $response = unserialize($attempt->useranswer, ['allowed_classes' => ['stdClass']]);
        if (isset($response->answer) && strip_tags($response->answer) === $fixture->reflection) { $found = true; }
    }
    if (!$found) { throw new RuntimeException($device . ': reflection not persisted'); }
    echo $device . ": confirmed account, saved completion and exact reflection verified\n";
}
