<?php
// Real publishing checks against an explicitly selected, isolated synthetic fixture only.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require $root . '/scripts/moodle-environment.php';
require_once $root . '/scripts/synthetic-fixture.php';
if (!getenv('ORIENTATION_TRIAL_DIR') || !orientation_is_synthetic_fixture($orientationtrial, $CFG)) {
    throw new RuntimeException('Explicit isolated synthetic fixture required.');
}
$course = $DB->get_record('course', ['shortname' => 'AI-ORIENTATION-TRIAL'], '*', MUST_EXIST);
$map = json_decode(file_get_contents($root . '/content/course-map.json'), true, 512, JSON_THROW_ON_ERROR);
$spec = $map['preparation_module'];
$publish = function ($script) use ($root) {
    passthru(escapeshellarg($root . '/scripts/php') . ' ' . escapeshellarg($root . '/scripts/' . $script), $status);
    if ($status !== 0) throw new RuntimeException('Synthetic publisher failed.');
};
$state = function () use ($DB, $course) {
    $hashes = [];
    foreach (['lesson_attempts', 'lesson_grades', 'lesson_branch', 'lesson_timer', 'lesson_answers',
            'course_modules_completion', 'course_completions', 'course_completion_criteria', 'local_orientation_context'] as $table) {
        $hashes[$table] = hash('sha256', serialize($DB->get_records($table, null, 'id')));
    }
    $hashes['modules'] = hash('sha256', serialize($DB->get_records('course_modules', ['course' => $course->id], 'id')));
    $hashes['sections'] = hash('sha256', serialize($DB->get_records('course_sections', ['course' => $course->id], 'id',
        'id,section,name,sequence,summary,component,itemid')));
    return $hashes;
};
$initial = $state();
$initialmodules = $DB->get_records('course_modules', ['course' => $course->id], 'id', 'id,module,instance');
$publish('sync-preparation.php');
$publish('sync-journey.php');
$afterfirst = $state();
unset($initial['modules'], $initial['sections'], $afterfirst['modules'], $afterfirst['sections']);
if ($initial !== $afterfirst) throw new RuntimeException('Initial publication changed learner evidence.');
foreach ($initialmodules as $old) {
    $current = $DB->get_record('course_modules', ['id' => $old->id, 'course' => $course->id], 'id,module,instance', MUST_EXIST);
    if ($old != $current) throw new RuntimeException('Initial publication replaced an existing activity.');
}
if (!(int)$DB->get_field('modules', 'visible', ['name' => 'subsection'], MUST_EXIST)) {
    throw new RuntimeException('Subsection feature must be enabled for learners to see the module.');
}
$before = $state();
$publish('sync-preparation.php');
$publish('sync-journey.php');
if ($before !== $state()) throw new RuntimeException('Repeat publication changed module identity, grouping or evidence.');
$group = $DB->get_record('course_modules', ['course' => $course->id, 'idnumber' => 'orientation:' . $spec['slug']], '*', MUST_EXIST);
$parent = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 1], '*', MUST_EXIST);
$section = $DB->get_record('course_sections', ['course' => $course->id, 'component' => 'mod_subsection', 'itemid' => $group->instance], '*', MUST_EXIST);
if ((int)$group->section !== (int)$parent->id || (int)$group->completion !== 0 ||
        (int)explode(',', $parent->sequence)[0] !== (int)$group->id || $section->name !== $spec['label']) {
    throw new RuntimeException('Preparation must be the first module under Your course, without required completion.');
}
$children = [];
foreach ($spec['children'] as $slug) {
    $child = $DB->get_record('course_modules', ['course' => $course->id, 'idnumber' => 'orientation:' . $slug], '*', MUST_EXIST);
    if ((int)$child->section !== (int)$section->id) throw new RuntimeException('Existing preparation Page is outside its module.');
    $children[] = (int)$child->id;
}
if (array_map('intval', explode(',', $section->sequence)) !== $children) throw new RuntimeException('Preparation Page order differs.');
$intro = $DB->get_record('course_modules', ['course' => $course->id, 'idnumber' => 'orientation:journey'], '*', MUST_EXIST);
if (!str_contains($section->summary, '/mod/page/view.php?id=' . $intro->id . '#course-rationale') ||
        !str_contains($section->summary, 'context store') || !str_contains($section->summary, 'tools evolve')) {
    throw new RuntimeException('Module introduction lacks its rationale link or context portability purpose.');
}
echo "PASS: first module groups the existing Pages in order; rationale link, repeat publication and learner evidence preserved.\n";
