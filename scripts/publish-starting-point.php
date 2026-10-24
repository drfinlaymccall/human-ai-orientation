<?php
// Additive native Quiz publication. Existing questions, quizzes and attempts are never replaced.
define('CLI_SCRIPT', true);
require __DIR__ . '/moodle-environment.php';
require_once __DIR__ . '/synthetic-fixture.php';
require_once $CFG->dirroot . '/course/modlib.php';
require_once $CFG->dirroot . '/mod/quiz/locallib.php';
require_once $CFG->libdir . '/questionlib.php';

$action = $argv[1] ?? 'status';
if (!in_array($action, ['status', 'publish', 'enable-fixture', 'disable'], true)) throw new RuntimeException('Use status, publish, enable-fixture or disable.');
$fixture = orientation_is_synthetic_fixture($orientationtrial, $CFG);
$source = dirname(__DIR__) . '/content/starting-point.json';
if (isset($argv[2])) {
    if (!$fixture) throw new RuntimeException('Alternate instruments are restricted to the synthetic fixture.');
    $source = $argv[2];
}
$instrument = json_decode(file_get_contents($source), true, 512, JSON_THROW_ON_ERROR);
if (!preg_match('/^[a-z0-9][a-z0-9.-]{0,79}$/D', $instrument['version'] ?? '') ||
        ($instrument['rule_version'] ?? '') !== 'starting-point-v1' ||
        array_column($instrument['statements'] ?? [], 'id') !== ['SP1', 'SP2', 'SP3', 'SP4', 'SP5', 'SP6'] ||
        array_keys($instrument['dimensions'] ?? []) !== ['understanding', 'cando'] ||
        array_column($instrument['unknown_choices'] ?? [], 'code') !== ['unsure', 'skip']) {
    throw new RuntimeException('Invalid six-pair starting-point instrument.');
}
$activities = \local_orientation\catalogue::modules();
foreach ($instrument['statements'] as $statement) {
    if (empty($statement['text']) || !isset($activities[$statement['activity']])) throw new RuntimeException('Invalid statement destination.');
}
foreach ($instrument['dimensions'] as $dimension) if (count($dimension['anchors']) !== 5 || empty($dimension['label'])) throw new RuntimeException('Five labelled anchors required.');
$hash = hash('sha256', json_encode($instrument, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
$version = $instrument['version'];
if ($action !== 'status') {
    $publicationlock = \core\lock\lock_config::get_lock_factory('local_orientation')->get_lock('startingpoint-publication', 10);
    if (!$publicationlock) throw new RuntimeException('Another starting-point publication is in progress.');
    register_shutdown_function(static function () use ($publicationlock): void { $publicationlock->release(); });
}
$registry = \local_orientation\startingpoint::registry();
if (isset($registry[$version]) && !hash_equals($registry[$version]['hash'], $hash)) throw new RuntimeException('Published instrument is immutable. Use a new version; retain the original quiz and attempts.');
if ($action === 'status') {
    echo json_encode(['version' => $version, 'published' => isset($registry[$version]),
        'enabled' => (bool)get_config('local_orientation', 'startingpoint_enabled'),
        'privacy_review_required' => !$fixture], JSON_PRETTY_PRINT) . PHP_EOL;
    exit;
}
if ($action === 'enable-fixture' && !$fixture) throw new RuntimeException('Only the exact guarded synthetic fixture can bypass owner review. Live publication stays hidden until Finlay reviews saved-rating privacy/help copy.');
\core\session\manager::set_user(get_admin());
$course = \local_orientation\catalogue::course();
$PAGE->set_course($course);
$PAGE->set_context(context_course::instance($course->id));
$fingerprint = function () use ($DB, $course): array {
    $out = [];
    foreach (['lesson_attempts', 'lesson_grades', 'lesson_branch', 'lesson_timer', 'lesson_answers', 'course_modules_completion',
        'course_completions', 'course_completion_criteria', 'quiz_attempts', 'quiz_grades', 'grade_grades', 'question_attempts',
        'question_attempt_steps', 'question_attempt_step_data'] as $table) $out[$table] = hash('sha256', serialize($DB->get_records($table, null, 'id')));
    // Preserve every previously existing activity identity; the new optional quiz is additive.
    $out['modules'] = $DB->get_records('course_modules', ['course' => $course->id], 'id', 'id,module,instance,idnumber,completion,completionview,completiongradeitemnumber,completionpassgrade');
    return $out;
};
$before = $fingerprint();
$transaction = $DB->start_delegated_transaction();
if ($action === 'disable') {
    set_config('startingpoint_enabled', 0, 'local_orientation');
    foreach ($registry as $publication) set_coursemodule_visible($publication['cmid'], 0);
} else if (!isset($registry[$version])) {
    // No existing identity may be adopted silently after a lost mapping.
    $identity = 'orientation:starting-point:' . $version;
    if ($DB->record_exists('course_modules', ['course' => $course->id, 'idnumber' => $identity])) throw new RuntimeException('Existing quiz has no immutable mapping; operator review required.');
    $intro = '<p>Optional: six statements with two separate ratings each — twelve responses. No answer is preselected. Choose 1–5, Not sure, Skip this rating, or leave an item unanswered. These are subjective self-ratings, not a test of ability.</p>' .
        '<p>Moodle saves your answers and dated attempts, including unfinished work, on Finlay’s server. Finlay can access them for course support. Suggestions use your latest finished compatible check; an unfinished check does not replace it. Retakes retain earlier attempts. No ratings award completion or proficiency; no answers are sent to an AI provider.</p>' .
        '<p>Use Next page or Previous page to save before leaving. You can resume an unfinished attempt or submit a partly answered one. There is no timer and you can retake freely.</p>' .
        '<p><a href="/local/orientation/index.php">Skip this check / Back to your course journey</a> · <a href="/privacy">About your information</a> · <a href="/help">Help or request a copy/deletion</a></p>';
    $module = (object)[
        'modulename' => 'quiz', 'module' => $DB->get_field('modules', 'id', ['name' => 'quiz'], MUST_EXIST),
        'name' => $instrument['title'], 'cmidnumber' => $identity, 'section' => 1, 'visible' => 0,
        'intro' => $intro, 'introformat' => FORMAT_HTML, 'showdescription' => 0, 'completion' => COMPLETION_TRACKING_NONE,
        'completionview' => 0, 'completionusegrade' => 0, 'completionpassgrade' => 0, 'completionattemptsexhausted' => 0,
        'completionminattempts' => 0, 'gradepass' => 0, 'grade' => 0, 'sumgrades' => 0,
        'timeopen' => 0, 'timeclose' => 0, 'timelimit' => 0, 'overduehandling' => 'autoabandon', 'graceperiod' => 0,
        'preferredbehaviour' => 'deferredfeedback', 'canredoquestions' => 0, 'attempts' => 0, 'attemptonlast' => 0,
        'grademethod' => QUIZ_GRADEHIGHEST, 'decimalpoints' => 0, 'questiondecimalpoints' => -1,
        'questionsperpage' => 4, 'navmethod' => 'free', 'shuffleanswers' => 0,
        'quizpassword' => '', 'subnet' => '', 'browsersecurity' => '-', 'delay1' => 0, 'delay2' => 0,
        'showuserpicture' => 0, 'showblocks' => 0, 'showfeedback' => 0,
        'attemptduring' => 1, 'attemptimmediately' => 1, 'attemptopen' => 1, 'attemptclosed' => 1,
    ];
    $module = add_moduleinfo($module, $course);
    $quiz = $DB->get_record('quiz', ['id' => $module->instance], '*', MUST_EXIST);
    $category = question_make_default_categories([context_course::instance($course->id)]);
    $emptyeditor = ['text' => '', 'format' => FORMAT_HTML, 'itemid' => 0];
    $questions = [];
    $number = 0;
    foreach ($instrument['statements'] as $statement) {
        foreach ($instrument['dimensions'] as $dimensionid => $dimension) {
            $choices = [];
            foreach ($dimension['anchors'] as $index => $anchor) $choices[] = ['code' => 'rating-' . ($index + 1), 'value' => $index + 1, 'label' => ($index + 1) . ' — ' . $anchor];
            foreach ($instrument['unknown_choices'] as $unknown) $choices[] = ['code' => $unknown['code'], 'value' => null, 'label' => $unknown['label']];
            $form = (object)[
                'category' => (string)$category->id, 'name' => $statement['id'] . ' ' . $dimension['label'],
                'idnumber' => $version . ':' . $statement['id'] . ':' . $dimensionid,
                'questiontext' => ['text' => '<p><strong>' . s($statement['text']) . '</strong></p><p>' . s($dimension['label']) . '</p>', 'format' => FORMAT_HTML, 'itemid' => 0],
                'generalfeedback' => $emptyeditor, 'defaultmark' => 0, 'penalty' => 0,
                'single' => 1, 'shuffleanswers' => 0, 'answernumbering' => 'none', 'showstandardinstruction' => 0,
                'correctfeedback' => $emptyeditor, 'partiallycorrectfeedback' => $emptyeditor, 'incorrectfeedback' => $emptyeditor,
                'shownumcorrect' => 0, 'answer' => [], 'fraction' => [], 'feedback' => [],
            ];
            foreach ($choices as $choice) {
                $form->answer[] = ['text' => s($choice['label']), 'format' => FORMAT_HTML, 'itemid' => 0];
                // Native single-choice requires max fraction=1. Every choice is equally valid, zero marks.
                $form->fraction[] = 1;
                $form->feedback[] = $emptyeditor;
            }
            $question = question_bank::get_qtype('multichoice')->save_question((object)['qtype' => 'multichoice'], $form);
            quiz_add_quiz_question($question->id, $quiz, (int)floor($number / 4) + 1, 0);
            $answers = $DB->get_records('question_answers', ['question' => $question->id], 'id');
            if (count($answers) !== count($choices)) throw new RuntimeException('Native answers do not match the instrument.');
            $answerMapping = [];
            foreach (array_values($answers) as $index => $answer) $answerMapping[(string)$answer->id] = ['code' => $choices[$index]['code'], 'value' => $choices[$index]['value']];
            $questions[(string)$question->id] = ['statement' => $statement['id'], 'dimension' => $dimensionid, 'answers' => $answerMapping];
            $number++;
        }
    }
    $structure = \mod_quiz\structure::create_for_quiz(\mod_quiz\quiz_settings::create($quiz->id));
    foreach ($DB->get_records('quiz_slots', ['quizid' => $quiz->id], 'slot') as $slot) $structure->update_slot_version($slot->id, 1);
    $initialsection = $DB->get_record('quiz_sections', ['quizid' => $quiz->id, 'firstslot' => 1], '*', MUST_EXIST);
    $structure->set_section_heading($initialsection->id, 'Useful tasks and clear instructions');
    $structure->add_section_heading(2, 'Helpful context and checking results');
    $structure->add_section_heading(3, 'Keeping context and choosing a next step');
    $registry[$version] = ['hash' => $hash, 'version' => $version, 'quizid' => (int)$quiz->id,
        'cmid' => (int)$module->coursemodule, 'instrument' => $instrument, 'questions' => $questions];
    set_config('startingpoint_registry', json_encode($registry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), 'local_orientation');
    // A new version must pass its own gate even if an earlier version was enabled.
    set_config('startingpoint_enabled', 0, 'local_orientation');
}
if ($action === 'enable-fixture') {
    set_coursemodule_visible($registry[$version]['cmid'], 1);
    set_config('startingpoint_enabled', 1, 'local_orientation');
}
$after = $fingerprint();
foreach ($before as $table => $value) {
    if ($table === 'modules') {
        foreach ($value as $id => $module) if (!isset($after['modules'][$id]) || $after['modules'][$id] != $module) throw new RuntimeException('Existing activity identity/completion changed; rolling back.');
    } else if ($value !== $after[$table]) throw new RuntimeException('Existing learner evidence changed; rolling back.');
}
$transaction->allow_commit();
rebuild_course_cache($course->id, true);
echo json_encode(['version' => $version, 'quizid' => $registry[$version]['quizid'] ?? null, 'cmid' => $registry[$version]['cmid'] ?? null,
    'enabled' => (bool)get_config('local_orientation', 'startingpoint_enabled'), 'evidence_unchanged' => true,
    'gate' => $fixture ? 'Synthetic fixture only; no owner approval claimed.' : 'Hidden: Finlay must review the new saved-rating privacy/help wording before exposure.'], JSON_PRETTY_PRINT) . PHP_EOL;
