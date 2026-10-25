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
        $members = []; $moduleids = []; $unitids = [];
        foreach ($map['units'] as $unit) {
            $unitids[] = $unit['slug'];
            if (!in_array($unit['status'], ['active', 'planned'], true)) throw new \RuntimeException('Invalid unit status.');
            if ($unit['status'] === 'planned' && isset($unit['journey_url'])) throw new \RuntimeException('Planned unit has a journey.');
            foreach ($unit['modules'] as $module) {
                $moduleids[] = $module['slug'];
                if ($unit['status'] === 'planned' && $module['activities']) throw new \RuntimeException('Planned unit has activities.');
                $members = array_merge($members, $module['activities']);
            }
        }
        sort($members); sort($slugs);
        if ($members !== $slugs || count(array_unique($moduleids)) !== count($moduleids) ||
                count(array_unique($unitids)) !== count($unitids)) throw new \RuntimeException('Invalid unit membership.');
        return $map;
    }
    /** Syllabus is a description, not an extra level or a completion gate. */
    public static function syllabus(array $rows = [], bool $journey = false): string {
        $html = '';
        foreach (self::map()['units'] as $unit) {
            if ($journey && $unit['status'] !== 'active') continue;
            $html .= '<section data-unit="' . s($unit['slug']) . '"><h2>' . s($unit['label']) . '</h2><p>' . s($unit['syllabus']) . '</p>';
            if ($unit['status'] === 'planned') $html .= '<p><strong>Planned — not yet available</strong></p>';
            else if (!$journey) $html .= '<p><a href="/local/orientation/index.php">Open Unit 1 journey</a></p>';
            $html .= '<ol>';
            foreach ($unit['modules'] as $module) {
                $label = s($module['label']);
                $slug = $module['activities'][0] ?? null;
                if ($journey && isset($rows[$slug])) $label = '<a href="#atlas-detail-' . s($slug) . '">' . $label . '</a>';
                $html .= '<li><strong>' . $label . '</strong>: ' . s($module['description']) . '</li>';
            }
            $html .= '</ol></section>';
        }
        return $html;
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
    /** Read native completion for the signed-in learner; reading does not award completion. */
    public static function progress(\stdClass $course): array {
        global $CFG, $USER;
        require_once($CFG->libdir . '/completionlib.php');
        $info = get_fast_modinfo($course, $USER->id);
        $completion = new \completion_info($course);
        global $DB;
        $baseline = array_filter(self::modules(), fn($activity) => $activity['baseline']);
        [$insql, $params] = $DB->get_in_or_equal(array_column($baseline, 'idnumber'), SQL_PARAMS_NAMED);
        $records = $DB->get_records_sql('SELECT cm.id, cm.idnumber, cm.deletioninprogress, m.name AS modname
            FROM {course_modules} cm JOIN {modules} m ON m.id = cm.module
            WHERE cm.course = :courseid AND cm.idnumber ' . $insql, ['courseid' => $course->id] + $params);
        $byidentity = [];
        foreach ($records as $record) $byidentity[$record->idnumber][] = $record;
        $complete = 0; $next = null; $chosen = false; $unavailable = false;
        foreach ($baseline as $activity) {
            $matches = $byidentity[$activity['idnumber']] ?? [];
            $record = count($matches) === 1 ? reset($matches) : null;
            if ($record && ($record->modname !== $activity['module_type'] || $record->deletioninprogress)) $record = null;
            $cm = $record && isset($info->cms[$record->id]) ? $info->cms[$record->id] : null;
            if (!$cm || !$cm->uservisible || !$cm->url) {
                $unavailable = true;
                if (!$chosen) $chosen = true;
                continue;
            }
            $state = $cm->completion ? (int)$completion->get_data($cm, false, $USER->id)->completionstate : 0;
            if (in_array($state, [COMPLETION_COMPLETE, COMPLETION_COMPLETE_PASS, COMPLETION_COMPLETE_FAIL], true)) $complete++;
            else if (!$chosen) { $next = ['label' => $activity['label'], 'url' => (string)$cm->url]; $chosen = true; }
        }
        return ['complete' => $complete, 'total' => 3, 'next' => $next, 'unavailable' => $unavailable];
    }
}
