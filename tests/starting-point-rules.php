<?php
// Portable direct invariants. No Moodle runtime, learner records or network required.
require __DIR__ . '/../moodle/local/orientation/classes/startingpoint_rule.php';
$instrument = json_decode(file_get_contents(__DIR__ . '/../content/starting-point.json'), true, 512, JSON_THROW_ON_ERROR);
$assert = function ($condition, string $message): void { if (!$condition) throw new RuntimeException($message); };
$ratings = function (int $value): array {
    $out = [];
    for ($i = 1; $i <= 6; $i++) foreach (['understanding', 'cando'] as $dimension) $out['SP' . $i][$dimension] = ['value' => $value, 'reason' => 'rating-' . $value];
    return $out;
};
$suggest = fn($responses) => \local_orientation\startingpoint_rule::suggest($instrument, $responses);
$r = $suggest($ratings(1)); $assert($r['candidate']['statement'] === 'SP1', 'All low uses stable SP1 tie break.');
$r = $ratings(5); $r['SP3']['cando']['value'] = 2; $s = $suggest($r); $assert($s['candidate']['activity'] === 'useful-context' && $s['candidate']['dimension'] === 'cando', 'Low can-do independent of high understanding.');
$r = $ratings(5); $r['SP4']['understanding']['value'] = 1; $s = $suggest($r); $assert($s['candidate']['statement'] === 'SP4' && $s['candidate']['dimension'] === 'understanding', 'Low understanding independent of high can-do.');
$r = $ratings(5); $r['SP5']['cando']['value'] = 3; $r['SP6']['cando']['value'] = 2; $assert($suggest($r)['candidate']['statement'] === 'SP6', 'Priority one precedes priority two.');
$assert($suggest($ratings(5)) === ['candidate' => null, 'reason' => 'familiarity'], 'High familiarity has no invented deficit.');
$assert($suggest([]) === ['candidate' => null, 'reason' => 'unknown'], 'Unknown is not low ability.');
$assert($suggest(['SP1' => ['understanding' => ['value' => 4]]]) === ['candidate' => null, 'reason' => 'partial'], 'A partial familiar response must not imply that every statement was rated.');
foreach (['unsure','skip','unanswered'] as $reason) $assert($suggest(['SP1' => ['cando' => ['value' => null, 'reason' => $reason]]])['reason'] === 'unknown', 'Each unknown reason stays unknown.');
$r = ['SP5' => ['cando' => ['value' => 2, 'reason' => 'rating-2']]]; $assert($suggest($r)['candidate']['activity'] === 'portfolio', 'Partial finished input does not fill missing ratings.');
$r = $ratings(5); $r['SP1']['cando']['value'] = 2; $r['SP2']['cando']['value'] = 1; $assert($suggest($r)['candidate']['statement'] === 'SP2', 'Numeric can-do is the second tie break.');
$r['SP1']['cando']['value'] = 1; $r['SP1']['understanding']['value'] = 4; $r['SP2']['understanding']['value'] = 2; $assert($suggest($r)['candidate']['statement'] === 'SP2', 'Numeric understanding is the third tie break.');
$assert($suggest(['SP1' => ['cando' => ['value' => 0]]])['reason'] === 'unknown', 'Out-of-range values cannot become ability ratings.');
echo "Starting-point rule invariants passed (low, high, mixed, unknown, independent dimensions, partial and tie breaks).\n";
