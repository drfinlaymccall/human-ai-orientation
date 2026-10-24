<?php
defined('MOODLE_INTERNAL') || die();
if ($hassiteconfig) {
    $settings = new admin_settingpage('local_orientationfeedback', get_string('pluginname', 'local_orientationfeedback'));
    $ADMIN->add('localplugins', $settings);
    $settings->add(new admin_setting_heading('local_orientationfeedback/inboxlink', '',
        html_writer::link(new moodle_url('/local/orientationfeedback/inbox.php'), get_string('inbox', 'local_orientationfeedback'))));
    $settings->add(new admin_setting_configcheckbox('local_orientationfeedback/enabled',
        get_string('enabled', 'local_orientationfeedback'), get_string('enabled_desc', 'local_orientationfeedback'), 0));
    $settings->add(new admin_setting_configtext('local_orientationfeedback/courseid',
        get_string('courseid', 'local_orientationfeedback'), get_string('courseid_desc', 'local_orientationfeedback'), 0, PARAM_INT));
    $settings->add(new admin_setting_configtext('local_orientationfeedback/reviewerid',
        get_string('reviewerid', 'local_orientationfeedback'), get_string('reviewerid_desc', 'local_orientationfeedback'), 0, PARAM_INT));
    $settings->add(new admin_setting_configtext('local_orientationfeedback/retentiondays',
        get_string('retentiondays', 'local_orientationfeedback'), get_string('retentiondays_desc', 'local_orientationfeedback'), 90, PARAM_INT));
}
