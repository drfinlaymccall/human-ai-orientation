<?php
namespace local_orientation;

/** Deterministic self-report suggestions; no grades, completion mutations or proficiency claims. */
class startingpoint_rule {
    public static function suggest(array $instrument, array $responses): array {
        if (($instrument['rule_version'] ?? '') !== 'starting-point-v1') {
            throw new \RuntimeException('Unsupported starting-point rule.');
        }
        $candidates = [];
        $numeric = 0;
        foreach ($instrument['statements'] as $index => $statement) {
            $id = $statement['id'];
            $understanding = self::rating($responses[$id]['understanding']['value'] ?? null);
            $cando = self::rating($responses[$id]['cando']['value'] ?? null);
            $numeric += (int)($understanding !== null) + (int)($cando !== null);
            $priority = $cando !== null && $cando <= 2 ? 1 : ($cando === 3 ? 2 :
                ($understanding !== null && $understanding <= 2 ? 3 : null));
            if ($priority === null) continue;
            $candidates[] = ['statement' => $id, 'text' => $statement['text'], 'activity' => $statement['activity'],
                'dimension' => $priority < 3 ? 'cando' : 'understanding',
                'value' => $priority < 3 ? $cando : $understanding,
                'sort' => [$priority, $cando ?? 99, $understanding ?? 99, $index]];
        }
        usort($candidates, fn($a, $b) => $a['sort'] <=> $b['sort']);
        return ['candidate' => $candidates[0] ?? null, 'reason' => $numeric ? 'familiarity' : 'unknown'];
    }

    private static function rating($value): ?int {
        return is_int($value) && $value >= 1 && $value <= 5 ? $value : null;
    }
}
