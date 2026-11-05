<?php
namespace local_orientation;
defined('MOODLE_INTERNAL') || die();

/** Supported Moodle navigation extensions; never changes login/session continuation. */
class navigation {
    public static function primary(\core\hook\navigation\primary_extend $hook): void {
        if (!isloggedin() || isguestuser()) return;
        $nav = $hook->get_primaryview();
        $nav->add('Your course journey', new \moodle_url('/local/orientation/index.php'), \navigation_node::TYPE_CUSTOM, null, 'orientation-journey');
        $nav->add('Help', new \moodle_url('/help'), \navigation_node::TYPE_CUSTOM, null, 'orientation-help');
        if (self::ordinary_learner()) {
            foreach (['myhome', 'mycourses'] as $key) {
                if ($node = $nav->get($key)) $node->remove();
            }
        }
    }
    public static function homepage(\core_user\hook\extend_default_homepage $hook): void {
        $hook->add_option(new \core\url('/local/orientation/index.php'), 'Your course journey');
    }
    public static function ordinary_learner(): bool {
        global $PAGE, $USER, $CFG;
        if (!isloggedin() || isguestuser() || is_siteadmin()) return false;
        require_once($CFG->libdir . '/enrollib.php');
        try {
            $course = catalogue::course();
        } catch (\dml_missing_record_exception $e) {
            return false;
        }
        $context = \context_course::instance($course->id);
        if (!$course->visible && !has_capability('moodle/course:viewhiddencourses', $context)) return false;
        if (!is_enrolled($context, $USER, '', true) || !has_capability('local/orientation:view', $context)) return false;
        if (has_any_capability(['moodle/course:update', 'moodle/course:manageactivities', 'moodle/grade:viewall'], $context)) return false;
        // Account and enrolment pages use the site context; another course keeps its own navigation.
        if ($PAGE->course->id != SITEID && $PAGE->course->id != $course->id) return false;
        foreach (enrol_get_all_users_courses($USER->id, true) as $enrolled) {
            if ($enrolled->id != $course->id) return false;
        }
        return true;
    }
}
