<?php
namespace local_orientationfeedback;
defined('MOODLE_INTERNAL') || die();

/** Validation, storage and access decisions shared by the web and privacy interfaces. */
final class service {
    public const MAX_BYTES = 10485760;
    public const SOURCES = ['home', 'privacy', 'journey', 'before-you-start', 'notes', 'free-tools', 'first-task',
        'preview', 'portfolio', 'check-and-continue', 'deeper-courses', 'help', 'glossary'];
    private const MEDIA = ['audio/webm' => 'webm', 'video/webm' => 'webm', 'audio/ogg' => 'ogg',
        'application/ogg' => 'ogg', 'audio/wav' => 'wav', 'audio/x-wav' => 'wav',
        'audio/mpeg' => 'mp3', 'audio/mp4' => 'm4a', 'video/mp4' => 'm4a', 'audio/flac' => 'flac',
        'audio/x-flac' => 'flac'];

    public static function configured(): bool {
        global $DB;
        $config = get_config('local_orientationfeedback');
        if (empty($config->enabled) || empty($config->courseid) || empty($config->reviewerid) ||
                (int)$config->courseid === SITEID || !$DB->record_exists('course', ['id' => $config->courseid])) {
            return false;
        }
        $reviewer = $DB->get_record('user', ['id' => $config->reviewerid, 'deleted' => 0, 'suspended' => 0]);
        return $reviewer && !isguestuser($reviewer) && has_capability('local/orientationfeedback:review',
            \context_system::instance(), $reviewer);
    }

    public static function reviewer(): bool {
        global $USER;
        return isloggedin() && !isguestuser() && has_capability('local/orientationfeedback:review',
            \context_system::instance(), $USER);
    }

    public static function validate_context(int $courseid, int $cmid = 0): \stdClass {
        global $USER, $DB;
        if (!self::configured()) { self::fail('disabled'); }
        if (!isloggedin() || isguestuser() || $courseid !== (int)get_config('local_orientationfeedback', 'courseid')) {
            self::fail('accessdenied');
        }
        $course = $DB->get_record('course', ['id' => $courseid], '*', MUST_EXIST);
        $context = \context_course::instance($courseid);
        if (!is_enrolled($context, $USER, '', true)) {
            self::fail('accessdenied');
        }
        if (!$course->visible && !has_capability('moodle/course:viewhiddencourses', $context)) {
            self::fail('accessdenied');
        }
        if ($cmid) {
            $modinfo = get_fast_modinfo($course, $USER->id);
            $cm = $modinfo->get_cms()[$cmid] ?? null;
            if (!$cm || !$cm->uservisible) { self::fail('badcontext'); }
        }
        return $course;
    }

    public static function fail(string $code): void {
        throw new \moodle_exception($code, 'local_orientationfeedback');
    }

    /** $upload is a trusted server temporary path, never a client supplied path. */
    public static function submit(array $data, ?string $upload = null): \stdClass {
        global $DB, $USER;
        require_sesskey();
        $courseid = (int)($data['courseid'] ?? 0);
        $cmid = (int)($data['cmid'] ?? 0);
        self::validate_context($courseid, $cmid);
        $token = $data['submissiontoken'] ?? '';
        if (!preg_match('/\A[a-f0-9]{32}\z/D', $token)) { self::fail('badtoken'); }
        $factory = \core\lock\lock_config::get_lock_factory('local_orientationfeedback');
        $lock = $factory->get_lock('submit-user-' . $USER->id, 10);
        if (!$lock) { self::fail('busy'); }
        try {
            $source = (string)($data['source'] ?? '');
            $section = trim((string)($data['section'] ?? ''));
            $message = trim((string)($data['message'] ?? ''));
            if (($source !== '' && !in_array($source, self::SOURCES, true)) ||
                    \core_text::strlen($section) > 160 || \core_text::strlen($message) > 5000) {
                self::fail('invalidinput');
            }
            $mime = ''; $filename = ''; $size = 0;
            if ($upload !== null) {
                $size = filesize($upload);
                if ($size === false || $size < 1 || $size > self::MAX_BYTES) { self::fail('filesize'); }
                $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($upload);
                if (!isset(self::MEDIA[$mime])) { self::fail('filetype'); }
                $filename = 'recording.' . self::MEDIA[$mime];
            }
            if ($message === '' && !$filename) { self::fail('emptyfeedback'); }
            $existing = $DB->get_record('local_orientationfeedback', ['userid' => $USER->id, 'submissiontoken' => $token]);
            if ($existing) {
                $same = (int)$existing->courseid === $courseid && (int)$existing->cmid === $cmid &&
                    $existing->source === $source && $existing->sectionlabel === $section &&
                    $existing->message === $message && ($existing->filename !== '') === ($filename !== '');
                if ($same && $filename !== '') {
                    $file = get_file_storage()->get_file(\context_course::instance($courseid)->id,
                        'local_orientationfeedback', 'audio', $existing->id, '/', $existing->filename);
                    $same = $file && $file->get_contenthash() === sha1_file($upload);
                }
                if (!$same) { self::fail('retryconflict'); }
                return $existing;
            }
            if ($DB->count_records_select('local_orientationfeedback', 'userid = :userid AND timecreated > :since',
                    ['userid' => $USER->id, 'since' => time() - HOURSECS]) >= 5) {
                self::fail('ratelimit');
            }
            $record = (object)['userid' => $USER->id, 'courseid' => $courseid, 'cmid' => $cmid,
                'source' => $source, 'sectionlabel' => $section, 'message' => $message,
                'submissiontoken' => $token, 'filename' => $filename, 'mimetype' => $mime,
                'filesize' => $size, 'notificationstate' => 'pending', 'timecreated' => time()];
            $transaction = $DB->start_delegated_transaction();
            $record->id = $DB->insert_record('local_orientationfeedback', $record);
            if ($filename) {
                get_file_storage()->create_file_from_pathname([
                    'contextid' => \context_course::instance($courseid)->id,
                    'component' => 'local_orientationfeedback', 'filearea' => 'audio', 'itemid' => $record->id,
                    'filepath' => '/', 'filename' => $filename, 'userid' => $USER->id, 'mimetype' => $mime,
                ], $upload);
            }
            $transaction->allow_commit();
            self::notify($record);
            return $record;
        } finally { $lock->release(); }
    }

    /** Mark the attempt before calling the transport: a retried POST must never send again. */
    private static function notify(\stdClass $record): void {
        global $DB;
        $record->notificationstate = 'attempted';
        $DB->set_field('local_orientationfeedback', 'notificationstate', 'attempted', ['id' => $record->id]);
        try {
            $notification = new \core\message\message();
            $notification->component = 'local_orientationfeedback';
            $notification->name = 'submission';
            $notification->userfrom = \core_user::get_noreply_user();
            $notification->userto = \core_user::get_user((int)get_config('local_orientationfeedback', 'reviewerid'));
            $notification->subject = get_string('notificationsubject', 'local_orientationfeedback');
            $notification->fullmessage = get_string('notificationbody', 'local_orientationfeedback');
            $notification->fullmessageformat = FORMAT_PLAIN;
            $notification->fullmessagehtml = '';
            $notification->smallmessage = $notification->fullmessage;
            $notification->notification = 1;
            $notification->contexturl = (new \moodle_url('/local/orientationfeedback/inbox.php'))->out(false);
            $notification->contexturlname = get_string('inbox', 'local_orientationfeedback');
            $record->notificationstate = message_send($notification) ? 'sent' : 'failed';
        } catch (\Throwable $e) {
            $record->notificationstate = 'failed';
        }
        $DB->set_field('local_orientationfeedback', 'notificationstate', $record->notificationstate, ['id' => $record->id]);
    }

    public static function read(int $id): \stdClass {
        global $DB, $USER;
        if (!isloggedin() || isguestuser()) { self::fail('accessdenied'); }
        $record = $DB->get_record('local_orientationfeedback', ['id' => $id], '*', MUST_EXIST);
        if ((int)$record->userid !== (int)$USER->id && !self::reviewer()) { self::fail('accessdenied'); }
        return $record;
    }

    public static function audio_url(\stdClass $record): \moodle_url {
        return \moodle_url::make_pluginfile_url(\context_course::instance($record->courseid)->id,
            'local_orientationfeedback', 'audio', $record->id, '/', $record->filename);
    }

    public static function delete(\stdClass $record): void {
        global $DB;
        // Core course deletion already removes its context and files. Still retire our metadata.
        $context = \context_course::instance($record->courseid, IGNORE_MISSING);
        if ($context) {
            get_file_storage()->delete_area_files($context->id, 'local_orientationfeedback', 'audio', $record->id);
        }
        $DB->delete_records('local_orientationfeedback', ['id' => $record->id]);
    }
}
