<?php

namespace Stanford\InlineTagInReport;

/** @var \Stanford\InlineTagInReport\InlineTagInReport $this */

$this->includeFile(rtrim(APP_PATH_WEBROOT_FULL, '/') . APP_PATH_WEBROOT . 'Resources/js/DataEntrySurveyCommon.js');
?>
<!--<input type="hidden" id="csv-export-url" value="--><?php //echo $this->getUrl('view/csv_export.php')
?><!--">-->
<!--<input type="hidden" id="csv-export-session" value="">-->
<script src="<?php echo $this->getUrl('assets/js/inline_tags.js') ?>"></script>
<script type="text/javascript">
    Inline.fields = <?php echo json_encode($this->getFieldsWithInlineTag()); ?>;

</script>
