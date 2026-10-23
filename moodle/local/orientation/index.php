<?php
require_once(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/completionlib.php');
$activities = \local_orientation\catalogue::modules();
$module = optional_param('module', '', PARAM_ALPHANUMEXT);
if ($module !== '' && !isset($activities[$module])) throw new moodle_exception('invalidparameter');
// Confirmation Continue is a native POST. Canonicalise before require_login saves its destination.
if ($_SERVER['REQUEST_METHOD'] === 'POST') redirect(new moodle_url('/local/orientation/index.php', $module ? ['module' => $module] : []));
$course = \local_orientation\catalogue::course();
$context = context_course::instance($course->id);
$PAGE->set_url('/local/orientation/index.php', $module ? ['module' => $module] : []);
require_login($course, false);
require_capability('local/orientation:view', $context);
if (isguestuser() || (!is_enrolled($context, $USER, '', true) && !has_capability('moodle/course:update', $context))) {
    throw new required_capability_exception($context, 'moodle/course:view', 'nopermissions', '');
}
$PAGE->set_context($context);
$PAGE->set_course($course);
$PAGE->set_pagelayout('incourse');
$PAGE->set_title('My orientation progress');
$PAGE->set_heading('My orientation progress');
$PAGE->set_cacheable(false);
$modinfo = get_fast_modinfo($course, $USER->id);
$completion = new completion_info($course);
$rows = [];
foreach ($activities as $slug => $activity) {
    $record = \local_orientation\catalogue::cm($course, $activity);
    $cm = $record && isset($modinfo->cms[$record->id]) ? $modinfo->cms[$record->id] : null;
    if (!$cm || !$cm->uservisible || !$cm->url) continue;
    $state = $cm->completion ? (int)$completion->get_data($cm, false, $USER->id)->completionstate : null;
    $rows[$slug] = ['activity' => $activity, 'cm' => $cm, 'complete' => in_array($state, [COMPLETION_COMPLETE, COMPLETION_COMPLETE_PASS, COMPLETION_COMPLETE_FAIL], true), 'state' => $state];
}
if ($module !== '') {
    if (!isset($rows[$module])) throw new moodle_exception('activityiscurrentlyhidden');
    redirect($rows[$module]['cm']->url);
}
header('Cache-Control: private, no-store');
echo $OUTPUT->header();
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
echo html_writer::start_tag('ul');
foreach ($rows as $row) {
    $a = $row['activity'];
    $state = $row['state'] === null ? 'No completion tracking' : ($row['complete'] ? 'Complete' : 'Not yet complete');
    echo html_writer::start_tag('li');
    echo html_writer::tag('h2', html_writer::link($row['cm']->url, s($a['label'])));
    echo html_writer::tag('p', s($state . ' · ' . ($a['baseline'] ? 'Core activity' : (($a['role'] ?? '') === 'portfolio-bridge' ? 'Portfolio practice within activity 2' : 'Optional preparation'))));
    echo html_writer::tag('p', s(implode(' ', $a['outcomes'])));
    echo html_writer::tag('p', s('Current version ' . $a['version'] . ' · Updated ' . $a['updated_at'] . '. ' . $a['update_note']));
    if ((int)$row['cm']->completion === COMPLETION_TRACKING_MANUAL) echo html_writer::tag('p', 'After doing the practical task, use Moodle’s Mark as done control on the activity. Opening a Page does not mark it complete.');
    if ($a['module_type'] === 'lesson') echo html_writer::tag('p', 'The Lesson saves its own progress and reflection. Open it to continue or revisit using its native resume choice.');
    foreach ($a['support_links'] ?? [] as $link) {
        $support = \local_orientation\catalogue::cm($course, ['idnumber' => 'orientation:' . $link['slug'], 'module_type' => 'page']);
        if ($support && isset($modinfo->cms[$support->id]) && $modinfo->cms[$support->id]->uservisible) {
            echo html_writer::tag('p', html_writer::link($modinfo->cms[$support->id]->url, s($link['label'])));
        }
    }
    echo html_writer::end_tag('li');
}
echo html_writer::end_tag('ul');
echo html_writer::tag('h2', 'Keep and reuse your context');
echo html_writer::tag('p', 'Choose Save to My context in the portfolio to keep its documents and private practice notes in Moodle. Editing alone keeps a temporary tab draft. Open My context to edit your saved words, copy them, or download a Markdown file.');
echo html_writer::tag('p', html_writer::link(new moodle_url('/local/orientation/workspace.php'), 'Open My context', ['class' => 'btn btn-primary']));
echo html_writer::tag('p', 'These are the current published versions. Existing completion stays recorded after updates; this view does not claim which version you previously read. New optional practice does not change the original three core activities.');
echo html_writer::tag('p', html_writer::link(new moodle_url('/help'), 'Ask Finlay for help') . ' · ' . html_writer::link(new moodle_url('/journey'), 'Public course journey'));
echo $OUTPUT->footer();
