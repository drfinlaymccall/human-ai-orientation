<?php
namespace local_orientation;
defined('MOODLE_INTERNAL') || die();

/**
 * A small list of people who asked to be told about one named thing, such as a new unit.
 * Rows are not linked to course accounts. Nothing here sends mail.
 */
class notify {
    public const TABLE = 'local_orientation_notify';
    /** Topics a visitor may ask about. Add a topic here before offering it on a page. */
    public const TOPICS = ['unit-2' => 'Unit 2: Introduction to Agentic Systems'];
    /** New addresses accepted per hour across the site; a brake on automated abuse of an open form. */
    public const HOURLY_LIMIT = 60;

    /** Normalise an address; null when it is not a usable email address. */
    public static function clean(string $email): ?string {
        $email = \core_text::strtolower(trim($email));
        return ($email !== '' && \core_text::strlen($email) <= 255 && validate_email($email)) ? $email : null;
    }

    /** @return string added|exists|invalid|busy */
    public static function add(string $email, string $topic, ?int $now = null): string {
        global $DB;
        $email = self::clean($email);
        if ($email === null || !isset(self::TOPICS[$topic])) return 'invalid';
        if ($DB->record_exists(self::TABLE, ['email' => $email, 'topic' => $topic])) return 'exists';
        $now ??= time();
        if ($DB->count_records_select(self::TABLE, 'timecreated > ?', [$now - HOURSECS]) >= self::HOURLY_LIMIT) return 'busy';
        try {
            $DB->insert_record(self::TABLE, ['email' => $email, 'topic' => $topic, 'token' => random_string(40), 'timecreated' => $now]);
        } catch (\dml_write_exception $e) {
            // Two requests for the same address at once: the unique index keeps one row.
            return 'exists';
        }
        return 'added';
    }

    /** The row a removal link names, or null. */
    public static function find(string $token): ?\stdClass {
        global $DB;
        if (!preg_match('/^[A-Za-z0-9]{40}$/', $token)) return null;
        return $DB->get_record(self::TABLE, ['token' => $token]) ?: null;
    }

    public static function remove(string $token): bool {
        global $DB;
        $row = self::find($token);
        if (!$row) return false;
        $DB->delete_records(self::TABLE, ['id' => $row->id]);
        return true;
    }

    public static function removal_url(\stdClass $row): string {
        global $CFG;
        return $CFG->wwwroot . '/local/orientation/notify.php?remove=' . $row->token;
    }
}
