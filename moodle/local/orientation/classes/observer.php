<?php
namespace local_orientation;
defined('MOODLE_INTERNAL') || die();
class observer {
    public static function user_created(\core\event\user_created $event): void {
        global $CFG, $DB;
        $user = $DB->get_record('user', ['id' => $event->objectid], '*', MUST_EXIST);
        if ($user->auth !== 'email') return;
        $wanted = get_user_preferences('auth_email_wantsurl', '', $user);
        if (!$wanted) return;
        $url = parse_url($wanted);
        $site = parse_url($CFG->wwwroot);
        if (!$url || ($url['scheme'] ?? '') !== $site['scheme'] || ($url['host'] ?? '') !== $site['host'] ||
                ($url['port'] ?? null) !== ($site['port'] ?? null) || isset($url['user']) || isset($url['pass'])) return;
        if (!is_readable(__DIR__ . '/../course-map.json')) return;
        try { $map = catalogue::map(); } catch (\Throwable $error) { return; }
        if (empty($map['course_shortname']) || empty($map['activities'])) return;
        $course = $DB->get_record('course', ['shortname' => $map['course_shortname']]);
        if (!$course) return;
        parse_str($url['query'] ?? '', $query);
        if (!isset($query['id']) || !is_scalar($query['id']) || !ctype_digit((string)$query['id'])) return;
        foreach (catalogue::modules() as $slug => $activity) {
            $cm = catalogue::cm($course, $activity);
            if ($cm && (int)$query['id'] === (int)$cm->id && ($url['path'] ?? '') ===
                    ($site['path'] ?? '') . '/mod/' . $activity['module_type'] . '/view.php') {
                set_user_preference('auth_email_wantsurl', (new \moodle_url('/local/orientation/index.php', ['module' => $slug]))->out(false), $user);
                return;
            }
        }
    }
}
