# Inline Tag In Report
@INLINE is a core REDCap actiontag that causes uplod fields with file/images to be rendered in the form view.  However, if you include one of these fields in a report, it does not render the image.

This EM adds report-capability to the existing @INLINE tag.  If enabled on a project and if a report is created with file upload fields containing images, the images will be rendered in the report.

Also, the EM support following features:
1. Mass download of all report files.
2. hide/display files and images.
3. change images width.
4. change files height.
