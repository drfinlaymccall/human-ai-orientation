<?php
require_once(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/completionlib.php');
$activities = \local_orientation\catalogue::modules();
$iscatalogue = optional_param('view', '', PARAM_ALPHA) === 'catalogue';
$module = optional_param('module', '', PARAM_ALPHANUMEXT);
if ($module !== '' && !isset($activities[$module])) throw new moodle_exception('invalidparameter');
// Confirmation Continue is a native POST. Canonicalise before require_login saves its destination.
if ($_SERVER['REQUEST_METHOD'] === 'POST') redirect(new moodle_url('/local/orientation/index.php', $module ? ['module' => $module] : ($iscatalogue ? ['view' => 'catalogue'] : [])));
$course = \local_orientation\catalogue::course();
$context = context_course::instance($course->id);
$PAGE->set_url('/local/orientation/index.php', $module ? ['module' => $module] : ($iscatalogue ? ['view' => 'catalogue'] : []));
require_login($course, false);
require_capability('local/orientation:view', $context);
if (isguestuser() || (!is_enrolled($context, $USER, '', true) && !has_capability('moodle/course:update', $context))) {
    throw new required_capability_exception($context, 'moodle/course:view', 'nopermissions', '');
}
$PAGE->set_context($context);
$PAGE->set_course($course);
$PAGE->set_pagelayout('incourse');
$PAGE->set_show_course_index(false);
$title = $iscatalogue ? 'Course catalogue' : 'Unit 1: Human–AI Orientation — journey';
$PAGE->set_title($title);
$PAGE->set_heading($title);
$PAGE->set_cacheable(false);
$PAGE->requires->css(new moodle_url('/local/orientation/activity-atlas.css'));
$PAGE->requires->js(new moodle_url('/local/orientation/activity-atlas.js'));
$PAGE->requires->js(new moodle_url('/local/orientation/journey.js'));
$PAGE->set_primary_active_tab('orientation-journey');
$modinfo = get_fast_modinfo($course, $USER->id);
$completion = new completion_info($course);
$rows = [];
foreach ($activities as $slug => $activity) {
    $record = \local_orientation\catalogue::cm($course, $activity);
    $cm = $record && isset($modinfo->cms[$record->id]) ? $modinfo->cms[$record->id] : null;
    if (!$cm || !$cm->uservisible || !$cm->url) continue;
    $state = $cm->completion ? (int)$completion->get_data($cm, false, $USER->id)->completionstate : null;
    $rows[$slug] = ['activity' => $activity, 'cm' => $cm, 'complete' => in_array($state, [COMPLETION_COMPLETE, COMPLETION_COMPLETE_PASS, COMPLETION_COMPLETE_FAIL], true), 'state' => $state,
        'started' => $activity['module_type'] === 'lesson' && $DB->record_exists('lesson_timer', ['lessonid' => $cm->instance, 'userid' => $USER->id])];
}
if ($module !== '') {
    if (!isset($rows[$module])) throw new moodle_exception('activityiscurrentlyhidden');
    redirect($rows[$module]['cm']->url);
}
header('Cache-Control: private, no-store');
echo $OUTPUT->header();
if ($iscatalogue) {
    echo '<span data-context-panel-disabled hidden></span>';
    echo \local_orientation\catalogue::syllabus();
    echo $OUTPUT->footer();
    exit;
}
echo '<p><a href="/local/orientation/index.php?view=catalogue">Course catalogue</a></p>';

echo html_writer::start_tag('div', ['data-private-journey' => '']);
$welcome = \local_orientation\welcome::data();
echo html_writer::start_tag('details', ['data-course-welcome' => '', 'class' => 'mb-4']);
echo html_writer::tag('summary', 'Welcome / Start here');
echo html_writer::tag('h2', 'Learn to team with AI.');
echo html_writer::tag('p', s($welcome['rationale']));
echo html_writer::tag('p', s($welcome['introduction']));
echo html_writer::tag('p', 'Your course journey is your home base. Choose Continue below to open your first unfinished core activity, or choose any available activity. The starting-point check and familiar-skills practice are optional. Files and notes are regular Unit 1 modules. Allow roughly 70–95 minutes, split into sessions that suit you.');
echo html_writer::start_tag('details', ['data-course-objectives' => '']);
echo html_writer::tag('summary', "What you'll practise");
echo html_writer::tag('p', 'By the end, you will have practised how to:');
echo html_writer::start_tag('ul');
foreach ($welcome['objectives'] as $objective) {
    echo html_writer::tag('li', s($objective));
}
echo html_writer::end_tag('ul');
echo html_writer::tag('p', 'These are practice goals, not a graded assessment.');
echo html_writer::end_tag('details');
echo html_writer::tag('p', 'When signed in, choose Save to My context to keep your documents and private practice notes in Moodle. Open My context to edit and copy them later. Editing alone keeps a temporary tab draft. Saved documents, activity progress and submitted reflections are separate records.');
echo html_writer::tag('p', 'Use your own AI; a free tool is enough and fictional examples are available. Share or paste only relevant, reviewed text. Saving in Moodle does not give your AI automatic access.');
$welcomelinks = [];
foreach ($welcome['links'] as $link) {
    $welcomelinks[] = html_writer::link(new moodle_url($link['path']), s($link['label']));
}
echo html_writer::tag('p', implode(' · ', $welcomelinks));
echo html_writer::end_tag('details');
echo html_writer::tag('p', 'Your signed-in Moodle account saves activity practice progress. Completion records practice, not mastery or a graded assessment.');
$next = null;
foreach ($activities as $slug => $activity) {
    if ($activity['baseline'] && (!isset($rows[$slug]) || !$rows[$slug]['complete'])) {
        $next = isset($rows[$slug]) ? $slug : false;
        break;
    }
}
if (is_string($next)) {
    echo html_writer::tag('p', html_writer::link($rows[$next]['cm']->url, 'Continue: ' . s($activities[$next]['label']), ['class' => 'btn btn-primary']));
    echo html_writer::tag('p', 'This suggests your first unfinished core activity. You can choose any available activity below. The context Lesson offers its own resume choice when you return.');
} else if ($next === null) {
    echo html_writer::tag('p', 'Your three core activities are recorded as complete. Revisit any activity or try optional practice. This is activity progress, not a claim of course mastery.');
} else {
    echo html_writer::tag('p', 'A core activity is currently unavailable. Your existing records are retained; choose an available activity or ask Finlay for help.');
}
echo \local_orientation\startingpoint::render($rows);
echo \local_orientation\catalogue::syllabus($rows, true);
echo \local_orientation\atlas::render($rows, $course, $modinfo);
echo html_writer::tag('h2', 'Keep and reuse your context');
echo html_writer::tag('p', 'Choose Save to My context in the portfolio to keep its documents and private practice notes in Moodle. Editing alone keeps a temporary tab draft. Open My context to edit your saved words, copy them, or download a Markdown file.');
echo html_writer::tag('p', html_writer::link(new moodle_url('/local/orientation/workspace.php'), 'Open My context', ['class' => 'btn btn-primary']));
echo html_writer::tag('p', 'These are the current published versions. Existing completion stays recorded after updates; this view does not claim which version you previously read. New optional practice does not change the original three core activities.');
echo html_writer::tag('p', html_writer::link(new moodle_url('/help'), 'Ask Finlay for help') . ' · ' . html_writer::link(new moodle_url('/journey'), 'Public course journey'));
echo html_writer::end_tag('div');
echo $OUTPUT->footer();
