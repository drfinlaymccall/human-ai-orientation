<?php
namespace local_orientationfeedback\task;
defined('MOODLE_INTERNAL') || die();
final class cleanup extends \core\task\scheduled_task {
    public function get_name() { return get_string('cleanup', 'local_orientationfeedback'); }
    public function execute() {
        $days = (int)get_config('local_orientationfeedback', 'retentiondays');
        if ($days <= 0) { return; }
        global $DB;
        $records = $DB->get_recordset_select('local_orientationfeedback', 'timecreated < :cutoff',
            ['cutoff' => time() - $days * DAYSECS], 'id', 'id, courseid');
        try {
            foreach ($records as $record) { \local_orientationfeedback\service::delete($record); }
        } finally { $records->close(); }
    }
}
