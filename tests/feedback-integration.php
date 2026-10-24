<?php
/** Synthetic integration checks. Writes ONLY a separately provisioned, explicitly marked Moodle test site.
 * Run scripts/php tests/feedback-integration.php --config=/path/to/isolated/moodle/config.php
 * Leaves a synthetic browser fixture manifest in trial/feedback-fixtures.json. Never targets the live site.
 */
define('CLI_SCRIPT', true);
$options = getopt('', ['config:']);
if (empty($options['config']) || !is_file($options['config'])) {
    throw new RuntimeException('Supply --config pointing to the isolated synthetic Moodle installation.');
}
require $options['config'];
if (empty($CFG->local_orientationfeedback_synthetic) ||
        !in_array(parse_url($CFG->wwwroot, PHP_URL_HOST), ['127.0.0.1', 'localhost'], true)) {
    throw new RuntimeException('Refusing writes: explicit synthetic-site marker and localhost wwwroot required.');
}
// A localhost installation's default noreply@127.0.0.1 is not a valid mail address.
// This synthetic sender still uses the site's explicitly configured capture transport.
set_config('noreplyaddress', 'synthetic-noreply@example.test');
// The combined course seed hides this button; expose the native guest route only in this guarded fixture.
set_config('guestloginbutton', 1);
require_once($CFG->dirroot . '/lib/testing/generator/lib.php');
require_once($CFG->libdir . '/filelib.php');
require_once($CFG->libdir . '/completionlib.php');
use local_orientationfeedback\service;
use local_orientationfeedback\privacy\provider;
use core_privacy\local\request\{approved_contextlist, approved_userlist, userlist, writer};

function check_feedback(bool $condition, string $label): void {
    if (!$condition) { throw new RuntimeException('FAIL: ' . $label); }
    echo "PASS: $label\n";
}
function rejected_feedback(callable $action, string $code, string $label): void {
    try { $action(); } catch (moodle_exception $e) {
        check_feedback($e->errorcode === $code, $label . ' [' . $e->errorcode . ']');
        return;
    }
    throw new RuntimeException('FAIL: accepted ' . $label);
}
function as_feedback_user(stdClass $user): void {
    \core\session\manager::set_user($user);
    $_GET['sesskey'] = sesskey();
    $_POST['sesskey'] = sesskey();
}
function evidence_feedback(): string {
    global $DB;
    $data = [];
    foreach (['course_modules_completion', 'lesson_attempts', 'lesson_grades'] as $table) {
        $data[$table] = $DB->get_records($table, null, 'id');
    }
    return hash('sha256', json_encode($data));
}
$generator = new testing_data_generator();
as_feedback_user(get_admin());
$tag = 'voiceqa-' . substr(bin2hex(random_bytes(5)), 0, 10);
$password = 'SyntheticVoiceFeedback!42';
$users = [];
foreach (['author', 'peer', 'outsider', 'teacher'] as $kind) {
    $users[$kind] = $generator->create_user(['username' => "$tag-$kind", 'password' => $password,
        'firstname' => 'Synthetic', 'lastname' => ucfirst($kind), 'email' => "$tag-$kind@example.test"]);
}
$course = $generator->create_course(['fullname' => 'Synthetic voice feedback QA', 'shortname' => $tag,
    'enablecompletion' => 1]);
$othercourse = $generator->create_course(['fullname' => 'Synthetic other course', 'shortname' => "$tag-other"]);
foreach (['author', 'peer'] as $kind) { $generator->enrol_user($users[$kind]->id, $course->id, 'student'); }
$generator->enrol_user($users['teacher']->id, $course->id, 'editingteacher');
$page = $generator->create_module('page', ['course' => $course->id, 'name' => 'Synthetic visible activity',
    'content' => 'Fictional feedback test only.', 'completion' => 1]);
$hidden = $generator->create_module('page', ['course' => $course->id, 'name' => 'Synthetic hidden activity',
    'content' => 'Hidden fictional fixture.', 'visible' => 0]);
$otherpage = $generator->create_module('page', ['course' => $othercourse->id, 'name' => 'Other course activity',
    'content' => 'Cross-course fixture.']);
$context = context_course::instance($course->id);
// Seed historic completion and a real Lesson attempt so fingerprint preservation checks are non-empty.
$completion = new completion_info($course);
$cm = get_coursemodule_from_id('page', $page->cmid);
$completion->update_state($cm, COMPLETION_COMPLETE, $users['author']->id);
$lesson = $generator->create_module('lesson', ['course' => $course->id, 'name' => 'Synthetic historic lesson']);
$lessonpageid = $DB->insert_record('lesson_pages', (object)['lessonid' => $lesson->id, 'qtype' => 1,
    'qoption' => 0, 'layout' => 1, 'display' => 1, 'timecreated' => time(), 'timemodified' => time(),
    'title' => 'Synthetic historic question', 'contents' => 'Fictional check']);
$DB->insert_record('lesson_attempts', (object)['lessonid' => $lesson->id, 'pageid' => $lessonpageid,
    'userid' => $users['author']->id, 'answerid' => 0, 'retry' => 0, 'correct' => 1,
    'useranswer' => 'Synthetic preserved answer', 'timeseen' => time()]);
$before = evidence_feedback();
set_config('enabled', 0, 'local_orientationfeedback');
check_feedback(!service::configured(), 'Disabled before explicit configuration');
set_config('courseid', $course->id, 'local_orientationfeedback');
set_config('reviewerid', get_admin()->id, 'local_orientationfeedback');
set_config('enabled', 1, 'local_orientationfeedback');
check_feedback(service::configured(), 'Explicit course and admin reviewer enable feedback');
$base = ['courseid' => $course->id, 'cmid' => $page->cmid, 'source' => 'help',
    'section' => 'Fictional section', 'message' => 'Synthetic feedback: the example helped.',
    'submissiontoken' => bin2hex(random_bytes(16))];
as_feedback_user($users['author']);
$invalid = $base; unset($_POST['sesskey'], $_GET['sesskey']);
rejected_feedback(fn() => service::submit($invalid), 'missingparam', 'Missing CSRF token rejected');
as_feedback_user($users['author']);
$_POST['sesskey'] = 'wrong-key';
rejected_feedback(fn() => service::submit($base), 'invalidsesskey', 'Incorrect CSRF token rejected');
as_feedback_user($users['author']);
rejected_feedback(fn() => service::submit(array_replace($base, ['submissiontoken' => ''])), 'badtoken', 'Missing idempotency token rejected');
rejected_feedback(fn() => service::submit(array_replace($base, ['cmid' => $otherpage->cmid])), 'badcontext', 'Cross-course activity rejected');
rejected_feedback(fn() => service::submit(array_replace($base, ['cmid' => $hidden->cmid])), 'badcontext', 'Hidden activity rejected');
rejected_feedback(fn() => service::submit(array_replace($base, ['courseid' => $othercourse->id])), 'accessdenied', 'Other target course rejected');
rejected_feedback(fn() => service::submit(array_replace($base, ['source' => '//evil.example/'])), 'invalidinput', 'Untrusted source/return path rejected');
rejected_feedback(fn() => service::submit(array_replace($base, ['message' => str_repeat('x', 5001)])), 'invalidinput', 'Oversized text rejected');
rejected_feedback(fn() => service::submit(array_replace($base, ['section' => str_repeat('x', 161)])), 'invalidinput', 'Oversized section rejected');
rejected_feedback(fn() => service::submit(array_replace($base, ['message' => ''])), 'emptyfeedback', 'Empty submission rejected');
$badfile = tempnam($CFG->tempdir, 'voiceqa');
file_put_contents($badfile, '<?php echo "not audio";');
rejected_feedback(fn() => service::submit($base, $badfile), 'filetype', 'Renamed executable content rejected by finfo');
file_put_contents($badfile, str_repeat('x', service::MAX_BYTES + 1));
clearstatcache(true, $badfile);
rejected_feedback(fn() => service::submit($base, $badfile), 'filesize', 'More than 10 MiB rejected');
unlink($badfile);
// A valid 8 kHz mono PCM WAV, generated without a microphone or third-party data.
$wav = 'RIFF' . pack('V', 8036) . 'WAVEfmt ' . pack('VvvVVvv', 16, 1, 1, 8000, 8000, 1, 8) .
    'data' . pack('V', 8000) . str_repeat(chr(128), 8000);
$audio = tempnam($CFG->tempdir, 'voiceqa');
file_put_contents($audio, $wav);
$notificationsbefore = $DB->count_records('notifications', ['component' => 'local_orientationfeedback', 'eventtype' => 'submission']);
$record = service::submit($base, $audio);
check_feedback($record->filename === 'recording.wav' && $record->filesize === strlen($wav), 'Server verifies and stores valid WAV under deterministic filename');
$storedfile = get_file_storage()->get_file($context->id, 'local_orientationfeedback', 'audio', $record->id, '/', $record->filename);
check_feedback($storedfile && $storedfile->get_content() === $wav, 'Private File API stores exact synthetic recording');
$notificationcount = $DB->count_records('notifications', ['component' => 'local_orientationfeedback', 'eventtype' => 'submission']);
check_feedback($record->notificationstate === 'sent' && $notificationcount === $notificationsbefore + 1,
    'Successful real Moodle message API call creates one generic notification after storage');
$duplicate = service::submit($base, $audio);
check_feedback((int)$duplicate->id === (int)$record->id &&
    $DB->count_records('notifications', ['component' => 'local_orientationfeedback', 'eventtype' => 'submission']) === $notificationcount,
    'Repeated token returns same receipt without second notification');
$notifications = $DB->get_records('notifications', ['component' => 'local_orientationfeedback', 'eventtype' => 'submission']);
foreach ($notifications as $notification) {
    check_feedback(strpos($notification->fullmessage, $base['message']) === false &&
        strpos($notification->fullmessage, $users['author']->username) === false, 'Notification contains no feedback text or author identifier');
}
// Five-minute 16 kHz 16-bit mono WAV exceeds the previous 4 MiB cap.
$longsamples = 300 * 16000 * 2;
$longwav = 'RIFF' . pack('V', $longsamples + 36) . 'WAVEfmt ' .
    pack('VvvVVvv', 16, 1, 1, 16000, 32000, 2, 16) . 'data' . pack('V', $longsamples) .
    str_repeat(chr(0), $longsamples);
$longaudio = tempnam($CFG->tempdir, 'voiceqa');
file_put_contents($longaudio, $longwav);
$longrecord = service::submit(array_replace($base, ['submissiontoken' => bin2hex(random_bytes(16))]), $longaudio);
$longstored = get_file_storage()->get_file($context->id, 'local_orientationfeedback', 'audio',
    $longrecord->id, '/', $longrecord->filename);
check_feedback($longrecord->filesize === strlen($longwav) && $longstored &&
    $longstored->get_content() === $longwav, 'Five-minute synthetic WAV is accepted and stored exactly');
service::delete($longrecord);
unlink($longaudio);
check_feedback((int)service::read($record->id)->userid === (int)$users['author']->id, 'Author can access receipt and playback record');
as_feedback_user($users['peer']);
rejected_feedback(fn() => service::read($record->id), 'accessdenied', 'Peer cannot access private receipt/playback record');
as_feedback_user($users['teacher']);
check_feedback(!service::reviewer(), 'Ordinary teacher has no private inbox access');
rejected_feedback(fn() => service::read($record->id), 'accessdenied', 'Teacher cannot read private recording');
as_feedback_user($users['outsider']);
rejected_feedback(fn() => service::submit($base), 'accessdenied', 'Unenrolled user cannot submit');
as_feedback_user(guest_user());
rejected_feedback(fn() => service::submit($base), 'accessdenied', 'Guest cannot submit');
rejected_feedback(fn() => service::read($record->id), 'accessdenied', 'Guest cannot read');
as_feedback_user(get_admin());
check_feedback(service::reviewer() && (int)service::read($record->id)->id === (int)$record->id, 'Admin reviewer can access inbox record and playback');
as_feedback_user($users['author']);
// Disable the real Moodle message provider to force message_send's false result after storage.
set_config('local_orientationfeedback_submission_disable', 1, 'message');
$faileddata = array_replace($base, ['submissiontoken' => bin2hex(random_bytes(16)), 'message' => 'Synthetic transport failure fixture']);
$failed = service::submit($faileddata);
check_feedback($failed->notificationstate === 'failed' && $DB->record_exists('local_orientationfeedback', ['id' => $failed->id]),
    'Real message-provider failure retains saved feedback with visible failed state');
set_config('local_orientationfeedback_submission_disable', 0, 'message');
check_feedback(service::submit($faileddata)->notificationstate === 'failed', 'Retry does not reattempt failed notification');
for ($n = 0; $n < 3; $n++) {
    service::submit(array_replace($base, ['submissiontoken' => bin2hex(random_bytes(16)), 'message' => "Synthetic rate fixture $n"]));
}
rejected_feedback(fn() => service::submit(array_replace($base, ['submissiontoken' => bin2hex(random_bytes(16))])), 'ratelimit', 'Sixth submission in an hour rejected');
check_feedback((int)service::submit($base)->id === (int)$record->id, 'Duplicate token remains valid after reaching rate limit');
check_feedback(in_array($context->id, provider::get_contexts_for_userid($users['author']->id)->get_contextids()), 'Privacy discovery includes feedback course');
$userlist = new userlist($context, 'local_orientationfeedback');
provider::get_users_in_context($userlist);
check_feedback(in_array($users['author']->id, $userlist->get_userids()), 'Privacy discovery includes author');
$approved = new approved_contextlist($users['author'], 'local_orientationfeedback', [$context->id]);
provider::export_user_data($approved);
$archive = writer::with_context($context)->finalise_content();
$packer = get_file_packer('application/zip');
$exportdir = make_request_directory();
$packer->extract_to_pathname($archive, $exportdir);
$exportfiles = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($exportdir));
$foundtext = false; $foundaudio = false;
foreach ($exportfiles as $file) {
    if (!$file->isFile()) { continue; }
    $content = file_get_contents($file->getPathname());
    if ($content === $wav) { $foundaudio = true; }
    if (strpos($content, $base['message']) !== false) { $foundtext = true; }
}
check_feedback($foundtext && $foundaudio, 'Real privacy export archive includes feedback and exact audio');
provider::delete_data_for_user($approved);
check_feedback(!$DB->record_exists('local_orientationfeedback', ['userid' => $users['author']->id]) &&
    !get_file_storage()->get_area_files($context->id, 'local_orientationfeedback', 'audio', $record->id),
    'Individual privacy deletion removes metadata and recording');
// Exercise bulk and all-context deletion with fresh records including audio.
$bulk = service::submit(array_replace($base, ['submissiontoken' => bin2hex(random_bytes(16))]), $audio);
provider::delete_data_for_users(new approved_userlist($context, 'local_orientationfeedback', [$users['author']->id]));
check_feedback(!$DB->record_exists('local_orientationfeedback', ['id' => $bulk->id]) &&
    !get_file_storage()->get_area_files($context->id, 'local_orientationfeedback', 'audio', $bulk->id),
    'Bulk privacy deletion removes metadata and recording');
$all = service::submit(array_replace($base, ['submissiontoken' => bin2hex(random_bytes(16))]), $audio);
provider::delete_data_for_all_users_in_context($context);
check_feedback(!$DB->record_exists('local_orientationfeedback', ['courseid' => $course->id]) &&
    !get_file_storage()->get_area_files($context->id, 'local_orientationfeedback', 'audio', $all->id),
    'Context privacy deletion removes metadata and recording');
$expired = service::submit(array_replace($base, ['submissiontoken' => bin2hex(random_bytes(16))]), $audio);
$DB->set_field('local_orientationfeedback', 'timecreated', time() - 100 * DAYSECS, ['id' => $expired->id]);
set_config('retentiondays', 90, 'local_orientationfeedback');
(new \local_orientationfeedback\task\cleanup())->execute();
check_feedback(!$DB->record_exists('local_orientationfeedback', ['id' => $expired->id]) &&
    !get_file_storage()->get_area_files($context->id, 'local_orientationfeedback', 'audio', $expired->id),
    'Retention task removes expired metadata and audio');
// Course deletion must immediately remove private data even when timed retention is disabled.
$generator->enrol_user($users['author']->id, $othercourse->id, 'student');
set_config('courseid', $othercourse->id, 'local_orientationfeedback');
$orphan = service::submit(array_replace($base, ['courseid' => $othercourse->id,
    'cmid' => $otherpage->cmid, 'submissiontoken' => bin2hex(random_bytes(16))]), $audio);
$othercontextid = context_course::instance($othercourse->id)->id;
set_config('courseid', $course->id, 'local_orientationfeedback');
set_config('retentiondays', 0, 'local_orientationfeedback');
as_feedback_user(get_admin());
delete_course($othercourse, false);
context_helper::reset_caches();
check_feedback(!$DB->record_exists('local_orientationfeedback', ['id' => $orphan->id]) &&
    !get_file_storage()->get_area_files($othercontextid, 'local_orientationfeedback', 'audio', $orphan->id),
    'Course deletion immediately removes unexpired feedback and audio with timed retention disabled');
// Legacy orphan metadata must not prevent cleanup of the remaining expired records.
$legacyorphan = clone $orphan;
unset($legacyorphan->id);
$legacyorphan->timecreated = time() - 100 * DAYSECS;
$legacyorphan->id = $DB->insert_record('local_orientationfeedback', $legacyorphan);
set_config('retentiondays', 90, 'local_orientationfeedback');
(new \local_orientationfeedback\task\cleanup())->execute();
check_feedback(!$DB->record_exists('local_orientationfeedback', ['id' => $legacyorphan->id]),
    'Retention handles legacy feedback metadata after its course context is deleted');
as_feedback_user($users['author']);
check_feedback(evidence_feedback() === $before, 'Historic completion, lesson attempts and grades fingerprint unchanged');
// Leave one author-owned audio record for authenticated browser/HTTP checks.
$browserrecord = service::submit(array_replace($base, ['submissiontoken' => bin2hex(random_bytes(16))]), $audio);
$manifest = ['synthetic' => true, 'wwwroot' => $CFG->wwwroot, 'courseid' => $course->id, 'cmid' => $page->cmid,
    'hiddencmid' => $hidden->cmid, 'othercmid' => $otherpage->cmid, 'recordid' => $browserrecord->id,
    'audio' => service::audio_url($browserrecord)->out(false), 'password' => $password, 'users' => []];
foreach ($users as $kind => $user) { $manifest['users'][$kind] = ['id' => $user->id, 'username' => $user->username]; }
$manifest['users']['reviewer'] = ['id' => get_admin()->id, 'username' => get_admin()->username];
$fixturepath = dirname(__DIR__) . '/trial/feedback-fixtures.json';
file_put_contents($fixturepath, json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
chmod($fixturepath, 0600);
unlink($audio);
echo "Synthetic integration complete. Browser fixture manifest saved under ignored trial/.\n";
