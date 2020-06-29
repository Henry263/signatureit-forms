(function($) {

    // $(".Q-div").find('input[type=text]').each(function(index) {
    //     // console.log(index + ": " + $(this).val());
    //     $(this).val("test val");

    // });
    // $(".Q-div").find('input[type=date]').each(function(index) {
    //     // console.log(index + ": " + $(this).val());
    //     $(this).val('2000-01-01');

    // });

    // $("#email").val('safsad@gmail.com');

    // Function to verify character only
    function verifychar(strval) {
        var regex = new RegExp("^[a-zA-Z][a-z\s ]*$");
        if (regex.test(strval)) {
            return true;
        } else {
            return false;
        }
    }

    // Function to verify email only
    function verifyemail(emailVal) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(emailVal);
    }
    var errjson = {
        "textError": "Above field allow only letters. no special characters and numbers",
        "emailError": "Enter Valid email address.",
        "emptydate": "Above date value must be selected."
    }

    function inputvalidation($elem) {
        if ($elem.attr('name') === 'email') {
            //console.log($elem.val());
            if (verifyemail($elem.val())) {
                $elem.next().addClass('display-none');
            } else {
                $elem.next().removeClass('display-none');
                $elem.next().text(errjson.emailError)
            }
        } else if ($elem.attr('name') === 'phonumber' || $elem.attr('name') === 'referral') {
            //console.log($elem.val());
        } else {
            //console.log($elem.val());
            if (verifychar($elem.val())) {
                $elem.next().addClass('display-none');
            } else {
                $elem.next().removeClass('display-none');
                $elem.next().text(errjson.textError)
            }
        }
    }

    $('input[type=text]').change(function() {
        inputvalidation($(this));
    });

    function checkdate($dateval) {
        if (!$.trim($dateval.val()).length) { // zero-length string AFTER a trim
            $dateval.next().removeClass('display-none');
            $dateval.next().text(errjson.emptydate)
        } else {
            $dateval.next().addClass('display-none');
        }
    }
    $('input[type=date]').change(function() {
        checkdate($(this));
    });

    function ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel, username_, tabledata_) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            //console.log("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g, "_");


        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        // //console.log(link);
        //navin@signatureits.com ,
        var dataUri = "data:" + ".csv" + ";base64," + btoa(CSV);
        let htmlbody = ' <div>' +
            '<div><strong>Hi Naveen,</strong></div>' +
            '<div>New candidate sign up please have a look at the following attachment and data.</div>' +
            '</div><br></br><br></br><br></br>';
        let tablevalues = '<div>' + $("#tablevalues").html() + '</div><br></br><br></br><br></br>'
            //console.log(tablevalues);
        Email.send({
            Host: "smtp.gmail.com",
            Username: "signatureitforms@gmail.com",
            Password: "naveentezseepana",
            To: ' signatureitforms@gmail.com',
            From: "signatureitforms@gmail.com",
            Subject: "New Candidate data: " + username_,
            Body: '<html>' + htmlbody + tablevalues + '</html>',
            Attachments: [{
                name: fileName,
                data: dataUri
            }]
        }).then(
            message => console.log("mail sent successfully s")
        );
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        // link.click();
        document.body.removeChild(link);
    }


    function CreateTable(object) {

        // CREATE DYNAMIC TABLE.
        var table = document.createElement('table');

        // SET THE TABLE ID. 
        // WE WOULD NEED THE ID TO TRAVERSE AND EXTRACT DATA FROM THE TABLE.
        table.setAttribute('id', 'empTable');

        var arrHead = new Array();
        arrHead = ['fields', 'data'];


        var arrValue = new Array();
        // arrValue.push(['1', 'Green Field', 'Accountant']);
        // arrValue.push(['2', 'Arun Banik', 'Project Manager']);
        // arrValue.push(['3', 'Dewane Paul', 'Programmer']);

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                // //console.log(key + " -> " + object[key]);
                arrValue.push([key, object[key]]);
            }
        }

        var tr = table.insertRow(-1);

        for (var h = 0; h < arrHead.length; h++) {
            var th = document.createElement('th'); // TABLE HEADER.
            th.innerHTML = arrHead[h];
            tr.appendChild(th);
        }

        for (var c = 0; c <= arrValue.length - 1; c++) {
            tr = table.insertRow(-1);

            for (var j = 0; j < arrHead.length; j++) {
                var td = document.createElement('td'); // TABLE DEFINITION.
                td = tr.insertCell(-1);
                td.innerHTML = arrValue[c][j]; // ADD VALUES TO EACH CELL.
            }
        }
        // FINALLY ADD THE NEWLY CREATED TABLE AND BUTTON TO THE BODY.
        // document.body.appendChild(table);
        $("#tablevalues").append(table);

        return table;
    }

    // //console.log("number of input fields", $('div[class=display-none]').length);
    //console.log($(".Q-div").find("div.display-none").length)
    $(".post-btn").click(function() {
        var obj = {};
        let objArray = [];
        $(".Q-div").find('input[type=text]').each(function(index) {
            // //console.log(index + ": " + $(this).val());
            obj[$(this).data('name')] = $(this).val();
            inputvalidation($(this))
        });

        $(".Q-div").find('input[type=date]').each(function(index) {
            // //console.log(index + ": " + $(this).val());
            obj[$(this).data('name')] = $(this).val();
            checkdate($(this));
        });
        if ($(".Q-div").find("div.display-none").length !== 10) {
            //console.log($(".Q-div").find("div.display-none").length)
            //console.log("Errir")
            $('.error-div:not(.display-none):first').text();
            $('html,body').animate({
                scrollTop: $('.error-div:not(.display-none):first').offset().top - 130
            });
        } else {
            obj[$("#relocate").data('name')] = $("#relocate option:selected").text();
            obj[$("#edu").data('name')] = $("#edu option:selected").text();
            obj[$("#cstatus").data('name')] = $("#cstatus option:selected").text();

            obj[$("#prevexp").data('name')] = $.trim($("#prevexp").val());
            obj[$("#techinterest").data('name')] = $.trim($("#techinterest").val());

            let tableData = CreateTable(obj);

            objArray.push(obj);

            let username = $('#fname').val() + " " + $('#lname').val();
            let csvFile = JSONToCSVConvertor(objArray, username, true, username, tableData);
            //console.log("Success: ", tableData)

            // sendEmail();
        }
        //console.log(obj);
    });

    var $window = $(window),
        $body = $('body'),
        $sidebar = $('#sidebar');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: [null, '480px']
    });

    // Hack: Enable IE flexbox workarounds.
    if (browser.name == 'ie')
        $body.addClass('is-ie');

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Forms.

    // Hack: Activate non-input submits.
    $('form').on('click', '.submit', function(event) {

        // Stop propagation, default.
        event.stopPropagation();
        event.preventDefault();

        // Submit form.
        $(this).parents('form').submit();

    });

    // Sidebar.
    if ($sidebar.length > 0) {

        var $sidebar_a = $sidebar.find('a');

        $sidebar_a
            .addClass('scrolly')
            .on('click', function() {

                var $this = $(this);

                // External link? Bail.
                if ($this.attr('href').charAt(0) != '#')
                    return;

                // Deactivate all links.
                $sidebar_a.removeClass('active');

                // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
                $this
                    .addClass('active')
                    .addClass('active-locked');

            })
            .each(function() {

                var $this = $(this),
                    id = $this.attr('href'),
                    $section = $(id);

                // No section for this link? Bail.
                if ($section.length < 1)
                    return;

                // Scrollex.
                $section.scrollex({
                    mode: 'middle',
                    top: '-20vh',
                    bottom: '-20vh',
                    initialize: function() {

                        // Deactivate section.
                        $section.addClass('inactive');

                    },
                    enter: function() {

                        // Activate section.
                        $section.removeClass('inactive');

                        // No locked links? Deactivate all links and activate this section's one.
                        if ($sidebar_a.filter('.active-locked').length == 0) {

                            $sidebar_a.removeClass('active');
                            $this.addClass('active');

                        }

                        // Otherwise, if this section's link is the one that's locked, unlock it.
                        else if ($this.hasClass('active-locked'))
                            $this.removeClass('active-locked');

                    }
                });

            });

    }

    // Scrolly.
    $('.scrolly').scrolly({
        speed: 1000,
        offset: function() {

            // If <=large, >small, and sidebar is present, use its height as the offset.
            if (breakpoints.active('<=large') &&
                !breakpoints.active('<=small') &&
                $sidebar.length > 0)
                return $sidebar.height();

            return 0;

        }
    });

    // Spotlights.
    $('.spotlights > section')
        .scrollex({
            mode: 'middle',
            top: '-10vh',
            bottom: '-10vh',
            initialize: function() {

                // Deactivate section.
                $(this).addClass('inactive');

            },
            enter: function() {

                // Activate section.
                $(this).removeClass('inactive');

            }
        })
        .each(function() {

            var $this = $(this),
                $image = $this.find('.image'),
                $img = $image.find('img'),
                x;

            // Assign image.
            $image.css('background-image', 'url(' + $img.attr('src') + ')');

            // Set background position.
            if (x = $img.data('position'))
                $image.css('background-position', x);

            // Hide <img>.
            $img.hide();

        });

    // Features.
    $('.features')
        .scrollex({
            mode: 'middle',
            top: '-20vh',
            bottom: '-20vh',
            initialize: function() {

                // Deactivate section.
                $(this).addClass('inactive');

            },
            enter: function() {

                // Activate section.
                $(this).removeClass('inactive');

            }
        });

})(jQuery);