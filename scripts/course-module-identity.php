<?php
function orientation_validate_baseline(array $map): void {
    $slugs = array_column($map['activities'], 'slug');
    if (count(array_unique($slugs)) !== count($slugs)) throw new RuntimeException('Duplicate activity slug in course map.');
    foreach ($map['activities'] as $activity) {
        if ($activity['idnumber'] !== 'orientation:' . $activity['slug']) throw new RuntimeException('Activity stable identity does not match its slug.');
    }
    $members = []; $groups = []; $unitids = [];
    foreach ($map['units'] as $unit) {
        $unitids[] = $unit['slug'];
        if (!in_array($unit['status'], ['active', 'planned'], true)) throw new RuntimeException('Invalid unit status.');
        if ($unit['status'] === 'planned' && isset($unit['journey_url'])) throw new RuntimeException('Planned journey is not available.');
        foreach ($unit['modules'] as $module) {
            $groups[] = $module['native_group_slug'] ?? $module['slug'];
            if ($unit['status'] === 'planned' && $module['activities']) throw new RuntimeException('Planned activities are not available.');
            $members = array_merge($members, $module['activities']);
        }
    }
    $expected = $slugs; sort($members); sort($expected);
    if ($members !== $expected || count(array_unique($groups)) !== count($groups) ||
            count(array_unique($unitids)) !== count($unitids)) throw new RuntimeException('Invalid unit membership.');
    $baseline = ['first-task', 'useful-context', 'check-and-continue'];
    $actual = array_column(array_filter($map['activities'], fn($activity) => $activity['baseline'] === true), 'slug');
    if (($map['baseline_version'] ?? null) !== 1 || ($map['baseline_slugs'] ?? null) !== $baseline || $actual !== $baseline) {
        throw new RuntimeException('The original practice baseline changed; explicit completion-policy review required.');
    }
}
// Shared by additive publishing tools. Resolve an adopted identity before a display name.
function orientation_existing_module(stdClass $course, string $slug, string $type, string $legacyname, ?string $manifestfile = null, ?string $manifestkey = null): ?stdClass {
    global $DB;
    $idnumber = 'orientation:' . $slug;
    $matches = $DB->get_records('course_modules', ['course' => $course->id, 'idnumber' => $idnumber]);
    if (count($matches) > 1) throw new RuntimeException('Conflicting stable module identity: ' . $slug);
    $stable = $matches ? reset($matches) : false;
    $knownid = null;
    if ($manifestfile && is_file($manifestfile)) {
        $manifest = json_decode(file_get_contents($manifestfile), true, 512, JSON_THROW_ON_ERROR);
        $knownid = $manifest[$manifestkey ?? $slug] ?? null;
        if ($knownid !== null && ((!is_int($knownid) && !is_string($knownid)) || !ctype_digit((string)$knownid) || (int)$knownid <= 0)) throw new RuntimeException('Invalid existing module manifest.');
    }
    if ($stable && $knownid !== null && (int)$knownid !== (int)$stable->id) throw new RuntimeException('Stable identity conflicts with adopted module manifest: ' . $slug);
    $cm = $stable ?: ($knownid !== null ? $DB->get_record('course_modules', ['id' => (int)$knownid]) : false);
    if ($knownid !== null && !$cm) throw new RuntimeException('An adopted module is missing; manual review required: ' . $slug);
    if (!$cm) {
        $pages = $DB->get_records($type, ['course' => $course->id, 'name' => $legacyname]);
        if (count($pages) > 1) throw new RuntimeException('Ambiguous legacy module name: ' . $slug);
        if (!$pages) return null;
        $record = reset($pages);
        $cm = get_coursemodule_from_instance($type, $record->id, $course->id, false, MUST_EXIST);
    }
    $modulename = $DB->get_field('modules', 'name', ['id' => $cm->module], MUST_EXIST);
    if ((int)$cm->course !== (int)$course->id || $modulename !== $type || $cm->deletioninprogress ||
            (!empty($cm->idnumber) && $cm->idnumber !== $idnumber)) throw new RuntimeException('Existing module cannot be safely adopted: ' . $slug);
    $DB->get_record($type, ['id' => $cm->instance, 'course' => $course->id], '*', MUST_EXIST);
    if ($cm->idnumber !== $idnumber) {
        set_coursemodule_idnumber($cm->id, $idnumber);
        $cm->idnumber = $idnumber;
    }
    return $cm;
}
