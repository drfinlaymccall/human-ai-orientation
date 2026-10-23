<?php
namespace local_orientation;
defined('MOODLE_INTERNAL') || die();

/** Localise the shared, stateless atlas with authorised native activity destinations and completion. */
class atlas {
    public static function render(array $rows, \stdClass $course, \course_modinfo $modinfo): string {
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        try {
            $dom->loadHTML('<?xml encoding="UTF-8"><div id="orientation-atlas">' . file_get_contents(__DIR__ . '/../activity-atlas.html') . '</div>', LIBXML_NONET);
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }
        $xpath = new \DOMXPath($dom);
        $rendered = [];
        foreach (['choice', 'detail', 'open', 'progress'] as $hook) {
            // Snapshot first: removing a node must not skip its next sibling.
            foreach (iterator_to_array($xpath->query('//*[@data-atlas-' . $hook . ']')) as $node) {
                $slug = $node->getAttribute('data-atlas-' . $hook);
                if (!isset($rows[$slug])) {
                    $remove = $hook === 'choice' ? $node->parentNode : $node;
                    if ($remove->parentNode) $remove->parentNode->removeChild($remove);
                    continue;
                }
                $row = $rows[$slug];
                if ($hook === 'open') $node->setAttribute('href', $row['cm']->url->out(false));
                if ($hook === 'progress') $node->textContent = self::status($row);
                if ($hook === 'detail') {
                    $rendered[$slug] = true;
                    $a = $row['activity'];
                    self::paragraph($dom, $node, self::status($row) . ' · ' . self::role($a), 'atlas-native-status');
                    self::paragraph($dom, $node, self::version($a));
                    if ((int)$row['cm']->completion === COMPLETION_TRACKING_MANUAL) {
                        self::paragraph($dom, $node, 'After doing the practical task, use Moodle’s Mark as done control on the activity. Opening a Page does not mark it complete.');
                    }
                    if ($a['module_type'] === 'lesson') {
                        self::paragraph($dom, $node, 'The Lesson saves its own progress and reflection. Open it to continue or revisit using its native resume choice.');
                    }
                }
            }
        }
        // The fragment's support links are public. Resolve declared support destinations with the same visibility rules.
        foreach (iterator_to_array($xpath->query('//*[@data-atlas-detail]//a[not(@data-atlas-open)]')) as $link) {
            $panel = $link->parentNode;
            while ($panel && (!$panel instanceof \DOMElement || !$panel->hasAttribute('data-atlas-detail'))) $panel = $panel->parentNode;
            $supports = $panel ? ($rows[$panel->getAttribute('data-atlas-detail')]['activity']['support_links'] ?? []) : [];
            $resolved = null;
            foreach ($supports as $support) {
                if ($link->getAttribute('href') !== '/' . $support['slug']) continue;
                $record = catalogue::cm($course, ['idnumber' => 'orientation:' . $support['slug'], 'module_type' => 'page']);
                $cm = $record ? ($modinfo->cms[$record->id] ?? null) : null;
                if ($cm && $cm->uservisible && $cm->url) $resolved = $cm->url->out(false);
            }
            if ($resolved) $link->setAttribute('href', $resolved);
            else $link->parentNode->removeChild($link);
        }
        $container = $dom->getElementById('orientation-atlas');
        $html = '';
        foreach ($container->childNodes as $child) $html .= $dom->saveHTML($child);
        // Future optional resources can be added without requiring an illustrated atlas place.
        foreach ($rows as $slug => $row) {
            if (isset($rendered[$slug])) continue;
            $a = $row['activity'];
            $html .= \html_writer::start_tag('section', ['data-journey-extra' => $slug]);
            $html .= \html_writer::tag('h2', \html_writer::link($row['cm']->url, s($a['label'])));
            $html .= \html_writer::tag('p', s(self::status($row) . ' · ' . self::role($a)));
            $html .= \html_writer::tag('p', s(implode(' ', $a['outcomes'])));
            $html .= \html_writer::tag('p', s(self::version($a)));
            $html .= \html_writer::end_tag('section');
        }
        return $html;
    }
    private static function status(array $row): string {
        if ($row['state'] === null) return 'No completion tracking';
        return $row['complete'] ? 'Completed' : (!empty($row['started']) ? 'In progress' : ($row['activity']['module_type'] === 'lesson' ? 'Not started' : 'Not yet complete'));
    }
    private static function role(array $a): string {
        return $a['baseline'] ? 'Core activity' : (($a['role'] ?? '') === 'portfolio-bridge' ? 'Portfolio practice within activity 2' : (($a['role'] ?? '') === 'optional-preparation' ? 'Optional preparation' : 'Optional practice'));
    }
    private static function version(array $a): string {
        return 'Current version ' . $a['version'] . ' · Updated ' . $a['updated_at'] . '. ' . $a['update_note'];
    }
    private static function paragraph(\DOMDocument $dom, \DOMElement $parent, string $text, string $class = ''): void {
        $p = $dom->createElement('p');
        if ($class) $p->setAttribute('class', $class);
        $p->appendChild($dom->createTextNode($text));
        $parent->appendChild($p);
    }
}
