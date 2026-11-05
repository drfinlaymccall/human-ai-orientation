<?php
// Test-only native attempt writer. Refuses all non-synthetic runtime identities before any mutation.
define('CLI_SCRIPT', true);
require __DIR__ . '/../scripts/moodle-environment.php';
require_once __DIR__ . '/../scripts/synthetic-fixture.php';
if (!orientation_is_synthetic_fixture($orientationtrial, $CFG)) throw new RuntimeException('Exact synthetic fixture required.');
require_once $CFG->dirroot . '/mod/quiz/locallib.php';
$input = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
$user = $DB->get_record('user', ['username' => $input['username']], '*', MUST_EXIST);
if (!str_starts_with($user->username, 'starting') || !str_ends_with($user->email, '@example.test')) throw new RuntimeException('Fictional test account required.');
\core\session\manager::set_user($user);
if ($input['action'] === 'results') {
    echo json_encode(\local_orientation\startingpoint::results(), JSON_THROW_ON_ERROR);
    exit;
}
if ($input['action'] !== 'attempt') throw new RuntimeException('Unsupported test action.');
$registry = \local_orientation\startingpoint::registry();
$publication = $registry[$input['version'] ?? \local_orientation\startingpoint::instrument()['version']];
$quiz = \mod_quiz\quiz_settings::create($publication['quizid'], $user->id);
$last = quiz_get_user_attempts($publication['quizid'], $user->id, 'all', true);
$number = $last ? max(array_column($last, 'attempt')) + 1 : 1;
$originalshuffle = [];
try {
    // Simulate a historical native answer order without altering mappings or existing attempts.
    if (!empty($input['shuffle'])) {
        foreach ($publication['questions'] as $id => $mapping) {
            $originalshuffle[$id] = $DB->get_field('qtype_multichoice_options', 'shuffleanswers', ['questionid' => $id], MUST_EXIST);
            $DB->set_field('qtype_multichoice_options', 'shuffleanswers', 1, ['questionid' => $id]);
            question_bank::notify_question_edited($id);
        }
        $quiz->get_quiz()->shuffleanswers = 1;
    }
    $record = quiz_prepare_and_start_new_attempt($quiz, $number, null, false, [], [], $user->id);
} finally {
    foreach ($originalshuffle as $id => $value) {
        $DB->set_field('qtype_multichoice_options', 'shuffleanswers', $value, ['questionid' => $id]);
        question_bank::notify_question_edited($id);
    }
}
$attempt = \mod_quiz\quiz_attempt::create($record->id);
$responses = [];
$orders = [];
foreach ($attempt->get_slots() as $slot) {
    $qa = $attempt->get_question_attempt($slot);
    $question = $qa->get_question();
    $mapping = $publication['questions'][(string)$question->id];
    $key = $mapping['statement'] . '.' . $mapping['dimension'];
    $orders[$key] = $question->get_order($qa);
    if (!array_key_exists($key, $input['answers'] ?? [])) continue;
    $wanted = $input['answers'][$key];
    foreach ($mapping['answers'] as $answerid => $choice) {
        if ($choice['code'] === $wanted) {
            $responses[$slot] = ['answer' => clean_param($question->answers[$answerid]->answer, PARAM_NOTAGS)];
            break;
        }
    }
}
if ($responses) $attempt->process_submitted_actions(time(), false, $responses);
if (($input['state'] ?? 'finished') === 'finished') $attempt->process_finish(time(), false);
else if ($input['state'] === 'abandoned') $attempt->process_abandon(time(), false);
else if ($input['state'] !== 'inprogress') throw new RuntimeException('Unsupported test state.');
if (!empty($input['preview'])) $DB->set_field('quiz_attempts', 'preview', 1, ['id' => $record->id]);
echo json_encode(['id' => (int)$record->id, 'orders' => $orders], JSON_THROW_ON_ERROR);
