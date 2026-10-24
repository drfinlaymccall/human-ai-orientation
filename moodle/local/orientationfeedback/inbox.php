<?php
require_once(__DIR__ . '/../../config.php');
use local_orientationfeedback\service;
require_login();
require_capability('local/orientationfeedback:review', context_system::instance());
$page = max(0, optional_param('page', 0, PARAM_INT));
$PAGE->set_url('/local/orientationfeedback/inbox.php', ['page' => $page]);
$PAGE->set_context(context_system::instance());
$PAGE->set_title(get_string('inbox', 'local_orientationfeedback'));
$PAGE->set_heading(get_string('inbox', 'local_orientationfeedback'));
echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('inbox', 'local_orientationfeedback'));
echo html_writer::tag('p', get_string('inboxintro', 'local_orientationfeedback'));
$total = $DB->count_records('local_orientationfeedback');
$records = $DB->get_records('local_orientationfeedback', null, 'timecreated DESC, id DESC', '*', $page * 20, 20);
$authors = [];
$courses = [];
foreach ($records as $record) {
    if (!array_key_exists($record->userid, $authors)) {
        $authors[$record->userid] = core_user::get_user($record->userid);
    }
    $author = $authors[$record->userid];
    echo html_writer::start_tag('article', ['class' => 'card card-body mb-3']);
    echo html_writer::tag('h2', s($author ? fullname($author) : get_string('deleteduser', 'local_orientationfeedback')) . ' — ' . s(userdate($record->timecreated)), ['class' => 'h5']);
    if (!array_key_exists($record->courseid, $courses)) {
        $courses[$record->courseid] = $DB->get_record('course', ['id' => $record->courseid]);
    }
    $course = $courses[$record->courseid];
    $contexturl = new moodle_url('/course/view.php', ['id' => $record->courseid]);
    $contextlabel = $course ? $course->fullname : get_string('deletedcourse', 'local_orientationfeedback');
    if ($record->cmid && $course) {
        $cm = get_fast_modinfo($course)->get_cms()[$record->cmid] ?? null;
        if ($cm) { $contexturl = new moodle_url('/mod/' . $cm->modname . '/view.php', ['id' => $cm->id]); $contextlabel .= ' / ' . $cm->name; }
    }
    echo html_writer::tag('p', html_writer::link($contexturl, s($contextlabel)) . ' ' . s($record->source) . ' ' . s($record->sectionlabel));
    echo html_writer::tag('p', s($record->message), ['style' => 'white-space:pre-wrap']);
    if ($record->filename && $course) {
        echo html_writer::tag('audio', '', ['controls' => 'controls', 'preload' => 'none', 'src' => service::audio_url($record)->out(false)]);
    }
    echo html_writer::tag('p', get_string('notificationstatus', 'local_orientationfeedback') . ' ' . s($record->notificationstate));
    echo html_writer::end_tag('article');
}
echo $OUTPUT->paging_bar($total, $page, 20, $PAGE->url);
echo $OUTPUT->footer();
