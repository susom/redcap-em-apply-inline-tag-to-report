Inline = {
    fields: [],
    processed: false,
    init: function () {

        $(document).on({
            ajaxComplete: function () {

                if (Inline.processed === false) {
                    setTimeout(function () {
                        for (var i = 0; i < Inline.fields.length; i++) {
                            Inline.processTag(Inline.fields[i])
                        }

                    }, 100);

                }
            }
        });
    },
    processTag: function (currentfield) {
        var valid_image_suffixes = new Array('jpeg', 'jpg', 'jpe', 'gif', 'png', 'tif', 'bmp');
        if (typeof currentfield == 'undefined') currentfield = '';
        var fieldEmbedded = false;
        if (currentfield == '') {
            // Multiple fields
            var selector = "#questiontable tr.\\@INLINE a.filedownloadlink, #questiontable .rc-field-embed.file-upload-inline-embed a.filedownloadlink";
        } else if ($("#questiontable .rc-field-embed[var='" + currentfield + "']").length) {
            // Single field embedded
            var selector = "#questiontable .rc-field-embed[var='" + currentfield + "'] a.filedownloadlink";
        } else if ($("#report_table").length) {
            // Single field non-embedded
            var selector = "#report_table > tbody > tr > td > button";
        } else {
            // Single field non-embedded
            var selector = "#questiontable tr#" + currentfield + "-tr a.filedownloadlink tr";
        }
        var usleep = 0;
        // Loop through one or more images to embed
        $(selector).each(function () {
            // pattern to remove extra text from url
            var regex = /window.open\(\'|\'\,\'_blank\'\);/gm;
            // Attributes
            var src = $(this).attr('onclick').replace('DataEntry/file_download.php', 'DataEntry/image_view.php')
                .replace('DataEntry%2Ffile_download.php', 'DataEntry%2Fimage_view.php').replace(regex, ''); // Change to image_view.php

            src += "&usleep=" + usleep;
            var field = $(this).attr('name');
            var filename = $(this).text();
            var fileext = getfileextension(filename.toLowerCase());
            var td = $("#questiontable .rc-field-embed[var='" + field + "']").length ? $("#questiontable .rc-field-embed[var='" + field + "']") : $("#questiontable tr#" + field + "-tr>td:last");
             // var maxwidth = td.width();
            var isImage = in_array(fileext, valid_image_suffixes);
            var isPdf = (fileext == 'pdf');
            // var dim = $('input[type="hidden"][name="' + field + '"]').attr('inlinedim');
            // if (typeof dim == 'undefined') {
            //     dim = new Array();
            // } else {
            //     dim = (dim.indexOf(',') > -1) ? dim.split(',') : new Array(dim);
            // }
            // var width = (dim.length > 0) ? "width:" + dim[0] + (isNumeric(dim[0]) ? "px" : "") + ";" : "";
            // var height = (dim.length > 1) ? "height:" + dim[1] + (isNumeric(dim[1]) ? "px" : "") + ";" : "";
            // Decide action to take
            var width = 'width: 500px'
            var maxwidth = '800px'
            var action = true;
            if ($(this).css('display') == 'none' || (!isImage && !isPdf)) {
                // If file was removed, then remove embedded image too
                $(this).parent().find('.file-upload-inline').remove();
                action = false;
            } else if ((isPdf && td.find('iframe.file-upload-inline').length) || (isImage && td.find('img.file-upload-inline').length)) {
                // Update src attribute if embedded PDF/image already exists on page
                td.find('object.file-upload-inline').attr('data', src);
                td.find('iframe.file-upload-inline, img.file-upload-inline').attr('src', src);
                td.find('img.file-upload-inline').attr('alt', filename);
            } else if (isPdf) {
                // Remove in case already existed as other tag type
                $(this).parent().find('.file-upload-inline').remove();
                // Add iframe for embedded PDF
                var height = "height:500px;";
                $(this).before("<object data='" + src + "' class='file-upload-inline' type='application/pdf' style='" + width + ";" + height + ";max-width:" + maxwidth + "px;'><iframe class='file-upload-inline' src='" + src + "' style='width:100%;border:none;max-width:" + maxwidth + "px;" + height + "'></iframe></object>");
            } else if (isImage) {
                // Remove in case already existed as other tag type
                $(this).parent().find('.file-upload-inline').remove();
                // Add img tag for embedded image
                $(this).before('<img src="' + src + '" class="file-upload-inline" style="' + width + ';max-width:' + maxwidth + 'px;" alt="' + htmlspecialchars(filename) + '">');
            } else {
                action = false;
            }
            if (action) {
                usleep += 100000;
            }
        });
        Inline.processed = true
    }
}
window.onload = function () {
    Inline.init();
}
