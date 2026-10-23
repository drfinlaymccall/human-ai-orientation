<?php
// Publish preparation resources and explanatory lesson edits. Preserve attempts and answers.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require __DIR__ . '/moodle-environment.php';
require_once $CFG->dirroot . '/course/lib.php';
require_once $CFG->dirroot . '/course/modlib.php';
require_once $CFG->dirroot . '/mod/page/lib.php';
require_once $CFG->libdir . '/resourcelib.php';
if (!in_array($CFG->wwwroot, ['https://orientation.finlaymccall.com', 'http://127.0.0.1:18802'], true)) {
    throw new RuntimeException('This update targets the existing public orientation trial.');
}
\core\session\manager::set_user(get_admin());
$course = $DB->get_record('course', ['shortname' => 'AI-ORIENTATION-TRIAL'], '*', MUST_EXIST);
$PAGE->set_course($course);
$PAGE->set_context(context_course::instance($course->id));
$spec = json_decode(file_get_contents($root . '/content/useful-context.json'), true, 512, JSON_THROW_ON_ERROR);
$lesson = $DB->get_record('lesson', ['course' => $course->id, 'name' => $spec['title']], '*', MUST_EXIST);
$lessoncm = get_coursemodule_from_instance('lesson', $lesson->id, $course->id, false, MUST_EXIST);
$definitions = [
    'deeper-courses' => ['source' => 'deeper-courses', 'name' => 'Go deeper: courses and videos', 'section' => 1,
        'intro' => 'Optional courses and short videos: choose one question to explore, then bring an idea back to your own task.'],
    'before-you-start' => ['source' => 'computer-basics', 'name' => 'Start here: files and folders',
        'intro' => '10–15 minutes of computer basics, then 10–15 minutes exploring AI inputs and giving instructions. Already familiar? Use the self-check and move on.'],
    'notes' => ['source' => 'notes-guide', 'name' => 'Finlay’s guide: set up your notes with Obsidian',
        'intro' => 'Optional, about 10 minutes. Give your context portfolio a home in a folder you can find again.'],
];
// Fingerprints stay in memory: no learner details are printed or exported.
$state = function () use ($DB) {
    $result = [];
    foreach (['lesson_attempts', 'lesson_grades', 'lesson_branch', 'lesson_timer', 'lesson_answers', 'course_modules_completion'] as $table) {
        $result[$table] = hash('sha256', serialize($DB->get_records($table, null, 'id')));
    }
    return $result;
};
$before = $state();
$transaction = $DB->start_delegated_transaction();
$resources = [];
foreach ($definitions as $slug => $definition) {
    $existing = $DB->get_record('page', ['course' => $course->id, 'name' => $definition['name']]);
    if (!$existing) {
        $module = add_moduleinfo((object)[
            'modulename' => 'page', 'module' => $DB->get_field('modules', 'id', ['name' => 'page'], MUST_EXIST),
            'name' => $definition['name'], 'section' => $definition['section'] ?? 0, 'visible' => 1,
            'intro' => '<p>' . $definition['intro'] . '</p>', 'introformat' => FORMAT_HTML,
            'content' => file_get_contents($root . '/content/' . $definition['source'] . '.html'),
            'contentformat' => FORMAT_HTML, 'showdescription' => 1,
            'completion' => COMPLETION_TRACKING_NONE, 'display' => RESOURCELIB_DISPLAY_AUTO,
            'printintro' => 0, 'printlastmodified' => 0,
        ], $course);
        $existing = $DB->get_record('page', ['id' => $module->instance], '*', MUST_EXIST);
    }
    $cm = get_coursemodule_from_instance('page', $existing->id, $course->id, false, MUST_EXIST);
    $resources[$slug] = ['record' => $existing, 'cmid' => (int)$cm->id];
}
$briefpageid = $DB->get_field('lesson_pages', 'id', ['lessonid' => $lesson->id, 'title' => $spec['pages'][2]['title']], MUST_EXIST);
$localise = function ($html) use ($resources, $lessoncm, $briefpageid, $root) {
    $html = str_replace('<!-- course-licence -->', file_get_contents($root . '/content/licence-notice.html'), $html);
    $html = str_replace('<!-- ai-interface -->', file_get_contents($root . '/content/ai-interface.html'), $html);
    $html = str_replace('<!-- free-tools-table -->', file_get_contents($root . '/content/free-tools-table.html'), $html);
    $html = str_replace('<!-- computer-controls -->', file_get_contents($root . '/content/computer-controls.html'), $html);
    $html = str_replace('href="/preview#page-2"', 'href="/mod/lesson/view.php?id=' . $lessoncm->id . '&amp;pageid=' . $briefpageid . '"', $html);
    foreach ($resources as $slug => $resource) {
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
    $html = file_get_contents($root . '/content/' . $definition['source'] . '.html');
    if ($slug !== 'deeper-courses') { $html .= '<p><a href="/deeper-courses">Go deeper: courses and videos</a></p>'; }
    $html .= '<p><a href="/preview">Continue to the AI lesson</a> · <a href="/course/view.php?id=' . $course->id . '">Return to the course</a></p>';
    $record->page = ['text' => $localise($html), 'format' => FORMAT_HTML, 'itemid' => 0];
    if ($record->content !== $record->page['text'] || $resources[$slug]['record']->intro !== $record->intro) {
        page_update_instance($record, null);
    }
}
// These pages are explanatory content; keep IDs, order, branching and all answers unchanged.
foreach (array_slice($spec['pages'], 0, 4) as $item) {
    $page = $DB->get_record('lesson_pages', ['lessonid' => $lesson->id, 'title' => $item['title']], '*', MUST_EXIST);
    if ((int)$page->qtype !== 20) {
        throw new RuntimeException('Expected an explanatory lesson page.');
    }
    $html = $localise($item['html']);
    if ($page->contents !== $html) {
        $DB->update_record('lesson_pages', (object)['id' => $page->id, 'contents' => $html, 'timemodified' => time()]);
    }
}
$section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 0], '*', MUST_EXIST);
course_update_section($course, $section, (object)[
    'name' => 'Before the AI lesson', 'summaryformat' => FORMAT_HTML,
    'summary' => '<p>Start with a quick files-and-folders check. Practise anything unfamiliar, then set up your notes if useful. Then explore text, voice, files and pictures with your AI. These preparation pages are self-guided; answers are not submitted or graded.</p>',
]);
if (!$DB->record_exists('page', ['course' => $course->id, 'name' => 'Your course journey'])) $DB->set_field('course', 'summary', '<p>Find your way around files and notes, then choose useful context, try it with your own AI and keep guidance you can reuse.</p><p>Early prototype · 20–30-minute preparation · optional notes setup · one 25–35-minute AI lesson.</p>', ['id' => $course->id]);
if ($before !== $state()) {
    throw new RuntimeException('Learner records or lesson answers changed; rolling back.');
}
$transaction->allow_commit();
rebuild_course_cache($course->id, true);
// Moodle's supported additional-HTML setting loads a narrowly scoped enhancement.
// Preserve unrelated footer content; editors initialise only their own widgets.
$footer = get_config('core', 'additionalhtmlfooter') ?: '';
$assets = '<!-- orientation-context-brief --><link rel="stylesheet" href="/assets/context-brief.css"><script src="/assets/context-brief.js" defer></script><script src="/assets/context-try.js" defer></script><link rel="stylesheet" href="/assets/ai-interface.css"><script src="/assets/ai-interface.js" defer></script><!-- /orientation-context-brief -->';
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
