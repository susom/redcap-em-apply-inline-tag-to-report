<?php

namespace Stanford\InlineTagInReport;

require_once "emLoggerTrait.php";

/**
 * Class InlineTagInReport
 * @package Stanford\InlineTagInReport
 * @property \Project $project;
 * @property int $reportId;
 * @property array $report
 * @property array $fieldsWithInlineTag
 */
class InlineTagInReport extends \ExternalModules\AbstractExternalModule
{

    use emLoggerTrait;

    private $project;

    private $reportId;

    private $report;

    private $fieldsWithInlineTag;

    public function __construct()
    {
        global $Proj;
        parent::__construct();
        // Other code to run when object is instantiated

        $this->setProject($Proj);

    }

    public function redcap_every_page_top(int $project_id)
    {
        if (strpos($_SERVER['SCRIPT_NAME'], 'DataExport/index') !== false && isset($_GET['report_id'])) {

            $this->setReportId(filter_var($_GET['report_id'], FILTER_SANITIZE_NUMBER_INT));
            $this->setReport(\REDCap::getReport($this->getReportId()));
            $this->setFieldsWithInlineTag();

            // if we have fields with @INLINE tags then call function to process them
            if ($this->getFieldsWithInlineTag()) {
                $this->includeFile(rtrim(APP_PATH_WEBROOT_FULL, '/') . APP_PATH_WEBROOT . 'Resources/js/DataEntrySurveyCommon.js');
                $this->includeFile("views/process_inline_tags.php");
            }

        } elseif (strpos($_SERVER['SCRIPT_NAME'], 'DataExport/index') !== false && !isset($_GET['report_id'])) {
            echo 'hello world';
        }
    }

    /**
     * @param string $path
     */
    public function includeFile($path)
    {
        include_once $path;
    }

    /**
     * @return \Project
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * @param \Project $project
     */
    public function setProject($project)
    {
        $this->project = $project;
    }

    /**
     * @return int
     */
    public function getReportId()
    {
        return $this->reportId;
    }

    /**
     * @param int $reportId
     */
    public function setReportId($reportId)
    {
        $this->reportId = $reportId;
    }

    /**
     * @return array
     */
    public function getReport()
    {
        return $this->report;
    }

    /**
     * @param array $report
     */
    public function setReport($report)
    {
        $this->report = $report;
    }

    /**
     * @return array
     */
    public function getFieldsWithInlineTag()
    {
        return $this->fieldsWithInlineTag;
    }

    /**
     * @param array $fieldsWithInlineTag
     */
    public function setFieldsWithInlineTag()
    {
        $array = [];
        $report = $this->getReport();
        foreach ($report as $id => $events) {
            foreach ($events as $eventId => $fieldsArray) {
                foreach ($fieldsArray as $fieldId => $field) {
                    if (strpos($this->getProject()->metadata[$fieldId]['misc'], '@INLINE') !== false) {
                        $array[] = $fieldId;
                    }
                }
            }
        }
        if (!empty($array)) {
            $this->fieldsWithInlineTag = $array;
        }
    }


}
