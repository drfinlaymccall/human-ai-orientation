<?php
namespace local_orientation;
defined('MOODLE_INTERNAL') || die();
class catalogue {
    public static function map(): array {
        $map = json_decode(file_get_contents(__DIR__ . '/../course-map.json'), true, 512, JSON_THROW_ON_ERROR);
        $slugs = array_column($map['activities'], 'slug');
        if (count(array_unique($slugs)) !== count($slugs)) throw new \RuntimeException('Duplicate activity slug in course map.');
        foreach ($map['activities'] as $activity) {
            if ($activity['idnumber'] !== 'orientation:' . $activity['slug']) throw new \RuntimeException('Activity stable identity does not match its slug.');
        }
        $baseline = ['first-task', 'useful-context', 'check-and-continue'];
        $actual = array_column(array_filter($map['activities'], fn($activity) => $activity['baseline'] === true), 'slug');
        if (($map['baseline_version'] ?? null) !== 1 || ($map['baseline_slugs'] ?? null) !== $baseline || $actual !== $baseline) {
            throw new \RuntimeException('The original practice baseline changed; explicit completion-policy review required.');
        }
        return $map;
    }
    public static function course(): \stdClass {
        global $DB;
        return $DB->get_record('course', ['shortname' => self::map()['course_shortname']], '*', MUST_EXIST);
    }
    public static function modules(): array {
        $map = self::map();
        return array_column($map['activities'], null, 'slug');
    }
    public static function cm(\stdClass $course, array $activity): ?\stdClass {
        global $DB;
        $matches = $DB->get_records('course_modules', ['course' => $course->id, 'idnumber' => $activity['idnumber']]);
        if (count($matches) !== 1) return null;
        $cm = reset($matches);
        $type = $DB->get_field('modules', 'name', ['id' => $cm->module]);
        return $type === $activity['module_type'] && !$cm->deletioninprogress ? $cm : null;
    }
}
