<?php
namespace local_orientation;

/** Shared, public learner guidance; native Moodle enrolment owns delivery and its subject. */
final class welcome {
    public static function data(): array {
        return json_decode(file_get_contents(__DIR__ . '/../student-welcome.json'), true, 512, JSON_THROW_ON_ERROR);
    }

    /** HTML is converted to a plain-text alternative by the pinned core welcome facility. */
    public static function email(string $base): string {
        $parts = parse_url($base);
        if (!$parts || !in_array($parts['scheme'] ?? '', ['https', 'http'], true) || empty($parts['host'])
                || isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment'])
                || !in_array($parts['path'] ?? '', ['', '/'], true)) {
            throw new \InvalidArgumentException('A public installation origin is required for welcome links.');
        }
        $escape = fn(string $text): string => htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $data = self::data();
        $html = '';
        foreach ($data['email_paragraphs'] as $paragraph) {
            // Core renders with course filters enabled. Preserve the explicit shared links instead
            // of auto-linking activity names in the prose to a different native course page.
            $html .= '<p><span class="nolink">' . $escape($paragraph) . '</span></p>';
        }
        // Visible full URLs remain readable when core creates the plain-text alternative.
        foreach (['journey', 'context', 'help', 'ai'] as $key) {
            $link = $data['links'][$key];
            if (!is_string($link['path']) || !str_starts_with($link['path'], '/') || str_starts_with($link['path'], '//')
                    || preg_match('/[\s?#\\\\]/', $link['path'])) {
                throw new \RuntimeException('Welcome destinations must be public site-root paths.');
            }
            $url = $escape(rtrim($base, '/') . $link['path']);
            $html .= '<p><strong><span class="nolink">' . $escape($link['label']) . '</span></strong><br /><a href="' . $url . '">' . $url . '</a></p>';
        }
        return $html;
    }
}
