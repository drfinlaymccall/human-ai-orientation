<?php
// Synthetic API contract test for the regrouping helper. Not a Moodle integration test.
define('MOODLE_INTERNAL', true);
define('MUST_EXIST', true);
define('FORMAT_HTML', 1);
define('COMPLETION_TRACKING_NONE', 0);
function s($text) { return htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); }
class StructureDB {
    public array $tables = [];
    public function get_records($table, $where = []) {
        return array_filter($this->tables[$table] ?? [], function($record) use ($where) {
            foreach ($where as $key => $value) if (($record->$key ?? null) != $value) return false;
            return true;
        });
    }
    public function get_record($table, $where, ...$unused) {
        $records = $this->get_records($table, $where);
        return $records ? clone reset($records) : false;
    }
    public function get_field($table, $field, $where, ...$unused) {
        return $this->get_record($table, $where)->$field;
    }
    public function set_field($table, $field, $value, $where) {
        foreach ($this->get_records($table, $where) as $record) $record->$field = $value;
    }
}
function set_coursemodule_idnumber($id, $value) { global $DB; $DB->tables['course_modules'][$id]->idnumber = $value; }
function set_coursemodule_name($id, $value) {
    global $DB;
    $cm = $DB->tables['course_modules'][$id];
    $type = $DB->tables['modules'][$cm->module]->name;
    $DB->tables[$type][$cm->instance]->name = $value;
}
function set_coursemodule_visible($id, $value) { global $DB; $DB->tables['course_modules'][$id]->visible = $value; }
function get_coursemodule_from_id($type, $id, ...$unused) { global $DB; return clone $DB->tables['course_modules'][$id]; }
function course_update_section($course, $section, $update) {
    global $DB;
    foreach ((array)$update as $key => $value) $DB->tables['course_sections'][$section->id]->$key = $value;
}
function moveto_module($cm, $section) {
    global $DB;
    foreach ($DB->tables['course_sections'] as $record) {
        $sequence = array_values(array_filter(explode(',', $record->sequence), fn($id) => $id !== '' && (int)$id !== $cm->id));
        if ($record->id === $section->id) $sequence[] = $cm->id;
        $record->sequence = implode(',', $sequence);
    }
    $DB->tables['course_modules'][$cm->id]->section = $section->id;
}
function add_moduleinfo($definition, $course) {
    global $DB;
    $id = max(array_keys($DB->tables['course_modules'])) + 1;
    $sectionid = max(array_keys($DB->tables['course_sections'])) + 1;
    $DB->tables['subsection'][$id] = (object)['id' => $id, 'course' => $course->id, 'name' => $definition->name];
    $DB->tables['course_modules'][$id] = (object)['id' => $id, 'course' => $course->id, 'module' => 3,
        'instance' => $id, 'section' => 1, 'idnumber' => $definition->cmidnumber,
        'visible' => 1, 'visibleold' => 1, 'deletioninprogress' => 0, 'completion' => $definition->completion];
    $DB->tables['course_sections'][$sectionid] = (object)['id' => $sectionid, 'course' => $course->id,
        'section' => $sectionid, 'component' => 'mod_subsection', 'itemid' => $id, 'sequence' => '', 'visible' => 1];
    return (object)['coursemodule' => $id];
}
$root = dirname(__DIR__);
$map = json_decode(file_get_contents($root . '/content/course-map.json'), true, 512, JSON_THROW_ON_ERROR);
$DB = new StructureDB();
$course = (object)['id' => 2];
foreach (['page', 'lesson', 'subsection'] as $i => $name) $DB->tables['modules'][$i + 1] = (object)['id' => $i + 1, 'name' => $name];
$DB->tables['course_sections'][1] = (object)['id' => 1, 'section' => 1, 'course' => 2, 'sequence' => '', 'visible' => 1];
foreach ($map['activities'] as $i => $activity) {
    $id = $i + 10;
    $type = $activity['module_type'];
    $DB->tables[$type][$id] = (object)['id' => $id, 'course' => 2, 'name' => $activity['label']];
    $DB->tables['course_modules'][$id] = (object)['id' => $id, 'instance' => $id, 'course' => 2,
        'module' => $type === 'lesson' ? 2 : 1, 'section' => 1, 'idnumber' => $activity['idnumber'],
        'completion' => $activity['baseline'] ? 1 : 0, 'visible' => $i === 0 ? 0 : 1, 'visibleold' => 1, 'deletioninprogress' => 0];
}
// Pre-existing wrapper, native identity and mock learner evidence.
$old = add_moduleinfo((object)['name' => $map['preparation_module']['label'], 'cmidnumber' => 'orientation:computer-use', 'completion' => 0], $course);
$DB->tables['course_modules_completion'][1] = (object)['id' => 1, 'coursemoduleid' => 10, 'completionstate' => 1];
$DB->tables['local_orientation_context'][1] = (object)['id' => 1, 'content' => 'Synthetic saved context'];
$before = unserialize(serialize($DB->tables));
$temp = tempnam(sys_get_temp_dir(), 'orientation-api-'); unlink($temp);
mkdir($temp); mkdir($temp . '/mod'); mkdir($temp . '/mod/subsection');
file_put_contents($temp . '/mod/subsection/lib.php', '<?php // Synthetic dependency.');
$CFG = (object)['dirroot' => $temp];
try {
    require $root . '/scripts/course-unit-structure.php';
    orientation_publish_structure($course, $map);
    $once = serialize($DB->tables);
    orientation_publish_structure($course, $map);
    if ($once !== serialize($DB->tables)) throw new RuntimeException('Regrouping is not idempotent.');
    if (count($DB->tables['subsection']) !== 7) throw new RuntimeException('Expected seven module wrappers.');
    if ($DB->tables['course_modules'][$old->coursemodule]->idnumber !== 'orientation:computer-use') throw new RuntimeException('Legacy wrapper replaced.');
    foreach ($before['course_modules'] as $id => $cm) {
        foreach (['id', 'instance', 'module', 'idnumber', 'completion', 'visible', 'visibleold'] as $key) {
            if ($DB->tables['course_modules'][$id]->$key !== $cm->$key) throw new RuntimeException('Changed existing ' . $key);
        }
    }
    foreach (['course_modules_completion', 'local_orientation_context'] as $table) {
        if (serialize($DB->tables[$table]) !== serialize($before[$table])) throw new RuntimeException('Changed evidence.');
    }
    echo "PASS synthetic regrouping twice: stable IDs, seven wrappers, visibility, completion and context unchanged\n";
} finally {
    unlink($temp . '/mod/subsection/lib.php'); rmdir($temp . '/mod/subsection'); rmdir($temp . '/mod'); rmdir($temp);
}
