<?php
require_once(__DIR__ . '/../../config.php');
use local_orientationfeedback\service;

$json = optional_param('format', '', PARAM_ALPHA) === 'json';
if ($json && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Suppress login redirects for fetch: the recorder must preserve its Blob on any failure.
    if (!isloggedin() || isguestuser()) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['error' => get_string('accessdenied', 'local_orientationfeedback')]);
        exit;
    }
}
require_login();
$id = optional_param('id', 0, PARAM_INT);
$courseid = optional_param('courseid', (int)get_config('local_orientationfeedback', 'courseid'), PARAM_INT);
$cmid = optional_param('cmid', 0, PARAM_INT);
$source = optional_param('source', '', PARAM_RAW_TRIMMED);
$section = optional_param('section', '', PARAM_RAW_TRIMMED);
$message = optional_param('message', '', PARAM_RAW);
$token = optional_param('submissiontoken', $_SERVER['REQUEST_METHOD'] === 'POST' ? '' : bin2hex(random_bytes(16)), PARAM_RAW);
$error = '';
try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $upload = null;
        if (!empty($_FILES['audio']) && $_FILES['audio']['error'] !== UPLOAD_ERR_NO_FILE) {
            if ($_FILES['audio']['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($_FILES['audio']['tmp_name'])) {
                service::fail('uploadfailed');
            }
            $upload = $_FILES['audio']['tmp_name'];
        }
        $record = service::submit(['submissiontoken' => $token, 'courseid' => $courseid, 'cmid' => $cmid,
            'source' => $source, 'section' => $section, 'message' => $message], $upload);
        $url = new moodle_url('/local/orientationfeedback/index.php', ['id' => $record->id]);
        if ($json) {
            header('Content-Type: application/json');
            header('Cache-Control: no-store');
            echo json_encode(['id' => (int)$record->id, 'redirect' => $url->out(false)]);
            exit;
        }
        redirect($url);
    }
    if ($id) {
        $record = service::read($id);
        $courseid = (int)$record->courseid;
        $course = get_course($courseid);
    } else {
        $course = service::validate_context($courseid, $cmid);
        if ($source !== '' && !in_array($source, service::SOURCES, true)) { service::fail('invalidinput'); }
        if (core_text::strlen($section) > 160) { service::fail('invalidinput'); }
    }
} catch (moodle_exception $e) {
    if ($json && $_SERVER['REQUEST_METHOD'] === 'POST') {
        http_response_code($e->errorcode === 'ratelimit' ? 429 : 400);
        header('Content-Type: application/json');
        header('Cache-Control: no-store');
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { throw $e; }
    $error = $e->getMessage();
    $course = service::validate_context($courseid, $cmid);
} catch (Throwable $e) {
    if ($json && $_SERVER['REQUEST_METHOD'] === 'POST') {
        http_response_code(500);
        header('Content-Type: application/json');
        header('Cache-Control: no-store');
        echo json_encode(['error' => get_string('savefailed', 'local_orientationfeedback')]);
        exit;
    }
    throw $e;
}
$PAGE->set_url('/local/orientationfeedback/index.php', $id ? ['id' => $id] : ['courseid' => $courseid, 'cmid' => $cmid, 'source' => $source]);
$PAGE->set_context(context_course::instance($courseid));
$PAGE->set_course($course);
$PAGE->set_title(get_string('sendfeedback', 'local_orientationfeedback'));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->requires->js(new moodle_url('/local/orientationfeedback/recorder.js'));
$PAGE->requires->css(new moodle_url('/local/orientationfeedback/styles.css'));
echo $OUTPUT->header();
echo $OUTPUT->heading(get_string($id ? 'receipt' : 'sendfeedback', 'local_orientationfeedback'));
if ($id) {
    echo html_writer::tag('p', get_string('stored', 'local_orientationfeedback'));
    echo html_writer::tag('p', s($record->message));
    if ($record->filename) {
        echo html_writer::tag('audio', '', ['controls' => 'controls', 'src' => service::audio_url($record)->out(false)]);
    }
    echo html_writer::tag('p', html_writer::link(new moodle_url('/course/view.php', ['id' => $courseid]),
        get_string('returncourse', 'local_orientationfeedback')));
} else {
    if ($error) { echo $OUTPUT->notification($error, 'notifyproblem'); }
    echo html_writer::tag('p', get_string('formintro', 'local_orientationfeedback'));
    echo html_writer::start_tag('form', ['method' => 'post', 'enctype' => 'multipart/form-data',
        'action' => (new moodle_url('/local/orientationfeedback/index.php'))->out(false), 'data-voice-feedback' => '']);
    foreach (['courseid' => $courseid, 'cmid' => $cmid, 'source' => $source, 'sesskey' => sesskey(), 'submissiontoken' => $token] as $name => $value) {
        echo html_writer::empty_tag('input', ['type' => 'hidden', 'name' => $name, 'value' => $value]);
    }
    echo html_writer::tag('p', get_string('context', 'local_orientationfeedback') . ' ' . s($course->fullname) .
        ($cmid ? ' / ' . s(get_fast_modinfo($course)->get_cm($cmid)->name) : '') . ($source ? ' / ' . s($source) : ''));
    echo html_writer::tag('label', get_string('section', 'local_orientationfeedback'), ['for' => 'feedback-section']);
    echo html_writer::empty_tag('input', ['id' => 'feedback-section', 'name' => 'section', 'maxlength' => 160, 'value' => $section]);
    echo html_writer::tag('label', get_string('message', 'local_orientationfeedback'), ['for' => 'feedback-message']);
    echo html_writer::tag('textarea', s($message), ['id' => 'feedback-message', 'name' => 'message', 'maxlength' => 5000, 'rows' => 6]);
    echo html_writer::start_div('voice-recorder');
    foreach (['record' => 'Record', 'stop' => 'Stop', 'discard' => 'Discard recording'] as $action => $label) {
        echo html_writer::tag('button', s($label), ['type' => 'button', 'data-voice-' . $action => '', 'hidden' => 'hidden']);
    }
    echo html_writer::tag('span', '0:00', ['data-voice-timer' => '', 'hidden' => 'hidden']);
    echo html_writer::tag('audio', '', ['data-voice-playback' => '', 'controls' => 'controls', 'hidden' => 'hidden']);
    echo html_writer::tag('p', '', ['data-voice-status' => '', 'role' => 'status', 'aria-live' => 'polite']);
    echo html_writer::end_div();
    echo html_writer::tag('label', get_string('audio', 'local_orientationfeedback'), ['for' => 'feedback-audio']);
    echo html_writer::empty_tag('input', ['type' => 'file', 'name' => 'audio', 'id' => 'feedback-audio', 'accept' => 'audio/*,.webm,.ogg,.m4a']);
    echo html_writer::tag('p', get_string('limits', 'local_orientationfeedback'));
    echo html_writer::tag('button', get_string('send', 'local_orientationfeedback'), ['type' => 'submit']);
    echo html_writer::end_tag('form');
}
echo $OUTPUT->footer();
