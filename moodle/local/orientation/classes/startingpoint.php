<?php
namespace local_orientation;
defined('MOODLE_INTERNAL') || die();

/** Reads only the authorised learner's native attempts against immutable publication mappings. */
class startingpoint {
    public static function instrument(): array {
        return json_decode(file_get_contents(__DIR__ . '/../starting-point.json'), true, 512, JSON_THROW_ON_ERROR);
    }

    public static function registry(): array {
        return json_decode(get_config('local_orientation', 'startingpoint_registry') ?: '{}', true, 512, JSON_THROW_ON_ERROR);
    }

    public static function publication(): ?array {
        $instrument = self::instrument();
        $publication = self::registry()[$instrument['version']] ?? null;
        $hash = hash('sha256', json_encode($instrument, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        return $publication && hash_equals($publication['hash'], $hash) ? $publication : null;
    }

    public static function enabled(): bool {
        return (bool)get_config('local_orientation', 'startingpoint_enabled') && self::publication() !== null;
    }

    public static function visible_quiz(array $publication): ?\cm_info {
        global $USER;
        $course = catalogue::course();
        $modinfo = get_fast_modinfo($course, $USER->id);
        $cm = $modinfo->cms[$publication['cmid']] ?? null;
        return $cm && $cm->modname === 'quiz' && (int)$cm->instance === (int)$publication['quizid'] && $cm->uservisible ? $cm : null;
    }

    /** No user/attempt parameter is accepted by this reader. */
    public static function results(): array {
        global $CFG, $USER;
        require_once($CFG->dirroot . '/mod/quiz/lib.php');
        $publication = self::publication();
        $result = ['finished' => null, 'unfinished' => null, 'earlier' => null];
        if (!self::enabled() || !self::visible_quiz($publication)) return $result;
        $context = \context_course::instance(catalogue::course()->id);
        require_capability('local/orientation:view', $context);
        if (!isloggedin() || isguestuser() || !is_enrolled($context, $USER, '', true)) return $result;
        $attempts = quiz_get_user_attempts($publication['quizid'], $USER->id, 'all', false);
        usort($attempts, fn($a, $b) => [(int)$b->timefinish, (int)$b->id] <=> [(int)$a->timefinish, (int)$a->id]);
        foreach ($attempts as $record) {
            if ((int)$record->userid !== (int)$USER->id || $record->preview || (int)$record->quiz !== (int)$publication['quizid']) continue;
            if ($record->state === \mod_quiz\quiz_attempt::IN_PROGRESS || $record->state === \mod_quiz\quiz_attempt::OVERDUE) {
                if (!$result['unfinished'] || $record->id > $result['unfinished']->id) $result['unfinished'] = $record;
            } else if ($record->state === \mod_quiz\quiz_attempt::FINISHED && !$result['finished']) {
                $responses = self::read($record, $publication);
                if ($responses !== null) $result['finished'] = ['attempt' => $record, 'responses' => $responses];
            }
        }
        // Earlier versions are dated historical evidence, never input to today's rule.
        if (!$result['finished']) {
            foreach (self::registry() as $older) {
                if ((int)$older['quizid'] === (int)$publication['quizid']) continue;
                foreach (quiz_get_user_attempts($older['quizid'], $USER->id, 'finished', false) as $record) {
                    if ($record->state !== \mod_quiz\quiz_attempt::FINISHED || $record->preview || (int)$record->userid !== (int)$USER->id) continue;
                    if (!$result['earlier'] || [(int)$record->timefinish, (int)$record->id] > [(int)$result['earlier']->timefinish, (int)$result['earlier']->id]) $result['earlier'] = $record;
                }
            }
        }
        return $result;
    }

    private static function read(\stdClass $record, array $publication): ?array {
        $attempt = \mod_quiz\quiz_attempt::create($record->id);
        $responses = [];
        $slots = $attempt->get_slots();
        if (count($slots) !== count($publication['questions'])) return null;
        foreach ($slots as $slot) {
            $qa = $attempt->get_question_attempt($slot);
            $question = $qa->get_question();
            $mapping = $publication['questions'][(string)$question->id] ?? null;
            if (!$mapping || !($question instanceof \qtype_multichoice_single_question)) return null;
            $raw = $qa->get_last_qt_var('answer', null);
            $response = ['value' => null, 'reason' => 'unanswered'];
            if ($raw !== null && $raw !== '' && (string)$raw !== '-1') {
                $order = $question->get_order($qa);
                if (!ctype_digit((string)$raw) || !isset($order[(int)$raw])) return null;
                $answerid = (string)$order[(int)$raw];
                $choice = $mapping['answers'][$answerid] ?? null;
                if (!$choice) return null;
                $response = ['value' => $choice['value'], 'reason' => $choice['code']];
            }
            $responses[$mapping['statement']][$mapping['dimension']] = $response;
        }
        return $responses;
    }

    public static function render(array $rows): string {
        if (!self::enabled()) return '';
        $publication = self::publication();
        if (!self::visible_quiz($publication)) return '';
        $results = self::results();
        $url = new \moodle_url('/local/orientation/startingpoint.php');
        $html = \html_writer::start_tag('section', ['data-starting-point' => '', 'aria-labelledby' => 'startingpoint-heading']);
        $html .= \html_writer::tag('h2', 'Your optional starting point', ['id' => 'startingpoint-heading']);
        $html .= \html_writer::tag('p', 'These are your own ratings, separate from activity completion. They do not award proficiency or restrict any activity.');
        if ($results['finished']) {
            $finished = $results['finished'];
            $date = userdate($finished['attempt']->timefinish, get_string('strftimedatetime', 'langconfig'));
            $suggestion = startingpoint_rule::suggest(self::instrument(), $finished['responses']);
            if ($candidate = $suggestion['candidate']) {
                $dimension = $candidate['dimension'] === 'cando' ? 'I can do this' : 'I understand this';
                $html .= \html_writer::tag('p', s('On ' . $date . ', you rated “' . $candidate['text'] . '” — ' . $dimension . ': ' . $candidate['value'] . ' of 5. This suggests a place to practise, not a judgement of ability.'));
                if (isset($rows[$candidate['activity']])) {
                    $row = $rows[$candidate['activity']];
                    $html .= \html_writer::tag('p', \html_writer::link($row['cm']->url, s(($row['complete'] ? 'Revisit: ' : 'Suggested practice: ') . $row['activity']['label']), ['data-starting-suggestion' => $candidate['activity']]));
                } else {
                    $html .= \html_writer::tag('p', 'The relevant suggested practice is currently unavailable. Choose another available activity below or ask for Help; your ordinary Continue remains separate.');
                }
            } else {
                $allcomplete = true;
                foreach (catalogue::modules() as $slug => $activity) {
                    if ($activity['baseline'] && (!isset($rows[$slug]) || !$rows[$slug]['complete'])) $allcomplete = false;
                }
                $message = $suggestion['reason'] === 'unknown' ? 'No starting-point suggestion is available from these responses; unknown ratings do not mean low ability.' :
                    ($allcomplete ? 'You reported familiarity with these statements. Revisit any available activity or choose your next goal.' : 'You reported familiarity with these statements. Choose any practice or use your ordinary Continue.');
                $html .= \html_writer::tag('p', s($message . ' Check finished ' . $date . '.'));
            }
        } else if ($results['earlier']) {
            $html .= \html_writer::tag('p', 'You have an earlier check from ' . userdate($results['earlier']->timefinish) . '. Its wording belongs to an earlier instrument; take the current check for a new suggestion.');
        } else {
            $html .= \html_writer::tag('p', 'No starting-point suggestion is available yet. Take the optional check, or choose any available activity below.');
        }
        if ($results['unfinished']) {
            $html .= \html_writer::tag('p', 'Your unfinished check does not replace any earlier dated suggestion. ' . \html_writer::link(new \moodle_url('/mod/quiz/attempt.php', ['attempt' => $results['unfinished']->id]), 'Resume check'));
        }
        $html .= \html_writer::tag('p', \html_writer::link($url, $results['finished'] ? 'Retake the optional check' : 'Find my starting point') . ' · You can choose any activity instead.');
        return $html . \html_writer::end_tag('section');
    }

    /** Supported output hook: a real link on native attempt, summary and review pages. */
    public static function attempt_navigation(\core\hook\output\before_standard_top_of_body_html_generation $hook): void {
        global $PAGE, $USER, $DB;
        if (!isloggedin() || isguestuser() || !self::enabled() || !$PAGE->has_set_url()) return;
        $cm = $PAGE->cm;
        if (!$cm || $cm->modname !== 'quiz') return;
        $known = false;
        foreach (self::registry() as $publication) if ((int)$publication['cmid'] === (int)$cm->id) $known = true;
        if (!$known || !$cm->uservisible) return;
        if ($attemptid = optional_param('attempt', 0, PARAM_INT)) {
            if (!$DB->record_exists('quiz_attempts', ['id' => $attemptid, 'quiz' => $cm->instance, 'userid' => $USER->id, 'preview' => 0])) return;
        }
        // The supported top-of-body hook precedes Boost's fixed navbar. Leave real space below it.
        $hook->add_html(\html_writer::tag('aside', \html_writer::link(new \moodle_url('/local/orientation/index.php'), 'Skip this check / Back to your course journey', ['style' => 'scroll-margin-top:5rem']) .
            \html_writer::tag('p', 'Leaving does not submit your check. Use Next page or Previous page to save choices before leaving; return to Resume check later.'),
            ['class' => 'container-fluid pb-2', 'style' => 'padding-top:4.5rem', 'data-starting-navigation' => '']));
    }
}
