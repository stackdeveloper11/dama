function getParams(script_name) {
    // Find all script tags
    var scripts = document.getElementsByTagName("script");
    // Look through them trying to find ourselves
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf("/" + script_name) > -1) {
            // Get an array of key=value strings of params
            var pa = scripts[i].src.split("?").pop().split("&");
            // Split each key=value into array, the construct js object
            var p = {};
            for (var j = 0; j < pa.length; j++) {
                var kv = pa[j].split("=");
                p[kv[0]] = kv[1];
            }
            return p;
        }
    }
    // No scripts match
    return {};
}
var pirates = [];
$(function () {
   // $.getJSON("/home/otobusbiletlerijs?yer=" + getParams("api").yer + "&gtarih=" + getParams("api").gtarih + "&FirmaNo=" + getParams("api").firmano + "&dtarih=" + getParams("api").dtarih + "", function (crewResponse) {
   //     console.log(crewResponse);
   // });
});