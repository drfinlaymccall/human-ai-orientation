<?php
namespace local_orientation;
defined('MOODLE_INTERNAL') || die();

/** Owner-scoped small text storage. No public or caller-selected learner access. */
final class context_store {
    const TABLE = 'local_orientation_context';
    const DOCUMENTS = [
        'working' => ['title' => 'Working with me', 'fields' => ['about' => 'Relevant background', 'preferences' => 'How to communicate with me', 'boundaries' => 'Boundaries', 'instruction' => 'An instruction worth reusing']],
        'projects' => ['title' => 'My goals and projects', 'fields' => ['project' => 'My current project', 'goal' => 'Goal and success criterion', 'constraints' => 'Constraints and unknowns', 'step' => 'A useful project step']],
        'knowledge' => ['title' => 'Useful knowledge and examples', 'fields' => ['knowledge' => 'Useful information', 'source' => 'Source and date', 'limits' => 'Why it helps and its limits', 'referenceExample' => 'An example worth following']],
    ];
    const PRACTICE = ['testTask' => 'Task and criterion', 'result' => 'Observed result and one check', 'correction' => 'Correction I tried and what changed', 'keep' => 'Instruction worth keeping, and where it belongs', 'nextGoal' => 'My next goal', 'learning' => 'What I need to learn or decide myself', 'aiInformation' => 'Information the AI will need', 'nextStep' => 'First step and a checkable success criterion'];

    public static function authorise(): \stdClass {
        global $USER;
        if (!isloggedin() || isguestuser()) throw new \RuntimeException('signin', 401);
        $course = catalogue::course();
        $context = \context_course::instance($course->id);
        if ((!$course->visible && !has_capability('moodle/course:viewhiddencourses', $context)) ||
                !has_capability('local/orientation:view', $context) ||
                (!is_enrolled($context, $USER, '', true) && !has_capability('moodle/course:update', $context))) {
            throw new \RuntimeException('access', 403);
        }
        return $course;
    }
    private static function owner(int $courseid): array {
        global $USER;
        return ['userid' => (int)$USER->id, 'courseid' => $courseid];
    }
    public static function blank(): array {
        $fields = [];
        foreach (self::DOCUMENTS as $doc) $fields += array_fill_keys(array_keys($doc['fields']), '');
        $fields += array_fill_keys(array_keys(self::PRACTICE), '');
        return ['format' => 'human-ai-orientation-portfolio', 'version' => 1, 'fields' => $fields, 'reviewed' => false, 'example' => false];
    }
    public static function text($text, int $max): string {
        if (!is_string($text) || !mb_check_encoding($text, 'UTF-8') ||
                strlen(mb_convert_encoding($text, 'UTF-16LE', 'UTF-8')) > $max * 2 || str_contains($text, "\0")) {
            throw new \RuntimeException('invalid', 400);
        }
        return $text;
    }
    public static function validate($raw): array {
        $blank = self::blank();
        if (!is_array($raw) || count($raw) !== 5 || array_diff(array_keys($raw), array_keys($blank)) ||
                ($raw['format'] ?? '') !== $blank['format'] || ($raw['version'] ?? 0) !== 1 ||
                !is_bool($raw['reviewed'] ?? null) || !is_bool($raw['example'] ?? null) ||
                !is_array($raw['fields'] ?? null) || count($raw['fields']) !== count($blank['fields']) ||
                array_diff(array_keys($raw['fields']), array_keys($blank['fields']))) {
            throw new \RuntimeException('invalid', 400);
        }
        foreach ($blank['fields'] as $key => $_) self::text($raw['fields'][$key], 2000);
        return $raw;
    }
    public static function portfolio(int $courseid): array {
        global $DB;
        $record = $DB->get_record(self::TABLE, self::owner($courseid) + ['itemkey' => 'portfolio']);
        return ['id' => $record ? (int)$record->id : 0, 'revision' => $record ? (int)$record->revision : 0, 'snapshot' => $record ? self::validate(json_decode($record->body, true, 32, JSON_THROW_ON_ERROR)) : null];
    }
    public static function item(int $courseid, int $id): \stdClass {
        global $DB;
        $item = $DB->get_record(self::TABLE, self::owner($courseid) + ['id' => $id]);
        if (!$item || $item->itemkey === 'portfolio') throw new \RuntimeException('missing', 404);
        return $item;
    }
    public static function listing(int $courseid): array {
        global $DB;
        $records = $DB->get_records(self::TABLE, self::owner($courseid), 'timemodified DESC, id DESC', 'id,itemkey,title,source,revision,timemodified');
        return array_values($records);
    }
    /** Lock the entire owner's workspace so limits, initial insert and revision checks are atomic. */
    private static function change(int $courseid, callable $work) {
        global $USER;
        $lock = \core\lock\lock_config::get_lock_factory('local_orientation_context')->get_lock($courseid . ':' . $USER->id, 5);
        if (!$lock) throw new \RuntimeException('busy', 503);
        try { return $work(); } finally { $lock->release(); }
    }
    public static function save(int $courseid, string $key, int $revision, string $title, string $body, string $source, ?int $expectedid = null): \stdClass {
        global $DB;
        if (!preg_match('/^(portfolio|brief|trial|note_[a-f0-9]{24})$/D', $key) || $revision < 0) throw new \RuntimeException('invalid', 400);
        if ($expectedid !== null && $expectedid < 0) throw new \RuntimeException('invalid', 400);
        if (!isset(catalogue::modules()[$source])) throw new \RuntimeException('invalid', 400);
        self::text($title, 160);
        if (!trim($title)) throw new \RuntimeException('invalid', 400);
        if ($key === 'portfolio') {
            self::validate(json_decode($body, true, 32, JSON_THROW_ON_ERROR));
        } else {
            self::text($body, 20000);
        }
        return self::change($courseid, function() use ($courseid, $key, $revision, $title, $body, $source, $expectedid, $DB) {
            $where = self::owner($courseid);
            $record = $DB->get_record(self::TABLE, $where + ['itemkey' => $key]);
            if (($record ? (int)$record->revision : 0) !== $revision ||
                    ($expectedid !== null && ($record ? (int)$record->id : 0) !== $expectedid)) {
                throw new \RuntimeException('conflict', 409);
            }
            if (!$record && $key !== 'portfolio' && $DB->count_records_select(self::TABLE,
                    'userid = :userid AND courseid = :courseid AND itemkey <> :portfolio', $where + ['portfolio' => 'portfolio']) >= 50) {
                throw new \RuntimeException('limit', 400);
            }
            $next = (object)($where + ['itemkey' => $key, 'title' => $title, 'body' => $body, 'source' => $source,
                'revision' => $revision + 1, 'timemodified' => time()]);
            if ($record) {
                $next->id = $record->id;
                $next->timecreated = $record->timecreated;
                $DB->update_record(self::TABLE, $next);
            } else {
                $next->timecreated = time();
                $next->id = $DB->insert_record(self::TABLE, $next);
            }
            return $next;
        });
    }
    public static function delete(int $courseid, int $id, int $revision): void {
        global $DB;
        self::change($courseid, function() use ($courseid, $id, $revision, $DB) {
            $item = self::item($courseid, $id);
            if ((int)$item->revision !== $revision) throw new \RuntimeException('conflict', 409);
            $DB->delete_records(self::TABLE, self::owner($courseid) + ['id' => $id]);
        });
    }
    public static function markdown(array $snapshot, string $document): string {
        $definition = $document === 'practice' ? ['title' => 'My private practice record', 'fields' => self::PRACTICE] : (self::DOCUMENTS[$document] ?? null);
        if (!$definition) throw new \RuntimeException('invalid', 400);
        $parts = [];
        foreach ($definition['fields'] as $key => $label) {
            if (trim($snapshot['fields'][$key])) $parts[] = '## ' . $label . "\n" . $snapshot['fields'][$key];
        }
        if (!$parts) return '';
        $prefix = $document === 'practice' ? '' : (($snapshot['example'] ? "Fictional practice example, authored for Human AI Orientation; edits may have been made.\n\n" : '') . ($snapshot['reviewed'] ? 'Review status: reviewed by the learner.' : 'Review status: draft — review before sharing.') . "\n\n");
        return $prefix . '# ' . $definition['title'] . "\n\n" . implode("\n\n", $parts) . "\n";
    }
}
