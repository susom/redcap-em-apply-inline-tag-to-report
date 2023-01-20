<?php

namespace Stanford\InlineTagInReport;

/** @var \Stanford\InlineTagInReport\InlineTagInReport $module */


try {
    //$field = filter_var($_GET['field'], FILTER_SANITIZE_STRING);
    $field = (string)($_GET['field'] ?? '');
    //$file_name = filter_var($_GET['file_name'], FILTER_SANITIZE_STRING);
    $file_name = htmlentities($_GET['file_name'], ENT_QUOTES);
    $report_id = htmlentities($_GET['report_id'], ENT_QUOTES);
    $module->setReportId($report_id);
    $module->massDownload($field, $file_name);
} catch (\Exception $e) {
    $module->emError($e->getMessage());
    http_response_code(404);
    echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
}
?>
