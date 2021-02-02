Inline = {
    fields: [],
    processed: false,
    width: 500,
    height: 500,
    // hide/ display images nad objects.
    displayed: true,
    reportId: null,
    massDownloadURL: '',
    primaryKey: '',
    init: function () {

        if (getCookie('report_config' + Inline.reportId) != null) {
            var json = getCookie('report_config' + Inline.reportId);
            json = JSON.parse(json)

            Inline.displayed = json[0] === '0' ? true : false;
            var width = json['1'];
            var height = json['2'];
            Inline.display()
            Inline.changeWidth()
            Inline.changeHeight()
            console.log(json)
            Inline.width = width
            Inline.height = height
        }


        $(document).on('click', '.mass-download', function () {
            var report_id = $(this).data('report-id');
            var field = $(this).data('field');
            var file_name = $("#field-" + field).val();

            var win = window.open(Inline.massDownloadURL + '&field=' + field + '&report_id=' + report_id + '&file_name=' + file_name, '_blank');
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
        var checked = Inline.displayed === false ? 'checked' : '';

        Inline.display()

        $('<div class="flexigrid"></div><div class="mDiv"><table id="objects-option-table"><thead><tr><th colspan="2" style="background-color: gray"><strong>Objects Options</strong></th></tr></thead><tbody><tr><td colspan="2"><input type="checkbox" ' + checked + ' name="display-objects" class="display-objects"> Hide Objects </td></tr><tr><td><div>Images/Objects Width: </div></td><td><input name="objects-width" id="objects-width" value="' + Inline.width + '">px</td></tr><tr><td>Objects Height: </td><td><input name="objects-height" id="objects-height" value="' + Inline.height + '">px</td></tr></tbody></table>').insertAfter("#this_report_title").find('#objects-option-table').css('border', '1px solid #ddd').find('tr').css('border', '1px solid #ddd');
        $(document).on('click', '.display-objects', function () {
            Inline.displayed = $('.display-objects:checked').length === 1 ? false : true
            Inline.display();
            Inline.setReportCookie();
        });
        $(document).on('focusout', '#objects-width', function () {
            Inline.changeWidth();
            Inline.setReportCookie();
        });
        $(document).on('focusout', '#objects-height', function () {
            Inline.changeHeight();
            Inline.setReportCookie();
        });
    },
    setReportCookie: function () {
        var array = [Inline.displayed === true ? '0' : '1', parseInt(Inline.width), parseInt(Inline.height)];
        var json_str = JSON.stringify(array);
        setCookie('report_config' + Inline.reportId, json_str);
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
        //console.log(Inline.displayed)
        if (Inline.displayed === false) {
            $("#report_table > tbody > tr > td").find('img').hide();
            $("#report_table > tbody > tr > td").find('object').hide();
        } else {
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

        var last_row = '<table><tr><td colspan="3"><div><strong>You can append record values to the downloaded file name using REDCap smart variables.</strong></div></td></tr>';
        var count = $(header_selector).length
        // add mass download button
        $(header_selector).each(function (i) {
//            console.log(Inline.fields.includes($(this).text()))
            // this field has INLINE tag
            if (Inline.fields.includes($(this).find('div.rpthdr').text())) {
                //$(this).after('<div style="z-index: 99999999"><button class="mass-download" data-field="'+$(this).text()+'" data-report-id="'+Inline.reportId+'">Download All Objects</button></div>')


                last_row += '<tr><td>' + $(this).clone().children().remove().end().text() + ': </td><td><input type="text" name="field-' + $(this).find('div.rpthdr').text() + '" id="field-' + $(this).find('div.rpthdr').text() + '" value="[' + Inline.primaryKey + ']_"> </td><td><button class="mass-download" data-field="' + $(this).find('div.rpthdr').text() + '" data-report-id="' + Inline.reportId + '">Download All ' + $(this).clone().children().remove().end().text() + '</button></td></tr>';
            }
            if (!--count) {
                last_row += '</table>';
                $('#this_report_title').before(last_row);
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

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

window.onload = function () {
    Inline.init();
}
