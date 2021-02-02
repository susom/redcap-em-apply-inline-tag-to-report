<?php

namespace Stanford\InlineTagInReport;

/** @var \Stanford\InlineTagInReport\InlineTagInReport $module */


try {
    $field = filter_var($_GET['field'], FILTER_SANITIZE_STRING);
    $file_name = filter_var($_GET['file_name'], FILTER_SANITIZE_STRING);
    $module->setReportId(filter_var($_GET['report_id'], FILTER_SANITIZE_STRING));
    $module->massDownload($field, $file_name);
} catch (\Exception $e) {
    $module->emError($e->getMessage());
    http_response_code(404);
    echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
}
?>
