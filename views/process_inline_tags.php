<?php

namespace Stanford\InlineTagInReport;

/** @var \Stanford\InlineTagInReport\InlineTagInReport $this */
?>
<!--<input type="hidden" id="csv-export-url" value="--><?php //echo $this->getUrl('view/csv_export.php')
?><!--">-->
<!--<input type="hidden" id="csv-export-session" value="">-->

<script src="<?php echo $this->getUrl('assets/js/inline_tags.js') ?>"></script>
<script type="text/javascript">
    Inline.fields = <?php echo json_encode($this->getFieldsWithInlineTag()); ?>;
    Inline.reportId = <?php echo $this->getReportId(); ?>;
    Inline.massDownloadURL = "<?php echo $this->getUrl('ajax/mass_download.php', false, true); ?>";
</script>
