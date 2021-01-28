<?php

namespace Stanford\InlineTagInReport;

/** @var \Stanford\InlineTagInReport\InlineTagInReport $module */


try {
    $field = filter_var($_GET['field'], FILTER_SANITIZE_STRING);
    $module->setReportId(filter_var($_GET['report_id'], FILTER_SANITIZE_STRING));
    $module->massDownload($field);
} catch (\Exception $e) {
    $module->emError($e->getMessage());
    http_response_code(404);
    echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
}
?>
