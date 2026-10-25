<?php
// Publish preparation resources and explanatory lesson edits. Preserve attempts and answers.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require __DIR__ . '/moodle-environment.php';
require_once $CFG->dirroot . '/course/lib.php';
require_once $CFG->dirroot . '/course/modlib.php';
require_once $CFG->dirroot . '/mod/page/lib.php';
require_once $CFG->dirroot . '/mod/subsection/lib.php';
require_once $CFG->libdir . '/resourcelib.php';
require_once __DIR__ . '/course-module-identity.php';
require_once __DIR__ . '/course-unit-structure.php';
require_once __DIR__ . '/synthetic-fixture.php';
if ($CFG->wwwroot !== 'https://orientation.finlaymccall.com' && !orientation_is_synthetic_fixture($orientationtrial, $CFG)) {
    throw new RuntimeException('This update targets the existing public orientation trial.');
}
\core\session\manager::set_user(get_admin());
$course = $DB->get_record('course', ['shortname' => 'AI-ORIENTATION-TRIAL'], '*', MUST_EXIST);
$PAGE->set_course($course);
$PAGE->set_context(context_course::instance($course->id));
$spec = json_decode(file_get_contents($root . '/content/useful-context.json'), true, 512, JSON_THROW_ON_ERROR);
$map = json_decode(file_get_contents($root . '/content/course-map.json'), true, 512, JSON_THROW_ON_ERROR);
orientation_validate_baseline($map);

$definitions = [
    'desktop-workspace' => ['name' => 'Desktop AI workspace', 'section' => 1,
        'intro' => 'Unit 1 module. Practice for familiar skills is optional.'],
    'deeper-courses' => ['name' => 'Go deeper: courses and videos', 'section' => 1,
        'intro' => 'Optional courses and short videos: choose one question to explore, then bring an idea back to your own task.'],
    'before-you-start' => ['name' => 'Start here: files and folders',
        'intro' => 'Unit 1 module. Practise saving, finding and reopening a file. If familiar, use the self-check and move on.'],
    'notes' => ['name' => 'Finlay’s guide: set up your notes with Obsidian',
        'intro' => 'Unit 1 module. Give your context notes a home you can find again. Practice for familiar skills is optional.'],
];
$compiled = [];
foreach ($definitions as $slug => $definition) {
    $path = $root . '/content/generated/' . $slug . '.html';
    if (!is_file($path) || ($compiled[$slug] = file_get_contents($path)) === false) {
        throw new RuntimeException('Build preparation fragments before publication.');
    }
}
// Fingerprints stay in memory: no learner details are printed or exported.
$state = function () use ($DB) {
    $result = [];
    foreach (['lesson_attempts', 'lesson_grades', 'lesson_branch', 'lesson_timer', 'lesson_answers', 'course_modules_completion', 'course_completions', 'course_completion_criteria'] as $table) {
        $result[$table] = hash('sha256', serialize($DB->get_records($table, null, 'id')));
    }
    return $result;
};
$before = $state();
$transaction = $DB->start_delegated_transaction();
if (!array_key_exists('subsection', \core_plugin_manager::instance()->get_enabled_plugins('mod'))) {
    $subsectionid = $DB->get_field('modules', 'id', ['name' => 'subsection'], MUST_EXIST);
    if ($DB->record_exists_select('course_modules', 'module = ? AND course <> ?', [$subsectionid, $course->id])) {
        throw new RuntimeException('Enabling subsections would affect another course; review that installation first.');
    }
    if (!\core\plugininfo\mod::enable_plugin('subsection', 1)) throw new RuntimeException('Subsections could not be enabled.');
}
$lessoncm = orientation_existing_module($course, 'useful-context', 'lesson', $spec['title'], $orientationtrial . '/course.json', 'lesson_cmid');
if (!$lessoncm) throw new RuntimeException('Original context Lesson required.');
$lesson = $DB->get_record('lesson', ['id' => $lessoncm->instance], '*', MUST_EXIST);
$activities = array_column($map['activities'], null, 'slug');
$resources = [];
foreach ($definitions as $slug => $definition) {
    $adopted = orientation_existing_module($course, $slug, 'page', $definition['name'], $orientationtrial . '/preparation.json');
    $existing = $adopted ? $DB->get_record('page', ['id' => $adopted->instance], '*', MUST_EXIST) : null;
    if (!$existing) {
        $module = add_moduleinfo((object)[
            'modulename' => 'page', 'module' => $DB->get_field('modules', 'id', ['name' => 'page'], MUST_EXIST),
            'name' => $definition['name'], 'cmidnumber' => 'orientation:' . $slug, 'section' => $definition['section'] ?? 0, 'visible' => 1,
            'intro' => '<p>' . $definition['intro'] . '</p>', 'introformat' => FORMAT_HTML,
            'content' => $compiled[$slug],
            'contentformat' => FORMAT_HTML, 'showdescription' => 1,
            'completion' => COMPLETION_TRACKING_NONE, 'display' => RESOURCELIB_DISPLAY_AUTO,
            'printintro' => 0, 'printlastmodified' => 0,
        ], $course);
        $existing = $DB->get_record('page', ['id' => $module->instance], '*', MUST_EXIST);
    }
    $cm = get_coursemodule_from_instance('page', $existing->id, $course->id, false, MUST_EXIST);
    if (isset($activities[$slug])) {
        set_coursemodule_name($cm->id, $activities[$slug]['label']);
        $existing->name = $activities[$slug]['label'];
    }
    $resources[$slug] = ['record' => $existing, 'cmid' => (int)$cm->id];
}
$briefpageid = $DB->get_field('lesson_pages', 'id', ['lessonid' => $lesson->id, 'title' => $spec['pages'][2]['title']], MUST_EXIST);
$journeycm = orientation_existing_module($course, 'journey', 'page', 'Your course journey', $orientationtrial . '/journey.json');
$localise = function ($html) use ($resources, $lessoncm, $briefpageid, $root, $journeycm) {
    $html = str_replace('href="/journey#course-rationale"',
        'href="' . ($journeycm ? '/mod/page/view.php?id=' . $journeycm->id . '#course-rationale' : '/journey') . '"', $html);
    $html = str_replace('<!-- course-licence -->', file_get_contents($root . '/content/licence-notice.html'), $html);
    $html = str_replace('<!-- ai-interface -->', file_get_contents($root . '/content/ai-interface.html'), $html);
    $html = str_replace('<!-- free-tools-table -->', file_get_contents($root . '/content/free-tools-table.html'), $html);
    $html = str_replace('<!-- computer-controls -->', file_get_contents($root . '/content/computer-controls.html'), $html);
    $html = str_replace('href="/preview#page-2"', 'href="/mod/lesson/view.php?id=' . $lessoncm->id . '&amp;pageid=' . $briefpageid . '"', $html);
    foreach ($resources as $slug => $resource) {
        $html = str_replace('href="/' . $slug . '#', 'href="/mod/page/view.php?id=' . $resource['cmid'] . '#', $html);
        $html = str_replace('href="/' . $slug . '"', 'href="/mod/page/view.php?id=' . $resource['cmid'] . '"', $html);
    }
    return str_replace('href="/preview"', 'href="/mod/lesson/view.php?id=' . $lessoncm->id . '"', $html);
};
foreach ($definitions as $slug => $definition) {
    $record = clone $resources[$slug]['record'];
    $record->instance = $record->id;
    $record->intro = '<p>' . $definition['intro'] . '</p>';
    $record->introformat = FORMAT_HTML;
    $record->coursemodule = $resources[$slug]['cmid'];
    $record->printintro = 0;
    $record->printlastmodified = 0;
    $html = $compiled[$slug];
    if ($slug === 'before-you-start') $html .= '<p>Next module: <a href="/notes">Set up your notes and context store</a>.</p>';
    if ($slug !== 'deeper-courses') { $html .= '<p><a href="/deeper-courses">Go deeper: courses and videos</a></p>'; }
    $html .= '<p><a href="/preview">Continue to the AI lesson</a> · <a href="/course/view.php?id=' . $course->id . '">Return to the course</a></p>';
    $record->page = ['text' => $localise($html), 'format' => FORMAT_HTML, 'itemid' => 0];
    if ($record->content !== $record->page['text'] || $resources[$slug]['record']->intro !== $record->intro) {
        page_update_instance($record, null);
    }
}
orientation_publish_structure($course, $map);
// Update authored content and reflection guidance; preserve question types, IDs,
// ordering, branching and every answer/attempt, including existing essays.
foreach ([0, 1, 2, 3, 6] as $index) {
    $item = $spec['pages'][$index];
    $page = $DB->get_record('lesson_pages', ['lessonid' => $lesson->id, 'title' => $item['title']], '*', MUST_EXIST);
    if ((int)$page->qtype !== ($item['type'] === 'essay' ? 10 : 20)) {
        throw new RuntimeException('Unexpected lesson page type; preserve its question and answers.');
    }
    $html = $localise($item['html']);
    if ($page->contents !== $html) {
        $DB->update_record('lesson_pages', (object)['id' => $page->id, 'contents' => $html, 'timemodified' => time()]);
    }
}
// The journey publisher owns the full-course introduction once it exists.
// Keep only the bootstrap summary for installations that have preparation alone.
if (!$DB->record_exists('course_modules', ['course' => $course->id, 'idnumber' => 'orientation:journey'])) {
    $section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 0], '*', MUST_EXIST);
    course_update_section($course, $section, (object)[
        'name' => 'Introduction', 'summaryformat' => FORMAT_HTML,
        'summary' => '<p>Use the course overview to choose any activity. Optional preparation offers a files-and-folders check, notes setup and ways to give your AI input. Practise anything unfamiliar or go straight to a core activity. These preparation pages are self-guided; answers are not submitted or graded.</p>',
    ]);
    $DB->set_field('course', 'summary', '<p>Find your way around files and notes, then choose useful context, try it with your own AI and keep guidance you can reuse.</p><p>Early prototype · 20–30-minute preparation · optional notes setup · one 25–35-minute AI lesson.</p>', ['id' => $course->id]);
}
if ($before !== $state()) {
    throw new RuntimeException('Learner records or lesson answers changed; rolling back.');
}
$transaction->allow_commit();
rebuild_course_cache($course->id, true);
// Moodle's supported additional-HTML setting loads a narrowly scoped enhancement.
// Preserve unrelated footer content; editors initialise only their own widgets.
$footer = get_config('core', 'additionalhtmlfooter') ?: '';
$assets = '<!-- orientation-context-brief --><link rel="stylesheet" href="/assets/context-brief.css"><script src="/assets/context-brief.js" defer></script><script src="/assets/context-try.js" defer></script><link rel="stylesheet" href="/assets/ai-interface.css"><script src="/assets/ai-interface.js" defer></script><link rel="stylesheet" href="/assets/finlay-tips.css"><script src="/assets/finlay-tips.js" defer></script><!-- /orientation-context-brief -->';
$assets = str_replace('<!-- /orientation-context-brief -->', '<p class="small">Original course materials © 2026 Finlay McCall · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a> · <a href="/mod/page/view.php?id=' . $resources['deeper-courses']['cmid'] . '#course-licence">Scope and attribution</a>. Third-party materials retain their own licences.</p><!-- /orientation-context-brief -->', $assets);
$updatedfooter = strpos($footer, '<!-- orientation-context-brief -->') === false
    ? $footer . "\n" . $assets
    : preg_replace('~<!-- orientation-context-brief -->.*?<!-- /orientation-context-brief -->~s', $assets, $footer);
if ($updatedfooter !== $footer) { set_config('additionalhtmlfooter', $updatedfooter); }
$scss = get_config('theme_boost', 'scss');
$extra = '\n/* orientation-preparation */ #page-mod-page-view #region-main { max-width: 52rem; margin: auto; line-height: 1.7; } #page-mod-page-view pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #edf4f1; padding: 1rem; } #page-mod-page-view code { overflow-wrap: anywhere; } .finlay-tip { padding: .6rem 1.3rem; margin: 2rem 0; border-left: 4px solid #176b60; background: #edf4f1; } #page-mod-page-view details { margin: 1rem 0; padding: .75rem; border: 1px solid #b7c9c2; } #page-mod-page-view summary { cursor: pointer; font-weight: 600; }';
if (strpos($scss, '/* orientation-preparation */') === false) {
    set_config('scss', $scss . "\n" . substr($extra, 2), 'theme_boost');
    theme_reset_all_caches();
}
$manifest = array_map(fn($resource) => $resource['cmid'], $resources);
file_put_contents($orientationtrial . '/preparation.json', json_encode($manifest, JSON_PRETTY_PRINT));
echo 'Preparation published. Learner records and lesson answers unchanged. Module IDs: ' . json_encode($manifest) . "\n";
