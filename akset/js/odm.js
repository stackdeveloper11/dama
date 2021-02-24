$(document).ready(function () {
    var checkedInput = $('.taksitler input[name=taksit]:checked');

    if (checkedInput.length > 0) {


        var amount = checkedInput.attr('data-amount');
        var BonusInstallmentCount = checkedInput.attr('data-BonusInstallmentCount');
        var InstallmentCount = checkedInput.attr('data-InstallmentCount');
        var InstallmentOptionId = checkedInput.attr('data-InstallmentOptionId');
        var AmountOfInterest = checkedInput.attr('data-AmountOfInterest');
        var RateOfInterest = checkedInput.attr('data-RateOfInterest');

        $("#odeme-amount").val(amount);
        $("#odeme-BonusInstallmentCount").val(BonusInstallmentCount);
        $("#odeme-InstallmentCount").val(InstallmentCount);
        $("#odeme-InstallmentOptionId").val(InstallmentOptionId);
        $("#odeme-AmountOfInterest").val(AmountOfInterest);
        $("#odeme-RateOfInterest").val(RateOfInterest);



        //$(this).attr('data-myorder')

        //      alert(amount);

    }

    $('input[type=radio][name=taksit]').change(function () {


        //alert(this.value);
        var checkedInput = $('.taksitler input[name=taksit]:checked');
        var amount = checkedInput.attr('data-amount');
        var BonusInstallmentCount = checkedInput.attr('data-BonusInstallmentCount');
        var InstallmentCount = checkedInput.attr('data-InstallmentCount');
        var InstallmentOptionId = checkedInput.attr('data-InstallmentOptionId');
        var AmountOfInterest = checkedInput.attr('data-AmountOfInterest');
        var RateOfInterest = checkedInput.attr('data-RateOfInterest');

        $("#odeme-amount").val(amount);
        $("#odeme-BonusInstallmentCount").val(BonusInstallmentCount);
        $("#odeme-InstallmentCount").val(InstallmentCount);
        $("#odeme-InstallmentOptionId").val(InstallmentOptionId);
        $("#odeme-AmountOfInterest").val(AmountOfInterest);
        $("#odeme-RateOfInterest").val(RateOfInterest);


    });
});



$(document).ready(function () {
    //var items = $('[data-mask]');
    //for (var i = 0; i < items.length; i++) {
    //    $(items[i]).mask(items[i].getAttribute('data-mask'), {
    //        placeholder: items[i].getAttribute('data-placeholder')
    //    });
    //}
});
var disableTC = function (e) {
    if (e.currentTarget.checked) {
        $(e.currentTarget).closest('.form-group').find('input[type=text]').attr('disabled', 'disabled');
        $('#form').parsley();
    } else {
        $(e.currentTarget).closest('.form-group').find('input[type=text]').removeAttr('disabled');
        $('#form').parsley();
    }
};
var odemeSecenekDegistir = function (e) {
    var value = e.currentTarget.value;
    $('#odeme-secenekleri li a[href="' + value + '"]').tab('show');
};
function faturaAc() {
    // Get the checkbox
    var checkBox = document.getElementById("fatura-checkboxi");
    // Get the output text


    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
        $('#fatura-modali').modal({
            backdrop: 'static',
            keyboard: false
        });
    } else {
        $('#fatura-modali').modal('hide');
        $("#billname").val("");
        $("#TaxOffice1").val("");
        $("#TaxNo1").val("");
        $("#Address_Detail1").val("");
        $("#Address_City1").val("");
        $("#Address_ZipCode1").val("");
    }

};

var yolcuBilgileriniAc = function () {
    $('.yolcu-bilgileri').removeClass('hidden-xs');
    $('.ucus-bilgileri').addClass('hidden-xs');
    document.body.scrollTop = 0;
};
var ucusBilgileriniAc = function () {
    $('.yolcu-bilgileri').addClass('hidden-xs');
    $('.ucus-bilgileri').removeClass('hidden-xs');
    document.body.scrollTop = 0;
};

var faturaKaydet = function () {
    if ($.trim($("#ttx").val()) == "" || $.trim($("#ttx").val()) == null) {
        alert("FATURA İSMİ BELİRTMELİSİNİZ!");
    }
    else if ($.trim($("#TaxOffice").val()) == "" || $.trim($("#TaxOffice").val()) == null) {
        alert("VERGİ DAİRESİ BELİRTMELİSİNİZ!");
    }
    else if ($.trim($("#TaxNo").val()) == "" || $.trim($("#TaxNo").val()) == null) {
        alert("VERGİ NUMARASI BELİRTMELİSİNİZ!");
    }
    else if ($.trim($("#Address_Detail").val()) == "" || $.trim($("#Address_Detail").val()) == null) {
        alert("ADRES BELİRTMELİSİNİZ!");
    }
    else if ($.trim($("#Address_City").val()) == "" || $.trim($("#Address_City").val()) == null) {
        alert("ŞEHİR BELİRTMELİSİNİZ!");
    }
    else if ($.trim($("#Address_ZipCode").val()) == "" || $.trim($("#Address_ZipCode").val()) == null) {
        alert("POSTA KODU BELİRTMELİSİNİZ!");
    }
    else {
        $('#fatura-checkboxi').prop('checked', true);
        $('#fatura-checkboxi')[0].checked = true;
        $('#fatura-modali').modal('hide');
        $("#billname").val($("#ttx").val());
        $("#TaxOffice1").val($("#TaxOffice").val());
        $("#TaxNo1").val($("#TaxNo").val());
        $("#Address_Detail1").val($("#Address_Detail").val());
        $("#Address_City1").val($("#Address_City").val());
        $("#Address_ZipCode1").val($("#Address_ZipCode").val());
    }

};