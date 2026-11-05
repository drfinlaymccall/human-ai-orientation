<?php
require_once(__DIR__ . '/../../config.php');
// Native confirmation Continue is POST; preserve a canonical protected destination through login/enrolment.
if ($_SERVER['REQUEST_METHOD'] === 'POST') redirect(new moodle_url('/local/orientation/startingpoint.php'));
$course = \local_orientation\catalogue::course();
$context = context_course::instance($course->id);
$PAGE->set_url('/local/orientation/startingpoint.php');
require_login($course, false);
require_capability('local/orientation:view', $context);
if (isguestuser() || (!is_enrolled($context, $USER, '', true) && !has_capability('moodle/course:update', $context))) throw new required_capability_exception($context, 'moodle/course:view', 'nopermissions', '');
$PAGE->set_context($context);
$PAGE->set_course($course);
$PAGE->set_pagelayout('incourse');
$PAGE->set_show_course_index(false);
$PAGE->set_title('Find my starting point');
$PAGE->set_heading('Find my starting point');
$PAGE->set_cacheable(false);
header('Cache-Control: private, no-store');
echo $OUTPUT->header();
echo html_writer::tag('h2', 'An optional check, with your own ratings');
echo html_writer::tag('p', 'Six statements each ask “I understand this” and “I can do this”: twelve separate responses. Choose 1–5, Not sure, Skip this rating, or leave a response unanswered. No answer is preselected. These subjective ratings suggest practice; they do not test ability, award completion or lock activities.');
echo html_writer::tag('p', 'Moodle saves your answers and dated attempts, including unfinished work, on Finlay’s server. Finlay can access them for course support. Only your latest finished compatible check informs your private suggestion. Retakes retain earlier attempts; an unfinished check does not replace earlier results. Answers are not sent to an AI provider.');
echo html_writer::tag('p', 'There is no timer. Use Next page or Previous page to save choices before leaving, then resume later. You can finish a partly answered check. No starting-point suggestion is available from an entirely unknown check; unknown does not mean low ability.');
$publication = \local_orientation\startingpoint::publication();
$cm = \local_orientation\startingpoint::enabled() ? \local_orientation\startingpoint::visible_quiz($publication) : null;
if ($cm) {
    $results = \local_orientation\startingpoint::results();
    $link = $results['unfinished'] ? new moodle_url('/mod/quiz/attempt.php', ['attempt' => $results['unfinished']->id]) : $cm->url;
    echo html_writer::tag('p', html_writer::link($link, $results['unfinished'] ? 'Resume check' : 'Open the optional check', ['class' => 'btn btn-primary']));
} else {
    echo html_writer::tag('p', 'This optional check is not available yet. Your course journey and all available activities remain usable.');
}
echo html_writer::tag('p', html_writer::link(new moodle_url('/local/orientation/index.php'), 'Skip this check / Back to your course journey'));
echo html_writer::tag('p', html_writer::link(new moodle_url('/privacy'), 'About your saved information') . ' · ' . html_writer::link(new moodle_url('/help'), 'Help or request a copy/deletion'));
echo $OUTPUT->footer();
