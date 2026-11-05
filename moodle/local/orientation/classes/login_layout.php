<?php
namespace local_orientation;
defined('MOODLE_INTERNAL') || die();

/** Keeps login-layout forms on narrow screens. Core and theme files stay unmodified. */
class login_layout {
    public const CSS = '.pagelayout-login .login-container{width:100%;max-width:min(100%,500px);min-width:0}';

    public static function head(\core\hook\output\before_standard_head_html_generation $hook): void {
        global $PAGE;
        if ($PAGE->pagelayout === 'login') $hook->add_html('<style>' . self::CSS . '</style>');
    }
}
