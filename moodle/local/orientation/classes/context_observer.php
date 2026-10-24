<?php
namespace local_orientation;
defined('MOODLE_INTERNAL') || die();
/** Remove saved context when its owner or course is deleted through Moodle. */
final class context_observer {
    public static function user_deleted(\core\event\user_deleted $event): void {
        global $DB;
        $DB->delete_records(context_store::TABLE, ['userid' => $event->objectid]);
    }
    public static function course_deleted(\core\event\course_deleted $event): void {
        global $DB;
        $DB->delete_records(context_store::TABLE, ['courseid' => $event->objectid]);
    }
}
