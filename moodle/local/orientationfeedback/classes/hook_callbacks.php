<?php
namespace local_orientationfeedback;
defined('MOODLE_INTERNAL') || die();
final class hook_callbacks {
    public static function before_course_deleted(\core_course\hook\before_course_deleted $hook): void {
        \local_orientationfeedback\privacy\provider::delete_data_for_all_users_in_context(
            \context_course::instance($hook->course->id));
    }

    public static function head_assets(\core\hook\output\before_standard_head_html_generation $hook): void {
        global $PAGE;
        if (!isloggedin() || isguestuser() || !get_config('local_orientationfeedback', 'enabled') ||
                (int)$PAGE->course->id !== (int)get_config('local_orientationfeedback', 'courseid') ||
                strpos($PAGE->url->get_path(), '/local/orientationfeedback/') !== false) { return; }
        $PAGE->requires->js(new \moodle_url('/local/orientationfeedback/launcher.js'));
        $PAGE->requires->css(new \moodle_url('/local/orientationfeedback/launcher.css'));
    }

    public static function footer(\core\hook\output\before_footer_html_generation $hook): void {
        global $PAGE;
        if (!isloggedin() || isguestuser() ||
                (int)$PAGE->course->id !== (int)get_config('local_orientationfeedback', 'courseid') ||
                strpos($PAGE->url->get_path(), '/local/orientationfeedback/') !== false) {
            return;
        }
        try {
            $cmid = $PAGE->cm ? (int)$PAGE->cm->id : 0;
            service::validate_context((int)$PAGE->course->id, $cmid);
            $url = new \moodle_url('/local/orientationfeedback/index.php', [
                'courseid' => $PAGE->course->id, 'cmid' => $cmid,
            ]);
            $hook->add_html(\html_writer::link($url, get_string('launcher', 'local_orientationfeedback'),
                ['class' => 'of-trigger', 'data-feedback-launcher' => '']));
        } catch (\moodle_exception $e) {
            // A hidden or unavailable activity must not expose a feedback entry.
        }
    }
}
