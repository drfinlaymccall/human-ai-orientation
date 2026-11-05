<?php
namespace local_orientationfeedback\privacy;
defined('MOODLE_INTERNAL') || die();

use core_privacy\local\metadata\collection;
use core_privacy\local\request\{contextlist, approved_contextlist, userlist, approved_userlist, writer};
use local_orientationfeedback\service;

final class provider implements \core_privacy\local\metadata\provider,
        \core_privacy\local\request\plugin\provider, \core_privacy\local\request\core_userlist_provider {
    public static function get_metadata(collection $collection): collection {
        $fields = [];
        foreach (['userid', 'courseid', 'cmid', 'source', 'sectionlabel', 'message', 'submissiontoken',
                'filename', 'mimetype', 'filesize', 'notificationstate', 'timecreated'] as $field) {
            $fields[$field] = 'privacy:metadata:' . $field;
        }
        $collection->add_database_table('local_orientationfeedback', $fields, 'privacy:metadata:feedback');
        $collection->add_subsystem_link('core_files', [], 'privacy:metadata:files');
        $collection->add_subsystem_link('core_message', [], 'privacy:metadata:notification');
        return $collection;
    }
    public static function get_contexts_for_userid(int $userid): contextlist {
        $contexts = new contextlist();
        $contexts->add_from_sql('SELECT c.id FROM {context} c JOIN {local_orientationfeedback} f
            ON c.instanceid = f.courseid AND c.contextlevel = :level WHERE f.userid = :userid',
            ['level' => CONTEXT_COURSE, 'userid' => $userid]);
        return $contexts;
    }
    public static function get_users_in_context(userlist $userlist) {
        $context = $userlist->get_context();
        if ($context->contextlevel === CONTEXT_COURSE) {
            $userlist->add_from_sql('userid', 'SELECT userid FROM {local_orientationfeedback} WHERE courseid = :courseid',
                ['courseid' => $context->instanceid]);
        }
    }
    public static function export_user_data(approved_contextlist $contextlist) {
        global $DB;
        $userid = $contextlist->get_user()->id;
        foreach ($contextlist->get_contexts() as $context) {
            if ($context->contextlevel !== CONTEXT_COURSE) { continue; }
            $records = $DB->get_records('local_orientationfeedback', ['courseid' => $context->instanceid, 'userid' => $userid]);
            foreach ($records as $record) {
                $path = [get_string('pluginname', 'local_orientationfeedback'), (string)$record->id];
                writer::with_context($context)->export_data($path, $record);
                writer::with_context($context)->export_area_files($path, 'local_orientationfeedback', 'audio', $record->id);
            }
        }
    }
    public static function delete_data_for_all_users_in_context(\context $context) {
        if ($context->contextlevel === CONTEXT_COURSE) { self::delete_matching((int)$context->instanceid); }
    }
    public static function delete_data_for_user(approved_contextlist $contextlist) {
        foreach ($contextlist->get_contexts() as $context) {
            if ($context->contextlevel === CONTEXT_COURSE) {
                self::delete_matching((int)$context->instanceid, [$contextlist->get_user()->id]);
            }
        }
    }
    public static function delete_data_for_users(approved_userlist $userlist) {
        $context = $userlist->get_context();
        if ($context->contextlevel === CONTEXT_COURSE && $userlist->get_userids()) {
            self::delete_matching((int)$context->instanceid, $userlist->get_userids());
        }
    }
    private static function delete_matching(int $courseid, ?array $userids = null): void {
        global $DB;
        $params = ['courseid' => $courseid];
        $where = 'courseid = :courseid';
        if ($userids !== null) {
            [$insql, $inparams] = $DB->get_in_or_equal($userids, SQL_PARAMS_NAMED, 'privacyuser');
            $where .= ' AND userid ' . $insql;
            $params += $inparams;
        }
        $records = $DB->get_recordset_select('local_orientationfeedback', $where, $params);
        try { foreach ($records as $record) { service::delete($record); } } finally { $records->close(); }
    }
}
