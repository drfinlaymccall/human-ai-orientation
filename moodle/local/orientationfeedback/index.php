<?php
require_once(__DIR__ . '/../../config.php');
use local_orientationfeedback\service;

$json = optional_param('format', '', PARAM_ALPHA) === 'json';
$embedded = optional_param('embedded', false, PARAM_BOOL);
$PAGE->set_pagelayout($embedded ? 'embedded' : 'standard');
$PAGE->add_body_class('orientation-feedback-page');
if ($embedded) { $PAGE->add_body_class('orientation-feedback-embedded'); }
$PAGE->requires->js(new moodle_url('/local/orientationfeedback/recorder.js'));
$PAGE->requires->css(new moodle_url('/local/orientationfeedback/styles.css'));
if ($json && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Suppress login redirects for fetch: the recorder must preserve its Blob on any failure.
    if (!isloggedin() || isguestuser()) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['error' => get_string('accessdenied', 'local_orientationfeedback')]);
        exit;
    }
}
if ($embedded && $_SERVER['REQUEST_METHOD'] === 'GET' && (!isloggedin() || isguestuser())) {
    $PAGE->set_context(context_system::instance());
    $PAGE->set_url('/local/orientationfeedback/index.php', ['embedded' => 1]);
    $PAGE->set_title(get_string('launcher', 'local_orientationfeedback'));
    echo $OUTPUT->header();
    echo html_writer::start_div('feedback-card feedback-gate');
    echo html_writer::tag('p', 'YOUR VOICE MATTERS', ['class' => 'feedback-eyebrow']);
    echo html_writer::tag('h1', 'Help make the course better');
    echo html_writer::tag('p', 'Sign in to leave a private voice message or note for Finlay.');
    $gatesource = optional_param('source', '', PARAM_ALPHANUMEXT);
    $login = new moodle_url('/local/orientationfeedback/signin.php', ['source' =>
        in_array($gatesource, service::SOURCES, true) ? $gatesource : '']);
    echo html_writer::link($login, 'Sign in to give feedback',
        ['class' => 'feedback-primary', 'target' => '_top', 'data-feedback-signin' => '']);
    echo html_writer::tag('p', 'No course account? ' . html_writer::link('mailto:hi@finlaymccall.com', 'Email Finlay'),
        ['class' => 'feedback-small']);
    echo html_writer::end_div();
    echo $OUTPUT->footer();
    exit;
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
$retryconflict = false;
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
        $receiptparams = ['id' => $record->id];
        if ($embedded) { $receiptparams['embedded'] = 1; }
        $url = new moodle_url('/local/orientationfeedback/index.php', $receiptparams);
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
    $retryconflict = $e->errorcode === 'retryconflict';
    if ($retryconflict) { http_response_code(409); }
    if ($json && $_SERVER['REQUEST_METHOD'] === 'POST') {
        http_response_code($e->errorcode === 'ratelimit' ? 429 : ($e->errorcode === 'retryconflict' ? 409 : 400));
        header('Content-Type: application/json');
        header('Cache-Control: no-store');
        echo json_encode(['error' => $e->getMessage(), 'code' => $e->errorcode]);
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
echo $OUTPUT->header();
echo html_writer::start_div('feedback-card');
echo html_writer::tag('p', $id ? 'THANK YOU' : 'YOUR VOICE MATTERS', ['class' => 'feedback-eyebrow']);
echo $OUTPUT->heading($id ? get_string('receipt', 'local_orientationfeedback') : 'What would you like to share?', 1);
if ($id) {
    echo html_writer::tag('p', 'Thanks for helping improve the course. Your feedback is saved privately for Finlay.');
    echo html_writer::tag('p', s($record->message), ['class' => 'feedback-saved-note']);
    if ($record->filename) {
        echo html_writer::tag('audio', '', ['controls' => 'controls', 'src' => service::audio_url($record)->out(false)]);
    }
    echo html_writer::tag('p', get_string('stored', 'local_orientationfeedback'), ['class' => 'feedback-small']);
    if (!$embedded) {
        echo html_writer::tag('p', html_writer::link(new moodle_url('/course/view.php', ['id' => $courseid]),
            get_string('returncourse', 'local_orientationfeedback')));
    }
} else {
    echo html_writer::tag('p', 'What helped, what got in the way, or what could be clearer?', ['class' => 'feedback-intro']);
    if ($error) { echo $OUTPUT->notification($error, 'notifyproblem'); }
    if ($retryconflict) {
        $newform = new moodle_url('/local/orientationfeedback/index.php', [
            'courseid' => $courseid, 'cmid' => $cmid, 'source' => $source,
        ]);
        echo html_writer::tag('p', 'Keep a copy of these changes, then ' . html_writer::link($newform,
            'open a separate feedback form in a new tab', ['target' => '_blank', 'rel' => 'noopener']) .
            ' to send a new message. Choose your audio file again in the new form.');
    }
    echo html_writer::start_tag('form', ['method' => 'post', 'enctype' => 'multipart/form-data',
        'action' => (new moodle_url('/local/orientationfeedback/index.php'))->out(false),
        'data-voice-feedback' => '', 'data-feedback-embedded' => $embedded ? '1' : '0']);
    foreach (['courseid' => $courseid, 'cmid' => $cmid, 'source' => $source, 'sesskey' => sesskey(),
            'submissiontoken' => $token, 'embedded' => $embedded ? 1 : 0] as $name => $value) {
        echo html_writer::empty_tag('input', ['type' => 'hidden', 'name' => $name, 'value' => $value]);
    }
    $about = $cmid ? get_fast_modinfo($course)->get_cm($cmid)->name :
        ($source ? ucwords(str_replace('-', ' ', $source)) : $course->fullname);
    echo html_writer::tag('p', get_string('context', 'local_orientationfeedback') . ' ' . s($about), ['class' => 'feedback-context']);
    echo html_writer::start_div('voice-recorder');
    echo html_writer::tag('span', 'VOICE MESSAGE', ['class' => 'feedback-label']);
    echo html_writer::start_div('feedback-record-controls');
    foreach (['record' => 'Record', 'stop' => 'Stop', 'discard' => 'Discard recording'] as $action => $label) {
        echo html_writer::tag('button', s($label), ['type' => 'button', 'data-voice-' . $action => '', 'hidden' => 'hidden']);
    }
    echo html_writer::tag('span', '0:00', ['data-voice-timer' => '', 'hidden' => 'hidden']);
    echo html_writer::end_div();
    echo html_writer::tag('audio', '', ['data-voice-playback' => '', 'controls' => 'controls', 'hidden' => 'hidden']);
    echo html_writer::tag('p', 'Up to five minutes. Listen or record again before sending.', ['class' => 'feedback-small']);
    echo html_writer::tag('p', '', ['data-voice-status' => '', 'role' => 'status', 'aria-live' => 'polite']);
    echo html_writer::end_div();
    echo html_writer::tag('label', 'Add a note (optional)', ['for' => 'feedback-message']);
    echo html_writer::tag('textarea', s($message), ['id' => 'feedback-message', 'name' => 'message', 'maxlength' => 5000,
        'rows' => 3, 'placeholder' => 'For example: I got stuck on…']);
    echo html_writer::start_tag('details', ['class' => 'feedback-options']);
    echo html_writer::tag('summary', 'Upload audio or add a heading');
    echo html_writer::tag('label', get_string('section', 'local_orientationfeedback'), ['for' => 'feedback-section']);
    echo html_writer::empty_tag('input', ['id' => 'feedback-section', 'name' => 'section', 'maxlength' => 160, 'value' => $section]);
    echo html_writer::tag('label', get_string('audio', 'local_orientationfeedback'), ['for' => 'feedback-audio']);
    echo html_writer::empty_tag('input', ['type' => 'file', 'name' => 'audio', 'id' => 'feedback-audio', 'accept' => 'audio/*,.webm,.ogg,.m4a']);
    echo html_writer::tag('p', get_string('limits', 'local_orientationfeedback'), ['class' => 'feedback-small']);
    echo html_writer::end_tag('details');
    echo html_writer::tag('p', 'Private to Finlay and authorised reviewers. Please leave out sensitive information.', ['class' => 'feedback-privacy']);
    echo html_writer::tag('button', get_string('send', 'local_orientationfeedback'), ['type' => 'submit', 'class' => 'feedback-primary']);
    echo html_writer::end_tag('form');
}
echo html_writer::end_div();
echo $OUTPUT->footer();
