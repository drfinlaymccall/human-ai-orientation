<?php
// Publish the introduction and activities without rewriting completion or lesson evidence.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require __DIR__ . '/moodle-environment.php';
require_once $CFG->dirroot . '/course/lib.php';
require_once $CFG->dirroot . '/course/modlib.php';
require_once $CFG->dirroot . '/mod/page/lib.php';
require_once $CFG->libdir . '/resourcelib.php';
require_once __DIR__ . '/course-module-identity.php';
require_once __DIR__ . '/synthetic-fixture.php';
if ($CFG->wwwroot !== 'https://orientation.finlaymccall.com' && !orientation_is_synthetic_fixture($orientationtrial, $CFG)) {
    throw new RuntimeException('This update targets the existing orientation installation or isolated launch fixture.');
}
$map = json_decode(file_get_contents($root . '/content/course-map.json'), true, 512, JSON_THROW_ON_ERROR);
$welcome = json_decode(file_get_contents($root . '/content/student-welcome.json'), true, 512, JSON_THROW_ON_ERROR);
orientation_validate_baseline($map);
$activities = array_column($map['activities'], null, 'slug');
\core\session\manager::set_user(get_admin());
$course = $DB->get_record('course', ['shortname' => 'AI-ORIENTATION-TRIAL'], '*', MUST_EXIST);
$PAGE->set_course($course);
$PAGE->set_context(context_course::instance($course->id));
$definitions = [
    'journey' => ['Your course journey', 0, 0],
    'first-task' => ['1. Get one useful result', 1, 1],
    'portfolio' => ['2. Build your personal context portfolio', 1, 1],
    'check-and-continue' => ['3. Test, improve and continue', 1, 1],
];
$fragmentpath = fn($slug) => $root . '/content/generated/' . ($slug === 'journey' ? 'introduction' : $slug) . '.html';
$fingerprint = function () use ($DB) {
    $result = [];
    foreach (['lesson_attempts', 'lesson_grades', 'lesson_branch', 'lesson_timer', 'lesson_answers', 'course_modules_completion', 'course_completions', 'course_completion_criteria'] as $table) {
        $result[$table] = hash('sha256', serialize($DB->get_records($table, null, 'id')));
    }
    return $result;
};
$before = $fingerprint();
$transaction = $DB->start_delegated_transaction();
$lessoncm = orientation_existing_module($course, 'useful-context', 'lesson', 'Give your AI useful context', $orientationtrial . '/course.json', 'lesson_cmid');
if (!$lessoncm) throw new RuntimeException('The original context Lesson must exist before publishing.');
set_coursemodule_name($lessoncm->id, $activities['useful-context']['label']);
$ids = [];
$pages = [];
foreach ($definitions as $slug => [$name, $section, $completion]) {
    $content = file_get_contents($fragmentpath($slug));
    if ($content === false) throw new RuntimeException('Run npm run build:journey first.');
    $cm = orientation_existing_module($course, $slug, 'page', $name, $orientationtrial . '/journey.json');
    $page = $cm ? $DB->get_record('page', ['id' => $cm->instance], '*', MUST_EXIST) : null;
    $displayname = $slug === 'journey' ? 'Course introduction' : ($activities[$slug]['label'] ?? $name);
    if (!$page) {
        $module = add_moduleinfo((object)[
            'modulename' => 'page', 'module' => $DB->get_field('modules', 'id', ['name' => 'page'], MUST_EXIST),
            'name' => $displayname, 'idnumber' => 'orientation:' . $slug, 'section' => $section, 'visible' => 1, 'intro' => '', 'introformat' => FORMAT_HTML,
            'content' => $content, 'contentformat' => FORMAT_HTML, 'showdescription' => 0,
            'completion' => $completion, 'display' => RESOURCELIB_DISPLAY_AUTO, 'printintro' => 0, 'printlastmodified' => 0,
        ], $course);
        $page = $DB->get_record('page', ['id' => $module->instance], '*', MUST_EXIST);
    }
    $ids[$slug] = (int)get_coursemodule_from_instance('page', $page->id, $course->id, false, MUST_EXIST)->id;
    set_coursemodule_name($ids[$slug], $displayname);
    $pages[$slug] = $page->id;
}
$localise = function ($html) use ($ids, $lessoncm, $orientationtrial) {
    $links = $ids;
    unset($links['journey']); // The legacy native Page is an introduction; course-map links use the private journey.
    if (file_exists($orientationtrial . '/preparation.json')) $links += json_decode(file_get_contents($orientationtrial . '/preparation.json'), true);
    foreach ($links as $slug => $id) $html = str_replace('href="/' . $slug . '"', 'href="/mod/page/view.php?id=' . $id . '"', $html);
    $html = str_replace('href="/journey"', 'href="/local/orientation/index.php"', $html);
    return str_replace('href="/preview"', 'href="/mod/lesson/view.php?id=' . $lessoncm->id . '"', $html);
};
foreach ($definitions as $slug => [$name, $section, $completion]) {
    $record = $DB->get_record('page', ['id' => $pages[$slug]], '*', MUST_EXIST);
    $html = file_get_contents($fragmentpath($slug));
    if ($completion) $html .= '<p><strong>When you have finished:</strong> use Moodle’s “Mark as done” control. Choose Save to My context to keep your portfolio in Moodle; typing alone keeps a temporary tab draft. Completion records practice, not mastery.</p>';
    if ($slug !== 'journey') $html .= '<nav aria-label="Course navigation"><p><a href="/local/orientation/index.php">Your course journey</a> · <a href="/help">Ask for help</a></p></nav>';
    $html = $localise($html);
    if ($record->content !== $html) {
        $record->instance = $record->id;
        $record->coursemodule = $ids[$slug];
        $record->page = ['text' => $html, 'format' => FORMAT_HTML, 'itemid' => 0];
        $record->printintro = 0; $record->printlastmodified = 0;
        page_update_instance($record, null);
    }
}
$firstsection = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 0], '*', MUST_EXIST);
$firstcm = explode(',', $firstsection->sequence)[0] ?: null;
if ((int)$firstcm !== $ids['journey']) moveto_module($DB->get_record('course_modules', ['id' => $ids['journey']]), $firstsection, $firstcm);
$section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 1], '*', MUST_EXIST);
// Put activities before the existing optional deeper-courses resource, in teaching order.
$optional = orientation_existing_module($course, 'deeper-courses', 'page', 'Go deeper: courses and videos', $orientationtrial . '/preparation.json');
$beforemod = $optional ? $optional->id : null;
foreach ([$ids['first-task'], $lessoncm->id, $ids['portfolio'], $ids['check-and-continue']] as $cmid) {
    moveto_module($DB->get_record('course_modules', ['id' => $cmid]), $section, $beforemod);
}
course_update_section($course, $section, (object)['name' => 'Your course', 'summaryformat' => FORMAT_HTML,
    'summary' => '<p>Choose and try a useful task, give context and build your portfolio, then check and continue. Mark the new activities done yourself. The original context lesson retains its own saved progress and reflection.</p><p><a href="/local/orientation/index.php">Open your course journey</a></p>']);
$DB->set_field('course', 'summary', '<p>' . s($welcome['rationale']) . '</p><p>Three practical activities with a portfolio extension · roughly 70–95 minutes · optional preparation · bring your own AI or use fictional examples.</p>', ['id' => $course->id]);
if ($before !== $fingerprint()) throw new RuntimeException('Existing learner evidence changed; rolling back.');
$transaction->allow_commit();
$footer = get_config('core', 'additionalhtmlfooter') ?: '';
$assets = '<!-- orientation-portfolio --><link rel="stylesheet" href="/assets/portfolio.css"><script src="/assets/portfolio.js" defer></script><!-- /orientation-portfolio -->';
if (strpos($footer, '<!-- orientation-portfolio -->') === false) set_config('additionalhtmlfooter', $footer . "\n" . $assets);
rebuild_course_cache($course->id, true);
$manifest = json_encode($ids, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
$manifestpath = $orientationtrial . '/journey.json';
$temporary = tempnam(dirname($manifestpath), '.journey-');
if ($temporary === false) throw new RuntimeException('Course published, but module manifest could not be prepared; rerun sync.');
try {
    if (!chmod($temporary, 0600) || file_put_contents($temporary, $manifest, LOCK_EX) !== strlen($manifest) || !rename($temporary, $manifestpath)) {
        throw new RuntimeException('Course published, but module manifest could not be saved; rerun sync.');
    }
} finally {
    if (file_exists($temporary)) unlink($temporary);
}
echo 'Journey published; existing evidence unchanged. Module IDs: ' . json_encode($ids) . "\n";
