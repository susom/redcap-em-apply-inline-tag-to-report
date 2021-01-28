<?php

namespace Stanford\InlineTagInReport;

/** @var \Stanford\InlineTagInReport\InlineTagInReport $module */


try {
    $field = 'image';
    $module->setReportId('557');
    $module->massDownload($field);
} catch (\Exception $e) {
    $module->emError($e->getMessage());
    http_response_code(404);
    echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
}
?>
