function __highlight(s, t) {
    var matcher = new RegExp("(" + $.ui.autocomplete.escapeRegex(t) + ")", "ig");
    return s.replace(matcher, "<span class=''>$1</span>");
    //return s.replace(matcher, "<strong class='menuitm' style='background:yellow'>$1</strong>");
}
var hangisinde = "ucakbileti";
var hangisindex = "ucakbileti";
$(document).ready(function () {

    if ($(window).width() > 468) {
        if ($("#ucak-form input[name=gidis]").length) {
            $.datepicker.setDefaults($.datepicker.regional['tr']);
            $("#ucak-form input[name=gidis]").datepicker({
                minDate: "+0d",
                numberOfMonths: 1,
                dateFormat: 'dd-mm-yy',
                onSelect: function (eve) {
                    console.log(eve);
                    takvimo(eve.replace("-", "").replace("-", ""), '1');
                    trhle(eve.replace("-", "").replace("-", ""), '1');
                },
                onClose: function (selectedDate) {
                    if (selectedDate.length > 0) {
                        var date2 = $('#ucak-form input[name=gidis]').datepicker('getDate');
                        date2.setDate(date2.getDate());
                        var tool = $('#ucak-form input[name=donus]')[0];
                        if (tool.getAttribute('disabled') === null) {
                            if ($('#ucak-form input[name=donus]').val().length < 1) {
                                $('#ucak-form input[name=donus]').datepicker('setDate', date2);
                            }
                            $("#ucak-form input[name=donus]").datepicker("option", "minDate", date2);
                            $("#ucak-form input[name=donus]").datepicker("show");
                        }
                    }
                }
            });

            $("#ucak-form input[name=donus]").datepicker({
                minDate: "+d",
                numberOfMonths: 1,
                dateFormat: 'dd-mm-yy',
                onSelect: function (eve) {
                    takvimo(eve.replace("-", "").replace("-", ""), '2');
                    trhle(eve.replace("-", "").replace("-", ""), '2');
                },
                onClose: function (selectedDate) {
                    if (selectedDate.length > 0) {
                        var date2 = $('#ucak-form input[name=donus]').datepicker('getDate');
                    }
                }
            });
        }
    }
});

$(document).ready(function () {

    var gidisTipi = $('input[name=gidis-tipi]')[0];
    if (gidisTipi != null) {
        var alan = $('.gidis-tipi-alani-mobil');
        alan.find('[data-value="' + gidisTipi.value + '"]').addClass('active');
        $('.gidis-tipi-alani-mobil .btn').click(function () {
            $('.gidis-tipi-alani-mobil .btn').removeClass('active');
            $(this).addClass('active');
            var value = $(this).attr('data-value');
            $(gidisTipi).val(value);
            var checkout = $('#checkout-mobil')[0];
            if (value === "1") {
                $(checkout).css('z-index', '-1');
                $(checkout).css('opacity', '.3');
            } else {
                $(checkout).css('z-index', '0');
                $(checkout).css('opacity', '1');
            }
        });
    }
});


$(document).ready(function () {
    if ($('#varis-yeri-mobil').length) {
        $('#varis-yeri-mobil').focusout(function (e) {
            if ($(this).val().indexOf(')') >= 0) {

            }
            else {
                $('#varis-yeri-mobil').val("");
                $('#varis-yeri-mobil').attr("data-ulke", "");
            }
        });
        $('#kalkis-yeri-mobil').focusout(function (e) {
            if ($(this).val().indexOf(')') >= 0) {

            }
            else {
                $('#kalkis-yeri-mobil').val("");
                $('#kalkis-yeri-mobil').attr("data-ulke", "");
            }
        });
        $("#kalkis-yeri-mobil").autocomplete({
            create: function (event, ui) {
                $('.ui-autocomplete').wrap('<span class="desktop"></span>');
            }, open: function (event, ui) {
                $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
            },
            minLength: 0,
            delay: 0,
            source: function (request, response) {
                if (hangisinde == "ucakbileti") {
                    var token = $('input[name="__RequestVerificationToken"]').val();
                  
                   
                    if (request.term.length > 1) {
                        jQuery.ajax({
                            method:"POST",
                            url: "/home/ucaklistesi",
                            timeout: 20000,
                            data: {
                                __RequestVerificationToken: token,
                                limit: 15,
                                str: request.term.replace("I", "i").replace("I", "i"),
                                where: "to",
                                from: $("#kalkis-yeri-mobil").val().substring($("#kalkis-yeri-mobil").val().lastIndexOf(" ") + 2).replace(")", "")
                            },
                            dataType: "json",
                            success: function (data) {
                                response($.map(data, function (item) {
                                    return {
                                        label: item.item,
                                        value: item.item,
                                        idsi: item.idsi
                                    };
                                }));
                            }
                        })
                    }
                }
                else {

                    if (request.term.length > 1) {
                        jQuery.ajax({
                            method: "POST",
                            url: "/home/otobuslistesi",
                            timeout: 20000,
                            data: {
                                __RequestVerificationToken: token,
                                firmano: "0",
                                term: request.term
                            },
                            dataType: "json",
                            success: function (data) {
                                response($.map(data, function (item) {
                              
                                    return {
                                        label: item.Kalkis_Yeri,
                                        value: item.Kalkis_Yeri
                                    };
                                }));
                            }
                        })
                    }
                    else {
                       var itemy = [
             { name: "İstanbul", label: "İstanbul" },
             { name: "İstanbul Anadolu", label: "İstanbul Anadolu" },
             { name: "Ankara", label: "Ankara"},
             { name: "İzmir", label: "İzmir"},
             { name: "Adana", label: "Adana"}
                        ];
                        response(itemy);
                    }
                }
            },
            select: function (e, ui) {
                //console.log(ui);
               
                    var keyvalue = ui.item.value;
                    $("#ucak-nereden").val(ui.item.id);
                    var value = ui.item.value;
                    var mobilPanel = $('#mobil-panel');

                    $("#from-mobilx").attr("data-ulke", ui.item.idsi);

                    mobilPanel.addClass('hidden');
                    $('body').removeClass('fix');
                    mobilPanelTarget.value = value;
                    $('#plane-from').val(ui.item.value);
                    $('#ucak-nereden').val(ui.item.id);
              
            }
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            // only change here was to replace .text() with .html()
            var dd = "";
            if (item.value.indexOf('Hepsi') !== -1) {
                dd = "greenxx";
            }
            return $("<li class='" + dd + "'></li>")
               .data("ui-autocomplete-item", item)
               .append($("<div></div>").html(item.label))
               .appendTo(ul);
        };

        $("#varis-yeri-mobil").autocomplete({
            create: function (event, ui) {
                $('.ui-autocomplete').wrap('<span class="desktop"></span>');
            }, open: function (event, ui) {
                $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
            },
            minLength: 0,
            delay: 0,
            source: function (request, response) {
                var token = $('input[name="__RequestVerificationToken"]').val();
                if (hangisinde == "ucakbileti") {
                    if (request.term.length > 1) {
                        jQuery.ajax({
                            method: "POST",
                            url: "/home/ucaklistesi",
                            timeout: 20000,
                            data: {
                                __RequestVerificationToken: token,
                                limit: 15,
                                str: request.term.replace("I", "i").replace("I", "i"),
                                where: "to",
                                from: $("#varis-yeri-mobil").val().substring($("#varis-yeri-mobil").val().lastIndexOf(" ") + 2).replace(")", "")
                            },
                            dataType: "json",
                            success: function (data) {
                                response($.map(data, function (item) {
                                    return {
                                        label: item.item,
                                        value: item.item,
                                        idsi: item.idsi
                                    };
                                }));
                            }
                        })
                    }
                }
                else {
                    if (request.term.length > 1) {
                        jQuery.ajax({
                            method: "POST",
                            url: "/home/otobuslistesivar",
                            timeout: 20000,
                            data: {
                                __RequestVerificationToken: token,
                                firmano: "0",
                                KalkisAdi: $("#from-mobilx").val(),
                                term: request.term
                            },
                            dataType: "json",
                            success: function (data) {
                                response($.map(data, function (item) {
                                    return {
                                        label: item.Kalkis_Yeri,
                                        value: item.Kalkis_Yeri
                                    };
                                }));
                            }
                        })
                    }
                    else {
                        var itemy = [
        { name: "İstanbul", label: "İstanbul" },
        { name: "İstanbul Anadolu", label: "İstanbul Anadolu" },
        { name: "Ankara", label: "Ankara" },
        { name: "İzmir", label: "İzmir" },
        { name: "Adana", label: "Adana" }
                        ];
                        response(itemy);
                    }
                }
            },
            select: function (e, ui) {
                //  console.log(ui);
                var keyvalue = ui.item.value;
                $("#ucak-nereye").val(ui.item.id);

                $("#destination-mobilx").attr("data-ulke", ui.item.idsi);

                var value = ui.item.value;
                var mobilPanel = $('#mobil-panel');
                mobilPanel.addClass('hidden');
                $('body').removeClass('fix');
                mobilPanelTarget.value = value;
                $('#plane-destination').val(ui.item.value);
                $('#ucak-nereye').val(ui.item.id);

            }
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            // only change here was to replace .text() with .html()

            var dd = "";
            if (item.value.indexOf('Hepsi') !== -1) {
                dd = "greenxx";
            }
            return $("<li class='" + dd + "'></li>")
               .data("ui-autocomplete-item", item)
               .append($("<div></div>").html(item.label))
               .appendTo(ul);
        };
    }

});

$(document).ready(function () {
    $.datepicker.setDefaults($.datepicker.regional['tr']);
    $("#datepicker-checkin-mobil").datepicker({
        numberOfMonths: 12,
        locale: 'tr',
        defaultDate: "+0d",
        minDate: "+0d",
        onSelect: function (selectedDate, inst) {
            console.log(selectedDate);
            takvimo(selectedDate.replace("-", "").replace("-", ""), '1');
            trhle(selectedDate.replace("-", "").replace("-", ""), '1');
            var fromDate = $(this).datepicker("getDate");
            var fromDay = $.datepicker.formatDate('dd', fromDate);
            var fromMonth = $.datepicker.formatDate('M', fromDate);
            var fromDayName = $.datepicker.formatDate('DD', fromDate);
            $('#checkin-mobil').find('#kalkis_gun').html(fromDay);
            $('#checkin-mobil').find('span').html(fromMonth + ".");
            $('#checkin-mobil').find('small').html(fromDayName);
            $('#checkin').val($.datepicker.formatDate('dd-mm-yy', fromDate));
            $("#kalkis_gunx").val($.datepicker.formatDate('dd-mm-yy', fromDate));
            if (selectedDate.length > 0) {
                var date2 = $('#datepicker-checkin-mobil').datepicker('getDate');
                date2.setDate(date2.getDate());
                $("#datepicker-checkout-mobil").datepicker("option", "minDate", date2);
                var toDate = $("#datepicker-checkout-mobil").datepicker("getDate");
                var toDay = $.datepicker.formatDate('dd', toDate);
                var toMonth = $.datepicker.formatDate('M', toDate);
                var toDayName = $.datepicker.formatDate('DD', toDate);
                var toyear = $.datepicker.formatDate('YYYY', toDate);
                $('#checkout-mobil').find('#mobile_donus_gun').html(toDay);
                $('#checkout-mobil').find('span').html(toMonth + ".");
                $('#checkout-mobil').find('small').html(toDayName);
                $('#checkout').val($.datepicker.formatDate('dd-mm-yy', toDate));
                var mobilPanel = $('#mobil-panel');
                mobilPanel.addClass('hidden');
                $('body').removeClass('fix');
                $("#donus_gunx").val($.datepicker.formatDate('dd-mm-yy', toDate));
                //  console.log(toDate);
            }
        }
    });
    $("#datepicker-checkout-mobil").datepicker({
        numberOfMonths: 12,
        locale: 'tr',
        defaultDate: "+1d",
        minDate: "+0d",
        onSelect: function (selectedDate, inst) {
            console.log(selectedDate);
            takvimo(selectedDate.replace("-", "").replace("-", ""), '2');
            trhle(selectedDate.replace("", ""), '2');
            var toDate = $(this).datepicker("getDate");
            var toDay = $.datepicker.formatDate('dd', toDate);
            var toMonth = $.datepicker.formatDate('M', toDate);
            var toDayName = $.datepicker.formatDate('DD', toDate);
            $('#checkout-mobil').find('#mobile_donus_gun').html(toDay);
            $('#checkout-mobil').find('span').html(toMonth + ".");
            $('#checkout-mobil').find('small').html(toDayName);
            $('#checkout').val($.datepicker.formatDate('dd.mm.yy', toDate));
            $("#donus_gunx").val($.datepicker.formatDate('dd-mm-yy', toDate));
            var mobilPanel = $('#mobil-panel');
            mobilPanel.addClass('hidden');
            $('body').removeClass('fix');
        }
    });

    $(document).on('click', '#yolcu-sayisi-mobil .input-group-btn button', function () {
        var input = $(this).closest('.input-group').find('input');
        var min = parseInt(input.attr('min'));
        var max = parseInt(input.attr('max'));
        var value = input.val();
        if ($(this).hasClass('plus') && value != max) {
            $(this).closest('.input-group').find('input').val(parseInt(value) + 1);
        } else if (!$(this).hasClass('plus') && value != min) {
            $(this).closest('.input-group').find('input').val(parseInt(value) - 1);
        }
        var title = $(this).closest('.col-xs-7').prev()[0].innerHTML;
        var area = $('#traveler-area');
        var titles = area.find('.col-xs-5');
        for (var i = 0; i < titles.length; i++) {
            if (titles[i].innerHTML === title) {
                $(titles[i]).next().find('input').val(input.val());
                break;
            }
        }
        yolcuHesapla();
    });

    $(document).on('change', '#yolcu-sayisi-mobil select', function () {
        $('#traveler-area select').val($(this).val());
        $('#traveler-area select').trigger('change');
    });
});


var mobildeGizle = function () {
    var width = $(window).width();
    if (width < 991) {
        $('#giris-yap').remove();
        $('#yardim').remove();
        $('#uye-ol span').hide();
    }
};

$(document).ready(mobildeGizle);

$(document).ready(function () {

    var checkbox = $("#aktarmasiz_mobil");

    checkbox.change(function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            $("#aktsz").val("true");
        } else {
            $("#aktsz").val("false");
        }
    });

    var checkbox = $("#iptal_edilebilir_mobil");

    checkbox.change(function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            $("#iptledl").val("true");
        } else {
            $("#iptledl").val("false");
        }
    });


    sehirler();
    $('.dropdown-toggle').dropdown();
    $("#modtik").click(function () {

        $('#rez-modal').modal({
            show: true,
            closeOnEscape: true
        });
    })
    $("#tikotik").click(function () {

        $('#myModali').modal({
            show: true,
            closeOnEscape: true
        });
    })

    /* var count = 5000;
     var j = 0;
     var field2 = $('#hotel-count-area')[0];
     if (field2 != null) {
         var m = setInterval(function() {
             field2.innerHTML = "&nbsp;" + j + "+&nbsp;";
             j += 10;
             if (j > count) {
                 clearInterval(m);
             }
         }, 1);
     }*/

});

function sehirler() {

    var data = ["Ankara", "İzmir", "Antalya", "Diyarbakır", "Gaziantep", "Trabzon", "Düsseldorf", "Londra", "Berlin", "Tegel", "Newyork", "Malatya", "Van", "Erzurum", "İstanbul", "Frankfurt", "Atina", "Barselona", "Kars", "Dortmund", "Hamburg", "Hannover", "Münih", "Sivas", "Şanlıurfa", "Samsun", "Ağrı", "Amsterdam"];

    var field = $('#text-flow-area span')[0];
    var i = 0;
    if (field != null) {
        var k = setInterval(function () {
            $(field).hide();
            field.innerHTML = data[i];
            $(field).show(300);
            i++;
            if (i === data.length) {
                clearInterval(k); sehirler();
            }
        }, 2000);
    }
}

$(document).ready(function () {

    $("#plane-from").focus(function () {
        $(this).select();
    });

    $("#kalkis-yeri-mobil").focus(function () {
        $(this).select();
    });

    $("#plane-destination").focus(function () {
        $(this).select();
    });

    $("#varis-yeri-mobil").focus(function () {
        $(this).select();
    });

    //$(".ui-autocomplete ").wrap('<div class="desktop" />');
    $("#ui-datepicker-div").wrap('<div class="desktop" />');
    $('#plane-destination').focusout(function (e) {
        if ($(this).val().indexOf(')') >= 0) {

        }
        else {
            if ($(".otox").hasClass("active")) {

            }
            else {
                $(this).val("");
                $(this).attr("data-ulke", "");
            }

        }
    });
    $('#plane-from').focusout(function (e) {
        if ($(this).val().indexOf(')') >= 0) {

        }
        else {
            if ($(".otox").hasClass("active")) {

            }
            else {
                $(this).val("");
                $(this).attr("data-ulke", "");
            }

        }
    });
    $("#plane-destination").autocomplete({

        //   open: function(event, ui) {
        //        $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
        //    },
        create: function (event, ui) {
            $('.ui-autocomplete').wrap('<span class="desktop"></span>');
        }, open: function (event, ui) {
            $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
        },
        minLength: 2,
        delay: 0,
        source: function (request, response) {
            var token = $('input[name="__RequestVerificationToken"]').val();
            if (hangisinde == "ucakbileti") {
                jQuery.ajax({
                    method:"POST",
                    url: "/home/ucaklistesi",
                    timeout: 20000,
                    data: {
                        __RequestVerificationToken: token,
                        limit: 15,
                        str: request.term.replace("I", "i").replace("I", "i").replace("I", "i"),
                        where: "to",
                        from: $("#plane-from").val().substring($("#plane-from").val().lastIndexOf(" ") + 2).replace(")", "")
                    },
                    dataType: "json",
                    success: function (data) {
                        response($.map(data, function (item) {

                            return {
                                label: item.item,
                                value: item.item,
                                idsi: item.idsi
                            };
                        }));
                    }
                })
            }
            else {
                jQuery.ajax({
                    method: "POST",
                    url: "/home/otobuslistesivar",
                    timeout: 20000,
                    data: {
                        __RequestVerificationToken: token,
                        firmano: "0",
                        KalkisAdi: $("#plane-from").val(),
                        term: request.term
                    },
                    dataType: "json",
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Kalkis_Yeri,
                                value: item.Kalkis_Yeri
                            };
                        }));
                    }
                })
            }
        },
        select: function (e, ui) {
            var keyvalue = ui.item.label;
            //  console.log(ui.item.idsi);
            if (ui.item.label.indexOf(')') >= 0) {
                $("#plane-destination").attr("data-ulke", ui.item.idsi);
            }

            $("#ucak-nereye").val(ui.item.id);
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var dd = "";
        if (item.value.indexOf('Hepsi') !== -1) {
            dd = "greenxx";
        }
        //   $("#plane-destination").attr("data-ulke", item.idsi);
        return $("<li class='" + dd + "'></li>")
           .data("ui-autocomplete-item", item)
           .append($("<div></div>").html(item.label))
           .appendTo(ul);
    };

    $("#plane-from").autocomplete({
        create: function (event, ui) {
            $('.ui-autocomplete').wrap('<span class="desktop"></span>');
        }, open: function (event, ui) {
            $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
        },
        minLength: 2,
        delay: 0,
        source: function (request, response) {
            var token = $('input[name="__RequestVerificationToken"]').val();
            if (hangisinde == "ucakbileti") {
                jQuery.ajax({
                    method: "POST",
                    url: "/home/ucaklistesi",
                    data: {
                        __RequestVerificationToken: token,
                        limit: 15,
                        str: request.term.replace("I", "i").replace("I", "i"),
                        where: "from",
                        from: "0"
                    },
                    dataType: "json",
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.item,
                                value: item.item,
                                idsi: item.idsi
                            };
                        }));
                    }
                })
            }
            else {
                jQuery.ajax({
                    method: "POST",
                    url: "/home/otobuslistesi",
                    data: {
                        __RequestVerificationToken: token,
                        firmano: "0",
                        term: request.term
                    },
                    dataType: "json",
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Kalkis_Yeri,
                                value: item.Kalkis_Yeri,

                            };
                        }));
                    }
                })
            }
        },
        select: function (e, ui) {
            var keyvalue = ui.item.label;
            if (ui.item.label.indexOf(')') >= 0) {
                $("#plane-from").attr("data-ulke", ui.item.idsi);
            }
            $("#ucak-nereden").val(ui.item.id);
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        // only change here was to replace .text() with .html()
        var dd = "";
        if (item.value.indexOf('Hepsi') !== -1) {
            dd = "greenxx";
        }

        return $("<li class='" + dd + "'></li>")
           .data("ui-autocomplete-item", item)
           .append($("<div></div>").html(item.label))
           .appendTo(ul);
    };

    //var havaalanlari_from_desktop = new Bloodhound({
    //    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    //    queryTokenizer: Bloodhound.tokenizers.whitespace,
    //    prefetch: '/UcakBileti/HavaalaniListesiHepsi',
    //    remote: {
    //        url: '/UcakBileti/HavaalaniListesi?str=%QUERY',
    //        wildcard: '%QUERY'
    //    }
    //});
});

var exchangeData = function (first, second) {

    var bir = $('#plane-from').val();
    var iki = $('#plane-destination').val();

    var birat = $('#plane-from').attr("data-ulke");
    var ikiat = $('#plane-destination').attr("data-ulke");


    $('#plane-from').val(iki);
    $('#plane-destination').val(bir);
    $('#plane-from').attr("data-ulke", ikiat);
    $('#plane-destination').attr("data-ulke", birat);

};

var exchangeData1 = function (first, second) {

    var bir = $('#ucak-nereden').val();
    var iki = $('#ucak-nereye').val();

    var birat = $('#ucak-nereden').attr("data-ulke");
    var ikiat = $('#ucak-nereye').attr("data-ulke");

    $('#ucak-nereden').attr("data-ulke", ikiat);
    $('#ucak-nereye').attr("data-ulke", birat);


    $('#ucak-nereden').val(iki);
    $('#ucak-nereye').val(bir);
};

$(document).ready(function () {
    $('.exchange-button').click(function () {
        exchangeData($('#plane-from'), $('#plane-destination'));
        exchangeData1($('#ucak-nereden'), $('#ucak-nereye'))
    });

    $('.mobil-ara-btn').click(function () {
        $("#ucak-form").submit();
    });
});

$(document).ready(function () {

    $('#main-slider').slick({
        infinite: true,
        speed: 1000,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        arrows: false
    });

});

function yolcuHesapla() {

    var input = $('#travelers');
    var toplam_ucak_yolcu_input = $("#toplam_ucak_yolcu_sayisi");
    var inputMobil = $('#yolcu-mobil');
    if (input != undefined) {
        var ucusSinifi = $('select[name=ucus-sinifi] option:selected')[0].text;
        var yolcuSayilari = $('#traveler-area input[type=number]');
        var toplamYolcuSayisi = 0;

        for (var i = 0; i < yolcuSayilari.length; i++) {
            toplamYolcuSayisi += parseInt(yolcuSayilari[i].value);
        }
        //alert(toplamYolcuSayisi);
        toplam_ucak_yolcu_input.val(toplamYolcuSayisi);
        input.val(toplamYolcuSayisi + " Yolcu, " + ucusSinifi);
        inputMobil.val(toplamYolcuSayisi + " Yolcu, " + ucusSinifi)
        if (inputMobil != undefined) {
            //$('#yolcu-mobil').val(input.value);
        }
    }
}

var yolcuHesapla1 = function (e) {
    var input = $('input[name=travelers]')[0];
    var toplam_ucak_yolcu_input = $("#toplam_ucak_yolcu_sayisi")[0];
    var inputMobil = $('input[name=yolcu-mobil')[0];

    if (input != undefined) {
        var ucusSinifi = $('select[name=ucus-sinifi] option:selected')[0];
        var yolcuSayilari = $('#traveler-area input[type=number]');
        var toplamYolcuSayisi = 0;
        for (var i = 0; i < yolcuSayilari.length; i++) {
            toplamYolcuSayisi += parseInt(yolcuSayilari[i].value);
        }
        toplam_ucak_yolcu_input.value = toplamYolcuSayisi;
        input.value = toplamYolcuSayisi + " Yolcu, " + ucusSinifi.text;
        if (inputMobil != undefined) {
            inputMobil.value = input.value;
        }
        $('#traveler-area select[name=ucus-sinifi]').change(yolcuHesapla1);
    }
};

$(document).ready(function () {
    yolcuHesapla();
    $('#traveler-area .input-group-btn button').click(function () {
        var input = $(this).closest('.input-group').find('input');
        var min = parseInt(input.attr('min'));
        var max = parseInt(input.attr('max'));
        var value = input.val();
        if ($(this).hasClass('plus') && value != max) {
            $(this).closest('.input-group').find('input').val(parseInt(value) + 1);
        } else if (!$(this).hasClass('plus') && value != min) {
            $(this).closest('.input-group').find('input').val(parseInt(value) - 1);
        }
        yolcuHesapla();
    });
    $('input[name=travelers]').click(function () {
        var area = $('#traveler-area');
        var hasClass = area.hasClass('hidden');
        if (hasClass) {
            area.removeClass('hidden');
        } else {
            area.addClass('hidden');
        }
    });

    $('#yolcu-tamam').click(function () {
        var area = $('#traveler-area');
        var hasClass = area.hasClass('hidden');
        if (hasClass) {
            area.removeClass('hidden');
        } else {
            area.addClass('hidden');
        }
        yolcuHesapla();
    });
});
function silhata() {
    $("#hatadesk,#hatamobil").html("").css("background", "transparent");
}
$(document).ready(function () {
    $('select[name=ucus-sinifi]').on('change', function () {
        var input = $('#travelers');
        var toplam_ucak_yolcu_input = $("#toplam_ucak_yolcu_sayisi");
        var inputMobil = $('#yolcu-mobil');
        if (input != undefined) {
            var ucusSinifi = $('select[name=ucus-sinifi] option:selected')[0].text;
            var yolcuSayilari = $('#traveler-area input[type=number]');
            var toplamYolcuSayisi = 0;
            for (var i = 0; i < yolcuSayilari.length; i++) {
                toplamYolcuSayisi += parseInt(yolcuSayilari[i].value);
            }
            //alert(toplamYolcuSayisi);
            toplam_ucak_yolcu_input.val(toplamYolcuSayisi);
            input.val(toplamYolcuSayisi + " Yolcu, " + ucusSinifi);
            inputMobil.val(toplamYolcuSayisi + " Yolcu, " + ucusSinifi)
            if (inputMobil != undefined) {
                //       $('#yolcu-mobil').val(input.value);
            }
        }
    })
    var gidisTipi = $('input[name=gidis-tipi]')[0];
    if (gidisTipi != null) {
        var alan = $('.gidis-tipi-alani');
        alan.find('[data-value="' + gidisTipi.value + '"]').addClass('active');
        $('.gidis-tipi-alani .btn').click(function () {
            $('.gidis-tipi-alani .btn').removeClass('active');
            $(this).addClass('active');
            var value = $(this).attr('data-value');
            $(gidisTipi).val(value);
            var checkout = $('input[name=donus]')[0];
            if (value === "1") {
                checkout.setAttribute('disabled', 'disabled');
                checkout.removeAttribute('required');
            } else {
                checkout.removeAttribute('disabled');
                checkout.setAttribute('required', 'required');
            }
        });
    }
});

$(document).ready(function () {
    $('input[name=from-mobil]').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $('input[name=destination-mobil]').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $('input[name=from-mobil]').val($('#plane-from').val());
    $('input[name=destination-mobil]').val($('#plane-destination').val());
});


var mobilPanelTarget;
var mobilYolcuCalistiMi = 0;
var gizle = function () {
    var mobilPanel = $('#mobil-panel');
    mobilPanel.removeClass('hidden');
    var buton = mobilPanel.find('.buton');
    buton.addClass('hidden');
    var inputs = mobilPanel.find('input');
    inputs.addClass('hidden');
    var inputGroups = mobilPanel.find('.input-group');
    inputGroups.addClass('hidden');
    var datepickers = $('.datepicker');
    datepickers.addClass('hidden');
    var yolcuSayisi = $('#yolcu-sayisi-mobil');
    yolcuSayisi.addClass('hidden');
    var liste = mobilPanel.find('#liste');
    liste.addClass('hidden');
    var rezSorgulama = mobilPanel.find('#rezervasyon-sorgulama');
    rezSorgulama.addClass('hidden');
    var htmlAlani = mobilPanel.find('#html-alani');
    htmlAlani.addClass('hidden');
    $('body').addClass('fix');
    return mobilPanel;
};
var kalkisYeriSec = function (e) {
    var mobilPanel = gizle();
    var buton = mobilPanel.find('.buton');
    buton.removeClass('hidden');
    buton[0].innerHTML = "Geri";
    buton.click(function () {
        mobilPanel.addClass('hidden');
        $('body').removeClass('fix');
        buton.addClass('hidden');
    });
    var inputGroups = mobilPanel.find('.input-group');
    inputGroups.removeClass('hidden');
    mobilPanelTarget = e.currentTarget;
    var value = mobilPanelTarget.value;
    var baslik = mobilPanel.find('.baslik')[0];
    baslik.innerHTML = "Kalkış Yeri";

    var kalkisYeri = mobilPanel.find('#kalkis-yeri-mobil');
    kalkisYeri.removeClass('hidden');
    kalkisYeri.typeahead('val', value);
    kalkisYeri.focus();
};

var varisYeriSec = function (e) {
    var mobilPanel = gizle();
    var buton = mobilPanel.find('.buton');
    buton.removeClass('hidden');
    buton[0].innerHTML = "Geri";
    buton.click(function () {
        mobilPanel.addClass('hidden');
        $('body').removeClass('fix');
        buton.addClass('hidden');
    });
    var inputGroups = mobilPanel.find('.input-group');
    inputGroups.removeClass('hidden');
    mobilPanelTarget = e.currentTarget;
    var value = mobilPanelTarget.value;
    var baslik = mobilPanel.find('.baslik')[0];
    baslik.innerHTML = "Varış Yeri";
    var varisYeri = mobilPanel.find('#varis-yeri-mobil');
    varisYeri.removeClass('hidden');
    varisYeri.typeahead('val', value);
    varisYeri.focus();
};

var kalkisTarihiSec = function (e) {
    var mobilPanel = gizle();
    var buton = mobilPanel.find('.buton');
    buton.removeClass('hidden');
    buton[0].innerHTML = "Geri";
    buton.click(function () {
        mobilPanel.addClass('hidden');
        $('body').removeClass('fix');
        buton.addClass('hidden');
    });
    var kalkisTarihi = mobilPanel.find('#datepicker-checkin-mobil');
    kalkisTarihi.removeClass('hidden');
    var baslik = mobilPanel.find('.baslik')[0];
    baslik.innerHTML = "Gidiş Tarihi";

};

var donusTarihiSec = function (e) {
    var mobilPanel = gizle();
    var buton = mobilPanel.find('.buton');
    buton.removeClass('hidden');
    buton[0].innerHTML = "Geri";
    buton.click(function () {
        mobilPanel.addClass('hidden');
        $('body').removeClass('fix');
        buton.addClass('hidden');

    });
    var kalkisTarihi = mobilPanel.find('#datepicker-checkout-mobil');
    kalkisTarihi.removeClass('hidden');
    var baslik = mobilPanel.find('.baslik')[0];
    baslik.innerHTML = "Dönüş Tarihi";
};

var yolcuSecMobil = function (e) {
    var mobilPanel = gizle();
    mobilPanelTarget = e.currentTarget;
    var baslik = mobilPanel.find('.baslik')[0];
    baslik.innerHTML = "Yolcu Sayısı";
    var buton = mobilPanel.find('.buton2');
    buton.removeClass('hidden');
    buton[0].innerHTML = "Geri";
    buton.click(function () {
        mobilPanel.addClass('hidden');
        $('body').removeClass('fix');
        buton.addClass('hidden');
    });
    var yolcuSayisi = $('#yolcu-sayisi-mobil');
    yolcuSayisi.removeClass('hidden');
    var inputGroups = yolcuSayisi.find('.input-group');
    inputGroups.removeClass('hidden');
    var inputs = yolcuSayisi.find('.input-group input');
    inputs.removeClass('hidden');
    if (mobilYolcuCalistiMi === 0) {
        yolcuSayisi.html($('#traveler-area').html());
        mobilYolcuCalistiMi = 1;
    }
};

var listeYukle = function (el, title) {
    var mobilPanel = gizle();
    var liste = mobilPanel.find('#liste');
    liste.removeClass('hidden');
    liste.html($(el).html());
    var baslik = mobilPanel.find('.baslik')[0];
    baslik.innerHTML = title;
    var buton = mobilPanel.find('.buton');
    buton.removeClass('hidden');
    buton[0].innerHTML = "Geri";
    buton.click(function () {
        mobilPanel.addClass('hidden');
        $('body').removeClass('fix');
        buton.addClass('hidden');
    });
};

var mobilHTMLYukle = function (el, title) {
    var mobilPanel = gizle();
    var htmlAlani = mobilPanel.find('#html-alani');
    htmlAlani.removeClass('hidden');
    $(el).appendTo(htmlAlani);
    var baslik = mobilPanel.find('.baslik')[0];
    baslik.innerHTML = title;
    var buton = mobilPanel.find('.buton');
    buton.removeClass('hidden');
    buton[0].innerHTML = "Geri";
    buton.click(function () {
        mobilPanel.addClass('hidden');
        $('body').removeClass('fix');
        buton.addClass('hidden');
    });
};

var rezArama = function () {
    var mobilPanel = gizle();
    var rezSorgulama = mobilPanel.find('#rezervasyon-sorgulama');
    rezSorgulama.removeClass('hidden');
    rezSorgulama.find('input').removeClass('hidden');
    var baslik = mobilPanel.find('.baslik')[0];
    baslik.innerHTML = "Rezervasyon Sorgula";
    var buton = mobilPanel.find('.buton');
    buton.removeClass('hidden');
    buton[0].innerHTML = "Geri";
    buton.click(function () {
        mobilPanel.addClass('hidden');
        $('body').removeClass('fix');
        buton.addClass('hidden');
    });
};