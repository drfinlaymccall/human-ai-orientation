<?php
// Site administrators only: see how many people asked about each topic and download the addresses.
require_once(__DIR__ . '/../../config.php');
use local_orientation\notify;
require_login(null, false);
require_capability('moodle/site:config', context_system::instance());
$PAGE->set_url('/local/orientation/notify-list.php');
$PAGE->set_context(context_system::instance());
$PAGE->set_pagelayout('admin');
$PAGE->set_title('Notify list');
$PAGE->set_heading('Notify list');
$PAGE->set_cacheable(false);
$topic = optional_param('download', '', PARAM_ALPHANUMEXT);
if ($topic !== '') {
    require_sesskey();
    if (!isset(notify::TOPICS[$topic])) throw new moodle_exception('invalidparameter');
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="notify-' . $topic . '.csv"');
    header('Cache-Control: private, no-store');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['email', 'topic', 'asked_on', 'removal_link']);
    foreach ($DB->get_records(notify::TABLE, ['topic' => $topic], 'timecreated, id') as $row) {
        fputcsv($out, [$row->email, $row->topic, userdate($row->timecreated, '%Y-%m-%d'), notify::removal_url($row)]);
    }
    exit;
}
echo $OUTPUT->header();
echo html_writer::tag('p', 'People who asked to be told about one thing. Send each person one email about that thing, and include their removal link. This page does not send mail.');
$table = new html_table();
$table->head = ['Topic', 'People', ''];
foreach (notify::TOPICS as $key => $label) {
    $count = $DB->count_records(notify::TABLE, ['topic' => $key]);
    $link = $count ? html_writer::link(new moodle_url('/local/orientation/notify-list.php', ['download' => $key, 'sesskey' => sesskey()]), 'Download addresses (CSV)') : '';
    $table->data[] = [s($label), $count, $link];
}
echo html_writer::table($table);
echo $OUTPUT->footer();
