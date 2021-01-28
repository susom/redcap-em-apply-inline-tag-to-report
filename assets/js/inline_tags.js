Inline = {
    fields: [],
    processed: false,
    width: 500,
    height: 500,
    // hide/ display images nad objects.
    isDisplay: true,
    reportId: null,
    massDownloadURL: '',
    init: function () {

        $(document).on('click', '.mass-download', function () {
            var report_id = $(this).data('report-id');
            var field = $(this).data('field');

            var win = window.open(Inline.massDownloadURL + '&field=' + field + '&report_id=' + report_id, '_blank');
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Please allow popups for this website');
            }
        });

        $(document).on({
            ajaxComplete: function () {

                if (Inline.processed === false) {
                    setTimeout(function () {
                        // for (var i = 0; i < Inline.fields.length; i++) {
                        //     Inline.processTag(Inline.fields[i])
                        // }
                        Inline.processTag()
                        Inline.injectOptions()
                    }, 100);

                }

            }
        });
    },
    injectOptions: function () {
        $('<div class="flexigrid"></div><div class="mDiv"><table id="objects-option-table"><thead><tr><th colspan="2" style="background-color: gray"><strong>Objects Options</strong></th></tr></thead><tbody><tr><td colspan="2"><input type="checkbox" name="display-objects" class="display-objects"> Hide Objects </td></tr><tr><td><div>Images/Objects Width: </div></td><td><input name="objects-width" id="objects-width" value="' + Inline.width + '">px</td></tr><tr><td>Objects Height: </td><td><input name="objects-height" id="objects-height" value="' + Inline.height + '">px</td></tr></tbody></table>').insertAfter("#report_parent_div").find('#objects-option-table').css('border', '1px solid #ddd').find('tr').css('border', '1px solid #ddd');
        $(document).on('click', '.display-objects', function () {
            Inline.display()
        });
        $(document).on('focusout', '#objects-width', function () {
            Inline.changeWidth()
        });
        $(document).on('focusout', '#objects-height', function () {
            Inline.changeHeight()
        });
    },
    changeHeight: function () {
        Inline.height = $("#objects-height").val();
        $("#report_table > tbody > tr > td").find('object').css('height', Inline.height);
    },
    changeWidth: function () {
        Inline.width = $("#objects-width").val();
        $("#report_table > tbody > tr > td").find('img').css('width', Inline.width);
        $("#report_table > tbody > tr > td").find('object').css('width', Inline.width);
    },
    display: function () {
        if (Inline.isDisplay === true) {
            Inline.isDisplay = false
            $("#report_table > tbody > tr > td").find('img').hide();
            $("#report_table > tbody > tr > td").find('object').hide();
        } else {
            Inline.isDisplay = true
            $("#report_table > tbody > tr > td").find('img').show();
            $("#report_table > tbody > tr > td").find('object').show();
        }
    },
    allLetter: function (inputtxt) {
        var regExp = /[a-zA-Z]/g;

        if (regExp.test(inputtxt)) {
            return true;
        } else {
            return false;
        }
    },
    processTag: function () {
        var valid_image_suffixes = new Array('jpeg', 'jpg', 'jpe', 'gif', 'png', 'tif', 'bmp');
        // if (typeof currentfield == 'undefined') currentfield = '';
        // var fieldEmbedded = false;
        // if (currentfield == '') {
        //     // Multiple fields
        //     var selector = "#questiontable tr.\\@INLINE a.filedownloadlink, #questiontable .rc-field-embed.file-upload-inline-embed a.filedownloadlink";
        // } else if ($("#questiontable .rc-field-embed[var='" + currentfield + "']").length) {
        //     // Single field embedded
        //     var selector = "#questiontable .rc-field-embed[var='" + currentfield + "'] a.filedownloadlink";
        // } else if ($("#report_table").length) {
        //     // Single field non-embedded
        //     var selector = "#report_table > tbody > tr > td > button";
        //
        //     var header_selector = "#report_table > thead > tr > th > div.rpthdr"
        // } else {
        //     // Single field non-embedded
        //     var selector = "#questiontable tr#" + currentfield + "-tr a.filedownloadlink tr";
        // }

        var selector = "#report_table > tbody > tr > td > button";

        var header_selector = "#report_table > thead > tr > th"
        var usleep = 0;

        var last_row = '<tr>';
        var count = $(header_selector).length
        // add mass download button
        $(header_selector).each(function (i) {
//            console.log(Inline.fields.includes($(this).text()))
            // this field has INLINE tag
            last_row += '<td>';
            if (Inline.fields.includes($(this).find('div.rpthdr').text())) {
                //$(this).after('<div style="z-index: 99999999"><button class="mass-download" data-field="'+$(this).text()+'" data-report-id="'+Inline.reportId+'">Download All Objects</button></div>')
                var text = $(this).text()


                last_row += '<div ><button class="mass-download" data-field="' + $(this).find('div.rpthdr').text() + '" data-report-id="' + Inline.reportId + '">Download ' + $(this).clone().children().remove().end().text() + '</button></div>';
            }
            last_row += '</td>';
            if (!--count) {
                last_row += '</tr>';
                $('#report_table tr:last').after(last_row);
            }
        })
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

            // exception to capture images with no extension
            if (Inline.allLetter(fileext) === false && in_array(fileext, valid_image_suffixes) === false) {
                isImage = true
            }

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
            var width = 'width: ' + Inline.width + 'px'
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
                var height = "height: " + Inline.height + "px;";
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
