<?php
// Presentation-only regrouping. Never write completion settings, criteria or learner evidence.
require_once __DIR__ . '/course-module-identity.php';
function orientation_publish_structure(stdClass $course, array $map): void {
    global $CFG, $DB;
    require_once $CFG->dirroot . '/mod/subsection/lib.php';
    $activities = array_column($map['activities'], null, 'slug');
    $resolved = [];
    // Bootstrap publishers can run in either order. Do not publish a partial hierarchy.
    foreach ($activities as $slug => $activity) {
        $cm = orientation_existing_module($course, $slug, $activity['module_type'], $activity['label']);
        if (!$cm) return;
        $resolved[$slug] = $cm;
    }
    $unit = $map['units'][0];
    $parent = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 1], '*', MUST_EXIST);
    course_update_section($course, $parent, (object)['name' => $unit['label'], 'summaryformat' => FORMAT_HTML,
        'summary' => '<p>' . s($unit['syllabus']) . '</p><p><a href="/local/orientation/index.php">Open Unit 1 journey</a></p>']);
    foreach ($unit['modules'] as $module) {
        $slug = $module['native_group_slug'] ?? $module['slug'];
        $legacyname = $slug === 'computer-use' ? $map['preparation_module']['label'] : $module['label'];
        $group = orientation_existing_module($course, $slug, 'subsection', $legacyname);
        if (!$group) {
            $created = add_moduleinfo((object)[
                'modulename' => 'subsection', 'module' => $DB->get_field('modules', 'id', ['name' => 'subsection'], MUST_EXIST),
                'name' => $module['label'], 'cmidnumber' => 'orientation:' . $slug,
                'section' => 1, 'visible' => 1, 'completion' => COMPLETION_TRACKING_NONE,
            ], $course);
            $group = get_coursemodule_from_id('subsection', $created->coursemodule, $course->id, false, MUST_EXIST);
        }
        set_coursemodule_name($group->id, $module['label']);
        $section = $DB->get_record('course_sections', ['course' => $course->id,
            'component' => 'mod_subsection', 'itemid' => $group->instance], '*', MUST_EXIST);
        course_update_section($course, $section, (object)['name' => $module['label'],
            'summaryformat' => FORMAT_HTML, 'summary' => '<p>' . s($module['description']) . '</p>']);
        foreach ($module['activities'] as $activityslug) {
            $activitycm = $resolved[$activityslug];
            moveto_module($activitycm, $section);
            set_coursemodule_visible($activitycm->id, $activitycm->visible);
            $DB->set_field('course_modules', 'visibleold', $activitycm->visibleold, ['id' => $activitycm->id]);
        }
        moveto_module($group, $parent);
    }
}
