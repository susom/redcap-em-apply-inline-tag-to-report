<?php

namespace Stanford\InlineTagInReport;
require_once "emLoggerTrait.php";

use ZipArchive;

/**
 * Class InlineTagInReport
 * @package Stanford\InlineTagInReport
 * @property \Project $project;
 * @property int $reportId;
 * @property array $report
 * @property array $fieldsWithInlineTag
 * @property ZipArchive $zipFolder
 */
class InlineTagInReport extends \ExternalModules\AbstractExternalModule
{

    use emLoggerTrait;

    private $project;

    private $reportId;

    private $report;

    private $fieldsWithInlineTag;

    private $zipFolder;

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
            $this->setFieldsWithInlineTag();

            // if we have fields with @INLINE tags then call function to process them
            if ($this->getFieldsWithInlineTag()) {
                $this->includeFile(rtrim(APP_PATH_WEBROOT_FULL, '/') . APP_PATH_WEBROOT . 'Resources/js/DataEntrySurveyCommon.js');
                $this->includeFile("views/process_inline_tags.php");
            }

        }
    }

    public function massDownload($fieldName)
    {
        // create zip folder for download
        $this->setZipFolder(new ZipArchive());

        $fileName = APP_PATH_TEMP . date("YmdHis") . '_' . $fieldName . '.zip';
        /**
         * Open main instruments archive file for save
         */
        if ($this->getZipFolder()->open($fileName, ZipArchive::CREATE) !== true) {
            throw new \Exception('cant open zip folder');
        }
        // calling this function to get edoc id because report returns file name istead of id.
        $records = \REDCap::getData();
        foreach ($this->getReport() as $id => $events) {
            foreach ($events as $eventId => $fieldsArray) {
                foreach ($fieldsArray as $fieldId => $field) {
                    if ($fieldId == $fieldName) {

//
//                        $temp = \Files::copyEdocToTemp($records[$id][$eventId][$fieldName]);
//                        $this->getZipFolder()->addFile($temp, 'files/' . $field);

                        $content = \Files::getEdocContentsAttributes($records[$id][$eventId][$fieldName]);
                        $this->getZipFolder()->addFromString('files/' . $field, $content[2]);
                    }
                }
            }
        }
        $this->getZipFolder()->close();
        $this->downloadZipFile($fileName, $fieldName . '.zip');
    }

    private function downloadZipFile($path, $fileName)
    {
        header('Content-disposition: attachment; filename=' . $fileName . '');
        header('Content-type: application/zip');
        readfile($path);
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
        $this->setReport(\REDCap::getReport($reportId));
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

    /**
     * @return ZipArchive
     */
    public function getZipFolder()
    {
        return $this->zipFolder;
    }

    /**
     * @param ZipArchive $zipFolder
     */
    public function setZipFolder($zipFolder)
    {
        $this->zipFolder = $zipFolder;
    }


}
