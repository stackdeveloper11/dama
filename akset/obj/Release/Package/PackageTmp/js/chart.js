function Time(n) {
    this.date = n;
    this.Hours = n.getHours();
    this.Minutes = n.getMinutes();
    this.TotalMinutes = (n.getDate() * 24 + this.Hours) * 60 + this.Minutes
}

function FilterTime(n, t) {
    this.MinDate = new Date(this.getDateFromString(n));
    this.MaxDate = new Date(this.getDateFromString(t));
    this.InitialMinDate = this.MinDate;
    this.MinSlider = 0;
    this.MaxSlider = Math.abs(this.MaxDate - this.MinDate);
    this.InitialMax = this.MaxSlider;
    this.MinDateAsTime = this.MinDate.getTime();
    this.MaxDateAsTime = this.MaxDate.getTime();
    this.slider = null;
    this.beginTime = null;
    this.endTime = null
}

function FlightDate(n, t) {
    var i = new Date(this.getDateFromString(n)),
        r = new Date(this.getDateFromString(t));
    this.DepDate = i.getTime();
    this.ArrDate = r.getTime()
}

function EstimationGraph(n, t) {
    this.EstimationNodes = [];
    this.Type = n;
    this.setMonthNamesForGraph();
    this.setGraphData(t);
    this.setDateText()
}

function EstimationNode(n, t, i) {
    this.Day = n;
    this.Fare = t;
    this.Currency = i
}

function initGoogleChartForEstimationGraph() {
    google.charts.load("41", {
        packages: ["corechart"]
    });
    google.charts.setOnLoadCallback(load_page_data)
}

function load_page_data() {
    var n = $("#rd-one-way-research").is(":checked");
    n ? graphRender.init(!0, !1) : graphRender.init(!0, !0)
}

function getDataFromEstimationGraph(n) {
    var i = new google.visualization.DataTable,
        r, t;
    for (i.addColumn("string", "Name"), i.addColumn("number", "Tutar"), i.addColumn({
            type: "string",
            role: "tooltip",
            p: {
                html: !0
            }
        }), r = n.EstimationNodes, t = 0; t < r.length; t++) {
        var u = r[t].Day,
            e = $.datepicker.formatDate("d", u),
            f = $.datepicker.formatDate("D", u),
            o = e + "\n" + f.substring(0, Math.min(f.length, 2)),
            s = r[t].Fare,
            h = getTooltip(r[t]);
        i.addRow([o, s, h])
    }
    return i
}

function getTooltip(n) {
    var t = $.datepicker.formatDate("yy-mm-dd", n.Day),
        i = $.datepicker.formatDate("dd MM, yy", n.Day),
        r = '<div class="graph-tooltip-date" data-date="' + t + '">' + i + "<\/div>",
        u = '<div class="graph-tooltip-fare"><strong>' + n.Fare + " <\/strong><span>" + n.Currency.replace("TRY", "TL") + "<\/span><\/div>";
    return '<div class="graph-tooltip">' + r + u + "<\/div>"
}

function setHiddenSelectedFares(n, t) {
    var i = graphRender.paddings[n],
        r = t.EstimationNodes[i].Fare;
    $("#graph-" + n + "-fare-selected").val(r)
}

function getViewFromData(n, t) {
    var i = new google.visualization.DataView(n);
    return i.setColumns([0, 1, 2, {
        type: "string",
        role: "style",
        calc: function(n, i) {
            return (t || t == 0) && i == t ? "color: #FF9A3D" : "color: #38b0ae"
        }
    }]), i
}

function drawFlightEstimationGraph(n, t) {
    n == "departure" ? drawFlightEstimationDepartureGraph(t) : n == "return" && drawFlightEstimationReturnGraph(t)
}

function drawFlightEstimationDepartureGraph(n) {
    var i = getDataFromEstimationGraph(n),
        u = getViewFromData(i, graphRender.paddings.departure),
        r, t;
    setHiddenSelectedFares("departure", n);
    r = {
        title: "",
        bar: {
            groupWidth: "65%"
        },
        legend: {
            position: "none"
        },
        backgroundColor: "#fff",
        properties: {
            html: !0
        },
        colors: ["#38b0ae"],
        chartArea: {
            right: 0,
            top: 3,
            width: "90%",
            height: "47%"
        },
        tooltip: {
            isHtml: !0
        },
        vAxis: {
            gridlines: {
                count: 3
            },
            viewWindowMode: "explicit",
            viewWindow: {
                min: 0,
                max: graphRender.graphUpperLimit
            }
        }
    };
    t = new google.visualization.ColumnChart(document.getElementById("departure-month"));
    t.draw(u, r);
    google.visualization.events.addListener(t, "select", function() {
        var n = t.getSelection(),
            u, f, e, o;
        n.length && (u = n[0].row, graphRender.lastSelectedRoute = "departure", t.setSelection(n), f = getViewFromData(i, u), e = $(i.Kf[u].c[2].v), t.draw(f, r), flightSearchGraphHelper.updateHiddenSelectedFields("departure", e), flightSearchGraphHelper.updateGraphMessage(), o = graphRender.departureDate, graphRender.paddings.departure = base.getDateDifferenceAsDays(graphRender.departureStartDate, graphRender.departureDate), flightSearchGraphHelper.fixDatesForDepartureReturn("departure", o, !1, !0), graphRender.Graphs.departure.setDateText(), graphRender.paddings.departure = base.getDateDifferenceAsDays(graphRender.departureStartDate, graphRender.departureDate))
    });
    google.visualization.events.addListener(t, "onmouseover", function(n) {
        barMouseOver(".departure-chart-month", $(".departure-month").offset().top, $(".google-visualization-tooltip"), $(".google-visualization-tooltip").width(), n)
    })
}

function barMouseOver(n, t, i, r) {
    var u = $(n + " svg g g g g rect").first(),
        e = u.offset(),
        f = 11,
        o = 0;
    try {
        f = parseFloat(u.attr("width"));
        o = parseFloat(u.attr("height"))
    } catch (e) {}
    i.offset({
        left: e.left - (r - f) / 2,
        top: t - 30
    });
    i.show("fast")
}

function drawFlightEstimationReturnGraph(n) {
    var i = getDataFromEstimationGraph(n),
        u = getViewFromData(i, graphRender.paddings["return"]),
        r, t;
    setHiddenSelectedFares("return", n);
    r = {
        title: "",
        bar: {
            groupWidth: "65%"
        },
        legend: {
            position: "none"
        },
        backgroundColor: "#fff",
        properties: {
            html: !0
        },
        colors: ["#38b0ae"],
        stroke: "none",
        chartArea: {
            right: 0,
            top: 3,
            width: "90%",
            height: "47%"
        },
        tooltip: {
            isHtml: !0
        },
        vAxis: {
            gridlines: {
                count: 3
            },
            viewWindowMode: "explicit",
            viewWindow: {
                min: 0,
                max: graphRender.graphUpperLimit
            }
        }
    };
    t = new google.visualization.ColumnChart(document.getElementById("return-month"));
    t.draw(u, r);
    google.visualization.events.addListener(t, "select", function() {
        var n = t.getSelection(),
            f;
        if (n.length) {
            graphRender.lastSelectedRoute = "return";
            t.setSelection(n);
            var u = n[0].row,
                e = getViewFromData(i, u),
                o = $(i.Kf[u].c[2].v);
            t.draw(e, r);
            flightSearchGraphHelper.updateHiddenSelectedFields("return", o);
            flightSearchGraphHelper.updateGraphMessage();
            f = graphRender.returnDate;
            graphRender.paddings["return"] = base.getDateDifferenceAsDays(graphRender.returnStartDate, graphRender.returnDate);
            flightSearchGraphHelper.fixDatesForDepartureReturn("return", f, !0, !1);
            graphRender.Graphs["return"].setDateText();
            graphRender.paddings["return"] = base.getDateDifferenceAsDays(graphRender.returnStartDate, graphRender.returnDate)
        }
    });
    google.visualization.events.addListener(t, "onmouseover", function(n) {
        barMouseOver(".return-chart-month", $(".return-month").offset().top, $(".google-visualization-tooltip"), $(".google-visualization-tooltip").width(), n)
    })
}

function RestServiceJs(n) {
    this.baseUrl = "https://apix.turna.com/v1";
    this.myurl = n;
    this.add = function(n, t, i) {
        var r = this.XDomainRequestCall(n, t, i);
        r || $.ajax({
            type: "POST",
            url: this.baseUrl + this.myurl,
            data: JSON.stringify(n),
            dataType: "text",
            processData: !1,
            contentType: "application/json",
            crossdomain: !0,
            success: t,
            error: function(n, t, r) {
                console.log(n);
                console.log(t);
                console.log(r);
                i()
            },
            timeout: 6e4
        })
    };
    this.XDomainRequestCall = function(n, t, i) {
        if ($.support.cors || !$.ajaxTransport || !window.XDomainRequest) return !1;
        var r = new XDomainRequest;
        return r.timeout = 6e4, r.ontimeout = function() {
            i()
        }, r.onprogress = function() {}, r.onerror = function() {
            i()
        }, r.onload = function() {
            t(r.responseText)
        }, r.open("POST", this.baseUrl + this.myurl), r.send($.param(n)), !0
    };
    this.update = function(n, t) {
        $.ajax({
            type: "PUT",
            url: this.baseUrl + this.myurl,
            data: JSON.stringify(n),
            dataType: "text",
            processData: !1,
            contentType: "application/json",
            success: t,
            error: function() {},
            timeout: 6e4
        })
    };
    this.find = function(n, t, i) {
        $.ajax({
            type: "GET",
            url: this.baseUrl + this.myurl + "/" + n,
            contentType: "application/json",
            success: t,
            error: i,
            timeout: 6e4
        })
    };
    this.findAll = function(n) {
        $.ajax({
            type: "GET",
            url: this.baseUrl + this.myurl,
            contentType: "application/json",
            success: n,
            error: function() {},
            timeout: 6e4
        })
    };
    this.remove = function(n, t) {
        $.ajax({
            type: "DELETE",
            url: this.baseUrl + this.myurl + "/" + n,
            contentType: "application/json",
            success: t,
            error: function() {},
            timeout: 6e4
        })
    };
    this.loadTmpl = function(n, t) {
        $.ajax({
            url: n,
            success: t,
            error: function() {},
            timeout: 6e4
        })
    }
}
var searchCommon, model, flightSearch, remarketing, ecommerce, flightSearchGraphHelper, searchGraphEventTracking, flightSearchTracking, latestSearches, userPreferencesCookie;
$(function() {
        function o(n, t) {
            var u = n.getAttribute("data-src"),
                f = n.getAttribute("src"),
                r;
            u != f && i != f && (r = new Image, r.onload = function() {
                n.parent ? n.parent.replaceChild(r, n) : n.src = u;
                t ? t() : null
            }, r.onerror = function() {
                n.src = i
            }, r.src = u)
        }

        function s(n) {
            var t = n.getBoundingClientRect();
            return t.top >= 0 && t.left >= 0 && t.top <= (window.innerHeight || document.documentElement.clientHeight)
        }
        for (var f = function(n, t) {
                var i, u;
                if (document.querySelectorAll) t = document.querySelectorAll(n);
                else {
                    i = document;
                    u = i.styleSheets[0] || i.createStyleSheet();
                    u.addRule(n, "f:b");
                    for (var f = i.all, r = 0, e = [], o = f.length; r < o; r++) f[r].currentStyle.f && e.push(f[r]);
                    u.removeRule(0);
                    t = e
                }
                return t
            }, e = function(n, t) {
                window.addEventListener ? this.addEventListener(n, t, !1) : window.attachEvent ? this.attachEvent("on" + n, t) : this["on" + n] = t
            }, h = function(n, t) {
                return Object.prototype.hasOwnProperty.call(n, t)
            }, i = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAggAAAFFBAMAAAB7/Ah/AAAALVBMVEUAAABdurpcuLgaiosdkJAVh4czn58rmZk8pKVEqalMra1duLhwwsI7qqpFs7PPC+l0AAAAA3RSTlMAXS9estqeAAAZqklEQVR42uzSvW3CYBgE4K9KwTpnT+BXXgB5AyuZIX0UKdkgoaFDdNSwHOJHQqyAn6e87k7XAAAAAAAAAAAAAAAAAIC70/HQlm01J/064zJ2WH3sv6t+n8M5SZ9pSupzATO8DV2ubdNtH2FNuaqqcdNe3NduWHdJPyWpyy3+W9u//81Dbmr8efUjnLk1l962qiCOT8GExNlkwQJY9SMU/WfSwspoxrGTsBsPLNhYIqDyWETC4rmJRAQFNpEaAQUWQVQUCgsvglToJwDxoYjPvfbxq0kcpw/4SUluEsfnnv+d94lCIhwKwG29p4nBDG6mAKQwhbeox/9XirojkgTM0XOGiiCSbxh6iAASztUP7qr9P1XoEL1m1tw3Y1P2GtFPlraOcToK/oj+jyxik4h++e2mmUnwJi2aqQCsGMNYsUnz8aTX6BFExTeIvvlnl1UjmkSVQA9W+BEoUSi33l+je7BMp2MLm/QIsqvizZ87nynErJlkiXLvAhEM0dqhqfyswae1BLMDegS5CfGPds0Q1i1/AIQAjmHc4W2a4Ku9BTsg3aYxHqNhLlIfyBV6pKhSjwrU17eUFauUqEMkxmMCA8x7NIFe1qzN5LYn6TQerfxy2KQeZnbNlJWvJK81gcREYFQwr07zprVxEU5U5I49SsFxeY3oLtHSOi2burSuEO2rFBXCNGrTkkv7OtOMbt7Yo0eCW5ToUvWAyufvPb+umBkCQMS4EoLa9BS7Q8t74wHhv8hCx7RZBDozhYhgEmeawlLqt2YToUoPnclbqAhr+ZyrWsYEZYwiaE03bpoZvUQPG90YydxtogrMrBRBWBGOKSr4xzQzS1MrJuGHHRUq1s5u8AHR8taIPdtO9Y2OYhJBl2Zmd1oUEYfaQ08Rn3iXdtupfSSixzcn71OBibjgTZoNs20a5/ODpTLytujh8gmOCuX13gUT0e/cJaqOztX24e7jlsCzpcKvbGOyRgcADTdIa9xA7U06Xy7mi6m1m77550HR91h30QEDjwZPCCYsobU3ssSJbjfu+H8oAAlGAMD6mPFZgyY5f1Uey9eLe6M30Nwds3Vxy7vP2WEGJvsJZCQu08Nj+e3T2bQ6XCQ3TxKOme67wjTGhfxuwAcr9EC5OGwDFbiuD48Bqjf2pu4BkqOCCAKmtVn8cPLVTyEhcLDRw6SCKLJ0qnVfY3oiavTkB7/a1Rs3xoMCBH0ibM1mGiHx+LprigKHc+NpA6fxxfK39MB53KGddJy0u0d0yN3HLxPpOzd9/fbWSJUjMWwJAm58cXKDmL8/HBjCm4UIwQYgD6/Ro0lVhdGDpt5aW9wHN/aWtTdWRm2JqBov7Qd/Vm+PVDSRYwLcNXyWBLlg7dHYcEHBQ3FWgeJ7k/C+8TTpAfEjt8kihE23eyK0F4jI3vkLfFvXaAhDoI+k4mZnprDYl0xbvW/bF94VFBTSRpIj0pcyPtWd7Ut6EFQ/7pKBkTwy+QfRsrKFN+o8fOpa3YVIfnTR+NRmSULcfytpdat0ffXNfQwIAGwq6GH9gLsgAecdekBUzSwCVvhHjUhhiPC6D9c31To8i+C//d05eYaW+apdvotyt7JxPcwUwxgkUCAf05bBhA2I857DLpvy9Er0DTMDkHYsrxItbcEUJs7DB0wqyCLw97e/PU7X72g6+8J0k9XHReDSMxTubOKuwgoJZzM7v0JqSSMcUw+Tv063FLyTImXa8NqNa7+qA41BZLyr7gMV2Gz9uGZRnNv3+A3ToauDMYqXZZOIuAkcMvixOJ0X6US5/NeCvmmsFUeqd95NK6f7riYXqPS2eAg4slO+C0FCAQZq95Y72bZ1p5qjoluBOsYQGcoWBjiiyEJwwGulgo05i4gFBFxQwEb0VFNTGGqt0MqCml3rNIkWLtH153vPfbXwn+GzhQocBeJwpnuxqKXHXF0Z+0VPuF20F0zdMYaPXQogQ195C7VljbA2nZ07CojkbTR2tb+hjd2itXm2l74vUf35q0cKJaf4VOHZEm6iJJxtKHFM9obucISPx/ZKeK2qaFfNBMepAHfJh36WltTYXNQIs3mcAWzlQj60IqePF+iIn96iI2pUv4x2GRmoIr5JJYcGRyKOHSSY9qUCeK0fCuzqlimETbG3yOoYV0Ewig8+MVjhELakyDyjuNdifDhkg6DMK70SrrFGS/bh04p4bklaZbHs3KQCZQgSvn1c/IUCSS9WAJeIbhAV4QgmDmClUtr7SYzcMKsAEEhwl2bgscfoYk7eyvn5M4INOcyZwjQANu6Ie6PTF0ERUaNEvXg2BvDxBbJBggG2hkKeTyFVYrDpuEyLYMEp8GmG4oiX50iRBhGMKpvf30tRXCUlwI/LWAhW7JQiCApqx4/qEBEcDqzvpurvmZ8UyIqvrdwE4zQIhhg4kEnr16tnDIwHywbP2mp/jXJrAYOWJbwNRl11oEbSHvhTUuv40V89EEgVaPkut1QxhJkBrLNaAgIJ4fcM4meLC3W3EW11oIgnh8jLmtqg0BFGjV4rA2PAMewL1Ruff63bU+bn2KAKypdWdWhRCbgV8QIzIEegzCfBVO3EK2eMi84o9p3zXCFG/oj01QRrd9MsYX1JXK8MxiKCHttZBAAx7hqdoo6qGABPbZDDswhllTEbfgQ8HAxwjWhZa2dvHSDDD8VHHU+kfy2+syS9zLhBn4jmjllFgBZlVIBxu4RDvF1Ygu/Qz/0ZWg/AIUlrwRkIgNGg+TD4iIn1NfCkQLYSr9GybvaDAjdzqTE+Ybb1ydYgIKvFawXNXRigI8HNcwEwU1gwBBhYm7dhhkj2MZdAJptBMfT8czBzadjwAYxcOfYotwINxh5VIvcYGSk/FKdGsggayVm7NAf7pkD0c324Kabh4qNd9neDVRfCTzgxXFIHY4dIHBGBuREBwKm5qwdYY87DOmV4FjZcMZ24QvdC4oSaVcVTTlgsDXgu3Ict4bY6IFineVgUNzcBbDAkxFRyvK/YmO0dntDZVyKgYKJUF5thLnKzt3pBX6S6a6BGc7FUd4ZJmJqp+D1jk7TynsSb4/kPdAyHABciRA4y88CMHgdUpSVpKTZpTjoAVLBlTboFeEAVU/BaFkEnTtr2jw3OZmA17BFp442OBuYit/opNcmVO5vnMV0D8OKFT1eOrj/VcEwnO31VXZxmACwOw3YpGObEik/pfGPxvat0HiwohPMG72WuO7m6qrfq3p2pKjUAaBcrdNRLzmgHdvXb27d/uNVMqbpL58NWBzzkv45p+IvZEo5EaB2kcePp/h+t4rSvkp5c5TMFpOSMZtCgjNK58S7n6ydVMA2pDccEMO3H6U9YiMK300qYF2lR5vVLdG7sblBmX50xAWcR0k74mp4iMX1FfdRraSUIGPMgteHU9jydGxdHG6rAFOSFbN4AYIKNE00g95aVVGf8uQXHfPiQBgKm+0QnHBO48BtruRMAAD5ZhP5jW6dK7KQyC4K5iNWRImyV7hM3FVMQtiiNr+IMKNCkkygb/CWmajP9ocEd89CijCEu0X1ieVqGYGWN8rzgk7LZ4PaJiae0hGuUeNxt3oJxeNcpUN03FFNFAGB7qWxG4uQhd9VKXSlxnQ1wzENtdDRI9w+d2krDizm7hgMKR/jxzRvvUaf0B2rTglkdAOTcRHjCu3T/qMjE3SoCkAjLEongWHN88l/mrqQ1lioKX7RNZ9iK4M+Q7xzjsGk5t9NOu9NHcScYZ4WAcQA3AeOAEwFncdGgOOEiC0H3iqj0Wt3oP9DfYKru7erqrk7XrYhd9fFeHuElndTX5575nIsjJ+PQ/3gBtkAmYgfK1UDnft5XNXb/I/akQkIYeTOjzLWKTyHEVNOhKBpyVzAw+AIKhhUcaPybDiNyJzMSHnD/J05XZ3MY0HP3kAT31QvEJmtIuDurNgzcDtjMFDRLERtzkSQTbsYCqxVZrK2B+z/RW5XU45hbGcb6BFiz+Hgd+pyl2U0Da5whptavKglDtdHAbQR9XpXOIRCG40ekONPjs52avJXPKrqaUeAZMXRUKzELBTU9DgO3GciyV6OxJ0IslspGX7/62BvppsZKb7kpG4N53omSDiZyN7vNoH8oXBWFQgSI4pzG9kltuiJUMIyDYgQVr6JXsZZDHbtb3YZwo8cCwiwsW1EmujPWH+rcpeNoXj001M0I3vuiviMNreXQbnVHbkPY8lXVSKPHDk3JK8iTUHDaHqyZnfECsJIgIJae1WK2UAnNYA+6jWFrhYP7/GN/vuKjLPvgBp0+N1mfWYvqL1IaPU0CwQzSjIGoRzc4Qr3tUcHokbde8WKWk8CUmMYlttnT5yDBXV++njuQ9PyxoAEU0AO3OWxX9RaRf+5R8hIEIXEu51v4oWmpsqV3fuTvnU69ZKxekGpoAGY92+DSmi0otGIdDh4ZxWFI1tGjB0lkEuffeRoLr/rJ9N17p58pCfvseDUgIbQAbBBbS5LA4VEePfjzMLS/jj46PE8r8+VqcbKFUOan6fTXT6afmsIO/vqt0XHgEEVuDn1oxVFgfe54/5FjEoBO0mudpHd9IWfOh9e7e5oDbHrwz+9NVYLPwruJ2xB6qwJ/euTZ8SP+wF8gvcCld93l3GcD9/2QodB7AwmnQ0NGQrKBmPdI9Dd2JHqqWIaMH3nGj46993y7S0DIItyTv9z+xd9nVYcXKiHgHaX9v/4+hIF8irc8VEGc+njcbQg9ZVQwfk7Iey+U1iElpsyxpP/4JPOcTOibSMKPAD39z28eDKmPJJVYN6sU43GQaizvBd57Ho9cGgkGofiJz0tX3l+Q4N+8IOGzzOZfiIKwgrlWG4gBG4gZakmIHltGQmpHGOAfnM/+9WR/58PXp4egg49/EnjNzoPECHUdGHd+qrx/4jaM7ctF1KfaKRhKfuVXro+B2xVCBrGMhLf/OIyO4HoO7nA788HbDQYPorzaUqe3y7HyYo+pf9DtsUHBeTCho7/+PjZQbQp6vzxPvHPkNobPdIgVkKDqkjAvlhRJwZwEeHgv4FwnGOoUY1QGp3dGEjblJswLjlVYKgnbYrp4cvZuzkc74XOzyDj465/sOPgaEvi+0C/WwsodYUCsJKoWe3459VB+/IE/qlS/v/Xek8Tu/Ofe8pKQXgv7Rp4NhJLbIF4yIVnyWsNhbnYov3ji4JDcIt4JKUfyCf18nFE/CeOpGYnqNoiegUDCZY/FM4Rx0qhjlrXa53VtKe9a6yMo636xcuMY+25TiGUoJoGi1ObJ1mTBx87r7jNWVlBVykKrPycF0EXNc/fr519wG8WuwBTlYXADGnURC1iMUF0wwjZPOddB1Yrq84fnbtP4Frzkxyg10Qi7HPp6dLkHfTcjgeMrS70kUJtrOr0vT0oG3NmkWZZ8nGjxC8vF+oFRTpx9E7S5fuzwcH5oJdcOTXqpezDkGXeDWW7kZFD2QTitDsnMwTVpCTvuGaVCEFj2T23YgAQrFVYk6+3hsAJj73A2ZiacQIOqDyS0hVMF5wCTHzn3/EMNSPClCReBf3xbCOoBH2VAnzhc9+xFXwRgt7kWsSUcps5oNAlPlk7CZ7484MFQj3A0YEHFjt2WQKCGFYg/FwodGvZdmzg25XzAYuY9JJOwNwTrUraaNaOFPOcScvOsZM28VhLE7C7XHvr5/CIzz5sxKFmrmip48ZEsJ+Ku6XAMgClPaoOXK36qoOI7c5+qVZ3Qn7hjqJabaZGqESqjExz0q+nd05fHs0GSG7yvzBxZ1CV0gTil6NpFf+m3+CC1c/4S+VbQzdMfcr1oFN2JFShLAuudrl3sCjI0jjyYBKzLcztsMKLpT/EpT6JP9sJH63RC1v3VMkjsCiR8tq6WNp0OjdWb3jzXIFwOp2axBcfD4dpFFAXvGuLSnn5VtYuCbNzoc/LtLBYZBtcq6FKdZ/jFDK0LgnPvKJofStHLvWDcPf01WkwqIvN3AgnhQ0RGQh6utI9rITpqnKFkMFZDPU2nrAwSwGa13X7ciw7Fc6+/W8iR4C7XBeRzrQ1v67j28loCQ+3N6VDj5HgxKrh3HHp/84x+2OdmeufWgesEtgG23IeOb8qTScQxLoHahVL4VFnz+gOPF6JORj4/8BBDIa3vbF4sp9lR9pvd3MC7EF5jH+6d/kJDDb1PRWy0FRTj3bMeEQhud51Bj8FZEUVunQ9znNWYFLqcBKj306kfqjKX2z12YPOJBkBNu2AWFvq9B9u+tGrslbros6bt5psLp9GPh1oe9t5RQJVmU7VC2hGlWLg+Nm60KbZfk0N9c/oziFh9We9BtUikfUZCKOkL1wF8By8g1yShsg580bTzDNj0nsXktBVp3J0n31HPxf9f25FbcHa9Dhq3N6wGMU0z+zBeVC2ejcoFGhJQlyQhw+c2Fkp2sNZBGE9NXzZemmo8NbuzTIISMOjMxScRx8TjVBLMVIHLJ+Rp+gy9WhWfQekzMqD9+LGKhzU506zIcemuhDvfn1Tb/crTdf17PKyLJFybRkJc8X65JIwFqxwvXyZhd7InZh1ylwrINbOKRA08L6zQkjVDz3N4GSy/yIOuezgN0cTz/qC2k7XYpLUSQhN36AfLxc/JEuddiKKrOMvdOfKgR/yLa/sSijlIQhUsIF/pfurtLzuerpPYc3Gnu4GpztVW1TjupqjAVMbLL75wX4DrLiYXHFhIAOrdNfug4wZZrISpUPW7TuaK8WTxqHTLTuxxKJjA6GhdvMGmgJLgEpBV+3T7RyXnbFGy2r8ibQFCPpAAqmttBj3ovlxdbiXUuOFzV7mLN1UfAyaAkdi6A/Et+dFjBzEps5KIs/UkFD7CC657eMjIwBzuXqDL3843CrfnJVulE+6rkYOxC5AOZdkKiIFDoZQNIR2WkGNRXQ6iBmtJOHLeBbR+R94K7BU+UM4EJfG2XH4X1O2W9e6DSQjhpYMk9KCqRQueJI2sSkUSuI68dwbfneT/gjtmGIpr9yMYktLgulPxn+tbAft0eBL6CHnfdQ09gwKlyPCOK+mE+gcTf5JRTpna6RquVY4PRJR/9IlNDiiDjhKOXX5fZxeK0hW8TPM6Y+4teHqw/nmWs89+kpCTOAoqdVyk1zqjIWU5HEpp9ZWFZm4aJi1N+3QcSrtjt3tX9L9O3J7rAhatHefiUHuj6bvLk55HKcWLPNT++PCegoS98x3fiRSDLKg4BUQEEDqv6/TQOXFMaXao2Cb1ZGkpvP/atQ5ekoQAqVHhhwtGktckpmoix2c6UaIcWmUmKCeBfOrYMcPuubq/OlQetx5RPsPQqiSwApNEEv5bOUGM22/g2RZe7MOKvXnrbURfMS7phEFyNm/3bPlNUIzab185hlbuXSEB1gZ7W8pjzEANjkPvlsrCHjr/yrWNa0GsWAZ5PlmvTwsomFwjVPZntM5CzyjqwxKYvXfpJHTQE258JYSs2NKnZ8krTz1T6/r9v0K0un5ZeVzraM5JQAdM/X8PpqEVSbi51tFMS62tWZO/+8hrrivYMhCWMX6wbt62rBVscMUGsrPOxJJsWEbdaehxyaJYXL39aENReCgnYbsbiaYVl8Pw/TXTtmbzAMo0kIBG84knu5KPz/e6kYHfO61uNKb6TTszGAXr0KPGG7V1ki2busd1AXsChc7n3FRtXO/xBzBb6N7/wh80y3Ez553PW9q+11x0+pYup2LUWkitTMGzDhoPUKjd7E65G+dhIcnGgNSS8IzOv57DDYON7OR2HE009czqugFZvKYMdQ3pvbLkhJL8UBqQcMgUb4o1Yz1xncBDCpR1gh6tv2N/FyUdMogGb9Bk5sJDNW4b0I40fr+j5dyS2Th5KEpnF2t5PU/mQEK9JxJJHfG63ylLAqeQwIUk6HmQjXGDMriGrR5BEMhucV2AlONH4GBSa0+Guugz98b3Nbm+DrqQ0euEVpDSCCv8KKUSF6DKkQRNJSHYnxIFmhVAOwApaXu6K61PIyKmzPt8T3K8BoaUCh1G3cjKlIspoyTdpsHvnX+9NFtLIovp7Ztc+xAU0HuSPG1FJIEebD6BxSVjFPjogtc4JyE1fy4c1Sg1ddE9FmcF1DOJnrm2sTsz+5pMwjsIaDxy3F/YOKII6AAJ/RkJnExCDwF2Z+MJXa60N3QiX13oehWm5CVkxFfaj/IwlTwzi5R0YCamNych2XuTOBTf/IeRrUjxH7mWEUkggASph/P68B33XIEEsMStO4IM3fAZAwmS/dlvouBIMGle9yPyAmbywl3SCb3KhdNpzYwKulL3qAD+uSyhZQjQW13ruHZ+U9p5slmFstIVjnIfZnYwS2MY+AJdCKavK+5gudklA96Pjq4kdiQjF1DcONmBMbn3gObpDX9yRbEbz3/I4x9IkISJax0e8LA2Mjw7HgB3IasSLpRsRyi/ZQN3YXI2U1UKZmvBY9kdKlop7V9TCfHZFMKt+K5hA1j76GlcNNhGKNfzoH/buZsThIEgDMMDLka0nDEXr6sEvC5iAZ7swEI8WIENRDxYnSTBQywg30Dep4KwYf+/2ZuNPQQfsih5iOtrbOyfokJo0R8xB7kX7WTBTqItp7KNsF75UYwRly63eLV5647KlCm8vX4fbda6tjIpj4fkpymkPqmls9aPCEMjnC2K99EU7h4ok1qJpuocqVjxIPodufYAx1uDVa1ZuC49yN1472USlZdA3UEkuYeJ0ckkL2EClTLJvYSZIVVSjIyEVuW+s7lbBlov6tTbgG+9TC1HfPpoalVDI5h9GoPtg6TtpRKNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACh8AWlWptNwXy/eAAAAAElFTkSuQmCC", n = [], r = f("img.lazy"), u = function() {
                for (var t = 0; t < n.length; t++) s(n[t]) && o(n[t], function() {
                    n.splice(t, t)
                })
            }, t = 0; t < r.length; t++) n.push(r[t]);
        u();
        e("scroll", u)
    }),
    function() {
        function e() {
            return function() {}
        }
        var i = "",
            ue = "\x00",
            dt = "\n",
            fe = "\n//# sourceURL=",
            ee = "\n;return exports});\n//# sourceURL=",
            f = " ",
            oe = " &#160;",
            se = " onreadystatechange='goog.onScriptLoad_(this, ",
            he = " should not be enumerable in Object.prototype.",
            h = '"',
            ce = '");',
            le = '"><\/script>',
            ar = "#",
            ae = "$1",
            vr = "%s",
            b = "&",
            ve = "&#0;",
            ye = "&#101;",
            pe = "&#39;",
            we = "&amp;",
            be = "&gt;",
            ke = "&lt;",
            de = "&quot;",
            ge = "'",
            no = "(^",
            to = ")' ",
            io = ")([a-z])",
            ro = ");",
            uo = ", ",
            gt = "-",
            fo = "-$1",
            c = ".",
            yr = "..",
            ni = "...",
            ti = "/",
            k = "0",
            eo = "0,(function(){",
            it = ": ",
            ii = "<",
            oo = "<\/script>",
            so = "<br />",
            ho = "<br>",
            pr = '<script type="text/javascript" src="',
            co = '<script type="text/javascript">',
            ri = ">",
            lo = "><\/script>",
            ao = "?",
            vo = "Already loaded ",
            ui = "American Samoa",
            wr = "Antigua and Barbuda",
            yo = "Assertion failed",
            po = "BY_WHOLE",
            rt = "Bolivia",
            ut = "Bosna i Hercegovina",
            fi = "Botswana",
            br = "British Virgin Islands",
            kr = "Cayman Islands",
            dr = "Christmas Island",
            wo = "Expected Element but got %s: %s.",
            bo = "Expected array but got %s: %s.",
            ko = "Expected boolean but got %s: %s.",
            go = "Expected function but got %s: %s.",
            ns = "Expected instanceof %s but got %s.",
            ts = "Expected number but got %s: %s.",
            is = "Expected object but got %s: %s.",
            rs = "Expected string but got %s: %s.",
            us = "Failure",
            gr = "Falkland Islands",
            v = "Ghana",
            nu = "Guinée équatoriale",
            tu = "Guyane française",
            fs = "HEAD",
            ei = "Honduras",
            oi = "Indonesia",
            si = "Itoophiyaa",
            es = "JavaScript",
            iu = "Kalaallit Nunaat",
            hi = "Kiribati",
            os = "Load packages + dependencies - previous: ",
            ss = "Loading css files: ",
            ru = "LocaleNameConstants",
            ci = "Luxembourg",
            li = "Madagascar",
            ai = "Marshall Islands",
            l = "Micronesia",
            uu = "Moldova, Republica",
            vi = "Nederlandse Antillen",
            yi = "New Zealand",
            o = "Nigeria",
            fu = "Norfolk Island",
            eu = "Northern Mariana Islands",
            ou = "Nouvelle-Calédonie",
            ft = "Papua New Guinea",
            pi = "Paraguay",
            wi = "Philippines",
            bi = "Polynésie française",
            ki = "Puerto Rico",
            su = "República Dominicana",
            et = "Rwanda",
            hu = "Rywvaneth Unys",
            di = "République centrafricaine",
            gi = "République démocratique du Congo",
            cu = "SCRIPT",
            lu = "Saint Kitts and Nevis",
            au = "Saint Vincent and the Grenadines",
            vu = "Saint-Pierre-et-Miquelon",
            yu = "Serbia and Montenegro",
            nr = "Seychelles",
            pu = "Slovenská republika",
            wu = "Solomon Islands",
            u = "South Africa",
            bu = "Svalbard og Jan Mayen",
            tr = "Swaziland",
            ku = "São Tomé e Príncipe",
            ot = "Sénégal",
            ir = "Tanzania",
            rr = "Timor Leste",
            st = "Tokelau",
            du = "Turks and Caicos Islands",
            ht = "Tuvalu",
            ct = "Türkiye",
            gu = "U.S. Virgin Islands",
            nf = "United Kingdom",
            ur = "United States",
            tf = "United States Minor Outlying Islands",
            rf = "Unknown or Invalid Region",
            lt = "Vanuatu",
            uf = "Wallis-et-Futuna",
            hs = "[object Array]",
            cs = "[object Function]",
            ls = "[object Window]",
            as = "\\$1",
            vs = "\\s",
            ys = "\\u",
            ps = "\\x",
            ws = "\\x08",
            bs = "]+",
            at = "_",
            ks = "amp",
            ff = "annotatedtimeline",
            y = "array",
            ds = "base.js",
            gs = "boolean",
            p = "browserchart",
            nh = "call",
            th = "callback after loading ",
            d = "complete",
            vt = "corechart",
            ef = "div",
            ih = "document",
            g = "dygraph",
            rh = "e",
            yt = "en",
            uh = "end loadScript: ",
            fh = "error",
            nt = "function",
            of = "g",
            eh = "get",
            oh = "goog.loadModule(",
            sh = 'goog.loadModule(function(exports) {"use strict";',
            hh = 'goog.retrieveAndExecModule_("',
            ch = "goog_",
            sf = "google.charts.load",
            lh = "google.charts.load version ",
            ah = "gt",
            vh = "head",
            yh = "href",
            hf = "id",
            ph = "iframe",
            a = "imagechart",
            wh = "javascript",
            bh = "link",
            cf = "load",
            kh = "load-css-",
            dh = "loadCSSFile: ",
            gh = "loadScript: ",
            nc = "loading css failed: ",
            tc = "lt",
            ic = "native code",
            rc = "none",
            lf = "null",
            fr = "number",
            uc = "o",
            w = "object",
            af = "onload",
            fc = "quot",
            ec = "rel",
            oc = "removeAttribute",
            vf = "script",
            sc = "splice",
            hc = "string",
            cc = "stylesheet",
            lc = "text/css",
            er = "text/javascript",
            ac = "type",
            r = "ui",
            pt = "ui_base",
            yf = "unknown",
            vc = "unknown type name",
            yc = "var ",
            pc = "var _evalTest_ = 1;",
            wc = "visualization",
            wt = "webfontloader",
            bc = "write",
            kc = "{cssFile}",
            dc = "{language}",
            gc = "{package}",
            pf = "{prefix}",
            wf = "{prefix}/{version}/css/{cssFile}",
            bf = "{prefix}/{version}/third_party/{package}",
            kf = "{version}",
            nl = "|[",
            tl = "})",
            il = "~",
            rl = "",
            df = "Česká republika",
            or = "Беларусь",
            sr = "Кыргызстан",
            hr = "монгольский",
            cr = "Հայաստանի Հանրապետութիւն",
            bt = "افغانستان",
            gf = "الامارات العربية المتحدة",
            ne = "الصحراء الغربية",
            te = "المملكة العربية السعودية",
            ie = "الولايات المتحدة الأمريكية",
            lr = "جزر القمر",
            kt = "پاکستان",
            s = "भारत",
            tt = "ኢትዮጵያ",
            re = "조선 민주주의 인민 공화국",
            ul = "�",
            n = n || {},
            t;
        if (n.global = this, n.O = function(n) {
                return void 0 !== n
            }, n.ya = function(t, i, r) {
                t = t.split(c);
                r = r || n.global;
                t[0] in r || !r.execScript || r.execScript(yc + t[0]);
                for (var u; t.length && (u = t.shift());) !t.length && n.O(i) ? r[u] = i : r = r[u] ? r[u] : r[u] = {}
            }, n.we = function(t, i) {
                n.ya(t, i)
            }, n.I = !0, n.Cd = yt, n.ra = !0, n.ec = !1, n.Nb = !n.I, n.Wa = !1, n.Ff = function(t) {
                n.cb(t)
            }, n.cb = function(t, i) {
                n.ya(t, i)
            }, n.mc = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/, n.Ma = function(t) {
                if (!n.i(t) || !t || -1 == t.search(n.mc)) throw Error("Invalid module identifier");
                if (!n.Kc()) throw Error("Module " + t + " has been loaded incorrectly.");
                if (n.l.Na) throw Error("goog.module may only be called once per module.");
                n.l.Na = t
            }, n.Ma.get = e(), n.Ma.He = e(), n.l = null, n.Kc = function() {
                return null != n.l
            }, n.Ma.fb = function() {
                n.l.fb = !0
            }, n.Yf = function(t) {
                if (n.Nb) throw t = t || i, Error("Importing test-only code into non-debug environment" + (t ? it + t : c));
            }, n.Ce = e(), n.Oe = function(t) {
                t = t.split(c);
                for (var i = n.global, r; r = t.shift();)
                    if (n.Hc(i[r])) i = i[r];
                    else return null;
                return i
            }, n.Te = function(t, i) {
                var u = i || n.global,
                    r;
                for (r in t) u[r] = t[r]
            }, n.Jd = function(t, i, r, u) {
                var o, f, e;
                if (n.Ua) {
                    for (t = t.replace(/\\/g, ti), f = n.j, e = 0; o = i[e]; e++) f.S[o] = t, f.Pa[t] = !!u;
                    for (u = 0; i = r[u]; u++) t in f.H || (f.H[t] = {}), f.H[t][i] = !0
                }
            }, n.xg = !1, n.zd = !0, n.tf = function(t) {
                n.global.console && n.global.console.error(t)
            }, n.Sf = e(), n.G = i, n.Af = e(), n.Id = function() {
                throw Error("unimplemented abstract method");
            }, n.Kd = function(t) {
                t.Ge = function() {
                    return t.ub ? t.ub : (n.I && (n.vb[n.vb.length] = t), t.ub = new t)
                }
            }, n.vb = [], n.Vb = !0, n.cc = n.I, n.Uc = {}, n.Ua = !1, n.Ua && (n.j = {
                Pa: {},
                S: {},
                H: {},
                Gb: {},
                qa: {},
                X: {}
            }, n.sb = function() {
                var t = n.global.document;
                return "undefined" != typeof t && bc in t
            }, n.Ac = function() {
                var u, i;
                if (n.O(n.global.Kb)) n.G = n.global.Kb;
                else if (n.sb())
                    for (u = n.global.document.getElementsByTagName(cu), i = u.length - 1; 0 <= i; --i) {
                        var r = u[i].src,
                            t = r.lastIndexOf(ao),
                            t = -1 == t ? r.length : t;
                        if (r.substr(t - 7, 7) == ds) {
                            n.G = r.substr(0, t - 7);
                            break
                        }
                    }
            }, n.Ga = function(t, i) {
                (n.global.rd || n.od)(t, i) && (n.j.qa[t] = !0)
            }, n.Ub = !(n.global.atob || !n.global.document || !n.global.document.all), n.Fc = function(t) {
                n.Ga(i, hh + t + ce) && (n.j.qa[t] = !0)
            }, n.Qa = [], n.zg = function(t, i) {
                return n.Vb && n.O(n.global.JSON) ? oh + n.global.JSON.stringify(i + fe + t + dt) + ro : sh + i + ee + t + dt
            }, n.Sc = function() {
                var i = n.Qa.length,
                    r, t;
                if (0 < i)
                    for (r = n.Qa, n.Qa = [], t = 0; t < i; t++) n.zb(r[t])
            }, n.uf = function(t) {
                n.wb(t) && n.nc(t) && n.zb(n.G + n.Fa(t))
            }, n.wb = function(t) {
                return (t = n.Fa(t)) && n.j.Pa[t] ? n.G + t in n.j.X : !1
            }, n.nc = function(t) {
                if ((t = n.Fa(t)) && t in n.j.H)
                    for (var i in n.j.H[t])
                        if (!n.Mc(i) && !n.wb(i)) return !1;
                return !0
            }, n.zb = function(t) {
                if (t in n.j.X) {
                    var i = n.j.X[t];
                    delete n.j.X[t];
                    n.Ec(i)
                }
            }, n.sf = function(t) {
                var u = n.l,
                    r, i;
                try {
                    if (n.l = {
                            Na: void 0
                        }, n.xb(t)) r = t.call(n.global, {});
                    else if (n.i(t)) r = n.Qc.call(n.global, t);
                    else throw Error("Invalid module definition");
                    if (i = n.l.Na, !n.i(i) || !i) throw Error('Invalid module name "' + i + h);
                    n.l.fb ? n.cb(i, r) : n.cc && Object.seal && Object.seal(r);
                    n.Uc[i] = r
                } finally {
                    n.l = u
                }
            }, n.Qc = function(a) {
                return eval(a), {}
            }, n.md = function(t) {
                n.global.document.write(pr + t + le)
            }, n.pc = function(t) {
                var r = n.global.document,
                    i = r.createElement(vf);
                i.type = er;
                i.src = t;
                i.defer = !1;
                i.async = !1;
                r.head.appendChild(i)
            }, n.od = function(t, i) {
                var r, u;
                if (n.sb()) {
                    if (r = n.global.document, !n.Wa && r.readyState == d) {
                        if (/\bdeps.js$/.test(t)) return !1;
                        throw Error('Cannot write "' + t + '" after document load');
                    }
                    return u = n.Ub, void 0 === i ? u ? (u = se + ++n.yb + to, r.write(pr + t + h + u + lo)) : n.Wa ? n.pc(t) : n.md(t) : r.write(co + i + oo), !0
                }
                return !1
            }, n.yb = 0, n.Cf = function(t, i) {
                return t.readyState == d && n.yb == i && n.Sc(), !0
            }, n.Ag = function(t) {
                function e(t) {
                    if (!(t in i.qa || t in i.Gb)) {
                        if (i.Gb[t] = !0, t in i.H)
                            for (var r in i.H[t])
                                if (!n.Mc(r))
                                    if (r in i.S) e(i.S[r]);
                                    else throw Error("Undefined nameToPath for " + r);
                        t in o || (o[t] = !0, u.push(t))
                    }
                }
                var u = [],
                    o = {},
                    i = n.j,
                    r, f;
                for (e(t), t = 0; t < u.length; t++) r = u[t], n.j.qa[r] = !0;
                for (f = n.l, n.l = null, t = 0; t < u.length; t++)
                    if (r = u[t]) i.Pa[r] ? n.Fc(n.G + r) : n.Ga(n.G + r);
                    else throw n.l = f, Error("Undefined script input");
                n.l = f
            }, n.Fa = function(t) {
                return t in n.j.S ? n.j.S[t] : null
            }, n.Ac(), n.global.td || n.Ga(n.G + "deps.js")), n.xf = function(n) {
                n = n.split(ti);
                for (var t = 0; t < n.length;) n[t] == c ? n.splice(t, 1) : t && n[t] == yr && n[t - 1] && n[t - 1] != yr ? n.splice(--t, 2) : t++;
                return n.join(ti)
            }, n.rf = function(t) {
                if (n.global.Lb) return n.global.Lb(t);
                var i = new n.global.XMLHttpRequest;
                return i.open(eh, t, !1), i.send(), i.responseText
            }, n.Tf = e(), n.s = function(n) {
                var t = typeof n,
                    i;
                if (t == w)
                    if (n) {
                        if (n instanceof Array) return y;
                        if (n instanceof Object) return t;
                        if (i = Object.prototype.toString.call(n), i == ls) return w;
                        if (i == hs || typeof n.length == fr && "undefined" != typeof n.splice && "undefined" != typeof n.propertyIsEnumerable && !n.propertyIsEnumerable(sc)) return y;
                        if (i == cs || "undefined" != typeof n.call && "undefined" != typeof n.propertyIsEnumerable && !n.propertyIsEnumerable(nh)) return nt
                    } else return lf;
                else if (t == nt && "undefined" == typeof n.call) return w;
                return t
            }, n.hf = function(n) {
                return null === n
            }, n.Hc = function(n) {
                return null != n
            }, n.isArray = function(t) {
                return n.s(t) == y
            }, n.Ia = function(t) {
                var i = n.s(t);
                return i == y || i == w && typeof t.length == fr
            }, n.cf = function(t) {
                return n.$(t) && typeof t.getFullYear == nt
            }, n.i = function(n) {
                return typeof n == hc
            }, n.Gc = function(n) {
                return typeof n == gs
            }, n.Lc = function(n) {
                return typeof n == fr
            }, n.xb = function(t) {
                return n.s(t) == nt
            }, n.$ = function(n) {
                var t = typeof n;
                return t == w && null != n || t == nt
            }, n.pb = function(t) {
                return t[n.F] || (t[n.F] = ++n.jd)
            }, n.Ue = function(t) {
                return !!t[n.F]
            }, n.ad = function(t) {
                oc in t && t.removeAttribute(n.F);
                try {
                    delete t[n.F]
                } catch (i) {}
            }, n.F = "closure_uid_" + (1e9 * Math.random() >>> 0), n.jd = 0, n.Ee = n.pb, n.Qf = n.ad, n.uc = function(t) {
                var i = n.s(t),
                    r;
                if (i == w || i == y) {
                    if (t.clone) return t.clone();
                    i = i == y ? [] : {};
                    for (r in t) i[r] = n.uc(t[r]);
                    return i
                }
                return t
            }, n.tc = function(n) {
                return n.call.apply(n.bind, arguments)
            }, n.rc = function(n, t) {
                if (!n) throw Error();
                if (2 < arguments.length) {
                    var i = Array.prototype.slice.call(arguments, 2);
                    return function() {
                        var r = Array.prototype.slice.call(arguments);
                        return Array.prototype.unshift.apply(r, i), n.apply(t, r)
                    }
                }
                return function() {
                    return n.apply(t, arguments)
                }
            }, n.bind = function() {
                return n.bind = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf(ic) ? n.tc : n.rc, n.bind.apply(null, arguments)
            }, n.Yc = function(n) {
                var t = Array.prototype.slice.call(arguments, 1);
                return function() {
                    var i = t.slice();
                    return i.push.apply(i, arguments), n.apply(this, i)
                }
            }, n.vf = function(n, t) {
                for (var i in t) n[i] = t[i]
            }, n.now = n.ra && Date.now || function() {
                return +new Date
            }, n.Ec = function(t) {
                if (n.global.execScript) n.global.execScript(t, es);
                else if (n.global.eval) {
                    if (null == n.Y)
                        if (n.global.eval(pc), "undefined" != typeof n.global._evalTest_) {
                            try {
                                delete n.global._evalTest_
                            } catch (u) {}
                            n.Y = !0
                        } else n.Y = !1;
                    if (n.Y) n.global.eval(t);
                    else {
                        var r = n.global.document,
                            i = r.createElement(cu);
                        i.type = er;
                        i.defer = !1;
                        i.appendChild(r.createTextNode(t));
                        r.body.appendChild(i);
                        r.body.removeChild(i)
                    }
                } else throw Error("goog.globalEval not available");
            }, n.Y = null, n.De = function(t, i) {
                function f(n) {
                    n = n.split(gt);
                    for (var i = [], t = 0; t < n.length; t++) i.push(u(n[t]));
                    return i.join(gt)
                }

                function u(t) {
                    return n.eb[t] || t
                }
                var r;
                return r = n.eb ? n.xc == po ? u : f : function(n) {
                    return n
                }, i ? t + gt + r(i) : r(t)
            }, n.Uf = function(t, i) {
                n.eb = t;
                n.xc = i
            }, n.Ke = function(n, t) {
                return t && (n = n.replace(/\{\$([^}]+)}/g, function(n, i) {
                    return i in t ? t[i] : n
                })), n
            }, n.Le = function(n) {
                return n
            }, n.Aa = function(t, i) {
                n.ya(t, i, void 0)
            }, n.Ae = function(n, t, i) {
                n[t] = i
            }, n.Ha = function(n, t) {
                function i() {}
                i.prototype = t.prototype;
                n.oa = t.prototype;
                n.prototype = new i;
                n.prototype.constructor = n;
                n.qc = function(n, i) {
                    for (var u = Array(arguments.length - 2), r = 2; r < arguments.length; r++) u[r - 2] = arguments[r];
                    return t.prototype[i].apply(n, u)
                }
            }, n.qc = function(t, i) {
                var e = arguments.callee.caller,
                    u, r, f;
                if (n.ec || n.I && !e) throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
                if (e.oa) {
                    for (u = Array(arguments.length - 1), r = 1; r < arguments.length; r++) u[r - 1] = arguments[r];
                    return e.oa.constructor.apply(t, u)
                }
                for (u = Array(arguments.length - 2), r = 2; r < arguments.length; r++) u[r - 2] = arguments[r];
                for (r = !1, f = t.constructor; f; f = f.oa && f.oa.constructor)
                    if (f.prototype[i] === e) r = !0;
                    else if (r) return f.prototype[i].apply(t, u);
                if (t[i] === e) return t.constructor.prototype[i].apply(t, u);
                throw Error("goog.base called from a method of one name to a method of a different name");
            }, n.scope = function(t) {
                t.call(n.global)
            }, n.Dd = !1, n.u = function(t, i) {
                var r = i.constructor,
                    u = i.dd;
                return r && r != Object.prototype.constructor || (r = function() {
                    throw Error("cannot instantiate an interface (no constructor defined).");
                }), r = n.u.vc(r, t), t && n.Ha(r, t), delete i.constructor, delete i.dd, n.u.Ya(r.prototype, i), null != u && (u instanceof Function ? u(r) : n.u.Ya(r, u)), r
            }, n.u.bc = n.I, n.u.vc = function(t, i) {
                if (n.u.bc && Object.seal instanceof Function) {
                    if (i && i.prototype && i.prototype[n.kc]) return t;
                    var r = function() {
                        var i = t.apply(this, arguments) || this;
                        return i[n.F] = i[n.F], this.constructor === r && Object.seal(i), i
                    };
                    return r
                }
                return t
            }, n.u.Xa = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), n.u.Ya = function(t, i) {
                var r, u;
                for (r in i) Object.prototype.hasOwnProperty.call(i, r) && (t[r] = i[r]);
                for (u = 0; u < n.u.Xa.length; u++) r = n.u.Xa[u], Object.prototype.hasOwnProperty.call(i, r) && (t[r] = i[r])
            }, n.fg = e(), n.kc = "goog_defineClass_legacy_unsealable", n.debug = {}, n.debug.Error = function(t) {
                if (Error.captureStackTrace) Error.captureStackTrace(this, n.debug.Error);
                else {
                    var i = Error().stack;
                    i && (this.stack = i)
                }
                t && (this.message = String(t))
            }, n.Ha(n.debug.Error, Error), n.debug.Error.prototype.name = "CustomError", n.gb = {}, n.gb.$b = {
                Ob: 1,
                pd: 2,
                Hd: 3,
                qd: 4,
                Bd: 5,
                Ad: 6,
                Gd: 7,
                ud: 8,
                wd: 9,
                yd: 10,
                xd: 11,
                Ed: 12
            }, n.f = {}, n.f.Va = !1, n.f.Qb = !1, n.f.lc = {
                Yb: " "
            }, n.f.startsWith = function(n, t) {
                return 0 == n.lastIndexOf(t, 0)
            }, n.f.endsWith = function(n, t) {
                var i = n.length - t.length;
                return 0 <= i && n.indexOf(t, i) == i
            }, n.f.ke = function(t, i) {
                return 0 == n.f.bb(i, t.substr(0, i.length))
            }, n.f.ge = function(t, i) {
                return 0 == n.f.bb(i, t.substr(t.length - i.length, i.length))
            }, n.f.je = function(n, t) {
                return n.toLowerCase() == t.toLowerCase()
            }, n.f.ed = function(n) {
                for (var t = n.split(vr), r = i, u = Array.prototype.slice.call(arguments, 1); u.length && 1 < t.length;) r += t.shift() + u.shift();
                return r + t.join(vr)
            }, n.f.me = function(n) {
                return n.replace(/[\s\xa0]+/g, f).replace(/^\s+|\s+$/g, i)
            }, n.f.Ja = function(n) {
                return /^[\s\xa0]*$/.test(n)
            }, n.f.ef = function(n) {
                return 0 == n.length
            }, n.f.Ic = n.f.Ja, n.f.Jc = function(t) {
                return n.f.Ja(n.f.Vc(t))
            }, n.f.df = n.f.Jc, n.f.bf = function(n) {
                return !/[^\t\n\r ]/.test(n)
            }, n.f.Ze = function(n) {
                return !/[^a-zA-Z]/.test(n)
            }, n.f.jf = function(n) {
                return !/[^0-9]/.test(n)
            }, n.f.$e = function(n) {
                return !/[^a-zA-Z0-9]/.test(n)
            }, n.f.mf = function(n) {
                return n == f
            }, n.f.nf = function(n) {
                return 1 == n.length && n >= f && n <= il || n >= rl && n <= ul
            }, n.f.dg = function(n) {
                return n.replace(/(\r\n|\r|\n)+/g, f)
            }, n.f.Zd = function(n) {
                return n.replace(/(\r\n|\r|\n)/g, dt)
            }, n.f.zf = function(n) {
                return n.replace(/\xa0|\s/g, f)
            }, n.f.yf = function(n) {
                return n.replace(/\xa0|[ \t]+/g, f)
            }, n.f.le = function(n) {
                return n.replace(/[\t\r\n ]+/g, f).replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, i)
            }, n.f.trim = n.ra && String.prototype.trim ? function(n) {
                return n.trim()
            } : function(n) {
                return n.replace(/^[\s\xa0]+|[\s\xa0]+$/g, i)
            }, n.f.trimLeft = function(n) {
                return n.replace(/^[\s\xa0]+/, i)
            }, n.f.trimRight = function(n) {
                return n.replace(/[\s\xa0]+$/, i)
            }, n.f.bb = function(n, t) {
                var i = String(n).toLowerCase(),
                    r = String(t).toLowerCase();
                return i < r ? -1 : i == r ? 0 : 1
            }, n.f.Bb = /(\.\d+)|(\d+)|(\D+)/g, n.f.Bf = function(t, i) {
                var e, o;
                if (t == i) return 0;
                if (!t) return -1;
                if (!i) return 1;
                for (var r = t.toLowerCase().match(n.f.Bb), u = i.toLowerCase().match(n.f.Bb), s = Math.min(r.length, u.length), f = 0; f < s; f++)
                    if (e = r[f], o = u[f], e != o) return r = parseInt(e, 10), !isNaN(r) && (u = parseInt(o, 10), !isNaN(u) && r - u) ? r - u : e < o ? -1 : 1;
                return r.length != u.length ? r.length - u.length : t < i ? -1 : 1
            }, n.f.wg = function(n) {
                return encodeURIComponent(String(n))
            }, n.f.vg = function(n) {
                return decodeURIComponent(n.replace(/\+/g, f))
            }, n.f.Wc = function(n, t) {
                return n.replace(/(\r\n|\r|\n)/g, t ? so : ho)
            }, n.f.qb = function(t) {
                return n.f.Ib.test(t) ? (-1 != t.indexOf(b) && (t = t.replace(n.f.Jb, we)), -1 != t.indexOf(ii) && (t = t.replace(n.f.Xb, ke)), -1 != t.indexOf(ri) && (t = t.replace(n.f.Rb, be)), -1 != t.indexOf(h) && (t = t.replace(n.f.ac, de)), -1 != t.indexOf(ge) && (t = t.replace(n.f.dc, pe)), -1 != t.indexOf(ue) && (t = t.replace(n.f.Zb, ve)), n.f.Va && -1 != t.indexOf(rh) && (t = t.replace(n.f.Pb, ye)), t) : t
            }, n.f.Jb = /&/g, n.f.Xb = /</g, n.f.Rb = />/g, n.f.ac = /"/g, n.f.dc = /'/g, n.f.Zb = /\x00/g, n.f.Pb = /e/g, n.f.Ib = n.f.Va ? /[\x00&<>"'e]/ : /[\x00&<>"']/, n.f.Eb = function(t) {
                return n.f.contains(t, b) ? !n.f.Qb && ih in n.global ? n.f.Fb(t) : n.f.kd(t) : t
            }, n.f.rg = function(t, i) {
                return n.f.contains(t, b) ? n.f.Fb(t, i) : t
            }, n.f.Fb = function(t, i) {
                var u = {
                        "&amp;": b,
                        "&lt;": ii,
                        "&gt;": ri,
                        "&quot;": h
                    },
                    r;
                return r = i ? i.createElement(ef) : n.global.document.createElement(ef), t.replace(n.f.Tb, function(n, t) {
                    var i = u[n],
                        e;
                    return i ? i : (t.charAt(0) == ar && (e = Number(k + t.substr(1)), isNaN(e) || (i = String.fromCharCode(e))), i || (r.innerHTML = n + f, i = r.firstChild.nodeValue.slice(0, -1)), u[n] = i)
                })
            }, n.f.kd = function(n) {
                return n.replace(/&([^;]+);/g, function(n, t) {
                    switch (t) {
                        case ks:
                            return b;
                        case tc:
                            return ii;
                        case ah:
                            return ri;
                        case fc:
                            return h;
                        default:
                            if (t.charAt(0) == ar) {
                                var i = Number(k + t.substr(1));
                                if (!isNaN(i)) return String.fromCharCode(i)
                            }
                            return n
                    }
                })
            }, n.f.Tb = /&([^;\s<&]+);?/g, n.f.yg = function(t, i) {
                return n.f.Wc(t.replace(/  /g, oe), i)
            }, n.f.Ef = function(t) {
                return t.replace(/(^|[\n ]) /g, ae + n.f.lc.Yb)
            }, n.f.eg = function(n, t) {
                for (var u, r = t.length, i = 0; i < r; i++)
                    if (u = 1 == r ? t : t.charAt(i), n.charAt(0) == u && n.charAt(n.length - 1) == u) return n.substring(1, n.length - 1);
                return n
            }, n.f.truncate = function(t, i, r) {
                return r && (t = n.f.Eb(t)), t.length > i && (t = t.substring(0, i - 3) + ni), r && (t = n.f.qb(t)), t
            }, n.f.qg = function(t, i, r, u) {
                if (r && (t = n.f.Eb(t)), u && t.length > i) u > i && (u = i), t = t.substring(0, i - u) + ni + t.substring(t.length - u);
                else if (t.length > i) {
                    u = Math.floor(i / 2);
                    var f = t.length - u;
                    t = t.substring(0, u + i % 2) + ni + t.substring(f)
                }
                return r && (t = n.f.qb(t)), t
            }, n.f.Ta = {
                "\x00": "\\0",
                "\b": "\\b",
                "\f": "\\f",
                "\n": "\\n",
                "\r": "\\r",
                "\t": "\\t",
                "\x0b": "\\x0B",
                '"': '\\"',
                "\\": "\\\\"
            }, n.f.ea = {
                "'": "\\'"
            }, n.f.quote = function(t) {
                var f, r, u, e;
                if (t = String(t), t.quote) return t.quote();
                for (f = [h], r = 0; r < t.length; r++) u = t.charAt(r), e = u.charCodeAt(0), f[r + 1] = n.f.Ta[u] || (31 < e && 127 > e ? u : n.f.hb(u));
                return f.push(h), f.join(i)
            }, n.f.ze = function(t) {
                for (var u = [], r = 0; r < t.length; r++) u[r] = n.f.hb(t.charAt(r));
                return u.join(i)
            }, n.f.hb = function(t) {
                if (t in n.f.ea) return n.f.ea[t];
                if (t in n.f.Ta) return n.f.ea[t] = n.f.Ta[t];
                var i = t,
                    r = t.charCodeAt(0);
                return 31 < r && 127 > r ? i = t : (256 > r ? (i = ps, 16 > r || 256 < r) && (i += k) : (i = ys, 4096 > r && (i += k)), i += r.toString(16).toUpperCase()), n.f.ea[t] = i
            }, n.f.contains = function(n, t) {
                return -1 != n.indexOf(t)
            }, n.f.fe = function(t, i) {
                return n.f.contains(t.toLowerCase(), i.toLowerCase())
            }, n.f.re = function(n, t) {
                return n && t ? n.split(t).length - 1 : 0
            }, n.f.T = function(n, t, i) {
                var r = n;
                return 0 <= t && t < n.length && 0 < i && (r = n.substr(0, t) + n.substr(t + i, n.length - t - i)), r
            }, n.f.remove = function(t, r) {
                var u = new RegExp(n.f.Ra(r), i);
                return t.replace(u, i)
            }, n.f.Nf = function(t, r) {
                var u = new RegExp(n.f.Ra(r), of );
                return t.replace(u, i)
            }, n.f.Ra = function(n) {
                return String(n).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, as).replace(/\x08/g, ws)
            }, n.f.repeat = String.prototype.repeat ? function(n, t) {
                return n.repeat(t)
            } : function(n, t) {
                return Array(t + 1).join(n)
            }, n.f.Df = function(t, i, r) {
                return t = n.O(r) ? t.toFixed(r) : String(t), r = t.indexOf(c), -1 == r && (r = t.length), n.f.repeat(k, Math.max(0, i - r)) + t
            }, n.f.Vc = function(n) {
                return null == n ? i : String(n)
            }, n.f.Yd = function() {
                return Array.prototype.join.call(arguments, i)
            }, n.f.Pe = function() {
                return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ n.now()).toString(36)
            }, n.f.pe = function(t, r) {
                for (var u, f, e = 0, s = n.f.trim(String(t)).split(c), h = n.f.trim(String(r)).split(c), l = Math.max(s.length, h.length), o = 0; 0 == e && o < l; o++) {
                    var a = s[o] || i,
                        v = h[o] || i,
                        y = /(\d*)(\D*)/g,
                        p = /(\d*)(\D*)/g;
                    do {
                        if (u = y.exec(a) || [i, i, i], f = p.exec(v) || [i, i, i], 0 == u[0].length && 0 == f[0].length) break;
                        e = n.f.ua(0 == u[1].length ? 0 : parseInt(u[1], 10), 0 == f[1].length ? 0 : parseInt(f[1], 10)) || n.f.ua(0 == u[2].length, 0 == f[2].length) || n.f.ua(u[2], f[2])
                    } while (0 == e)
                }
                return e
            }, n.f.ua = function(n, t) {
                return n < t ? -1 : n > t ? 1 : 0
            }, n.f.Sb = 4294967296, n.f.Ve = function(t) {
                for (var i = 0, r = 0; r < t.length; ++r) i = 31 * i + t.charCodeAt(r), i %= n.f.Sb;
                return i
            }, n.f.ld = 2147483648 * Math.random() | 0, n.f.ue = function() {
                return ch + n.f.ld++
            }, n.f.hg = function(t) {
                var i = Number(t);
                return 0 == i && n.f.Ja(t) ? NaN : i
            }, n.f.gf = function(n) {
                return /^[a-z]+([A-Z][a-z]*)*$/.test(n)
            }, n.f.of = function(n) {
                return /^([A-Z][a-z]*)+$/.test(n)
            }, n.f.gg = function(n) {
                return String(n).replace(/\-([a-z])/g, function(n, t) {
                    return t.toUpperCase()
                })
            }, n.f.og = function(n) {
                return String(n).replace(/([A-Z])/g, fo).toLowerCase()
            }, n.f.pg = function(t, r) {
                var u = n.i(r) ? n.f.Ra(r) : vs;
                return t.replace(new RegExp(no + (u ? nl + u + bs : i) + io, of ), function(n, t, i) {
                    return t + i.toUpperCase()
                })
            }, n.f.$d = function(n) {
                return String(n.charAt(0)).toUpperCase() + String(n.substr(1)).toLowerCase()
            }, n.f.parseInt = function(t) {
                return isFinite(t) && (t = String(t)), n.i(t) ? /^\s*-?0x/i.test(t) ? parseInt(t, 16) : parseInt(t, 10) : NaN
            }, n.f.ag = function(n, t, i) {
                n = n.split(t);
                for (var r = []; 0 < i && n.length;) r.push(n.shift()), i--;
                return n.length && r.push(n.join(t)), r
            }, n.f.xe = function(n, t) {
                var u = [],
                    f = [],
                    r, i;
                if (n == t) return 0;
                if (!n.length || !t.length) return Math.max(n.length, t.length);
                for (r = 0; r < t.length + 1; r++) u[r] = r;
                for (r = 0; r < n.length; r++) {
                    for (f[0] = r + 1, i = 0; i < t.length; i++) f[i + 1] = Math.min(f[i] + 1, u[i + 1] + 1, u[i] + (n[r] != t[i]));
                    for (i = 0; i < u.length; i++) u[i] = f[i]
                }
                return f[t.length]
            }, n.g = {}, n.g.o = n.I, n.g.V = function(t, i) {
                i.unshift(t);
                n.debug.Error.call(this, n.f.ed.apply(null, i));
                i.shift()
            }, n.Ha(n.g.V, n.debug.Error), n.g.V.prototype.name = "AssertionError", n.g.Mb = function(n) {
                throw n;
            }, n.g.xa = n.g.Mb, n.g.B = function(t, r, u, f) {
                var e = yo,
                    o;
                u ? (e = e + (it + u), o = f) : t && (e += it + t, o = r);
                t = new n.g.V(i + e, o || []);
                n.g.xa(t)
            }, n.g.Vf = function(t) {
                n.g.o && (n.g.xa = t)
            }, n.g.assert = function(t, r) {
                return n.g.o && !t && n.g.B(i, null, r, Array.prototype.slice.call(arguments, 2)), t
            }, n.g.Ba = function(t) {
                n.g.o && n.g.xa(new n.g.V(us + (t ? it + t : i), Array.prototype.slice.call(arguments, 1)))
            }, n.g.Qd = function(t, i) {
                return n.g.o && !n.Lc(t) && n.g.B(ts, [n.s(t), t], i, Array.prototype.slice.call(arguments, 2)), t
            }, n.g.Td = function(t, i) {
                return n.g.o && !n.i(t) && n.g.B(rs, [n.s(t), t], i, Array.prototype.slice.call(arguments, 2)), t
            }, n.g.Od = function(t, i) {
                return n.g.o && !n.xb(t) && n.g.B(go, [n.s(t), t], i, Array.prototype.slice.call(arguments, 2)), t
            }, n.g.Rd = function(t, i) {
                return n.g.o && !n.$(t) && n.g.B(is, [n.s(t), t], i, Array.prototype.slice.call(arguments, 2)), t
            }, n.g.Ld = function(t, i) {
                return n.g.o && !n.isArray(t) && n.g.B(bo, [n.s(t), t], i, Array.prototype.slice.call(arguments, 2)), t
            }, n.g.Md = function(t, i) {
                return n.g.o && !n.Gc(t) && n.g.B(ko, [n.s(t), t], i, Array.prototype.slice.call(arguments, 2)), t
            }, n.g.Nd = function(t, i) {
                return !n.g.o || n.$(t) && t.nodeType == n.gb.$b.Ob || n.g.B(wo, [n.s(t), t], i, Array.prototype.slice.call(arguments, 2)), t
            }, n.g.Pd = function(t, i, r) {
                return !n.g.o || t instanceof i || n.g.B(ns, [n.g.ob(i), n.g.ob(t)], r, Array.prototype.slice.call(arguments, 3)), t
            }, n.g.Sd = function() {
                for (var t in Object.prototype) n.g.Ba(t + he)
            }, n.g.ob = function(n) {
                return n instanceof Function ? n.displayName || n.name || vc : n instanceof Object ? n.constructor.displayName || n.constructor.name || Object.prototype.toString.call(n) : null === n ? lf : typeof n
            }, n.b = {}, n.A = n.ra, n.b.w = !1, n.b.Zc = function(n) {
                return n[n.length - 1]
            }, n.b.pf = n.b.Zc, n.b.h = Array.prototype, n.b.indexOf = n.A && (n.b.w || n.b.h.indexOf) ? function(t, i, r) {
                return n.b.h.indexOf.call(t, i, r)
            } : function(t, i, r) {
                if (r = null == r ? 0 : 0 > r ? Math.max(0, t.length + r) : r, n.i(t)) return n.i(i) && 1 == i.length ? t.indexOf(i, r) : -1;
                for (; r < t.length; r++)
                    if (r in t && t[r] === i) return r;
                return -1
            }, n.b.lastIndexOf = n.A && (n.b.w || n.b.h.lastIndexOf) ? function(t, i, r) {
                return n.b.h.lastIndexOf.call(t, i, null == r ? t.length - 1 : r)
            } : function(t, i, r) {
                if (r = null == r ? t.length - 1 : r, 0 > r && (r = Math.max(0, t.length + r)), n.i(t)) return n.i(i) && 1 == i.length ? t.lastIndexOf(i, r) : -1;
                for (; 0 <= r; r--)
                    if (r in t && t[r] === i) return r;
                return -1
            }, n.b.forEach = n.A && (n.b.w || n.b.h.forEach) ? function(t, i, r) {
                n.b.h.forEach.call(t, i, r)
            } : function(t, r, u) {
                for (var o = t.length, e = n.i(t) ? t.split(i) : t, f = 0; f < o; f++) f in e && r.call(u, e[f], f, t)
            }, n.b.jb = function(t, r) {
                for (var f = n.i(t) ? t.split(i) : t, u = t.length - 1; 0 <= u; --u) u in f && r.call(void 0, f[u], u, t)
            }, n.b.filter = n.A && (n.b.w || n.b.h.filter) ? function(t, i, r) {
                return n.b.h.filter.call(t, i, r)
            } : function(t, r, u) {
                for (var e, h = t.length, o = [], c = 0, s = n.i(t) ? t.split(i) : t, f = 0; f < h; f++) f in s && (e = s[f], r.call(u, e, f, t) && (o[c++] = e));
                return o
            }, n.b.map = n.A && (n.b.w || n.b.h.map) ? function(t, i, r) {
                return n.b.h.map.call(t, i, r)
            } : function(t, r, u) {
                for (var e = t.length, o = Array(e), s = n.i(t) ? t.split(i) : t, f = 0; f < e; f++) f in s && (o[f] = r.call(u, s[f], f, t));
                return o
            }, n.b.reduce = n.A && (n.b.w || n.b.h.reduce) ? function(t, i, r, u) {
                return u && (i = n.bind(i, u)), n.b.h.reduce.call(t, i, r)
            } : function(t, i, r, u) {
                var f = r;
                return n.b.forEach(t, function(n, r) {
                    f = i.call(u, f, n, r, t)
                }), f
            }, n.b.reduceRight = n.A && (n.b.w || n.b.h.reduceRight) ? function(t, i, r, u) {
                return u && (i = n.bind(i, u)), n.b.h.reduceRight.call(t, i, r)
            } : function(t, i, r, u) {
                var f = r;
                return n.b.jb(t, function(n, r) {
                    f = i.call(u, f, n, r, t)
                }), f
            }, n.b.some = n.A && (n.b.w || n.b.h.some) ? function(t, i, r) {
                return n.b.h.some.call(t, i, r)
            } : function(t, r, u) {
                for (var o = t.length, e = n.i(t) ? t.split(i) : t, f = 0; f < o; f++)
                    if (f in e && r.call(u, e[f], f, t)) return !0;
                return !1
            }, n.b.every = n.A && (n.b.w || n.b.h.every) ? function(t, i, r) {
                return n.b.h.every.call(t, i, r)
            } : function(t, r, u) {
                for (var o = t.length, e = n.i(t) ? t.split(i) : t, f = 0; f < o; f++)
                    if (f in e && !r.call(u, e[f], f, t)) return !1;
                return !0
            }, n.b.count = function(t, i, r) {
                var u = 0;
                return n.b.forEach(t, function(n, t, f) {
                    i.call(r, n, t, f) && ++u
                }, r), u
            }, n.b.find = function(t, i, r) {
                return i = n.b.ib(t, i, r), 0 > i ? null : n.i(t) ? t.charAt(i) : t[i]
            }, n.b.ib = function(t, r, u) {
                for (var o = t.length, e = n.i(t) ? t.split(i) : t, f = 0; f < o; f++)
                    if (f in e && r.call(u, e[f], f, t)) return f;
                return -1
            }, n.b.Be = function(t, i, r) {
                return i = n.b.Bc(t, i, r), 0 > i ? null : n.i(t) ? t.charAt(i) : t[i]
            }, n.b.Bc = function(t, r, u) {
                for (var e = n.i(t) ? t.split(i) : t, f = t.length - 1; 0 <= f; f--)
                    if (f in e && r.call(u, e[f], f, t)) return f;
                return -1
            }, n.b.contains = function(t, i) {
                return 0 <= n.b.indexOf(t, i)
            }, n.b.Ic = function(n) {
                return 0 == n.length
            }, n.b.clear = function(t) {
                if (!n.isArray(t))
                    for (var i = t.length - 1; 0 <= i; i--) delete t[i];
                t.length = 0
            }, n.b.We = function(t, i) {
                n.b.contains(t, i) || t.push(i)
            }, n.b.tb = function(t, i, r) {
                n.b.splice(t, r, 0, i)
            }, n.b.Xe = function(t, i, r) {
                n.Yc(n.b.splice, t, r, 0).apply(null, i)
            }, n.b.insertBefore = function(t, i, r) {
                var u;
                2 == arguments.length || 0 > (u = n.b.indexOf(t, r)) ? t.push(i) : n.b.tb(t, i, u)
            }, n.b.remove = function(t, i) {
                var r = n.b.indexOf(t, i),
                    u;
                return (u = 0 <= r) && n.b.T(t, r), u
            }, n.b.T = function(t, i) {
                return 1 == n.b.h.splice.call(t, i, 1).length
            }, n.b.Rf = function(t, i, r) {
                return i = n.b.ib(t, i, r), 0 <= i ? (n.b.T(t, i), !0) : !1
            }, n.b.Of = function(t, i, r) {
                var u = 0;
                return n.b.jb(t, function(f, e) {
                    i.call(r, f, e, t) && n.b.T(t, e) && u++
                }), u
            }, n.b.concat = function() {
                return n.b.h.concat.apply(n.b.h, arguments)
            }, n.b.join = function() {
                return n.b.h.concat.apply(n.b.h, arguments)
            }, n.b.hd = function(n) {
                var i = n.length,
                    r, t;
                if (0 < i) {
                    for (r = Array(i), t = 0; t < i; t++) r[t] = n[t];
                    return r
                }
                return []
            }, n.b.clone = n.b.hd, n.b.extend = function(t) {
                for (var i, f, e, r, u = 1; u < arguments.length; u++)
                    if (i = arguments[u], n.Ia(i))
                        for (f = t.length || 0, e = i.length || 0, t.length = f + e, r = 0; r < e; r++) t[f + r] = i[r];
                    else t.push(i)
            }, n.b.splice = function(t) {
                return n.b.h.splice.apply(t, n.b.slice(arguments, 1))
            }, n.b.slice = function(t, i, r) {
                return 2 >= arguments.length ? n.b.h.slice.call(t, i) : n.b.h.slice.call(t, i, r)
            }, n.b.Pf = function(t, i, r) {
                function h(t) {
                    return n.$(t) ? uc + n.pb(t) : (typeof t).charAt(0) + t
                }
                var u, f;
                i = i || t;
                r = r || h;
                for (var e = {}, o = 0, s = 0; s < t.length;) u = t[s++], f = r(u), Object.prototype.hasOwnProperty.call(e, f) || (e[f] = !0, i[o++] = u);
                i.length = o
            }, n.b.Za = function(t, i, r) {
                return n.b.$a(t, r || n.b.C, !1, i)
            }, n.b.Wd = function(t, i, r) {
                return n.b.$a(t, i, !0, void 0, r)
            }, n.b.$a = function(n, t, i, r, u) {
                for (var h, e, s, f = 0, o = n.length; f < o;) e = f + o >> 1, s = i ? t.call(u, n[e], e, n) : t(r, n[e]), 0 < s ? f = e + 1 : (o = e, h = !s);
                return h ? f : ~f
            }, n.b.sort = function(t, i) {
                t.sort(i || n.b.C)
            }, n.b.cg = function(t, i) {
                for (var u, r = 0; r < t.length; r++) t[r] = {
                    index: r,
                    value: t[r]
                };
                for (u = i || n.b.C, n.b.sort(t, function(n, t) {
                        return u(n.value, t.value) || n.index - t.index
                    }), r = 0; r < t.length; r++) t[r] = t[r].value
            }, n.b.cd = function(t, i, r) {
                var u = r || n.b.C;
                n.b.sort(t, function(n, t) {
                    return u(i(n), i(t))
                })
            }, n.b.$f = function(t, i, r) {
                n.b.cd(t, function(n) {
                    return n[i]
                }, r)
            }, n.b.lf = function(t, i, r) {
                var u, f;
                for (i = i || n.b.C, u = 1; u < t.length; u++)
                    if (f = i(t[u - 1], t[u]), 0 < f || 0 == f && r) return !1;
                return !0
            }, n.b.ye = function(t, i, r) {
                var f, u;
                if (!n.Ia(t) || !n.Ia(i) || t.length != i.length) return !1;
                for (f = t.length, r = r || n.b.yc, u = 0; u < f; u++)
                    if (!r(t[u], i[u])) return !1;
                return !0
            }, n.b.oe = function(t, i, r) {
                var e, u, f;
                for (r = r || n.b.C, e = Math.min(t.length, i.length), u = 0; u < e; u++)
                    if (f = r(t[u], i[u]), 0 != f) return f;
                return n.b.C(t.length, i.length)
            }, n.b.C = function(n, t) {
                return n > t ? 1 : n < t ? -1 : 0
            }, n.b.Ye = function(t, i) {
                return -n.b.C(t, i)
            }, n.b.yc = function(n, t) {
                return n === t
            }, n.b.Ud = function(t, i, r) {
                return r = n.b.Za(t, i, r), 0 > r ? (n.b.tb(t, i, -(r + 1)), !0) : !1
            }, n.b.Vd = function(t, i, r) {
                return i = n.b.Za(t, i, r), 0 <= i ? n.b.T(t, i) : !1
            }, n.b.Xd = function(t, i, r) {
                for (var o, e, f = {}, u = 0; u < t.length; u++) o = t[u], e = i.call(r, o, u, t), n.O(e) && (f[e] || (f[e] = [])).push(o);
                return f
            }, n.b.jg = function(t, i, r) {
                var u = {};
                return n.b.forEach(t, function(n, f) {
                    u[i.call(r, n, f, t)] = n
                }), u
            }, n.b.Gf = function(n, t, i) {
                var f = [],
                    r = 0,
                    u = n;
                if (i = i || 1, void 0 !== t && (r = n, u = t), 0 > i * (u - r)) return [];
                if (0 < i)
                    for (n = r; n < u; n += i) f.push(n);
                else
                    for (n = r; n > u; n += i) f.push(n);
                return f
            }, n.b.repeat = function(n, t) {
                for (var r = [], i = 0; i < t; i++) r[i] = n;
                return r
            }, n.b.Cc = function() {
                for (var t, i, e, f, r = [], u = 0; u < arguments.length; u++)
                    if (t = arguments[u], n.isArray(t))
                        for (i = 0; i < t.length; i += 8192)
                            for (e = n.b.Cc.apply(null, n.b.slice(t, i, i + 8192)), f = 0; f < e.length; f++) r.push(e[f]);
                    else r.push(t);
                return r
            }, n.b.rotate = function(t, i) {
                return t.length && (i %= t.length, 0 < i ? n.b.h.unshift.apply(t, t.splice(-i, i)) : 0 > i && n.b.h.push.apply(t, t.splice(0, -i))), t
            }, n.b.wf = function(t, i, r) {
                i = n.b.h.splice.call(t, i, 1);
                n.b.h.splice.call(t, r, 0, i[0])
            }, n.b.Bg = function() {
                var i, n, r, t, u;
                if (!arguments.length) return [];
                for (i = [], n = 0;; n++) {
                    for (r = [], t = 0; t < arguments.length; t++) {
                        if (u = arguments[t], n >= u.length) return i;
                        r.push(u[n])
                    }
                    i.push(r)
                }
            }, n.b.Zf = function(n, t) {
                for (var r, f, u = t || Math.random, i = n.length - 1; 0 < i; i--) r = Math.floor(u() * (i + 1)), f = n[i], n[i] = n[r], n[r] = f
            }, n.b.qe = function(t, i) {
                var r = [];
                return n.b.forEach(i, function(n) {
                    r.push(t[n])
                }), r
            }, n.locale = {}, n.locale.K = {
                COUNTRY: {
                    AD: "Andorra",
                    AE: gf,
                    AF: bt,
                    AG: wr,
                    AI: "Anguilla",
                    AL: "Shqipëria",
                    AM: cr,
                    AN: vi,
                    AO: "Angola",
                    AQ: "Antarctica",
                    AR: "Argentina",
                    AS: ui,
                    AT: "Österreich",
                    AU: "Australia",
                    AW: "Aruba",
                    AX: "Åland",
                    AZ: "Azərbaycan",
                    BA: ut,
                    BB: "Barbados",
                    BD: "বাংলাদেশ",
                    BE: "België",
                    BF: "Burkina Faso",
                    BG: "България",
                    BH: "البحرين",
                    BI: "Burundi",
                    BJ: "Bénin",
                    BM: "Bermuda",
                    BN: "Brunei",
                    BO: rt,
                    BR: "Brasil",
                    BS: "Bahamas",
                    BT: "भूटान",
                    BV: "Bouvet Island",
                    BW: fi,
                    BY: or,
                    BZ: "Belize",
                    CA: "Canada",
                    CC: "Cocos (Keeling) Islands",
                    CD: gi,
                    CF: di,
                    CG: "Congo",
                    CH: "Schweiz",
                    CI: "Côte d’Ivoire",
                    CK: "Cook Islands",
                    CL: "Chile",
                    CM: "Cameroun",
                    CN: "中国",
                    CO: "Colombia",
                    CR: "Costa Rica",
                    CS: yu,
                    CU: "Cuba",
                    CV: "Cabo Verde",
                    CX: dr,
                    CY: "Κύπρος",
                    CZ: df,
                    DD: "East Germany",
                    DE: "Deutschland",
                    DJ: "Jabuuti",
                    DK: "Danmark",
                    DM: "Dominica",
                    DO: su,
                    DZ: "الجزائر",
                    EC: "Ecuador",
                    EE: "Eesti",
                    EG: "مصر",
                    EH: ne,
                    ER: "اريتريا",
                    ES: "España",
                    ET: tt,
                    FI: "Suomi",
                    FJ: "फिजी",
                    FK: gr,
                    FM: l,
                    FO: "Føroyar",
                    FR: "France",
                    FX: "Metropolitan France",
                    GA: "Gabon",
                    GB: nf,
                    GD: "Grenada",
                    GE: "საქართველო",
                    GF: tu,
                    GG: "Guernsey",
                    GH: v,
                    GI: "Gibraltar",
                    GL: iu,
                    GM: "Gambia",
                    GN: "Guinée",
                    GP: "Guadeloupe",
                    GQ: nu,
                    GR: "Ελλάδα",
                    GS: "South Georgia and the South Sandwich Islands",
                    GT: "Guatemala",
                    GU: "Guam",
                    GW: "Guiné Bissau",
                    GY: "Guyana",
                    HK: "香港",
                    HM: "Heard Island and McDonald Islands",
                    HN: ei,
                    HR: "Hrvatska",
                    HT: "Haïti",
                    HU: "Magyarország",
                    ID: oi,
                    IE: "Ireland",
                    IL: "ישראל",
                    IM: "Isle of Man",
                    IN: s,
                    IO: "British Indian Ocean Territory",
                    IQ: "العراق",
                    IR: "ایران",
                    IS: "Ísland",
                    IT: "Italia",
                    JE: "Jersey",
                    JM: "Jamaica",
                    JO: "الأردن",
                    JP: "日本",
                    KE: "Kenya",
                    KG: sr,
                    KH: "កម្ពុជា",
                    KI: hi,
                    KM: lr,
                    KN: lu,
                    KP: re,
                    KR: "대한민국",
                    KW: "الكويت",
                    KY: kr,
                    KZ: "Казахстан",
                    LA: "ลาว",
                    LB: "لبنان",
                    LC: "Saint Lucia",
                    LI: "Liechtenstein",
                    LK: "இலங்கை",
                    LR: "Liberia",
                    LS: "Lesotho",
                    LT: "Lietuva",
                    LU: ci,
                    LV: "Latvija",
                    LY: "ليبيا",
                    MA: "المغرب",
                    MC: "Monaco",
                    MD: uu,
                    ME: "Црна Гора",
                    MG: li,
                    MH: ai,
                    MK: "Македонија",
                    ML: "مالي",
                    MM: "Myanmar",
                    MN: "蒙古",
                    MO: "澳门",
                    MP: eu,
                    MQ: "Martinique",
                    MR: "موريتانيا",
                    MS: "Montserrat",
                    MT: "Malta",
                    MU: "Mauritius",
                    MV: "Maldives",
                    MW: "Malawi",
                    MX: "México",
                    MY: "Malaysia",
                    MZ: "Moçambique",
                    NA: "Namibia",
                    NC: ou,
                    NE: "Niger",
                    NF: fu,
                    NG: o,
                    NI: "Nicaragua",
                    NL: "Nederland",
                    NO: "Norge",
                    NP: "नेपाल",
                    NR: "Nauru",
                    NT: "Neutral Zone",
                    NU: "Niue",
                    NZ: yi,
                    OM: "عمان",
                    PA: "Panamá",
                    PE: "Perú",
                    PF: bi,
                    PG: ft,
                    PH: wi,
                    PK: kt,
                    PL: "Polska",
                    PM: vu,
                    PN: "Pitcairn",
                    PR: ki,
                    PS: "فلسطين",
                    PT: "Portugal",
                    PW: "Palau",
                    PY: pi,
                    QA: "قطر",
                    QO: "Outlying Oceania",
                    QU: "European Union",
                    RE: "Réunion",
                    RO: "România",
                    RS: "Србија",
                    RU: "Россия",
                    RW: et,
                    SA: te,
                    SB: wu,
                    SC: nr,
                    SD: "السودان",
                    SE: "Sverige",
                    SG: "新加坡",
                    SH: "Saint Helena",
                    SI: "Slovenija",
                    SJ: bu,
                    SK: pu,
                    SL: "Sierra Leone",
                    SM: "San Marino",
                    SN: ot,
                    SO: "Somali",
                    SR: "Suriname",
                    ST: ku,
                    SU: "Union of Soviet Socialist Republics",
                    SV: "El Salvador",
                    SY: "سوريا",
                    SZ: tr,
                    TC: du,
                    TD: "تشاد",
                    TF: "French Southern Territories",
                    TG: "Togo",
                    TH: "ประเทศไทย",
                    TJ: "تاجیکستان",
                    TK: st,
                    TL: rr,
                    TM: "Туркменистан",
                    TN: "تونس",
                    TO: "Tonga",
                    TR: ct,
                    TT: "Trinidad y Tobago",
                    TV: ht,
                    TW: "台湾",
                    TZ: ir,
                    UA: "Україна",
                    UG: "Uganda",
                    UM: tf,
                    US: ur,
                    UY: "Uruguay",
                    UZ: "Ўзбекистон",
                    VA: "Vaticano",
                    VC: au,
                    VE: "Venezuela",
                    VG: br,
                    VI: gu,
                    VN: "Việt Nam",
                    VU: lt,
                    WF: uf,
                    WS: "Samoa",
                    YD: "People's Democratic Republic of Yemen",
                    YE: "اليمن",
                    YT: "Mayotte",
                    ZA: u,
                    ZM: "Zambia",
                    ZW: "Zimbabwe",
                    ZZ: rf,
                    aa_DJ: "Jabuuti",
                    aa_ER: "Érythrée",
                    aa_ER_SAAHO: "Érythrée",
                    aa_ET: si,
                    af_NA: "Namibië",
                    af_ZA: "Suid-Afrika",
                    ak_GH: v,
                    am_ET: tt,
                    ar_AE: gf,
                    ar_BH: "البحرين",
                    ar_DJ: "جيبوتي",
                    ar_DZ: "الجزائر",
                    ar_EG: "مصر",
                    ar_EH: ne,
                    ar_ER: "اريتريا",
                    ar_IL: "اسرائيل",
                    ar_IQ: "العراق",
                    ar_JO: "الأردن",
                    ar_KM: lr,
                    ar_KW: "الكويت",
                    ar_LB: "لبنان",
                    ar_LY: "ليبيا",
                    ar_MA: "المغرب",
                    ar_MR: "موريتانيا",
                    ar_OM: "عمان",
                    ar_PS: "فلسطين",
                    ar_QA: "قطر",
                    ar_SA: te,
                    ar_SD: "السودان",
                    ar_SY: "سوريا",
                    ar_TD: "تشاد",
                    ar_TN: "تونس",
                    ar_YE: "اليمن",
                    as_IN: "ভাৰত",
                    ay_BO: rt,
                    az_AZ: "Azərbaycan",
                    az_Cyrl_AZ: "Азәрбајҹан",
                    az_Latn_AZ: "Azerbaycan",
                    be_BY: or,
                    bg_BG: "България",
                    bi_VU: lt,
                    bn_BD: "বাংলাদেশ",
                    bn_IN: "ভারত",
                    bo_CN: "རྒྱ་ནག",
                    bo_IN: "རྒྱ་གར་",
                    bs_BA: ut,
                    byn_ER: "ኤርትራ",
                    ca_AD: "Andorra",
                    ca_ES: "Espanya",
                    cch_NG: o,
                    ch_GU: "Guam",
                    chk_FM: l,
                    cop_Arab_EG: "مصر",
                    cop_Arab_US: ie,
                    cop_EG: "مصر",
                    cop_US: ie,
                    cs_CZ: df,
                    cy_GB: "Prydain Fawr",
                    da_DK: "Danmark",
                    da_GL: "Grønland",
                    de_AT: "Österreich",
                    de_BE: "Belgien",
                    de_CH: "Schweiz",
                    de_DE: "Deutschland",
                    de_LI: "Liechtenstein",
                    de_LU: "Luxemburg",
                    dv_MV: "Maldives",
                    dz_BT: "Bhutan",
                    ee_GH: v,
                    ee_TG: "Togo",
                    efi_NG: o,
                    el_CY: "Κύπρος",
                    el_GR: "Ελλάδα",
                    en_AG: wr,
                    en_AI: "Anguilla",
                    en_AS: ui,
                    en_AU: "Australia",
                    en_BB: "Barbados",
                    en_BE: "Belgium",
                    en_BM: "Bermuda",
                    en_BS: "Bahamas",
                    en_BW: fi,
                    en_BZ: "Belize",
                    en_CA: "Canada",
                    en_CC: "Cocos Islands",
                    en_CK: "Cook Islands",
                    en_CM: "Cameroon",
                    en_CX: dr,
                    en_DM: "Dominica",
                    en_FJ: "Fiji",
                    en_FK: gr,
                    en_FM: l,
                    en_GB: nf,
                    en_GD: "Grenada",
                    en_GG: "Guernsey",
                    en_GH: v,
                    en_GI: "Gibraltar",
                    en_GM: "Gambia",
                    en_GU: "Guam",
                    en_GY: "Guyana",
                    en_HK: "Hong Kong",
                    en_HN: ei,
                    en_IE: "Ireland",
                    en_IM: "Isle of Man",
                    en_IN: "India",
                    en_JE: "Jersey",
                    en_JM: "Jamaica",
                    en_KE: "Kenya",
                    en_KI: hi,
                    en_KN: lu,
                    en_KY: kr,
                    en_LC: "Saint Lucia",
                    en_LR: "Liberia",
                    en_LS: "Lesotho",
                    en_MH: ai,
                    en_MP: eu,
                    en_MS: "Montserrat",
                    en_MT: "Malta",
                    en_MU: "Mauritius",
                    en_MW: "Malawi",
                    en_NA: "Namibia",
                    en_NF: fu,
                    en_NG: o,
                    en_NR: "Nauru",
                    en_NU: "Niue",
                    en_NZ: yi,
                    en_PG: ft,
                    en_PH: wi,
                    en_PK: "Pakistan",
                    en_PN: "Pitcairn",
                    en_PR: ki,
                    en_RW: et,
                    en_SB: wu,
                    en_SC: nr,
                    en_SG: "Singapore",
                    en_SH: "Saint Helena",
                    en_SL: "Sierra Leone",
                    en_SZ: tr,
                    en_TC: du,
                    en_TK: st,
                    en_TO: "Tonga",
                    en_TT: "Trinidad and Tobago",
                    en_TV: ht,
                    en_TZ: ir,
                    en_UG: "Uganda",
                    en_UM: tf,
                    en_US: ur,
                    en_US_POSIX: ur,
                    en_VC: au,
                    en_VG: br,
                    en_VI: gu,
                    en_VU: lt,
                    en_WS: "Samoa",
                    en_ZA: u,
                    en_ZM: "Zambia",
                    en_ZW: "Zimbabwe",
                    es_AR: "Argentina",
                    es_BO: rt,
                    es_CL: "Chile",
                    es_CO: "Colombia",
                    es_CR: "Costa Rica",
                    es_CU: "Cuba",
                    es_DO: su,
                    es_EC: "Ecuador",
                    es_ES: "España",
                    es_GQ: "Guinea Ecuatorial",
                    es_GT: "Guatemala",
                    es_HN: ei,
                    es_MX: "México",
                    es_NI: "Nicaragua",
                    es_PA: "Panamá",
                    es_PE: "Perú",
                    es_PH: "Filipinas",
                    es_PR: ki,
                    es_PY: pi,
                    es_SV: "El Salvador",
                    es_US: "Estados Unidos",
                    es_UY: "Uruguay",
                    es_VE: "Venezuela",
                    et_EE: "Eesti",
                    eu_ES: "Espainia",
                    fa_AF: bt,
                    fa_IR: "ایران",
                    fi_FI: "Suomi",
                    fil_PH: wi,
                    fj_FJ: "Fiji",
                    fo_FO: "Føroyar",
                    fr_BE: "Belgique",
                    fr_BF: "Burkina Faso",
                    fr_BI: "Burundi",
                    fr_BJ: "Bénin",
                    fr_CA: "Canada",
                    fr_CD: gi,
                    fr_CF: di,
                    fr_CG: "Congo",
                    fr_CH: "Suisse",
                    fr_CI: "Côte d’Ivoire",
                    fr_CM: "Cameroun",
                    fr_DJ: "Djibouti",
                    fr_DZ: "Algérie",
                    fr_FR: "France",
                    fr_GA: "Gabon",
                    fr_GF: tu,
                    fr_GN: "Guinée",
                    fr_GP: "Guadeloupe",
                    fr_GQ: nu,
                    fr_HT: "Haïti",
                    fr_KM: "Comores",
                    fr_LU: ci,
                    fr_MA: "Maroc",
                    fr_MC: "Monaco",
                    fr_MG: li,
                    fr_ML: "Mali",
                    fr_MQ: "Martinique",
                    fr_MU: "Maurice",
                    fr_NC: ou,
                    fr_NE: "Niger",
                    fr_PF: bi,
                    fr_PM: vu,
                    fr_RE: "Réunion",
                    fr_RW: et,
                    fr_SC: nr,
                    fr_SN: ot,
                    fr_SY: "Syrie",
                    fr_TD: "Tchad",
                    fr_TG: "Togo",
                    fr_TN: "Tunisie",
                    fr_VU: lt,
                    fr_WF: uf,
                    fr_YT: "Mayotte",
                    fur_IT: "Italia",
                    ga_IE: "Éire",
                    gaa_GH: v,
                    gez_ER: "ኤርትራ",
                    gez_ET: tt,
                    gil_KI: hi,
                    gl_ES: "España",
                    gn_PY: pi,
                    gu_IN: "ભારત",
                    gv_GB: hu,
                    ha_Arab_NG: "نيجيريا",
                    ha_GH: "غانا",
                    ha_Latn_GH: v,
                    ha_Latn_NE: "Niger",
                    ha_Latn_NG: "Nigéria",
                    ha_NE: "النيجر",
                    ha_NG: "نيجيريا",
                    haw_US: "ʻAmelika Hui Pū ʻIa",
                    he_IL: "ישראל",
                    hi_IN: s,
                    ho_PG: ft,
                    hr_BA: ut,
                    hr_HR: "Hrvatska",
                    ht_HT: "Haïti",
                    hu_HU: "Magyarország",
                    hy_AM: cr,
                    hy_AM_REVISED: cr,
                    id_ID: oi,
                    ig_NG: o,
                    ii_CN: "ꍏꇩ",
                    is_IS: "Ísland",
                    it_CH: "Svizzera",
                    it_IT: "Italia",
                    it_SM: "San Marino",
                    ja_JP: "日本",
                    ka_GE: "საქართველო",
                    kaj_NG: o,
                    kam_KE: "Kenya",
                    kcg_NG: o,
                    kfo_NG: "Nigéria",
                    kk_KZ: "Қазақстан",
                    kl_GL: iu,
                    km_KH: "កម្ពុជា",
                    kn_IN: "ಭಾರತ",
                    ko_KP: re,
                    ko_KR: "대한민국",
                    kok_IN: s,
                    kos_FM: l,
                    kpe_GN: "Guinée",
                    kpe_LR: "Libéria",
                    ks_IN: s,
                    ku_IQ: "Irak",
                    ku_IR: "İran",
                    ku_Latn_IQ: "Irak",
                    ku_Latn_IR: "İran",
                    ku_Latn_SY: "Suriye",
                    ku_Latn_TR: ct,
                    ku_SY: "Suriye",
                    ku_TR: ct,
                    kw_GB: hu,
                    ky_Cyrl_KG: sr,
                    ky_KG: "Kırgızistan",
                    la_VA: "Vaticano",
                    lb_LU: ci,
                    ln_CD: gi,
                    ln_CG: "Kongo",
                    lo_LA: "Laos",
                    lt_LT: "Lietuva",
                    lv_LV: "Latvija",
                    mg_MG: li,
                    mh_MH: ai,
                    mi_NZ: yi,
                    mk_MK: "Македонија",
                    ml_IN: "ഇന്ത്യ",
                    mn_Cyrl_MN: "Монголия",
                    mn_MN: "Монголия",
                    mr_IN: s,
                    ms_BN: "Brunei",
                    ms_MY: "Malaysia",
                    ms_SG: "Singapura",
                    mt_MT: "Malta",
                    my_MM: "Myanmar",
                    na_NR: "Nauru",
                    nb_NO: "Norge",
                    nb_SJ: bu,
                    ne_NP: "नेपाल",
                    niu_NU: "Niue",
                    nl_AN: vi,
                    nl_AW: "Aruba",
                    nl_BE: "België",
                    nl_NL: "Nederland",
                    nl_SR: "Suriname",
                    nn_NO: "Noreg",
                    nr_ZA: u,
                    nso_ZA: u,
                    ny_MW: "Malawi",
                    om_ET: si,
                    om_KE: "Keeniyaa",
                    or_IN: "ଭାରତ",
                    pa_Arab_PK: kt,
                    pa_Guru_IN: "ਭਾਰਤ",
                    pa_IN: "ਭਾਰਤ",
                    pa_PK: kt,
                    pap_AN: vi,
                    pau_PW: "Palau",
                    pl_PL: "Polska",
                    pon_FM: l,
                    ps_AF: bt,
                    pt_AO: "Angola",
                    pt_BR: "Brasil",
                    pt_CV: "Cabo Verde",
                    pt_GW: "Guiné Bissau",
                    pt_MZ: "Moçambique",
                    pt_PT: "Portugal",
                    pt_ST: ku,
                    pt_TL: rr,
                    qu_BO: rt,
                    qu_PE: "Perú",
                    rm_CH: "Schweiz",
                    rn_BI: "Burundi",
                    ro_MD: uu,
                    ro_RO: "România",
                    ru_BY: or,
                    ru_KG: sr,
                    ru_KZ: "Казахстан",
                    ru_RU: "Россия",
                    ru_UA: "Украина",
                    rw_RW: et,
                    sa_IN: s,
                    sd_Deva_IN: s,
                    sd_IN: s,
                    se_FI: "Finland",
                    se_NO: "Norge",
                    sg_CF: di,
                    sh_BA: "Bosnia and Herzegovina",
                    sh_CS: yu,
                    si_LK: "Sri Lanka",
                    sid_ET: si,
                    sk_SK: pu,
                    sl_SI: "Slovenija",
                    sm_AS: ui,
                    sm_WS: "Samoa",
                    so_DJ: "Jabuuti",
                    so_ET: "Itoobiya",
                    so_KE: "Kiiniya",
                    so_SO: "Soomaaliya",
                    sq_AL: "Shqipëria",
                    sr_BA: "Босна и Херцеговина",
                    sr_CS: "Србија и Црна Гора",
                    sr_Cyrl_BA: "Босния",
                    sr_Cyrl_CS: "Сербия и Черногория",
                    sr_Cyrl_ME: "Черногория",
                    sr_Cyrl_RS: "Сербия",
                    sr_Latn_BA: ut,
                    sr_Latn_CS: "Srbija i Crna Gora",
                    sr_Latn_ME: "Crna Gora",
                    sr_Latn_RS: "Srbija",
                    sr_ME: "Црна Гора",
                    sr_RS: "Србија",
                    ss_SZ: tr,
                    ss_ZA: u,
                    st_LS: "Lesotho",
                    st_ZA: u,
                    su_ID: oi,
                    sv_AX: "Åland",
                    sv_FI: "Finland",
                    sv_SE: "Sverige",
                    sw_KE: "Kenya",
                    sw_TZ: ir,
                    sw_UG: "Uganda",
                    swb_KM: lr,
                    syr_SY: "Syria",
                    ta_IN: "இந்தியா",
                    ta_LK: "இலங்கை",
                    ta_SG: "சிங்கப்பூர்",
                    te_IN: "భారత దేళం",
                    tet_TL: rr,
                    tg_Cyrl_TJ: "Таджикистан",
                    tg_TJ: "تاجکستان",
                    th_TH: "ประเทศไทย",
                    ti_ER: "ኤርትራ",
                    ti_ET: tt,
                    tig_ER: "ኤርትራ",
                    tk_TM: "ترکمنستان",
                    tkl_TK: st,
                    tn_BW: fi,
                    tn_ZA: u,
                    to_TO: "Tonga",
                    tpi_PG: ft,
                    tr_CY: "Güney Kıbrıs Rum Kesimi",
                    tr_TR: ct,
                    ts_ZA: u,
                    tt_RU: "Россия",
                    tvl_TV: ht,
                    ty_PF: bi,
                    uk_UA: "Україна",
                    uli_FM: l,
                    und_ZZ: rf,
                    ur_IN: "بھارت",
                    ur_PK: kt,
                    uz_AF: "Afganistan",
                    uz_Arab_AF: bt,
                    uz_Cyrl_UZ: "Узбекистан",
                    uz_Latn_UZ: "Oʿzbekiston",
                    uz_UZ: "Ўзбекистон",
                    ve_ZA: u,
                    vi_VN: "Việt Nam",
                    wal_ET: tt,
                    wo_Arab_SN: "السنغال",
                    wo_Latn_SN: ot,
                    wo_SN: ot,
                    xh_ZA: u,
                    yap_FM: l,
                    yo_NG: o,
                    zh_CN: "中国",
                    zh_HK: "香港",
                    zh_Hans_CN: "中国",
                    zh_Hans_SG: "新加坡",
                    zh_Hant_HK: "中華人民共和國香港特別行政區",
                    zh_Hant_MO: "澳門",
                    zh_Hant_TW: "臺灣",
                    zh_MO: "澳门",
                    zh_SG: "新加坡",
                    zh_TW: "台湾",
                    zu_ZA: u
                },
                LANGUAGE: {
                    aa: "afar",
                    ab: "абхазский",
                    ace: "Aceh",
                    ach: "Acoli",
                    ada: "Adangme",
                    ady: "адыгейский",
                    ae: "Avestan",
                    af: "Afrikaans",
                    afa: "Afro-Asiatic Language",
                    afh: "Afrihili",
                    ain: "Ainu",
                    ak: "Akan",
                    akk: "Akkadian",
                    ale: "Aleut",
                    alg: "Algonquian Language",
                    alt: "Southern Altai",
                    am: "አማርኛ",
                    an: "Aragonese",
                    ang: "Old English",
                    anp: "Angika",
                    apa: "Apache Language",
                    ar: "العربية",
                    arc: "Aramaic",
                    arn: "Araucanian",
                    arp: "Arapaho",
                    art: "Artificial Language",
                    arw: "Arawak",
                    as: "অসমীয়া",
                    ast: "asturiano",
                    ath: "Athapascan Language",
                    aus: "Australian Language",
                    av: "аварский",
                    awa: "Awadhi",
                    ay: "aimara",
                    az: "azərbaycanca",
                    az_Arab: "ترکی آذربایجانی",
                    az_Cyrl: "Азәрбајҹан",
                    az_Latn: "Azerice",
                    ba: "башкирский",
                    bad: "Banda",
                    bai: "Bamileke Language",
                    bal: "بلوچی",
                    ban: "Balin",
                    bas: "Basa",
                    bat: "Baltic Language",
                    be: "беларуская",
                    bej: "Beja",
                    bem: "Bemba",
                    ber: "Berber",
                    bg: "български",
                    bh: "बिहारी",
                    bho: "Bhojpuri",
                    bi: "bichelamar ; bislama",
                    bik: "Bikol",
                    bin: "Bini",
                    bla: "Siksika",
                    bm: "bambara",
                    bn: "বাংলা",
                    bnt: "Bantu",
                    bo: "པོད་སྐད་",
                    br: "breton",
                    bra: "Braj",
                    bs: "Bosanski",
                    btk: "Batak",
                    bua: "Buriat",
                    bug: "Bugis",
                    byn: "ብሊን",
                    ca: "català",
                    cad: "Caddo",
                    cai: "Central American Indian Language",
                    car: "Carib",
                    cau: "Caucasian Language",
                    cch: "Atsam",
                    ce: "чеченский",
                    ceb: "Cebuano",
                    cel: "Celtic Language",
                    ch: "Chamorro",
                    chb: "Chibcha",
                    chg: "Chagatai",
                    chk: "Chuukese",
                    chm: "марийский (черемисский)",
                    chn: "Chinook Jargon",
                    cho: "Choctaw",
                    chp: "Chipewyan",
                    chr: "Cherokee",
                    chy: "Cheyenne",
                    cmc: "Chamic Language",
                    co: "corse",
                    cop: "قبطية",
                    cop_Arab: "قبطية",
                    cpe: "English-based Creole or Pidgin",
                    cpf: "French-based Creole or Pidgin",
                    cpp: "Portuguese-based Creole or Pidgin",
                    cr: "Cree",
                    crh: "Crimean Turkish",
                    crp: "Creole or Pidgin",
                    cs: "čeština",
                    csb: "Kashubian",
                    cu: "Church Slavic",
                    cus: "Cushitic Language",
                    cv: "чувашский",
                    cy: "Cymraeg",
                    da: "dansk",
                    dak: "Dakota",
                    dar: "даргва",
                    day: "Dayak",
                    de: "Deutsch",
                    del: "Delaware",
                    den: "Slave",
                    dgr: "Dogrib",
                    din: "Dinka",
                    doi: "الدوجرى",
                    dra: "Dravidian Language",
                    dsb: "Lower Sorbian",
                    dua: "Duala",
                    dum: "Middle Dutch",
                    dv: "Divehi",
                    dyu: "dioula",
                    dz: "རྫོང་ཁ",
                    ee: "Ewe",
                    efi: "Efik",
                    egy: "Ancient Egyptian",
                    eka: "Ekajuk",
                    el: "Ελληνικά",
                    elx: "Elamite",
                    en: "English",
                    enm: "Middle English",
                    eo: "esperanto",
                    es: "español",
                    et: "eesti",
                    eu: "euskara",
                    ewo: "Ewondo",
                    fa: "فارسی",
                    fan: "fang",
                    fat: "Fanti",
                    ff: "Fulah",
                    fi: "suomi",
                    fil: "Filipino",
                    fiu: "Finno-Ugrian Language",
                    fj: "Fijian",
                    fo: "føroyskt",
                    fon: "Fon",
                    fr: "français",
                    frm: "Middle French",
                    fro: "Old French",
                    frr: "Northern Frisian",
                    frs: "Eastern Frisian",
                    fur: "friulano",
                    fy: "Fries",
                    ga: "Gaeilge",
                    gaa: "Ga",
                    gay: "Gayo",
                    gba: "Gbaya",
                    gd: "Scottish Gaelic",
                    gem: "Germanic Language",
                    gez: "ግዕዝኛ",
                    gil: "Gilbertese",
                    gl: "galego",
                    gmh: "Middle High German",
                    gn: "guaraní",
                    goh: "Old High German",
                    gon: "Gondi",
                    gor: "Gorontalo",
                    got: "Gothic",
                    grb: "Grebo",
                    grc: "Αρχαία Ελληνικά",
                    gsw: "Schweizerdeutsch",
                    gu: "ગુજરાતી",
                    gv: "Gaelg",
                    gwi: "Gwichʼin",
                    ha: "الهوسا",
                    ha_Arab: "الهوسا",
                    ha_Latn: "haoussa",
                    hai: "Haida",
                    haw: "ʻōlelo Hawaiʻi",
                    he: "עברית",
                    hi: "हिंदी",
                    hil: "Hiligaynon",
                    him: "Himachali",
                    hit: "Hittite",
                    hmn: "Hmong",
                    ho: "Hiri Motu",
                    hr: "hrvatski",
                    hsb: "Upper Sorbian",
                    ht: "haïtien",
                    hu: "magyar",
                    hup: "Hupa",
                    hy: "Հայերէն",
                    hz: "Herero",
                    ia: "interlingvao",
                    iba: "Iban",
                    id: "Bahasa Indonesia",
                    ie: "Interlingue",
                    ig: "Igbo",
                    ii: "ꆈꌠꉙ",
                    ijo: "Ijo",
                    ik: "Inupiaq",
                    ilo: "Iloko",
                    inc: "Indic Language",
                    ine: "Indo-European Language",
                    inh: "ингушский",
                    io: "Ido",
                    ira: "Iranian Language",
                    iro: "Iroquoian Language",
                    is: "íslenska",
                    it: "italiano",
                    iu: "Inuktitut",
                    ja: "日本語",
                    jbo: "Lojban",
                    jpr: "Judeo-Persian",
                    jrb: "Judeo-Arabic",
                    jv: "Jawa",
                    ka: "ქართული",
                    kaa: "каракалпакский",
                    kab: "kabyle",
                    kac: "Kachin",
                    kaj: "Jju",
                    kam: "Kamba",
                    kar: "Karen",
                    kaw: "Kawi",
                    kbd: "кабардинский",
                    kcg: "Tyap",
                    kfo: "koro",
                    kg: "Kongo",
                    kha: "Khasi",
                    khi: "Khoisan Language",
                    kho: "Khotanese",
                    ki: "Kikuyu",
                    kj: "Kuanyama",
                    kk: "Қазақ",
                    kl: "kalaallisut",
                    km: "ភាសាខ្មែរ",
                    kmb: "quimbundo",
                    kn: "ಕನ್ನಡ",
                    ko: "한국어",
                    kok: "कोंकणी",
                    kos: "Kosraean",
                    kpe: "kpellé",
                    kr: "Kanuri",
                    krc: "карачаево-балкарский",
                    krl: "карельский",
                    kro: "Kru",
                    kru: "Kurukh",
                    ks: "काश्मिरी",
                    ku: "Kürtçe",
                    ku_Arab: "الكردية",
                    ku_Latn: "Kürtçe",
                    kum: "кумыкский",
                    kut: "Kutenai",
                    kv: "Komi",
                    kw: "kernewek",
                    ky: "Kırgızca",
                    ky_Arab: "القيرغستانية",
                    ky_Cyrl: "киргизский",
                    la: "latino",
                    lad: "לדינו",
                    lah: "لاهندا",
                    lam: "Lamba",
                    lb: "luxembourgeois",
                    lez: "лезгинский",
                    lg: "Ganda",
                    li: "Limburgs",
                    ln: "lingala",
                    lo: "Lao",
                    lol: "mongo",
                    loz: "Lozi",
                    lt: "lietuvių",
                    lu: "luba-katanga",
                    lua: "luba-lulua",
                    lui: "Luiseno",
                    lun: "Lunda",
                    luo: "Luo",
                    lus: "Lushai",
                    lv: "latviešu",
                    mad: "Madura",
                    mag: "Magahi",
                    mai: "Maithili",
                    mak: "Makassar",
                    man: "Mandingo",
                    map: "Austronesian",
                    mas: "Masai",
                    mdf: "мокша",
                    mdr: "Mandar",
                    men: "Mende",
                    mg: "malgache",
                    mga: "Middle Irish",
                    mh: "Marshallese",
                    mi: "Maori",
                    mic: "Micmac",
                    min: "Minangkabau",
                    mis: "Miscellaneous Language",
                    mk: "македонски",
                    mkh: "Mon-Khmer Language",
                    ml: "മലയാളം",
                    mn: hr,
                    mn_Cyrl: hr,
                    mn_Mong: hr,
                    mnc: "Manchu",
                    mni: "Manipuri",
                    mno: "Manobo Language",
                    mo: "Moldavian",
                    moh: "Mohawk",
                    mos: "moré ; mossi",
                    mr: "मराठी",
                    ms: "Bahasa Melayu",
                    mt: "Malti",
                    mul: "Multiple Languages",
                    mun: "Munda Language",
                    mus: "Creek",
                    mwl: "Mirandese",
                    mwr: "Marwari",
                    my: "Burmese",
                    myn: "Mayan Language",
                    myv: "эрзя",
                    na: "Nauru",
                    nah: "Nahuatl",
                    nai: "North American Indian Language",
                    nap: "napoletano",
                    nb: "norsk bokmål",
                    nd: "North Ndebele",
                    nds: "Low German",
                    ne: "नेपाली",
                    "new": "Newari",
                    ng: "Ndonga",
                    nia: "Nias",
                    nic: "Niger-Kordofanian Language",
                    niu: "Niuean",
                    nl: "Nederlands",
                    nn: "nynorsk",
                    no: "Norwegian",
                    nog: "ногайский",
                    non: "Old Norse",
                    nqo: "N’Ko",
                    nr: "South Ndebele",
                    nso: "Northern Sotho",
                    nub: "Nubian Language",
                    nv: "Navajo",
                    nwc: "Classical Newari",
                    ny: "nianja; chicheua; cheua",
                    nym: "Nyamwezi",
                    nyn: "Nyankole",
                    nyo: "Nyoro",
                    nzi: "Nzima",
                    oc: "occitan",
                    oj: "Ojibwa",
                    om: "Oromoo",
                    or: "ଓଡ଼ିଆ",
                    os: "осетинский",
                    osa: "Osage",
                    ota: "Ottoman Turkish",
                    oto: "Otomian Language",
                    pa: "ਪੰਜਾਬੀ",
                    pa_Arab: "پنجاب",
                    pa_Guru: "ਪੰਜਾਬੀ",
                    paa: "Papuan Language",
                    pag: "Pangasinan",
                    pal: "Pahlavi",
                    pam: "Pampanga",
                    pap: "Papiamento",
                    pau: "Palauan",
                    peo: "Old Persian",
                    phi: "Philippine Language",
                    phn: "Phoenician",
                    pi: "บาลี",
                    pl: "polski",
                    pon: "Pohnpeian",
                    pra: "Prakrit Language",
                    pro: "Old Provençal",
                    ps: "پښتو",
                    pt: "português",
                    qu: "quechua",
                    raj: "Rajasthani",
                    rap: "Rapanui",
                    rar: "Rarotongan",
                    rm: "Rätoromanisch",
                    rn: "roundi",
                    ro: "română",
                    roa: "Romance Language",
                    rom: "Romany",
                    ru: "русский",
                    rup: "Aromanian",
                    rw: "rwanda",
                    sa: "संस्कृत भाषा",
                    sad: "Sandawe",
                    sah: "якутский",
                    sai: "South American Indian Language",
                    sal: "Salishan Language",
                    sam: "ארמית שומרונית",
                    sas: "Sasak",
                    sat: "Santali",
                    sc: "Sardinian",
                    scn: "siciliano",
                    sco: "Scots",
                    sd: "सिन्धी",
                    sd_Arab: "سندی",
                    sd_Deva: "सिन्धी",
                    se: "nordsamiska",
                    sel: "селькупский",
                    sem: "Semitic Language",
                    sg: "sangho",
                    sga: "Old Irish",
                    sgn: "Sign Language",
                    sh: "Serbo-Croatian",
                    shn: "Shan",
                    si: "Sinhalese",
                    sid: "Sidamo",
                    sio: "Siouan Language",
                    sit: "Sino-Tibetan Language",
                    sk: "slovenský",
                    sl: "slovenščina",
                    sla: "Slavic Language",
                    sm: "Samoan",
                    sma: "sydsamiska",
                    smi: "Sami Language",
                    smj: "lulesamiska",
                    smn: "Inari Sami",
                    sms: "Skolt Sami",
                    sn: "Shona",
                    snk: "soninké",
                    so: "Soomaali",
                    sog: "Sogdien",
                    son: "Songhai",
                    sq: "shqipe",
                    sr: "Српски",
                    sr_Cyrl: "сербский",
                    sr_Latn: "Srpski",
                    srn: "Sranantongo",
                    srr: "sérère",
                    ss: "Swati",
                    ssa: "Nilo-Saharan Language",
                    st: "Sesotho",
                    su: "Sundan",
                    suk: "Sukuma",
                    sus: "soussou",
                    sux: "Sumerian",
                    sv: "svenska",
                    sw: "Kiswahili",
                    syc: "Classical Syriac",
                    syr: "Syriac",
                    ta: "தமிழ்",
                    tai: "Tai Language",
                    te: "తెలుగు",
                    tem: "Timne",
                    ter: "Tereno",
                    tet: "tétum",
                    tg: "تاجک",
                    tg_Arab: "تاجک",
                    tg_Cyrl: "таджикский",
                    th: "ไทย",
                    ti: "ትግርኛ",
                    tig: "ትግረ",
                    tiv: "Tiv",
                    tk: "ترکمنی",
                    tkl: st,
                    tl: "Tagalog",
                    tlh: "Klingon",
                    tli: "Tlingit",
                    tmh: "tamacheq",
                    tn: "Tswana",
                    to: "Tonga",
                    tog: "Nyasa Tonga",
                    tpi: "Tok Pisin",
                    tr: "Türkçe",
                    ts: "Tsonga",
                    tsi: "Tsimshian",
                    tt: "татарский",
                    tum: "Tumbuka",
                    tup: "Tupi Language",
                    tut: "алтайские (другие)",
                    tvl: ht,
                    tw: "Twi",
                    ty: "tahitien",
                    tyv: "тувинский",
                    udm: "удмуртский",
                    ug: "уйгурский",
                    uga: "Ugaritic",
                    uk: "українська",
                    umb: "umbundu",
                    und: "English",
                    ur: "اردو",
                    uz: "Ўзбек",
                    uz_Arab: "اۉزبېک",
                    uz_Cyrl: "узбекский",
                    uz_Latn: "o'zbekcha",
                    vai: "Vai",
                    ve: "Venda",
                    vi: "Tiếng Việt",
                    vo: "volapuko",
                    vot: "Votic",
                    wa: "Wallonisch",
                    wak: "Wakashan Language",
                    wal: "Walamo",
                    war: "Waray",
                    was: "Washo",
                    wen: "Sorbian Language",
                    wo: "wolof",
                    wo_Arab: "الولوف",
                    wo_Latn: "wolof",
                    xal: "калмыцкий",
                    xh: "Xhosa",
                    yao: "iao",
                    yap: "Yapese",
                    yi: "יידיש",
                    yo: "Yoruba",
                    ypk: "Yupik Language",
                    za: "Zhuang",
                    zap: "Zapotec",
                    zen: "Zenaga",
                    zh: "中文",
                    zh_Hans: "中文",
                    zh_Hant: "中文",
                    znd: "Zande",
                    zu: "Zulu",
                    zun: "Zuni",
                    zxx: "No linguistic content",
                    zza: "Zaza"
                }
            }, n.locale.Wf = function(t) {
                t = t.replace(/-/g, at);
                n.locale.M = t
            }, n.locale.Ea = function() {
                return n.locale.M || (n.locale.M = yt), n.locale.M
            }, n.locale.J = {
                vd: "DateTimeConstants",
                Fd: "NumberFormatConstants",
                gc: "TimeZoneConstants",
                Wb: ru,
                hc: "TimeZoneSelectedIds",
                jc: "TimeZoneSelectedShortNames",
                ic: "TimeZoneSelectedLongNames",
                fc: "TimeZoneAllLongNames"
            }, n.locale.Da = function(n) {
                return (n = n.match(/^\w{2,3}([-_]|$)/)) ? n[0].replace(/[_-]/g, i) : i
            }, n.locale.kb = function(n) {
                return (n = n.match(/[-_]([a-zA-Z]{2}|\d{3})([-_]|$)/)) ? n[0].replace(/[_-]/g, i) : i
            }, n.locale.Re = function(n) {
                return n = n.split(/[-_]/g), 1 < n.length && n[1].match(/^[a-zA-Z]{4}$/) ? n[1] : i
            }, n.locale.Se = function(n) {
                return (n = n.match(/[-_]([a-z]{2,})/)) ? n[1] : i
            }, n.locale.Me = function(t) {
                var i = n.locale.Da(t) + at + n.locale.kb(t);
                return i in n.locale.K.COUNTRY ? n.locale.K.COUNTRY[i] : t
            }, n.locale.Ie = function(t, i) {
                i || (i = n.locale.mb());
                var r = n.locale.kb(t);
                return r in i.COUNTRY ? i.COUNTRY[r] : t
            }, n.locale.Ne = function(t) {
                if (t in n.locale.K.LANGUAGE) return n.locale.K.LANGUAGE[t];
                var i = n.locale.Da(t);
                return i in n.locale.K.LANGUAGE ? n.locale.K.LANGUAGE[i] : t
            }, n.locale.Je = function(t, i) {
                if (i || (i = n.locale.mb()), t in i.LANGUAGE) return i.LANGUAGE[t];
                var r = n.locale.Da(t);
                return r in i.LANGUAGE ? i.LANGUAGE[r] : t
            }, n.locale.L = function(t, i, r) {
                n.locale.m[i] || (n.locale.m[i] = {});
                n.locale.m[i][r] = t;
                n.locale.M || (n.locale.M = r)
            }, n.locale.kf = function(t, i) {
                return t in n.locale.m && i in n.locale.m[t]
            }, n.locale.m = {}, n.locale.Jf = function(t, i) {
                n.locale.L(t, n.locale.J.gc, i)
            }, n.locale.Hf = function(t, i) {
                n.locale.L(t, n.locale.J.Wb, i)
            }, n.locale.Kf = function(t, i) {
                n.locale.L(t, n.locale.J.hc, i)
            }, n.locale.Mf = function(t, i) {
                n.locale.L(t, n.locale.J.jc, i)
            }, n.locale.Lf = function(t, i) {
                n.locale.L(t, n.locale.J.ic, i)
            }, n.locale.If = function(t, i) {
                n.locale.L(t, n.locale.J.fc, i)
            }, n.locale.mb = function() {
                var t = n.locale.Ea(),
                    t = t ? t : n.locale.Ea();
                if (ru in n.locale.m) return n.locale.m.LocaleNameConstants[t]
            }, n.locale.Qe = function(t, i) {
                var r = i ? i : n.locale.Ea();
                if (t in n.locale.m) return r in n.locale.m[t] ? n.locale.m[t][r] : (r = r.split(at), 1 < r.length && r[0] in n.locale.m[t] ? n.locale.m[t][r[0]] : n.locale.m[t].en)
            }, t = {
                a: {}
            }, t.a.c = {}, t.a.c.languages = {
                af: !0,
                am: !0,
                az: !0,
                ar: !0,
                arb: "ar",
                bg: !0,
                bn: !0,
                ca: !0,
                cs: !0,
                cmn: "zh",
                da: !0,
                de: !0,
                el: !0,
                en: !0,
                en_gb: !0,
                es: !0,
                es_419: !0,
                et: !0,
                eu: !0,
                fa: !0,
                fi: !0,
                fil: !0,
                fr: !0,
                fr_ca: !0,
                gl: !0,
                ka: !0,
                gu: !0,
                he: "iw",
                hi: !0,
                hr: !0,
                hu: !0,
                hy: !0,
                id: !0,
                "in": hf,
                is: !0,
                it: !0,
                iw: !0,
                ja: !0,
                ji: "yi",
                jv: !1,
                jw: "jv",
                km: !0,
                kn: !0,
                ko: !0,
                lo: !0,
                lt: !0,
                lv: !0,
                ml: !0,
                mn: !0,
                mo: "ro",
                mr: !0,
                ms: !0,
                nb: "no",
                ne: !0,
                nl: !0,
                no: !0,
                pl: !0,
                pt: "pt_br",
                pt_br: !0,
                pt_pt: !0,
                ro: !0,
                ru: !0,
                si: !0,
                sk: !0,
                sl: !0,
                sr: !0,
                sv: !0,
                sw: !0,
                swh: "sw",
                ta: !0,
                te: !0,
                th: !0,
                tl: "fil",
                tr: !0,
                uk: !0,
                ur: !0,
                vi: !0,
                yi: !1,
                zh: "zh_ch",
                zh_cn: !0,
                zh_hk: !0,
                zh_tw: !0,
                zsm: "ms",
                zu: !0
            }, t.a.c.P = {}, t.a.c.R = yf, t.a.c.log = e(), t.a.c.error = e(), t.a.c.Z = !1, t.a.c.N = window, t.a.c.Sa = {
                gstatic: {
                    prefix: "https://www.gstatic.com/charts",
                    debug: "{prefix}/debug/{version}/jsapi_debug_{package}_module.js",
                    compiled: "{prefix}/{version}/js/jsapi_compiled_{package}_module.js",
                    i18n: "{prefix}/{version}/i18n/jsapi_compiled_i18n_{package}_module__{language}.js",
                    css: wf,
                    css_debug: wf,
                    third_party: bf,
                    third_party_gen: bf
                }
            }, t.a.c.v = t.a.c.Sa.gstatic, t.a.c.zc = {
                "default": [],
                format: [],
                ui: ["format", "default"],
                ui_base: ["format", "default"],
                annotatedtimeline: [r],
                annotationchart: [r, "controls", vt, "table"],
                areachart: [r, p],
                bar: [r, g, wt],
                barchart: [r, p],
                browserchart: [r],
                calendar: [r],
                charteditor: [r, vt, a, ff, "gauge", "motionchart", "orgchart", "table"],
                charteditor_base: [pt, vt, a, ff, "gauge", "motionchart", "orgchart", "table_base"],
                columnchart: [r, p],
                controls: [r],
                controls_base: [pt],
                corechart: [r],
                gantt: [r, g],
                gauge: [r],
                geochart: [r],
                geomap: [r],
                geomap_base: [pt],
                helloworld: [r],
                imageareachart: [r, a],
                imagebarchart: [r, a],
                imagelinechart: [r, a],
                imagechart: [r],
                imagepiechart: [r, a],
                imagesparkline: [r, a],
                intensitymap: [r],
                line: [r, g, wt],
                linechart: [r, p],
                map: [r],
                motionchart: [r],
                orgchart: [r],
                overtimecharts: [r, vt],
                piechart: [r, p],
                sankey: ["d3", "d3.sankey", r],
                scatter: [r, g, wt],
                scatterchart: [r, p],
                table: [r],
                table_base: [pt],
                timeline: [r, g],
                treemap: [r],
                wordtree: [r]
            }, t.a.c.fd = {
                d3: "d3/d3.js",
                "d3.sankey": "d3/d3.sankey.js",
                webfontloader: "webfontloader/webfont.js"
            }, t.a.c.Db = {
                dygraph: "dygraphs/dygraph-tickers-combined.js"
            }, t.a.c.wc = {
                annotatedtimeline: "/annotatedtimeline/annotatedtimeline.css",
                annotationchart: "annotationchart/annotationchart.css",
                charteditor: "charteditor/charteditor.css",
                charteditor_base: "charteditor/charteditor_base.css",
                controls: "controls/controls.css",
                imagesparkline: "imagesparkline/imagesparkline.css",
                intensitymap: "intensitymap/intensitymap.css",
                orgchart: "orgchart/orgchart.css",
                table: "table/table.css",
                table_base: "table/table_base.css",
                ui: ["util/util.css", "core/tooltip.css"],
                ui_base: "util/util_base.css"
            }, t.a.c.va = function(n, i) {
                for (var r, o, f = i || {}, u = [], e = 0; e < n.length; e++) r = n[e], f[r] || (f[r] = !0, o = t.a.c.zc[r] || [], 0 < o.length && (u = u.concat(t.a.c.va(o, f))), u.push(r));
                return u
            }, t.a.c.Dc = function(i) {
                for (var r, u, e = {}, o = [], f = 0; f < i.length; f++)
                    for (r = t.a.c.wc[i[f]], n.isArray(r) || (r = [r]), u = 0; u < r.length; u++)(cssFile = r[u]) && !e[cssFile] && (e[cssFile] = !0, o.push(cssFile));
                return o
            }, t.a.c.Xf = function(n, i) {
                if (i)
                    if ("undefined" == typeof n.onload) {
                        var r = !1;
                        n.onreadystatechange = function() {
                            r || (n.readyState && n.readyState !== d ? t.a.c.N.setTimeout(n.onreadystatechange, 0) : (r = !0, delete n.onreadystatechange, t.a.c.N.setTimeout(i, 0)))
                        }
                    } else n.onload = i
            }, t.a.c.Tc = function(n, i) {
                var r, u;
                t.a.c.log(gh + n);
                r = i.createElement(vf);
                r.type = er;
                r.language = wh;
                r.async = !1;
                r.defer = !1;
                u = i.body || i.head || i.getElementsByTagName(fs).item(0) || i.documentElement;
                u.insertBefore(r, u.lastChild);
                r.src = n;
                t.a.c.log(uh + n)
            }, t.a.c.Rc = function(n, r) {
                function c(i) {
                    var o = t.a.c.rb,
                        r = n[i++],
                        u, e;
                    r && (u = r, e = t.a.c.fd[r], e ? (u = e, r === wt && (o = window.document), r = t.a.c.v.third_party) : t.a.c.Db[r] ? (u = t.a.c.Db[r], r = t.a.c.v.third_party_gen) : r = t.a.c.Z ? v : f ? p : y, u = r.replace(pf, a).replace(kf, w).replace(dc, f).replace(gc, u), t.a.c.Tc(u, o), c(i))
                }

                function l() {
                    for (var d = [], e = 0; e < n.length; e++) d.push(s[n[e]]);
                    eval(eo + d.join(i) + tl)();
                    t.a.c.N.setTimeout(r, 0)
                }
                var e, u, o, s, h;
                for (n = t.a.c.va(n), e = [], u = 0; u < n.length; u++) o = n[u], t.a.c.P[o] || e.push(o);
                n = e;
                t.a.c.log(os + n);
                var a = t.a.c.v.prefix,
                    v = t.a.c.v.debug,
                    y = t.a.c.v.compiled,
                    p = t.a.c.v.i18n,
                    w = t.a.c.R,
                    f = t.a.c.Ka;
                f === yt && (f = null);
                s = {};
                h = n.length;
                t.a.c.Xc = function(n, i) {
                    t.a.c.log(th + n);
                    s[n] = i;
                    t.a.c.P[n] = !0;
                    h--;
                    0 === h && l()
                };
                c(0)
            }, t.a.c.W = function(n) {
                function o() {
                    f = !0;
                    for (var t = r.length, n = 0; n < t; n++) r[n]()
                }

                function s() {
                    h = !0;
                    for (var t = u.length, n = 0; n < t; n++) u[n]()
                }
                var r = [],
                    u = [],
                    f = !1,
                    h = !1;
                t.a.c.W.count || (t.a.c.W.count = 0);
                var c = kh + t.a.c.W.count++,
                    e = {
                        done: function(n) {
                            return r.push(n), f && n(), e
                        },
                        Ba: function(n) {
                            return u.push(n), h && n(), e
                        }
                    },
                    i = document.createElement(bh);
                return i.setAttribute(hf, c), i.setAttribute(ec, cc), i.setAttribute(ac, lc), "undefined" != typeof i.addEventListener ? (i.addEventListener(cf, o, !1), i.addEventListener(fh, s, !1)) : "undefined" != typeof i.attachEvent && i.attachEvent(af, function() {
                    var n, t = document.styleSheets.length;
                    try {
                        for (; t--;)
                            if (n = document.styleSheets[t], n.id === c) {
                                o();
                                return
                            }
                    } catch (i) {}
                    f || s()
                }), document.getElementsByTagName(vh)[0].appendChild(i), i.setAttribute(yh, n), e
            }, t.a.c.Oc = function(n, i) {
                t.a.c.log(dh + n);
                t.a.c.W(n).done(i).Ba(function() {
                    t.a.c.error(nc + n)
                })
            }, t.a.c.Pc = function(n, i) {
                var r, e, u, o, f;
                n = t.a.c.va(n);
                r = t.a.c.Dc(n);
                null === r || 0 === r.length ? i() : (t.a.c.log(ss + r.join(uo)), e = t.a.c.v.prefix, u = t.a.c.v.css, t.a.c.Z && (u = t.a.c.v.css_debug || u), o = t.a.c.R, f = function(n) {
                    var s = r[n],
                        h;
                    h = n < r.length - 1 ? function() {
                        f(n + 1)
                    } : i;
                    t.a.c.P[s] ? (t.a.c.log(vo + s), t.a.c.N.setTimeout(h, 0)) : (t.a.c.P[s] = !0, s = u.replace(pf, e).replace(kf, o).replace(kc, s), t.a.c.Oc(s, h))
                }, f(0))
            }, t.a.c.Fe = function() {
                var n = t.a.c.D,
                    r;
                return n || (n = t.a.c.D = document.createElement(ph), t.a.c.D = n, n.name = sf, (document.body || document.head || document).appendChild(n), n.style.display = rc, r = t.a.c.rb = n.contentDocument ? n.contentDocument : n.contentWindow ? n.contentWindow.document : n.document, r.open(), r.writeln(i), r.close()), n
            }, t.a.c.Ab = function(r) {
                for (var u = r.replace(/-/g, at).toLowerCase(); n.i(u);) r = u, u = t.a.c.languages[u], u === r && (u = !1);
                return u || (r.match(/_[^_]+$/) ? (r = r.replace(/_[^_]+$/, i), r = t.a.c.Ab(r)) : r = yt), r
            }, t.a.c.$c = function(n, r) {
                r.log && (t.a.c.log = r.log);
                r.error && (t.a.c.error = r.error);
                var f = r.debug,
                    u = r.language || i,
                    u = t.a.c.Ab(u);
                n || (n = r.version || yf);
                (t.a.c.R && t.a.c.R !== n || t.a.c.Ka && t.a.c.Ka !== u || t.a.c.Z !== f) && t.a.c.D && t.a.c.D.parentNode && (t.a.c.D.parentNode.removeChild(t.a.c.D), t.a.c.D = null, t.a.c.P = {});
                t.a.c.R = n;
                t.a.c.Ka = u;
                t.a.c.Z = f
            }, t.a.c.qf = !1, t.a.c.Cb = !1, t.a.c.ma = !1, t.a.c.loaded = !1, t.a.c.Ca = [], t.a.c.load = function(n, i, r) {
                if (t.a.c.Nc) throw Error("google.charts.load() cannot be called more than once.");
                if (t.a.c.Nc = !0, t.a.c.Cb = !0, t.a.c.ma) t.a.c.U(function() {
                    t.a.c.load(n, i)
                });
                else {
                    t.a.c.loaded = !1;
                    t.a.c.ma = !0;
                    t.a.c.$c(n, i);
                    t.a.c.log(lh + n);
                    t.a.c.v = r || t.a.c.Sa[n] || t.a.c.Sa.gstatic;
                    t.a.c.D = null;
                    t.a.c.N = window;
                    t.a.c.rb = document;
                    var f = function() {
                            t.a.c.ma = !1;
                            t.a.c.loaded = !0;
                            t.a.c.La()
                        },
                        u = i.packages;
                    t.a.c.U(i.callback);
                    t.a.c.Pc(u, function() {
                        t.a.c.Rc(u, f)
                    })
                }
            }, t.a.c.U = function(n) {
                n && t.a.c.Ca.push(n);
                t.a.c.loaded && !t.a.c.ma && t.a.c.La()
            }, t.a.c.bd = function(n) {
                if (window.addEventListener) window.addEventListener(cf, n, !1);
                else if (window.attachEvent) window.attachEvent(af, n);
                else {
                    var t = window.onload;
                    window.onload = function(i) {
                        t && t(i);
                        n()
                    }
                }
            }, t.a.c.Hb = document && document.readyState === d, t.a.c.bd(function() {
                t.a.c.Hb = !0;
                t.a.c.La()
            }), t.a.c.La = function() {
                if (t.a.c.Cb && t.a.c.loaded && (t.a.c.Hb || document.readyState === d))
                    for (; 0 < t.a.c.Ca.length;) t.a.c.Ca.shift()()
            }, t.a.c.Oa = function(n, i) {
                t.a.c.Xc(n, i)
            }, n.global.google && n.global.google.charts && n.global.google.charts.load) throw Error("Google Charts loader.js can only be loaded once.");
        t.a.load = function(n, i, r) {
            n === wc && (n = i, i = r);
            t.a.c.load(String(n), i || {})
        };
        t.a.U = function(n) {
            t.a.c.U(n)
        };
        t.a.Oa = function(n, i) {
            t.a.c.Oa(n, i)
        };
        n.Aa(sf, t.a.load);
        n.Aa("google.charts.setOnLoadCallback", t.a.U);
        n.Aa("google.charts.packageLoadedCallback", t.a.Oa)
    }(),
    function(n, t) {
        if (typeof define == "function" && define.amd) define(["jquery"], t);
        else if (typeof module == "object" && module.exports) {
            var i;
            try {
                i = require("jquery")
            } catch (r) {
                i = null
            }
            module.exports = t(i)
        } else n.Slider = t(n.jQuery)
    }(this, function(n) {
        var t;
        return function(n) {
                "use strict";

                function i() {}

                function r(n) {
                    function u(t) {
                        t.prototype.option || (t.prototype.option = function(t) {
                            n.isPlainObject(t) && (this.options = n.extend(!0, this.options, t))
                        })
                    }

                    function f(i, u) {
                        n.fn[i] = function(f) {
                            var c, s, l, a, e, h, o;
                            if (typeof f == "string") {
                                for (c = t.call(arguments, 1), s = 0, l = this.length; s < l; s++) {
                                    if (a = this[s], e = n.data(a, i), !e) {
                                        r("cannot call methods on " + i + " prior to initialization; attempted to call '" + f + "'");
                                        continue
                                    }
                                    if (!n.isFunction(e[f]) || f.charAt(0) === "_") {
                                        r("no such method '" + f + "' for " + i + " instance");
                                        continue
                                    }
                                    if (h = e[f].apply(e, c), h !== undefined && h !== e) return h
                                }
                                return this
                            }
                            return o = this.map(function() {
                                var t = n.data(this, i);
                                return t ? (t.option(f), t._init()) : (t = new u(this, f), n.data(this, i, t)), n(this)
                            }), !o || o.length > 1 ? o : o[0]
                        }
                    }
                    if (n) {
                        var r = typeof console == "undefined" ? i : function(n) {
                            console.error(n)
                        };
                        return n.bridget = function(n, t) {
                            u(t);
                            f(n, t)
                        }, n.bridget
                    }
                }
                var t = Array.prototype.slice;
                r(n)
            }(n),
            function(n) {
                function r(t, i) {
                    function g(n, t) {
                        var r = "data-slider-" + t,
                            i = n.getAttribute(r);
                        try {
                            return JSON.parse(i)
                        } catch (u) {
                            return i
                        }
                    }
                    var u, h, c, l, a, p, v, f, r, w, b;
                    typeof t == "string" ? this.element = document.querySelector(t) : t instanceof HTMLElement && (this.element = t);
                    var k = this.element.style.width,
                        y = !1,
                        d = this.element.parentNode,
                        e, o, s;
                    for (this.sliderElem ? y = !0 : (this.sliderElem = document.createElement("div"), this.sliderElem.className = "slider", u = document.createElement("div"), u.className = "slider-track", e = document.createElement("div"), e.className = "slider-selection", o = document.createElement("div"), o.className = "slider-handle min-slider-handle", s = document.createElement("div"), s.className = "slider-handle max-slider-handle", u.appendChild(e), u.appendChild(o), u.appendChild(s), h = function(n) {
                            var i = document.createElement("div"),
                                t;
                            i.className = "tooltip-arrow";
                            t = document.createElement("div");
                            t.className = "tooltip-inner";
                            n.appendChild(i);
                            n.appendChild(t)
                        }, c = document.createElement("div"), c.className = "tooltip tooltip-main", h(c), l = document.createElement("div"), l.className = "tooltip tooltip-min", h(l), a = document.createElement("div"), a.className = "tooltip tooltip-max", h(a), this.sliderElem.appendChild(u), this.sliderElem.appendChild(c), this.sliderElem.appendChild(l), this.sliderElem.appendChild(a), d.insertBefore(this.sliderElem, this.element), this.element.style.display = "none"), n && (this.$element = n(this.element), this.$sliderElem = n(this.sliderElem)), i = i ? i : {}, p = Object.keys(this.defaultOptions), v = 0; v < p.length; v++) f = p[v], r = i[f], r = typeof r != "undefined" ? r : g(this.element, f), r = r !== null ? r : this.defaultOptions[f], this.options || (this.options = {}), this.options[f] = r;
                    this.eventToCallbackMap = {};
                    this.sliderElem.id = this.options.id;
                    this.touchCapable = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch;
                    this.tooltip = this.sliderElem.querySelector(".tooltip-main");
                    this.tooltipInner = this.tooltip.querySelector(".tooltip-inner");
                    this.tooltip_min = this.sliderElem.querySelector(".tooltip-min");
                    this.tooltipInner_min = this.tooltip_min.querySelector(".tooltip-inner");
                    this.tooltip_max = this.sliderElem.querySelector(".tooltip-max");
                    this.tooltipInner_max = this.tooltip_max.querySelector(".tooltip-inner");
                    y === !0 && (this._removeClass(this.sliderElem, "slider-horizontal"), this._removeClass(this.sliderElem, "slider-vertical"), this._removeClass(this.tooltip, "hide"), this._removeClass(this.tooltip_min, "hide"), this._removeClass(this.tooltip_max, "hide"), ["left", "top", "width", "height"].forEach(function(n) {
                        this._removeProperty(this.trackSelection, n)
                    }, this), [this.handle1, this.handle2].forEach(function(n) {
                        this._removeProperty(n, "left");
                        this._removeProperty(n, "top")
                    }, this), [this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function(n) {
                        this._removeProperty(n, "left");
                        this._removeProperty(n, "top");
                        this._removeProperty(n, "margin-left");
                        this._removeProperty(n, "margin-top");
                        this._removeClass(n, "right");
                        this._removeClass(n, "top")
                    }, this));
                    this.options.orientation === "vertical" ? (this._addClass(this.sliderElem, "slider-vertical"), this.stylePos = "top", this.mousePos = "pageY", this.sizePos = "offsetHeight", this._addClass(this.tooltip, "right"), this.tooltip.style.left = "100%", this._addClass(this.tooltip_min, "right"), this.tooltip_min.style.left = "100%", this._addClass(this.tooltip_max, "right"), this.tooltip_max.style.left = "100%") : (this._addClass(this.sliderElem, "slider-horizontal"), this.sliderElem.style.width = k, this.options.orientation = "horizontal", this.stylePos = "left", this.mousePos = "pageX", this.sizePos = "offsetWidth", this._addClass(this.tooltip, "top"), this.tooltip.style.top = -this.tooltip.outerHeight - 14 + "px", this._addClass(this.tooltip_min, "top"), this.tooltip_min.style.top = -this.tooltip_min.outerHeight - 14 + "px", this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = -this.tooltip_max.outerHeight - 14 + "px");
                    this.options.value instanceof Array ? this.options.range = !0 : this.options.range && (this.options.value = [this.options.value, this.options.max]);
                    this.trackSelection = e || this.trackSelection;
                    this.options.selection === "none" && this._addClass(this.trackSelection, "hide");
                    this.handle1 = o || this.handle1;
                    this.handle2 = s || this.handle2;
                    y === !0 && (this._removeClass(this.handle1, "round triangle"), this._removeClass(this.handle2, "round triangle hide"));
                    w = ["round", "triangle", "custom"];
                    b = w.indexOf(this.options.handle) !== -1;
                    b && (this._addClass(this.handle1, this.options.handle), this._addClass(this.handle2, this.options.handle));
                    this.offset = this._offset(this.sliderElem);
                    this.size = this.sliderElem[this.sizePos];
                    this.setValue(this.options.value);
                    this.handle1Keydown = this._keydown.bind(this, 0);
                    this.handle1.addEventListener("keydown", this.handle1Keydown, !1);
                    this.handle2Keydown = this._keydown.bind(this, 1);
                    this.handle2.addEventListener("keydown", this.handle2Keydown, !1);
                    this.touchCapable ? (this.mousedown = this._mousedown.bind(this), this.sliderElem.addEventListener("touchstart", this.mousedown, !1)) : (this.mousedown = this._mousedown.bind(this), this.sliderElem.addEventListener("mousedown", this.mousedown, !1));
                    this.options.tooltip === "hide" ? (this._addClass(this.tooltip, "hide"), this._addClass(this.tooltip_min, "hide"), this._addClass(this.tooltip_max, "hide")) : this.options.tooltip === "always" ? (this._showTooltip(), this._alwaysShowTooltip = !0) : (this.showTooltip = this._showTooltip.bind(this), this.hideTooltip = this._hideTooltip.bind(this), this.sliderElem.addEventListener("mouseenter", this.showTooltip, !1), this.sliderElem.addEventListener("mouseleave", this.hideTooltip, !1), this.handle1.addEventListener("focus", this.showTooltip, !1), this.handle1.addEventListener("blur", this.hideTooltip, !1), this.handle2.addEventListener("focus", this.showTooltip, !1), this.handle2.addEventListener("blur", this.hideTooltip, !1));
                    this.options.enabled ? this.enable() : this.disable()
                }
                var i = {
                        formatInvalidInputErrorMsg: function(n) {
                            return "Invalid input value '" + n + "' passed in"
                        },
                        callingContextNotSliderInstance: "Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"
                    },
                    u;
                t = function(n, t) {
                    return r.call(this, n, t), this
                };
                t.prototype = {
                    _init: function() {},
                    constructor: t,
                    defaultOptions: {
                        id: "",
                        min: 0,
                        max: 10,
                        step: 1,
                        precision: 0,
                        orientation: "horizontal",
                        value: 5,
                        range: !1,
                        selection: "before",
                        tooltip: "show",
                        tooltip_split: !1,
                        handle: "round",
                        reversed: !1,
                        enabled: !0,
                        formatter: function(n) {
                            return n instanceof Array ? n[0] + " : " + n[1] : n
                        },
                        natural_arrow_keys: !1
                    },
                    over: !1,
                    inDrag: !1,
                    getValue: function() {
                        return this.options.range ? this.options.value : this.options.value[0]
                    },
                    setValue: function(n, t) {
                        var u, r, i;
                        return n || (n = 0), u = this.getValue(), this.options.value = this._validateInputValue(n), r = this._applyPrecision.bind(this), this.options.range ? (this.options.value[0] = r(this.options.value[0]), this.options.value[1] = r(this.options.value[1]), this.options.value[0] = Math.max(this.options.min, Math.min(this.options.max, this.options.value[0])), this.options.value[1] = Math.max(this.options.min, Math.min(this.options.max, this.options.value[1]))) : (this.options.value = r(this.options.value), this.options.value = [Math.max(this.options.min, Math.min(this.options.max, this.options.value))], this._addClass(this.handle2, "hide"), this.options.value[1] = this.options.selection === "after" ? this.options.max : this.options.min), this.diff = this.options.max - this.options.min, this.percentage = this.diff > 0 ? [(this.options.value[0] - this.options.min) * 100 / this.diff, (this.options.value[1] - this.options.min) * 100 / this.diff, this.options.step * 100 / this.diff] : [0, 0, 100], this._layout(), i = this.options.range ? this.options.value : this.options.value[0], t === !0 && this._trigger("slide", i), u !== i && this._trigger("change", {
                            oldValue: u,
                            newValue: i
                        }), this._setDataVal(i), this
                    },
                    destroy: function() {
                        this._removeSliderEventHandlers();
                        this.sliderElem.parentNode.removeChild(this.sliderElem);
                        this.element.style.display = "";
                        this._cleanUpEventCallbacksMap();
                        this.element.removeAttribute("data");
                        n && (this._unbindJQueryEventHandlers(), this.$element.removeData("slider"))
                    },
                    disable: function() {
                        return this.options.enabled = !1, this.handle1.removeAttribute("tabindex"), this.handle2.removeAttribute("tabindex"), this._addClass(this.sliderElem, "slider-disabled"), this._trigger("slideDisabled"), this
                    },
                    enable: function() {
                        return this.options.enabled = !0, this.handle1.setAttribute("tabindex", 0), this.handle2.setAttribute("tabindex", 0), this._removeClass(this.sliderElem, "slider-disabled"), this._trigger("slideEnabled"), this
                    },
                    toggle: function() {
                        return this.options.enabled ? this.disable() : this.enable(), this
                    },
                    isEnabled: function() {
                        return this.options.enabled
                    },
                    on: function(t, i) {
                        if (n) {
                            this.$element.on(t, i);
                            this.$sliderElem.on(t, i)
                        } else this._bindNonQueryEventHandler(t, i);
                        return this
                    },
                    getAttribute: function(n) {
                        return n ? this.options[n] : this.options
                    },
                    setAttribute: function(n, t) {
                        return this.options[n] = t, this
                    },
                    refresh: function() {
                        return this._removeSliderEventHandlers(), r.call(this, this.element, this.options), n && n.data(this.element, "slider", this), this
                    },
                    _removeSliderEventHandlers: function() {
                        this.handle1.removeEventListener("keydown", this.handle1Keydown, !1);
                        this.handle1.removeEventListener("focus", this.showTooltip, !1);
                        this.handle1.removeEventListener("blur", this.hideTooltip, !1);
                        this.handle2.removeEventListener("keydown", this.handle2Keydown, !1);
                        this.handle2.removeEventListener("focus", this.handle2Keydown, !1);
                        this.handle2.removeEventListener("blur", this.handle2Keydown, !1);
                        this.sliderElem.removeEventListener("mouseenter", this.showTooltip, !1);
                        this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, !1);
                        this.sliderElem.removeEventListener("touchstart", this.mousedown, !1);
                        this.sliderElem.removeEventListener("mousedown", this.mousedown, !1)
                    },
                    _bindNonQueryEventHandler: function(n, t) {
                        this.eventToCallbackMap[n] === undefined && (this.eventToCallbackMap[n] = []);
                        this.eventToCallbackMap[n].push(t)
                    },
                    _cleanUpEventCallbacksMap: function() {
                        for (var t = Object.keys(this.eventToCallbackMap), i, n = 0; n < t.length; n++) i = t[n], this.eventToCallbackMap[i] = null
                    },
                    _showTooltip: function() {
                        this.options.tooltip_split === !1 ? this._addClass(this.tooltip, "in") : (this._addClass(this.tooltip_min, "in"), this._addClass(this.tooltip_max, "in"));
                        this.over = !0
                    },
                    _hideTooltip: function() {
                        this.inDrag === !1 && this.alwaysShowTooltip !== !0 && (this._removeClass(this.tooltip, "in"), this._removeClass(this.tooltip_min, "in"), this._removeClass(this.tooltip_max, "in"));
                        this.over = !1
                    },
                    _layout: function() {
                        var n, i, r, t, u, f;
                        n = this.options.reversed ? [100 - this.percentage[0], this.percentage[1]] : [this.percentage[0], this.percentage[1]];
                        this.handle1.style[this.stylePos] = n[0] + "%";
                        this.handle2.style[this.stylePos] = n[1] + "%";
                        this.options.orientation === "vertical" ? (this.trackSelection.style.top = Math.min(n[0], n[1]) + "%", this.trackSelection.style.height = Math.abs(n[0] - n[1]) + "%") : (this.trackSelection.style.left = Math.min(n[0], n[1]) + "%", this.trackSelection.style.width = Math.abs(n[0] - n[1]) + "%", i = this.tooltip_min.getBoundingClientRect(), r = this.tooltip_max.getBoundingClientRect(), i.right > r.left ? (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = "18px") : (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = "-30px"));
                        this.options.range ? (t = this.options.formatter(this.options.value), this._setText(this.tooltipInner, t), this.tooltip.style[this.stylePos] = (n[1] + n[0]) / 2 + "%", this.options.orientation === "vertical" ? this._css(this.tooltip, "margin-top", -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-left", -this.tooltip.offsetWidth / 2 + "px"), this.options.orientation === "vertical" ? this._css(this.tooltip, "margin-top", -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-left", -this.tooltip.offsetWidth / 2 + "px"), u = this.options.formatter(this.options.value[0]), this._setText(this.tooltipInner_min, u), f = this.options.formatter(this.options.value[1]), this._setText(this.tooltipInner_max, f), this.tooltip_min.style[this.stylePos] = n[0] + "%", this.options.orientation === "vertical" ? this._css(this.tooltip_min, "margin-top", -this.tooltip_min.offsetHeight / 2 + "px") : this._css(this.tooltip_min, "margin-left", -this.tooltip_min.offsetWidth / 2 + "px"), this.tooltip_max.style[this.stylePos] = n[1] + "%", this.options.orientation === "vertical" ? this._css(this.tooltip_max, "margin-top", -this.tooltip_max.offsetHeight / 2 + "px") : this._css(this.tooltip_max, "margin-left", -this.tooltip_max.offsetWidth / 2 + "px")) : (t = this.options.formatter(this.options.value[0]), this._setText(this.tooltipInner, t), this.tooltip.style[this.stylePos] = n[0] + "%", this.options.orientation === "vertical" ? this._css(this.tooltip, "margin-top", -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-left", -this.tooltip.offsetWidth / 2 + "px"))
                    },
                    _removeProperty: function(n, t) {
                        n.style.removeProperty ? n.style.removeProperty(t) : n.style.removeAttribute(t)
                    },
                    _mousedown: function(n) {
                        var t, r, u, i;
                        return this.options.enabled ? (this._triggerFocusOnHandle(), this.offset = this._offset(this.sliderElem), this.size = this.sliderElem[this.sizePos], t = this._getPercentage(n), this.options.range ? (r = Math.abs(this.percentage[0] - t), u = Math.abs(this.percentage[1] - t), this.dragged = r < u ? 0 : 1) : this.dragged = 0, this.percentage[this.dragged] = this.options.reversed ? 100 - t : t, this._layout(), this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), this.mousemove && document.removeEventListener("mousemove", this.mousemove, !1), this.mouseup && document.removeEventListener("mouseup", this.mouseup, !1), this.mousemove = this._mousemove.bind(this), this.mouseup = this._mouseup.bind(this), this.touchCapable && (document.addEventListener("touchmove", this.mousemove, !1), document.addEventListener("touchend", this.mouseup, !1)), document.addEventListener("mousemove", this.mousemove, !1), document.addEventListener("mouseup", this.mouseup, !1), this.inDrag = !0, i = this._calculateValue(), this._trigger("slideStart", i), this._setDataVal(i), this.setValue(i), this._pauseEvent(n), !0) : !1
                    },
                    _triggerFocusOnHandle: function(n) {
                        n === 0 && this.handle1.focus();
                        n === 1 && this.handle2.focus()
                    },
                    _keydown: function(n, t) {
                        var r, f, e, o, i, u;
                        if (!this.options.enabled) return !1;
                        switch (t.keyCode) {
                            case 37:
                            case 40:
                                r = -1;
                                break;
                            case 39:
                            case 38:
                                r = 1
                        }
                        if (r) return this.options.natural_arrow_keys && (f = this.options.orientation === "vertical" && !this.options.reversed, e = this.options.orientation === "horizontal" && this.options.reversed, (f || e) && (r = r * -1)), o = r * this.percentage[2], i = this.percentage[n] + o, i > 100 ? i = 100 : i < 0 && (i = 0), this.dragged = n, this._adjustPercentageForRangeSliders(i), this.percentage[this.dragged] = i, this._layout(), u = this._calculateValue(), this._trigger("slideStart", u), this._setDataVal(u), this.setValue(u, !0), this._trigger("slideStop", u), this._setDataVal(u), this._pauseEvent(t), !1
                    },
                    _pauseEvent: function(n) {
                        n.stopPropagation && n.stopPropagation();
                        n.preventDefault && n.preventDefault();
                        n.cancelBubble = !0;
                        n.returnValue = !1
                    },
                    _mousemove: function(n) {
                        var t, i;
                        return this.options.enabled ? (t = this._getPercentage(n), this._adjustPercentageForRangeSliders(t), this.percentage[this.dragged] = this.options.reversed ? 100 - t : t, this._layout(), i = this._calculateValue(), this.setValue(i, !0), !1) : !1
                    },
                    _adjustPercentageForRangeSliders: function(n) {
                        this.options.range && (this.dragged === 0 && this.percentage[1] < n ? (this.percentage[0] = this.percentage[1], this.dragged = 1) : this.dragged === 1 && this.percentage[0] > n && (this.percentage[1] = this.percentage[0], this.dragged = 0))
                    },
                    _mouseup: function() {
                        if (!this.options.enabled) return !1;
                        this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1));
                        document.removeEventListener("mousemove", this.mousemove, !1);
                        document.removeEventListener("mouseup", this.mouseup, !1);
                        this.inDrag = !1;
                        this.over === !1 && this._hideTooltip();
                        var n = this._calculateValue();
                        return this._layout(), this._trigger("slideStop", n), this._setDataVal(n), !1
                    },
                    _calculateValue: function() {
                        var n;
                        return this.options.range ? (n = [this.options.min, this.options.max], this.percentage[0] !== 0 && (n[0] = Math.max(this.options.min, this.options.min + Math.round(this.diff * this.percentage[0] / 100 / this.options.step) * this.options.step), n[0] = this._applyPrecision(n[0])), this.percentage[1] !== 100 && (n[1] = Math.min(this.options.max, this.options.min + Math.round(this.diff * this.percentage[1] / 100 / this.options.step) * this.options.step), n[1] = this._applyPrecision(n[1]))) : (n = this.options.min + Math.round(this.diff * this.percentage[0] / 100 / this.options.step) * this.options.step, n < this.options.min ? n = this.options.min : n > this.options.max && (n = this.options.max), n = parseFloat(n), n = this._applyPrecision(n)), n
                    },
                    _applyPrecision: function(n) {
                        var t = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);
                        return this._applyToFixedAndParseFloat(n, t)
                    },
                    _getNumDigitsAfterDecimalPlace: function(n) {
                        var t = ("" + n).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                        return t ? Math.max(0, (t[1] ? t[1].length : 0) - (t[2] ? +t[2] : 0)) : 0
                    },
                    _applyToFixedAndParseFloat: function(n, t) {
                        var i = n.toFixed(t);
                        return parseFloat(i)
                    },
                    _getPercentage: function(n) {
                        this.touchCapable && (n.type === "touchstart" || n.type === "touchmove") && (n = n.touches[0]);
                        var t = (n[this.mousePos] - this.offset[this.stylePos]) * 100 / this.size;
                        return t = Math.round(t / this.percentage[2]) * this.percentage[2], Math.max(0, Math.min(100, t))
                    },
                    _validateInputValue: function(n) {
                        if (typeof n == "number") return n;
                        if (n instanceof Array) return this._validateArray(n), n;
                        throw new Error(i.formatInvalidInputErrorMsg(n));
                    },
                    _validateArray: function(n) {
                        for (var r, t = 0; t < n.length; t++)
                            if (r = n[t], typeof r != "number") throw new Error(i.formatInvalidInputErrorMsg(r));
                    },
                    _setDataVal: function(n) {
                        var t = "value: '" + n + "'";
                        this.element.setAttribute("data", t);
                        this.element.setAttribute("value", n)
                    },
                    _trigger: function(t, i) {
                        var r, u, f;
                        if (i = i || i === 0 ? i : undefined, r = this.eventToCallbackMap[t], r && r.length)
                            for (u = 0; u < r.length; u++) f = r[u], f(i);
                        n && this._triggerJQueryEvent(t, i)
                    },
                    _triggerJQueryEvent: function(n, t) {
                        var i = {
                            type: n,
                            value: t
                        };
                        this.$element.trigger(i);
                        this.$sliderElem.trigger(i)
                    },
                    _unbindJQueryEventHandlers: function() {
                        this.$element.off();
                        this.$sliderElem.off()
                    },
                    _setText: function(n, t) {
                        typeof n.innerText != "undefined" ? n.innerText = t : typeof n.textContent != "undefined" && (n.textContent = t)
                    },
                    _removeClass: function(n, t) {
                        for (var u = t.split(" "), r = n.className, f, e, i = 0; i < u.length; i++) f = u[i], e = new RegExp("(?:\\s|^)" + f + "(?:\\s|$)"), r = r.replace(e, " ");
                        n.className = r.trim()
                    },
                    _addClass: function(n, t) {
                        for (var u = t.split(" "), r = n.className, i = 0; i < u.length; i++) {
                            var f = u[i],
                                e = new RegExp("(?:\\s|^)" + f + "(?:\\s|$)"),
                                o = e.test(r);
                            o || (r += " " + f)
                        }
                        n.className = r.trim()
                    },
                    _offset: function(n) {
                        var t = 0,
                            i = 0;
                        if (n.offsetParent)
                            do t += n.offsetLeft, i += n.offsetTop; while (n = n.offsetParent);
                        return {
                            left: t,
                            top: i
                        }
                    },
                    _css: function(t, i, r) {
                        if (n) n.style(t, i, r);
                        else {
                            var u = i.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(n, t) {
                                return t.toUpperCase()
                            });
                            t.style[u] = r
                        }
                    }
                };
                n && (u = n.fn.slider ? "bootstrapSlider" : "slider", n.bridget(u, t))
            }(n), t
    });
searchCommon = {
    init: function() {
        this.searchCommonInit()
    },
    searchCommonInit: function() {
        searchCommon.flightOneTwoWayClick();
        searchCommon.flightSearchClickValidate();
        searchCommon.flightDatePicker();
        searchCommon.flightPassengerButtonClick();
        searchCommon.flightClassComboChange()
    },
    flightDatePicker: function() {
        $("input.datepick").datepicker({
            minDate: 0,
            numberOfMonths: 2,
            beforeShowDay: function(n) {
                var t = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $(this).val());
                return [!0, t && n.getTime() === t.getTime() ? "dp-highlight" : ""]
            },
            onSelect: function(n, t, i) {
                i || (i = $(this));
                var r = i.datepicker("getDate");
                r = $.datepicker.formatDate("yy-mm-dd", new Date(r));
                $(i.attr("next")).val(r);
                $(".todate").datepicker("option", "minDate", $(".fromdate").val());
                i.hasClass("fromdate") && !$(".todate").hasClass("transparant-50") && setTimeout(function() {
                    $(".todate").datepicker("show")
                }, 100)
            }
        });
        $("input.datepick").each(function() {
            var n = $($(this).attr("next")),
                t;
            n.length && n.val() !== "" && (t = new Date(n.val()), $(this).datepicker(), $(this).datepicker("setDate", t))
        });
        $(".todate").datepicker("option", "minDate", $(".fromdate").val())
    },
    flightSearchClickValidate: function() {
        $("#btnSearch").click(function(n) {
            var t = base.dataValidation("#flight-search-form", n);
            t || $("#flight-search-form").submit()
        })
    },
    flightPassengerButtonClick: function() {
        $(".div-search-spinner button").click(function(n) {
            searchCommon.flightPassengerButtonClickEvent(this, n)
        })
    },
    flightPassengerButtonClickEvent: function(n, t) {
        var f = $(".passenger-data-validation"),
            i = {
                adult: 0,
                child: 0,
                infant: 0,
                student: 0,
                senior: 0
            },
            e = $(n).parents(".search-spinner").find("input"),
            r = $(n).parents(".search-spinner").attr("passenger-type"),
            c;
        i[r] = parseInt(e.val());
        $(".div-search-spinner input").not(e).each(function() {
            i[$(this).parents(".search-spinner").attr("passenger-type")] = parseInt($(this).val())
        });
        var s = i.adult + i.senior,
            l = s + i.student,
            a = l + i.child,
            h = i.infant,
            u = parseInt(e.val()),
            o = u;
        if ($(n).attr("data-dir") === "dwn") {
            if (u === 0) return;
            if ((r === "adult" || r === "senior") && h === s) {
                base.showMasterDialog(t, f.attr("infant-validation"));
                return
            }
            if (l === 1 && r !== "infant" && r !== "child") {
                base.showMasterDialog(t, f.attr("min-adult-validation"));
                return
            }
            o = u - 1
        } else {
            if (r === "infant" && h === s) {
                base.showMasterDialog(t, f.attr("infant-validation"));
                return
            }
            if (a === 7 && r !== "infant") {
                base.showMasterDialog(t, f.attr("max-adult-validation"));
                return
            }
            o = u + 1
        }
        e.val(o);
        c = a + h - u + o;
        $("#reSearchPassenger").val(c + " " + $("#reSearchPassenger").attr("passengertext") + " - " + $("#reSearchPassenger").attr("passengerclass"));
        $("#reSearchPassenger").attr("passengercount", c)
    },
    flightClassComboChange: function() {
        $(".search-options #select-list").change(function() {
            var n = $(".search-options #select-list > option:selected"),
                t = n.attr("shortname"),
                i = $("#reSearchPassenger").attr("passengercount");
            $("#reSearchPassenger").attr("passengerclass", t);
            $("#reSearchPassenger").val(i + " " + $("#reSearchPassenger").attr("passengertext") + " - " + t);
            $("#flight-class").val(n.val())
        })
    },
    flightOneTwoWayClick: function() {
        $("#lb-one-way").click(function() {
            $(".todate").addClass("transparant-50");
            $($(".todate").attr("next")).addClass("no-validation")
        });
        $("#lb-way").click(function() {
            $(".todate").removeClass("transparant-50");
            $($(".todate").attr("next")).removeClass("no-validation")
        });
        $(".todate").click(function() {
            $(".todate").hasClass("transparant-50") && ($("#lb-way").trigger("click"), $("#rd-one-way-research").length && $("#rd-one-way-research").trigger("click"))
        });
        $("#rd-one-way-research").change(function() {
            $(this).is(":checked") ? ($(".todate").addClass("transparant-50"), $($(".todate").attr("next")).addClass("no-validation")) : ($(".todate").removeClass("transparant-50"), $($(".todate").attr("next")).removeClass("no-validation"))
        });
        $("#rd-one-way-research").length && $("#rd-one-way-research").is(":checked") && ($(".todate").addClass("transparant-50"), $($(".todate").attr("next")).addClass("no-validation"))
    }
};
$(document).ready(function() {
    searchCommon.init()
});
model = {
    searchData: null,
    passCountWithoutInfant: null,
    response: null,
    filteredResponse: null,
    currency: null,
    dateFormat: null,
    resultCounter: 0,
    sponsor: null,
    imageUrl: {},
    scrollResults: {
        items: []
    },
    filter: {
        departure: {
            takeOffTime: null,
            landingTime: null,
            price: [null, null],
            priceSlider: null,
            minDuration: null,
            maxDuration: null,
            durationSlider: null
        },
        ret: {
            takeOffTime: null,
            landingTime: null,
            price: [null, null],
            priceSlider: null,
            minDuration: null,
            maxDuration: null,
            durationSlider: null
        },
        transfers: [],
        refundables: [],
        airports: [],
        airlines: [],
        stopAirports: []
    },
    newResult: function() {
        var n = {};
        return n.Type = model.response.Type, n.Filter = model.response.Filter, n.Template = model.response.Template, n.Combs = [], n
    },
    setSponsorForInternationalRT: function() {
        if (model.sponsor != null) {
            var n = model.response.Combs.filter(function(n) {
                return n.Dep[0].SL != -100 || n.Ret[0].SL != -100
            });
            n.unshift(model.sponsor);
            model.response.Combs = n;
            model.response[model.sponsor.Dep[0].Id + model.sponsor.Ret[0].Id] = model.sponsor
        }
    },
    setSponsorForOneWay: function() {
        if (model.sponsor != null) {
            var n = model.response.Combs.filter(function(n) {
                return n.Dep[0].SL != -100
            });
            n.unshift(model.sponsor);
            model.response.Combs = n;
            model.response[model.sponsor.Dep[0].Id] = model.sponsor
        }
    },
    setSponsorForDomesticRT: function() {
        var n;
        model.sponsor != null && model.sponsor.dep != null && (n = model.response.Combs[0].Dep.filter(function(n) {
            return n.SL != -100
        }), n.unshift(model.sponsor.dep), model.response.Combs[0].Dep = n);
        model.sponsor != null && model.sponsor.ret != null && (n = model.response.Combs[0].Ret.filter(function(n) {
            return n.SL != -100
        }), n.unshift(model.sponsor.ret), model.response.Combs[0].Ret = n)
    },
    newComb: function(n, t, i, r) {
        n.separate || (n.separate = r);
        t == null || t.separate || (t.separate = r);
        var u = {
            Dep: [n],
            Ret: [t],
            CombSC: [],
            Price: i
        };
        return t == null && (u.Ret = null), u
    },
    SetResponse: function(n) {
        model.filteredResponse = n;
        model.response = n
    },
    getTimeFormatted: function(n) {
        var i = model.minutesToTime(n),
            u = $("#filter-duration").attr("hour"),
            f = $("#filter-duration").attr("minute"),
            t = i.split(":")[0].replace(/^0+/, ""),
            n, r;
        return t == "" && (t = "0"), n = i.split(":")[1].replace(/^0+/, ""), n == "" && (n = "00"), n.length == 1 && (n = "0" + n), r = t + u.substring(0, 1), r + " " + n + f.substring(0, 1)
    },
    minutesToTime: function(n) {
        var t = n % 60,
            i = Math.floor(n / 60);
        return i = i <= 9 ? "0" + i : "" + i, t = t <= 9 ? "0" + t : "" + t, i + ":" + t
    },
    TimeToMinutes: function(n) {
        var t = n.split(":"),
            r, i;
        if (t.length == 0) return 0;
        if (t.length == 1) return parseInt(t[0]);
        if (t.length == 2) return r = parseInt(t[0]), i = parseInt(t[1]), r * 60 + i;
        if (t.length == 3) {
            var u = parseInt(t[0]),
                r = parseInt(t[1]),
                i = parseInt(t[2]);
            return (u * 24 + r) * 60 + i
        }
        return 0
    },
    SetTotalPrice: function(n) {
        var r = Math.round(n.F * 100) / 100,
            i = Math.abs(Math.round(n.D * 100) / 100),
            t = r - i;
        t = Math.abs(Math.round(t * 100) / 100);
        n.D = i;
        n.totalAmount = t
    },
    getAirlineFromCode: function(n) {
        for (var i, t = 0; t < model.response.Filter.AirLines.length; t++)
            if (i = model.response.Filter.AirLines[t], i.Code == n) return i
    },
    imageExists: function(n, t) {
        var i = n.attr("src"),
            r;
        model.imageUrl.hasOwnProperty(i) && model.imageUrl[i] == !1 && n.attr("src", i.replace(t, "default"));
        r = !1;
        $.ajax({
            url: i,
            type: "HEAD",
            async: !1,
            error: function() {
                model.imageUrl[i] = !1
            }
        });
        model.imageUrl[i] == !1 && n.attr("src", i.replace(t, "default"))
    }
};
Time.FromMinutes = function(n) {
    var t = Math.floor(n / 60);
    return n = n % 60, new Time(t, n)
};
Time.ParseString = function() {
    var n = parseInt(timeStr.substr(0, 2)),
        t = parseInt(timeStr.substr(2, 3));
    return new Time(n, t)
};
Time.prototype.toString = function() {
    return this.padZeros(this.Hours.toString(), 2) + ":" + this.padZeros(this.Minutes.toString(), 2)
};
Time.ToShortString = function() {
    return tmp = $.datepicker.formatDate("D ", this.date), tmp + this.padZeros(this.Hours.toString(), 2) + ":" + this.padZeros(this.Minutes.toString(), 2)
};
Time.prototype.padZeros = function(n, t) {
    return n.length < t ? this.padZeros("0" + n, t) : n
};
Time.prototype.compare = function(n) {
    return this.TotalMinutes > n.TotalMinutes ? 1 : this.TotalMinutes == n.TotalMinutes ? 0 : -1
};
Time.prototype.substract = function(n) {
    var t = this.Hours - n.Hours,
        i;
    return t < 0 && (t += 24), i = this.Minutes - n.Minutes, i < 0 && (i = 60 + i, t = t - 1), new Time(t, i)
};
FilterTime.prototype.getTimes = function() {
    tmpOne = $.datepicker.formatDate("D ", this.MinDate);
    tmpTwo = $.datepicker.formatDate("D ", this.MaxDate);
    tmpOne == tmpTwo && (tmpTwo = "");
    return [tmpOne + this.toTimeString(this.MinDate), tmpTwo + this.toTimeString(this.MaxDate)]
};
FilterTime.prototype.addMinMax = function(n, t) {
    var i = this.InitialMinDate.getTime();
    this.MinSlider != n && (this.MinSlider = n, this.MinDateAsTime = i + n, this.MinDate = new Date(this.MinDateAsTime));
    this.MaxSlider != t && (this.MaxSlider = t, this.MaxDateAsTime = i + t, this.MaxDate = new Date(this.MaxDateAsTime))
};
FilterTime.prototype.toTimeString = function(n) {
    return this.padZeros(n.getHours().toString(), 2) + ":" + this.padZeros(n.getMinutes().toString(), 2)
};
FilterTime.prototype.padZeros = function(n, t) {
    return n.length < t ? this.padZeros("0" + n, t) : n
};
FilterTime.prototype.getDateFromString = function(n) {
    var r = n.split(" "),
        t = r[0].split("-"),
        u = r[1].split(":"),
        i = $.datepicker.parseDate("dd/mm/yy", t[2] + "/" + t[1] + "/" + t[0]),
        f = i.getTime(),
        i = new Date(f + 36e5 * Number(u[0]) + 6e4 * Number(u[1]));
    return i
};
FlightDate.prototype.getDateFromString = FilterTime.prototype.getDateFromString;
var myScroll = {
        header: null,
        headerTop: null,
        headerMarginTop: null,
        headerMarginBottom: null,
        headerHeight: null,
        mainNavHeight: $(".navbar-main").height(),
        navbarmain: $(".navbar-main"),
        searchList: $(".div-search-list"),
        getScrollTop: function() {
            return myScroll.searchList.offset().top - myScroll.mainNavHeight
        },
        scrollToUp: function() {
            var n = 0,
                t = myScroll.getScrollTop();
            $(window).scrollTop() >= t && (n = t);
            n > 0 && $("html, body").animate({
                scrollTop: n
            }, 200)
        },
        SetValues: function(n) {
            myScroll.header = n;
            myScroll.headerMarginTop = parseInt(n.css("margin-top").replace("px", ""));
            myScroll.headerMarginBottom = parseInt(n.css("margin-bottom").replace("px", ""));
            myScroll.headerTop = n.offset().top - myScroll.mainNavHeight;
            myScroll.headerHeight = n.outerHeight(!1)
        },
        ScrollHeader: function(n, t, i, r) {
            var f, u, e, o;
            i !== null && i !== undefined && i.length && (f = i.offset().top + i.outerHeight() - 120, u = $(n).scrollTop(), u > f && !i.hasClass("domestic-list-selected") && (u = 0), e = myScroll.mainNavHeight - myScroll.headerMarginTop, o = t.outerWidth(), myScroll.ScrollHelper(t, "item-header-fixed", e, o, u, r, !1, null, null))
        },
        ScrollHelper: function(n, t, i, r, u, f, e, o, s) {
            var h, c;
            $(window).width() > f && (h = myScroll.headerTop, myScroll.header.hasClass("item-header-fixed") || (h = myScroll.header.offset().top - myScroll.mainNavHeight), u >= h && !e && (n.hasClass(t) && n.position().top == i || (myScroll.headerTop = h, n.removeAttr("style"), n.css({
                top: i,
                width: r
            }), n.addClass(t), t == "item-header-fixed" && (myScroll.navbarmain.removeClass("navbar-main-bottom"), c = n.next(), c.hasClass("domestic-list-selected-fixed") || n.next().css("margin-top", myScroll.headerMarginTop + myScroll.headerMarginBottom + myScroll.headerHeight + "px")))), (u < myScroll.headerTop || e) && (n.removeClass(t), n.removeAttr("style"), n.next().removeAttr("style"), myScroll.navbarmain.addClass("navbar-main-bottom"), o != null && (o.removeClass(s), o.removeAttr("style"))))
        },
        scrollFilter: function(n) {
            var i = $(".div-search-nav"),
                r = parseInt(i.css("margin-top").replace("px", "")),
                e = parseInt(i.css("margin-bottom").replace("px", "")),
                u = i.offset().top,
                o = u - r - 10,
                s = $(".div-footer").outerHeight(!1),
                f = $(".div-search-nav"),
                t = $("#lastScrollTop").val();
            n ? (myScroll.scrollFilterHelper(t, f, i, r, u), t = $(this).scrollTop(), $("#lastScrollTop").val(t)) : $(window).scroll(function() {
                myScroll.scrollFilterHelper(t, f, i, r, u);
                t = $(this).scrollTop();
                $("#lastScrollTop").val(t)
            })
        },
        scrollFilterHelper: function(n, t, i, r, u) {
            var f = $(window).scrollTop(),
                o = $(window).height(),
                e = i.outerHeight(!1),
                s = $(".div-footer").offset().top,
                h = $(".div-search-list-items").outerHeight(!1);
            if (t.removeClass("filter-top-fixed"), t.removeClass("filter-bottom-fixed"), f <= myScroll.getScrollTop() && (t.removeClass("filter-sticked-bottom"), t.removeClass("filter-sticked-top"), t.removeClass("scroll-absolute"), t.css({
                    position: "relative",
                    top: "0px"
                })), e < o - 150 || e >= h) {
                t.removeClass("filter-sticked-bottom");
                t.removeClass("scroll-absolute");
                t.removeClass("filter-sticked-top");
                t.css({
                    position: "relative",
                    top: "0px"
                });
                return
            }
            if (f > s - o) {
                myScroll.stickFilterAboveFooter(t, s - f - e - r - 10);
                return
            }
            f < n ? myScroll.filterUpScrollController(t, f, o, e) : myScroll.filterDownScrollController(t, f, o, e, r, u)
        },
        filterUpScrollController: function(n, t, i, r) {
            if (!n.hasClass("scroll-absolute") && n.hasClass("filter-sticked-bottom") && (n.removeClass("filter-sticked-bottom"), n.addClass("scroll-absolute"), n.css({
                    top: t + i - r - 40,
                    "padding-right": "20px"
                })), n.hasClass("scroll-absolute") && n.offset().top > t) {
                var u = $(".div-search-again").height();
                n.removeClass("scroll-absolute");
                myScroll.scrollFilterAddFixed(n, "top", 15);
                n.addClass("filter-sticked-top")
            }
            n.hasClass("filter-sticked-top") && t < myScroll.getScrollTop() && (n.removeClass("filter-sticked-top"), n.css({
                position: "relative",
                top: "0px"
            }))
        },
        filterDownScrollController: function(n, t, i, r, u, f) {
            n.hasClass("filter-sticked-top") && (n.removeClass("filter-sticked-top"), n.addClass("scroll-absolute"), n.css({
                top: t,
                "padding-right": "20px"
            }));
            var e = Number(n.css("top").replace("px", ""));
            n.hasClass("scroll-absolute") || n.hasClass("filter-sticked-bottom") ? e + r - i - 15 < t && !n.hasClass("filter-sticked-bottom") && (myScroll.scrollFilterAddFixed(n, "top", 0 - r + i - 10), n.removeClass("scroll-absolute"), n.addClass("filter-sticked-bottom")) : t > f + r + u - i - 15 && (myScroll.scrollFilterAddFixed(n, "top", 0 - r + i - 10), n.addClass("filter-sticked-bottom"))
        },
        stickFilterAboveFooter: function(n, t) {
            n.removeClass("scroll-absolute");
            myScroll.scrollFilterAddFixed(n, "top", t)
        },
        scrollFilterAddFixed: function(n, t, i) {
            t == "bottom" ? (n.css({
                bottom: i,
                position: "fixed",
                "padding-right": "20px"
            }), n.addClass("filter-bottom-fixed")) : (n.css({
                top: i,
                position: "fixed",
                "padding-right": "20px"
            }), n.addClass("filter-top-fixed"))
        },
        scrollFilterEx: function() {
            var n = $(".div-search-nav"),
                i = parseInt(n.css("margin-top").replace("px", "")),
                f = parseInt(n.css("margin-bottom").replace("px", "")),
                r = n.offset().top,
                e = r - i - 10,
                o = $(".div-footer").outerHeight(!1),
                u = $(".div-search-nav"),
                t = 0;
            $(window).scroll(function() {
                myScroll.scrollFilterHelper(t, u, n, i, r);
                t = $(this).scrollTop()
            });
            $(".div-search-nav .nav-item .title").click(function() {
                u.hasClass("filter-top-fixed") ? t += 1 : t -= 1;
                setTimeout(function() {
                    myScroll.scrollFilterHelper(t, u, n, i, r)
                }, 200)
            })
        },
        scrollFilterHelperEx: function(n, t, i, r, u) {
            t.removeAttr("style");
            var f = $(window).scrollTop(),
                e = $(window).height(),
                o = i.outerHeight(!1),
                s = $(".div-footer").offset().top,
                h = $(".div-search-list-items").outerHeight(!1);
            t.removeClass("filter-top-fixed");
            t.removeClass("filter-bottom-fixed");
            u < f + r + 10 && (o < e - 150 && f < s - e ? myScroll.scrollFilterAddFixed(t, "top", myScroll.mainNavHeight - r) : h > o && (f > s - e ? myScroll.scrollFilterAddFixed(t, "top", s - f - o - r - 10) : f > u + o + r - e ? f < n ? myScroll.scrollFilterAddFixed(t, "top", myScroll.mainNavHeight - r) : myScroll.scrollFilterAddFixed(t, "bottom", 10) : f < n && myScroll.scrollFilterAddFixed(t, "top", myScroll.mainNavHeight - r)))
        },
        scrollFilterAddFixedEx: function(n, t, i) {
            t == "bottom" ? (n.css({
                bottom: i,
                position: "fixed",
                "padding-right": "20px"
            }), n.addClass("filter-bottom-fixed")) : (n.css({
                top: i,
                position: "fixed",
                "padding-right": "20px"
            }), n.addClass("filter-top-fixed"))
        }
    },
    render = {
        getDetailsUrl: "/Flight/GetDetails",
        flightId: function(n, t, i) {
            var r = t.Id;
            i != null && (r = r + "-" + i.Id);
            n.attr("id", r)
        },
        seat: function(n, t, i) {
            var u = t.S,
                r, f;
            i != null && (u = Math.min(i.S, u));
            r = n.find(".last-seat");
            model.passCountWithoutInfant <= 4 ? u <= 4 ? (u < model.passCountWithoutInfant && (u = model.passCountWithoutInfant), f = r.attr("turna-title").replace("1", u), r.find("span").html(f), r.attr("turna-title", f), u > 2 && r.find("span").css("color", "#ffb7b9"), r.show()) : r.remove() : r.remove()
        },
        point: function(n, t) {
            var r = t.find(".win-point"),
                e = Math.floor(n.LPC * 100) / 100,
                u, i;
            if (n.LP > 0 ? (r.find("span").html("+" + n.LP), u = r.attr("turna-title").replace("{0}", n.LP), u = u.replace("{1}", e).replace("{2}", model.currency), r.attr("turna-title", u)) : r.remove(), i = t.find(".extra-point"), i.length != 0)
                if (n.SLP > 0 && n.LP - n.SLP > 0) {
                    var o = i.attr("turna-title"),
                        s = i.attr("txt"),
                        f = render.getPointDivision(n.LP, n.SLP);
                    f > 1 ? i.find(".slp").html("x" + f) : i.find(".slp").html("+" + n.SLP);
                    i.attr("turna-title", o.replace("{0}", n.LP - n.SLP).replace("{1}", n.LP))
                } else i.remove()
        },
        getPointDivision: function(n, t) {
            if (n % (n - t) == 0) {
                var i = Math.floor(n / (n - t));
                if (i > 0 && i < 5) return i
            }
            return 0
        },
        airlineName: function(n, t, i) {
            var r = render.airlineHelper(n, t, ""),
                u, f;
            i != null && (u = render.airlineHelper(n, i, "-ret"), r == u ? (f = n.find(".airline-img-ret"), f.length == 1 && f.remove()) : r += " / " + u);
            n.find(".airline-name").html(r)
        },
        airlineHelper: function(n, t, i) {
            for (var s = t.MA.split(";"), r = n.find(".airline-img" + i), f, e, o, u = 0; u < s.length; u++) f = s[u], e = r.clone(), e.attr("src", r.attr("src").replace("default", f)), o = model.getAirlineFromCode(f), e.removeAttr("turna-title"), e.insertBefore(r);
            return r.remove(), s.length == 1 ? (o = model.getAirlineFromCode(f), o.Name) : n.find(".airline-name").html()
        },
        transfer: function(n, t) {
            var o = $("#airport-slug").val().capitalize(),
                i = t.find(".flight-transfer"),
                u, f, r, e, s;
            if (n.TRN == 0) i.html(i.attr("direct")), i.removeAttr("turna-title");
            else {
                for (n.TRN > 1 && i.html(n.TRN + " " + i.html()), u = [], f = n.TRF.split(";"), r = 0; r < f.length; r++) u.push(render.helper.getAirportsFromCode(f[r])[0]);
                e = $(u).map(function() {
                    return this.City + " - " + this.Name + " " + o
                }).get();
                s = i.attr("turna-title");
                i.attr("turna-title", e.join("\n"));
                i.attr("TRF", n.TRF);
                i.attr("TRN", n.TRN)
            }
            i.addClass("t" + n.TRN)
        },
        date: function(n, t, i) {
            var u, s;
            n.dates = new FlightDate(n.Ddate, n.Adate);
            u = t.find(".departure-date");
            u.html(render.helper.getFlightTimeFromDate(n.Ddate));
            u.attr("date", n.Ddate);
            var r = t.find(".arrival-date"),
                h = n.Ddate.split(" ")[0],
                c = n.Adate.split(" ")[0],
                e = render.helper.getDateDifference(h, c);
            if (e > 0 ? (s = '<span class="date-diff">+' + Math.round(e) + "<\/span>", r.html(render.helper.getFlightTimeFromDate(n.Adate) + s)) : r.html(render.helper.getFlightTimeFromDate(n.Adate)), r.attr("date", n.Adate), i) {
                r.removeAttr("turna-title");
                u.removeAttr("turna-title");
                var f = r.parent(),
                    l = f.attr("departure"),
                    a = f.attr("arrival"),
                    v = render.getDurationText(n, f),
                    o = l + ": " + render.helper.getFlightDateFormated(n.Ddate) + "\n";
                o += a + ": " + render.helper.getFlightDateFormated(n.Adate) + "\n";
                o += f.attr("txt") + ": " + v[1];
                f.attr("turna-title", o)
            } else u.attr("turna-title", render.helper.getFlightDateFormated(n.Ddate)), e == 0 ? r.removeAttr("turna-title") : r.attr("turna-title", render.helper.getFlightDateFormated(n.Adate))
        },
        itemAirport: function(n, t, i) {
            var e = $("#airport-slug").val().capitalize(),
                r = render.helper.getAirportsFromCode(t)[0],
                u = r.Name.substring(0, Math.min(r.Name.length, 9)),
                f;
            r.Name != u && (u = u + "...");
            n.html("<span>(" + r.Code + ") <\/span>" + r.Name);
            n.attr(i, t);
            f = r.Name;
            r.City != r.Name && (f = r.City + " " + r.Name);
            r.Name != u ? n.attr("turna-title", f + " " + e) : n.removeAttr("turna-title")
        },
        duration: function(n, t) {
            var i = t.find(".duration"),
                r = render.getDurationText(n, i);
            i.html(r[0]);
            i.attr("turna-title", i.attr("txt") + ": " + r[1])
        },
        baggageAllowance: function(n, t) {
            if (n.BGG > 0) {
                t.find(".baggage-info span").html(n.BGG);
                var i = t.find(".baggage-info").attr("turna-title");
                t.find(".baggage-info").attr("turna-title", i + n.BGG + " kg");
                t.find(".hand-baggage").remove()
            } else t.find(".baggage-info").remove()
        },
        getDurationText: function(n, t) {
            var i = n.DR;
            return n.duration = model.TimeToMinutes(n.DR), render.helper.getDurationHelper(n.DR, t)
        },
        promotion: function(n, t, i) {
            t.IsP == "t" || i != null && i.IsP == "t" ? n.find(".promotion").show() : n.find(".promotion").hide()
        },
        price: function(n, t) {
            var f, i, r, u;
            if (model.SetTotalPrice(n), t.find(".price .money-val").html(n.totalAmount), f = t.find(".price .currency").attr("src"), t.find(".price .currency").attr("src", f.replace("try", model.currency.toLowerCase())), i = t.find(".discount"), i.length != 0) {
                if (n.D == 0) {
                    i.remove();
                    return
                }
                r = t.find(".extra-point");
                r.length > 0 && r.remove();
                u = Math.round(n.D);
                i.find(".discount-value .value").html("-" + u);
                i.find(".discount-value .currency").html(model.currency.replace("TRY", "TL"));
                i.attr("turna-title", i.attr("turna-title").replace("{0}", u + " " + model.currency.replace("TRY", "TL")))
            }
        },
        click: function(n, t, i, r) {
            var u = n.find(".flight-details-button");
            u.click(function() {
                if (u.hasClass("called")) {
                    var f = n.find(".flight-details");
                    f.hasClass("show-details") ? (u.removeClass("btn-clicked"), n.removeClass("selected-flight"), f.removeClass("show-details").slideUp("fast")) : (f.addClass("show-details").slideDown("fast"), n.addClass("selected-flight"), u.addClass("btn-clicked"))
                } else render.flightDetailsAjaxCall(t, n, i, r), u.addClass("called").addClass("btn-clicked")
            })
        },
        flightDetailsAjaxCall: function(n, t, i, r) {
            firstId = i.Id;
            secondId = "";
            r != null && (secondId = r.Id);
            $.ajax({
                url: render.getDetailsUrl,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: !1,
                data: JSON.stringify({
                    first: firstId,
                    second: secondId
                }),
                async: !0,
                success: function(u) {
                    u.HasError == !0 || n(u, t, i, r)
                }
            })
        },
        renderFlightDetailsSegmentCombination: function(n, t, i, r, u) {
            var s = t.SegmentDetails,
                v = n.find(".detail").clone(),
                y = n.find(".note").clone(),
                l, p, o, f, h, e, w, a, c;
            for (n.find(".detail").remove(), n.find(".note").remove(), l = n.find(".title").attr(u), p = n.find(".title-header").html(l), render.flightDetail.title(i, n, r), o = 0; o < s.length; o++) f = v.clone(), u == "return" && (h = f.find("img").first(), h.attr("src", h.attr("src").replace("icon-plane-small", "icon-plane-small-turn"))), e = s[o], render.flightDetail.airline(e, f, r, u), render.flightDetail.airport(e.O, f, ".title-dep"), render.flightDetail.airport(e.D, f, ".title-arr"), render.flightDetail.date(e.Ddate, f, "dep"), render.flightDetail.date(e.Adate, f, "arr"), render.flightDetail.equipmentType(e, f), (e.DR != "" || e.DR != null) && (w = n.find(".title-duration").attr("txt") + ": ", a = render.getDurationText(e, i.find(".duration")), f.append('<div class="segment-duration">' + a[0] + "<\/div>")), n.append(f), o + 1 < s.length && (c = y.clone(), render.flightDetail.segmentDuration(i, c, e.Adate, s[o + 1].Ddate), n.append(c)), s.length == 1 ? f.addClass("border-radius-5") : o == 0 ? f.addClass("border-radius-top") : o == s.length - 1 && f.addClass("border-radius-bottoom");
            return n
        },
        GetSelectedFlightGroup: function(n) {
            var i = {
                    Id: n.Id,
                    ReferenceId: n.RID,
                    ProviderId: null
                },
                r, u, t;
            for (n.Ret != null && n.Dep[0].PID == n.Ret[0].PID && (i.ProviderId = n.Dep[0].PID), n.Price && n.Price.Paxes && (i.SelectedPaxes = n.Price.Paxes), r = [n.Dep[0]], n.Ret != null && r.push(n.Ret[0]), i.SelectedFlightItems = [], u = 0; u < r.length; u++) t = r[u], i.SelectedFlightItems.push({
                Id: t.Id,
                ProviderId: t.PID,
                ReferenceId: t.RID,
                IsPromo: t.IsP == "t",
                IsPromoId: t.IsPId,
                Origin: t.O,
                Duration: t.DR,
                SelectedPaxes: t.Price ? t.Price.Paxes : null
            });
            return i
        },
        ChooseClick: function(n, t, i) {
            i.click(function() {
                var l, a, r, v, y, h, c, p, w, s, o, b;
                $(".overlay-m").show();
                n == null && (n = t());
                var f = render.GetSelectedFlightGroup(n),
                    i = $('<form action="' + $(".allocateurl").val() + '" method="POST">'),
                    k = $("<input>").attr("type", "hidden").attr("name", "request.SelectedFlightGroup.Id").val(f.Id);
                if (i.append(k), f.ProviderId && (l = $("<input>").attr("type", "hidden").attr("name", "request.SelectedFlightGroup.ProviderId").val(f.ProviderId), i.append(l)), f.ReferenceId && (a = $("<input>").attr("type", "hidden").attr("name", "request.SelectedFlightGroup.ReferenceId").val(f.ReferenceId), i.append(a)), f.SelectedPaxes)
                    for (r = 0; r < f.SelectedPaxes.length; r++) o = f.SelectedPaxes[r], render.ChooseClickHelper(i, "request.SelectedFlightGroup.SelectedPaxes[" + r + "]", o);
                for (r = 0; r < f.SelectedFlightItems.length; r++) {
                    var u = f.SelectedFlightItems[r],
                        e = "request.SelectedFlightGroup.SelectedFlightItems[" + r + "]",
                        d = $("<input>").attr("type", "hidden").attr("name", e + ".Id").val(u.Id);
                    if (i.append(d), u.ReferenceId && (v = $("<input>").attr("type", "hidden").attr("name", e + ".ReferenceId").val(u.ReferenceId), i.append(v)), u.ProviderId && (y = $("<input>").attr("type", "hidden").attr("name", e + ".ProviderId").val(u.ProviderId), i.append(y)), u.IsPromo && (h = $("<input>").attr("type", "hidden").attr("name", e + ".IsPromo"), h.val(f.SelectedFlightItems[r].IsPromo.toString().toLowerCase()), i.append(h)), c = $("<input>").attr("type", "hidden").attr("name", e + ".IsPromoId"), c.val(f.SelectedFlightItems[r].IsPromoId.toString().toLowerCase()), i.append(c), u.Origin && (p = $("<input>").attr("type", "hidden").attr("name", e + ".Origin").val(u.Origin), i.append(p)), u.Duration && (w = $("<input>").attr("type", "hidden").attr("name", e + ".Duration").val(u.Duration), i.append(w)), u.SelectedPaxes)
                        for (s = 0; s < u.SelectedPaxes.length; s++) o = u.SelectedPaxes[s], b = "request.SelectedFlightGroup.SelectedFlightItems[" + r + "].SelectedPaxes[" + s + "]", render.ChooseClickHelper(i, b, o)
                }
                $("body").append(i);
                $(i).submit()
            })
        },
        ChooseClickHelper: function(n, t, i) {
            var c = $("<input>").attr("type", "hidden").attr("name", t + ".Count").val(i.C),
                r, u, f, e, o, s, h;
            n.append(c);
            r = $("<input>").attr("type", "hidden").attr("name", t + ".Type").val(i.T);
            n.append(r);
            u = $("<input>").attr("type", "hidden").attr("name", t + ".SystemServiceCharge").val(i.SC);
            n.append(u);
            f = $("<input>").attr("type", "hidden").attr("name", t + ".LoyaltyPoints").val(i.LP);
            n.append(f);
            e = $("<input>").attr("type", "hidden").attr("name", t + ".BaseFareDiscount").val(i.BFD);
            n.append(e);
            o = $("<input>").attr("type", "hidden").attr("name", t + ".BaseFareAddOn").val(i.BFA);
            n.append(o);
            s = $("<input>").attr("type", "hidden").attr("name", t + ".RefundInsurancePrice").val(i.CF);
            n.append(s);
            h = $("<input>").attr("type", "hidden").attr("name", t + ".ServiceChargeCode").val(i.Id);
            n.append(h)
        },
        flightDetail: {
            title: function(n, t, i) {
                var r = t.find(".title-duration").attr("txt") + ": ",
                    u = render.getDurationText(i, n.find(".duration"));
                t.find(".title-duration").html(r += u[1])
            },
            airline: function(n, t, i, r) {
                var u = model.getAirlineFromCode(n.MA),
                    e = t.find(".segment-flight").attr("txt"),
                    f;
                t.find(".segment-flight").html(u.Name + " - " + e + " " + n.FC);
                u = model.getAirlineFromCode(n.OA);
                operatingAirline = t.find(".operating-airline").attr("txt").replace("{0}", u.Name);
                t.find(".operating-airline").html(operatingAirline);
                f = t.find(".plane-image");
                f.attr("src", f.attr("src").replace("departure", r))
            },
            airlineDomestic: function(n, t) {
                var r = model.getAirlineFromCode(n.MA),
                    i;
                t.find(".segment-flight").html(r.Name);
                i = t.find(".segment-flight-num");
                i.html(i.attr("txt") + " - " + n.FC)
            },
            airport: function(n, t, i) {
                var u = $("#airport-slug").val().capitalize(),
                    r = render.helper.getAirportsFromCode(n)[0],
                    f = r.City + " - " + r.Name + " " + u;
                t.find(i).html(f)
            },
            airportDomestic: function(n, t, i) {
                var f = $("#airport-slug").val(),
                    r = render.helper.getAirportsFromCode(n)[0],
                    u = r.Name;
                t.find(i).html(u)
            },
            date: function(n, t, i) {
                var r = render.helper.getSegmentDateFormated(n, model.dateFormat);
                t.find(".segment-" + i + "-time").html(r[0]);
                t.find(".segment-" + i + "-date").html(r[1])
            },
            equipmentType: function(n, t, i) {
                var u = t.find(".equipment-type"),
                    r = t.find(".equipment-type span");
                if (r.length) {
                    if (n.AN != null && n.AN != "") {
                        r.html(n.AN);
                        i && (t.css("padding-bottom", i), u.css("bottom", "15px"));
                        return
                    }
                    n.EQ != null && n.EQ != "" && r.html(n.EQ);
                    t.css("padding-bottom", "14px");
                    u.hide()
                }
            },
            dateDomestic: function(n, t, i) {
                var r = render.helper.getSegmentDateFormated(n, "D, d.M");
                t.find(".segment-" + i + "-time").html(r[0]);
                t.find(".segment-" + i + "-date").html(r[1])
            },
            segmentDuration: function(n, t, i, r) {
                var u = render.helper.getSegmentDateDifferenceFormatted(i, r, n.find(".duration")),
                    f = t.find(".segment-transfer").attr("txt");
                t.find(".segment-transfer").html(f + ": " + u[1])
            },
            otherFlightDetails: function(n, t, i) {
                var r, u, f;
                n.MinSeatWidth > 0 ? (r = t.find(".seat .description"), u = r.html().replace("{0}", n.MinSeatWidth).replace("{1}", n.MaxSeatWidth), r.html(u), n.IsMealServed ? t.find(".paid-meal").remove() : t.find(".free-meal").remove()) : t.find(".meal-and-seat").remove();
                n.Baggage != null && n.Baggage != "" ? (f = t.find(".baggage .description"), f.html(n.Baggage)) : t.find(".baggage").remove();
                t.html().trim() != "" && (i.append(t), i.find(".border-radius-bottoom").removeClass("border-radius-bottoom"), i.find(".border-radius-5").removeClass("border-radius-5").addClass("border-radius-top"))
            }
        },
        helper: {
            getAirportsFromCode: function(n) {
                for (var t = [], r, i = 0; i < model.response.Filter.Airports.length; i++) r = model.response.Filter.Airports[i], n.indexOf(r.Code) > -1 && t.push(r);
                return t.length == 0 && t.push({
                    Name: n,
                    City: n,
                    Code: n
                }), t
            },
            getFlightTimeFromDate: function(n) {
                return n.split(" ")[1]
            },
            getDurationHelper: function(n, t) {
                var u = n.split(":")[0].replace(/^0+/, ""),
                    f = n.split(":")[1].replace(/^0+/, ""),
                    e = t.attr("hour"),
                    o = t.attr("minute"),
                    i, r;
                return t.attr("duration", n), i = "", r = "", u != "" && (i = i + u + e.substring(0, 1), r = r + u + " " + e), f != "" && (i = i + " " + f + o.substring(0, 1), r = r + " " + f + " " + o), [i, r]
            },
            getFlightDateFormated: function(n) {
                var t = n.split(" ")[0].split("-"),
                    i = $.datepicker.parseDate("dd/mm/yy", t[2] + "/" + t[1] + "/" + t[0]);
                return tmp = $.datepicker.formatDate(model.dateFormat, i)
            },
            getSegmentDateFormated: function(n, t) {
                var i = n.split(" ")[0].split("-"),
                    r = $.datepicker.parseDate("dd/mm/yy", i[2] + "/" + i[1] + "/" + i[0]),
                    t = t.replace("DD", "D");
                return tmp = $.datepicker.formatDate(t, r), [n.split(" ")[1], tmp]
            },
            getDateDifference: function(n, t) {
                var i = n.split("-"),
                    r = t.split("-"),
                    u = $.datepicker.parseDate("dd/mm/yy", i[2] + "/" + i[1] + "/" + i[0]),
                    f = $.datepicker.parseDate("dd/mm/yy", r[2] + "/" + r[1] + "/" + r[0]);
                return (f - u) / 864e5
            },
            getSegmentDateDifferenceFormatted: function(n, t, i) {
                var r = new FlightDate(n, t),
                    u = (r.ArrDate - r.DepDate) / 6e4,
                    f = model.minutesToTime(u);
                return render.helper.getDurationHelper(f, i)
            }
        }
    },
    DomesticRT = {
        Template: null,
        Dep: null,
        DepCount: null,
        Ret: null,
        RetCount: null,
        SC: null,
        Wrapper: null,
        DepartureFlights: null,
        DepartureHeader: null,
        ReturnFlights: null,
        ReturnHeader: null,
        loadCount: 15,
        selectedClass: "domestic-list-selected",
        DepSelectedItem: null,
        RetSelectedItem: null,
        SelectedFilterResults: null,
        Render: function() {
            DomesticRT.SelectedFilterResults = model.filteredResponse;
            DomesticRT.RenderSponsor();
            DomesticRT.RenderTitle();
            DomesticRT.RenderFlights();
            DomesticRT.RenderLastPrice();
            DomesticRT.RenderOnScrollDown()
        },
        RenderSponsor: function() {
            var n, t;
            if (model.sponsor = {
                    dep: null,
                    ret: null
                }, model.response != null && model.response.Combs != null && model.response.Combs.length != 0 && model.response.Combs[0].Dep != null && model.response.Combs[0].Ret != null) {
                for (n = 0; n < model.response.Combs[0].Dep.length; n++) t = model.response.Combs[0].Dep[n], t.SL == -100 && model.sponsor.dep == null && (model.sponsor.dep = t);
                for (n = 0; n < model.response.Combs[0].Ret.length; n++) t = model.response.Combs[0].Ret[n], t.SL == -100 && model.sponsor.ret == null && (model.sponsor.ret = t);
                model.setSponsorForDomesticRT()
            }
        },
        RenderTitle: function() {
            var t, i, n, r, u, o, f, e;
            DomesticRT.Dep = DomesticRT.SelectedFilterResults.Combs[0].Dep;
            DomesticRT.DepCount = DomesticRT.Dep.length;
            DomesticRT.Ret = DomesticRT.SelectedFilterResults.Combs[0].Ret;
            DomesticRT.RetCount = DomesticRT.Ret.length;
            t = model.response.Combs[0].Dep.length;
            i = model.response.Combs[0].Ret.length;
            DomesticRT.SC = DomesticRT.SelectedFilterResults.Combs[0].CombSC;
            DomesticRT.Template = $(DomesticRT.SelectedFilterResults.Template);
            DomesticRT.Wrapper = $(".div-search-list-items");
            n = DomesticRT.Wrapper.find(".sorting-title");
            n.length ? (n.find(".dep-count .filtered-result").html(DomesticRT.DepCount + "/" + t), n.find(".ret-count .filtered-result").html(DomesticRT.RetCount + "/" + i)) : (DomesticRT.Wrapper.html(""), n = DomesticRT.Template.find(".rt-domestic-title"), n.find(".dep-count .filtered-result").html(DomesticRT.DepCount + "/" + t), n.find(".ret-count .filtered-result").html(DomesticRT.RetCount + "/" + i), DomesticRT.Wrapper.append(n));
            t != DomesticRT.DepCount || i != DomesticRT.RetCount ? n.find(".filter-show-all").show() : n.find(".filter-show-all").hide();
            DomesticRT.DepartureFlights == null ? (r = DomesticRT.Template.find(".rt-domestic").clone(), DomesticRT.Wrapper.append(r), r.addClass("dep"), DomesticRT.DepartureFlights = r, u = DomesticRT.Template.find(".rt-domestic").clone(), DomesticRT.Wrapper.append(u), u.addClass("ret"), DomesticRT.ReturnFlights = u) : (DomesticRT.DepartureFlights.html(""), DomesticRT.ReturnFlights.html(""));
            o = $.datepicker._defaults.dateFormat.replace("D", "DD");
            DomesticRT.DepartureHeader = DomesticRT.Template.find(".rt-header-departure");
            f = DomesticRT.DepartureHeader.find(".date-info").html();
            e = $.datepicker.formatDate(o, new Date(f));
            DomesticRT.DepartureHeader.find(".date-info").html(e);
            DomesticRT.DepartureFlights.append(DomesticRT.DepartureHeader);
            DomesticRT.ReturnHeader = DomesticRT.Template.find(".rt-header-return");
            f = DomesticRT.ReturnHeader.find(".date-info").html();
            e = $.datepicker.formatDate(o, new Date(f));
            DomesticRT.ReturnHeader.find(".date-info").html(e);
            DomesticRT.ReturnFlights.append(DomesticRT.ReturnHeader);
            myScroll.SetValues(DomesticRT.DepartureHeader)
        },
        RenderFlights: function() {
            var i = DomesticRT.Template.find(".rt-domestic-item"),
                r = Math.max(DomesticRT.DepCount, DomesticRT.RetCount),
                n, t;
            for (model.resultCounter = DomesticRT.loadCount, model.resultCounter > r && (model.resultCounter = r), n = 0; n < model.resultCounter; n++) n < DomesticRT.DepCount && (t = DomesticRT.RenderFlightItem("dep", DomesticRT.Dep[n], i.clone()), DomesticRT.ShowFlightItem(DomesticRT.DepartureFlights, t, n)), n < DomesticRT.RetCount && (t = DomesticRT.RenderFlightItem("ret", DomesticRT.Ret[n], i.clone()), DomesticRT.ShowFlightItem(DomesticRT.ReturnFlights, t, n))
        },
        RenderFlightItem: function(n, t, i) {
            var u, f, r, e, o;
            return model.scrollResults[t.Id] || (model.scrollResults[t.Id] = !0, model.scrollResults.items.push({
                type: n,
                item: t,
                handled: !1
            })), DomesticRT.SetSponsorStatusOfItem(i, t), render.flightId(i, t, null), render.seat(i, t, null), render.point(t.Price, i), render.airlineName(i, t, null), render.transfer(t, i), render.date(t, i, !0), render.promotion(i, t, null), render.price(t.Price, i), u = $(window).width(), u < 1148 && u > 830 && i.find(".date-diff").remove(), f = $("#airport-slug").val().capitalize(), r = i.find(".origin-destination"), r.html(t.O + " - " + t.D), r.attr("origin", t.O), r.attr("destination", t.D), e = render.helper.getAirportsFromCode(t.O)[0].Name, o = render.helper.getAirportsFromCode(t.D)[0].Name, r.attr("turna-title", e + " " + f + " - " + o + " " + f), n == "ret" ? (i.find(".from-in-button").removeClass("from-in-button").addClass("to-in-button"), i.removeClass("departure-flight").addClass("return-flight"), DomesticRT.SelectClick(t, DomesticRT.ReturnFlights, i, ".return-flight", ".departure-flight")) : DomesticRT.SelectClick(t, DomesticRT.DepartureFlights, i, ".departure-flight", ".return-flight"), render.click(i, DomesticRT.RenderFlightDetails, t, null), i
        },
        SetSponsorStatusOfItem: function(n, t) {
            t.SL == -100 ? n.addClass("sponsor-item") : n.find(".sponsor").remove()
        },
        RenderLastPrice: function() {
            var n = DomesticRT.Template.find("#total-price").hide();
            DomesticRT.Wrapper.append(n);
            DomesticRT.Wrapper.append(DomesticRT.Template.find(".clearfix").first());
            render.ChooseClick(null, DomesticRT.GetCombinationFromSelectedItems, n.find(".bt-choose"))
        },
        ShowFlightItem: function(n, t, i) {
            var r = i * 250;
            i > 5 && (r = 1250);
            t.hide();
            n.append(t);
            setTimeout(function() {
                n.hasClass(DomesticRT.selectedClass) || t.fadeIn("slow")
            }, r)
        },
        RenderFlightsDirectly: function() {
            $(".div-search-nav").removeClass("filter-sticked-bottom").removeAttr("style");
            $("footer").hide();
            model.resultCounter = 0;
            DomesticRT.RenderSelectedItemsFirst();
            DomesticRT.RenderTitle();
            DomesticRT.RenderFlightPartial();
            myScroll.scrollToUp();
            $("footer").show()
        },
        RenderFlightPartial: function() {
            var r = Math.max(DomesticRT.DepCount, DomesticRT.RetCount),
                e, t, i, n;
            if (model.resultCounter != r) {
                e = model.resultCounter;
                model.resultCounter += DomesticRT.loadCount;
                model.resultCounter > r && (model.resultCounter = r);
                var u = "",
                    f = "",
                    o = DomesticRT.Template.find(".rt-domestic-item"),
                    s = [],
                    h = [];
                for (t = e; t < model.resultCounter; t++) u += DomesticRT.RenderFlightItemPartial(t, DomesticRT.DepCount, "dep", DomesticRT.Dep, s, o), f += DomesticRT.RenderFlightItemPartial(t, DomesticRT.RetCount, "ret", DomesticRT.Ret, h, o);
                i = [!1, !1];
                DomesticRT.DepSelectedItem != null && (n = DomesticRT.RenderDepOrRetAllButton(DomesticRT.DepartureFlights, "dep"), n != "" && (i[0] = !0), u += n);
                DomesticRT.RetSelectedItem != null && (n = DomesticRT.RenderDepOrRetAllButton(DomesticRT.ReturnFlights, "ret"), n != "" && (i[1] = !0), f += n);
                DomesticRT.RenderFlightPartialAppend(u, DomesticRT.DepartureFlights, s, i[0]);
                DomesticRT.RenderFlightPartialAppend(f, DomesticRT.ReturnFlights, h, i[1])
            }
        },
        RenderFlightItemPartial: function(n, t, i, r, u, f) {
            if (n < t) {
                var e = DomesticRT.RenderFlightItem(i, r[n], f.clone());
                return u.push(r[n]), jQuery("<p>").append(e).html()
            }
            return ""
        },
        RenderDepOrRetAllButton: function(n, t) {
            if (!n.find(".show-section-all").length) {
                var i = DomesticRT.Template.find(".show-section-all").clone();
                return i.addClass(t + "-show-all"), jQuery("<p>").append(i).html()
            }
            return ""
        },
        RenderFlightPartialAppend: function(n, t, i, r) {
            var f, e, u, o;
            if (n != "") {
                for (f = "", e = "", t.hasClass("dep") ? (f = ".departure-flight", e = ".return-flight") : (e = ".departure-flight", f = ".return-flight"), t.append(n), u = 0; u < i.length; u++) o = $("#" + i[u].Id), render.click(o, DomesticRT.RenderFlightDetails, i[u], null), DomesticRT.SelectClick(i[u], t, o, f, e);
                r && DomesticRT.SelectReverseAllClick(t.find(".show-section-all"), t, f)
            }
        },
        RenderFlightDetails: function(n, t, i) {
            var u = t.find(".details-wrapper"),
                r = $('<div class="flight-details details"><\/div>'),
                f = DomesticRT.RenderFlightDetailsSegment(n[0], t, i, "departure");
            r.append(f.html());
            u.append(r.hide());
            t.addClass("selected-flight");
            r.addClass("show-details").slideDown("fast");
            DomesticRT.ScrollsectionAllShow(t);
            t.find(".flight-details-button").click(function() {
                DomesticRT.ScrollsectionAllShow(t)
            })
        },
        RenderFlightDetailsSegment: function(n, t, i) {
            var o = n.SegmentDetails,
                u = DomesticRT.Template.find(".flight-details").clone(),
                h = u.find(".detail").clone(),
                c = u.find(".note").clone(),
                l = u.find(".other-flight-details").clone(),
                r, f, e, s;
            for (u.find(".detail").remove(), u.find(".note").remove(), u.find(".other-flight-details").remove(), r = null, f = 0; f < o.length; f++) r = h.clone(), e = o[f], render.flightDetail.airlineDomestic(e, r, i), render.flightDetail.airportDomestic(e.O, r, ".title-dep"), render.flightDetail.airportDomestic(e.D, r, ".title-arr"), render.flightDetail.dateDomestic(e.Ddate, r, "dep"), render.flightDetail.dateDomestic(e.Adate, r, "arr"), u.append(r), f + 1 < o.length ? (render.flightDetail.equipmentType(e, r, "34px"), s = c.clone(), render.flightDetail.segmentDuration(t, s, e.Adate, o[f + 1].Ddate), u.append(s)) : render.flightDetail.equipmentType(e, r), f > 0 ? r.find(".title").remove() : render.flightDetail.title(t, r, i), o.length == 1 ? r.addClass("border-radius-5") : f == 0 ? r.addClass("border-radius-top") : f == o.length - 1 && r.addClass("border-radius-bottoom");
            return render.flightDetail.otherFlightDetails(n, l, u), u
        },
        SelectClick: function(n, t, i, r) {
            var f = i.find(".button input"),
                u = DomesticRT.selectedClass;
            f.click(function() {
                t.hasClass(u) ? ($(t).removeClass(u), DomesticRT.SelectClickHelper(r, null)) : ($(t).addClass(u), DomesticRT.SelectClickHelper(r, n));
                DomesticRT.RenderFlightsDirectly();
                DomesticRT.SelectClickButtonValueChanger()
            })
        },
        SelectClickButtonValueChanger: function() {
            $(".domestic-list-selected .button input").each(function() {
                var n = this,
                    t = $(n).val(),
                    i = $(n).attr("txt");
                $(n).attr("txt", t);
                $(n).val(i)
            })
        },
        SelectReverseAllClick: function(n, t, i) {
            n.length && n.click(function() {
                t.removeClass(DomesticRT.selectedClass);
                DomesticRT.SelectClickHelper(i, null);
                DomesticRT.RenderFlightsDirectly();
                DomesticRT.SelectClickButtonValueChanger()
            })
        },
        SelectClickHelper: function(n, t) {
            n == ".departure-flight" ? DomesticRT.DepSelectedItem = t : DomesticRT.RetSelectedItem = t
        },
        RenderSelectedItemsFirst: function() {
            var n = DomesticRT.DepSelectedItem,
                t = DomesticRT.RetSelectedItem,
                i;
            if (DomesticRT.HideTotalPriceIfFlightsNotSelected(), n == null && t == null) {
                DomesticRT.DepartureFlights.removeClass(DomesticRT.selectedClass);
                DomesticRT.ReturnFlights.removeClass(DomesticRT.selectedClass);
                DomesticRT.SelectedFilterResults = model.filteredResponse;
                return
            }(DomesticRT.SelectedFilterResults = model.newResult(), i = {
                Dep: [],
                Ret: [],
                CombSC: model.response.Combs[0].CombSC,
                Price: null
            }, DomesticRT.SelectedFilterResults.Combs.push(i), DomesticRT.ProcessSelectedFlights()) || (n != null && DomesticRT.RenderAndPushSelectedOppositeItems("Dep", "Ret", n, "DepDate", "ArrDate", 1), t != null && DomesticRT.RenderAndPushSelectedOppositeItems("Ret", "Dep", t, "ArrDate", "DepDate", -1))
        },
        HideTotalPriceIfFlightsNotSelected: function() {
            (DomesticRT.DepSelectedItem == null || DomesticRT.RetSelectedItem == null) && $("#total-price").hide()
        },
        ProcessSelectedFlights: function() {
            var n = DomesticRT.DepSelectedItem,
                t = DomesticRT.RetSelectedItem;
            return n != null && t != null ? (DomesticRT.SelectedFilterResults.Combs[0].Dep.push(n), DomesticRT.SelectedFilterResults.Combs[0].Ret.push(t), model.SetTotalPrice(n.Price), model.SetTotalPrice(t.Price), DomesticRT.ComputeRoundTripPrices(model, n, t), ecommerce.domesticChoosenRTImpression(n, t), !0) : !1
        },
        ComputeRoundTripPrices: function(n, t, i) {
            var e = (t.Price.totalAmount + i.Price.totalAmount).toFixed(2),
                u, r, f;
            $("#total-price .price").html(e + " " + n.currency);
            t.Price.LP + i.Price.LP > 0 ? (u = $("#total-price .point"), r = Math.round(t.Price.LPC * 100) / 100, r += Math.round(i.Price.LPC * 100) / 100, r = Math.round(r * 100) / 100, f = u.find(".point-value"), f.html(t.Price.LP + i.Price.LP + " " + f.attr("data")), u.find(".point-desc").html(" (" + r + " " + n.currency + ")"), u.show()) : $("#total-price .text-point, #total-price .point").hide();
            $("#total-price").show()
        },
        FetchRoundTripPrices: function(n, t, i) {
            var r = DomesticRT.GetCombinationFromSelectedItems(),
                u = {
                    Id: r.Id,
                    SelectedFlightItems: [{
                        Id: t.Id
                    }, {
                        Id: i.Id
                    }]
                };
            $.ajax({
                url: "/Flight/ComputeRoundTripPrice",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: !1,
                data: JSON.stringify(u),
                async: !0,
                timeout: 1e4,
                success: function(t) {
                    var e, i, f, r, u, o;
                    if (t == null) {
                        $("#total-price").hide();
                        return
                    }
                    for (e = 0, i = 0, f = 0; f < t.length; ++f) r = t[f], e += r.TotalFare * r.Count, i += r.CustomerLoyaltyPoints * r.Count;
                    $("#total-price .price").html(e.toFixed(2) + " " + n.currency);
                    i > 0 ? (u = $("#total-price .point"), o = u.attr("turna-title").replace("{0}", i), u.attr("turna-title", o.replace("{1}", Math.floor(i * 100) / 100).replace("{2}", n.currency)), u.html(i), u.show()) : $("#total-price .text-point, #total-price .point").hide();
                    $("#total-price").show()
                }
            })
        },
        RenderAndPushSelectedOppositeItems: function(n, t, i, r, u, f) {
            var s, o, e;
            for (i.hasOwnProperty("dates") || (i.dates = new FlightDate(i.Ddate, i.Adate)), s = i.dates[u] + f * 36e5, DomesticRT.SelectedFilterResults.Combs[0][n].push(i), o = 0; o < model.filteredResponse.Combs[0][t].length; o++) e = model.filteredResponse.Combs[0][t][o], e.hasOwnProperty("dates") || (e.dates = new FlightDate(e.Ddate, e.Adate)), s * f < e.dates[r] * f && DomesticRT.SelectedFilterResults.Combs[0][t].push(e)
        },
        GetCombinationFromSelectedItems: function() {
            var n = model.newComb(DomesticRT.DepSelectedItem, DomesticRT.RetSelectedItem, null, !1);
            return n.RID = model.response.Combs[0].RID, n.PID = model.response.Combs[0].PID, n.Id = model.response.Combs[0].Id, n
        },
        RenderOnScrollDown: function() {
            $(window).scroll(function() {
                $(window).scrollTop() > ($(document).height() - $(window).height()) * .7 && DomesticRT.RenderFlightPartial();
                myScroll.ScrollHeader(this, DomesticRT.DepartureHeader, DomesticRT.DepartureFlights, 840);
                myScroll.ScrollHeader(this, DomesticRT.ReturnHeader, DomesticRT.ReturnFlights, 840);
                DomesticRT.ScrollFlightItem(this, 840, ".domestic-list-selected .flight");
                DomesticRT.ScrollFlightItem(this, 840, ".domestic-list-selected .show-section-all")
            })
        },
        ScrollFlightItem: function(n, t, i) {
            var f, u, e;
            if ($(".domestic-list-selected").length) {
                var o = DomesticRT.DepartureFlights.offset().top + DomesticRT.DepartureFlights.outerHeight() - 150,
                    s = DomesticRT.ReturnFlights.offset().top + DomesticRT.ReturnFlights.outerHeight() - 150,
                    h = Math.max(o, s),
                    r = $(n).scrollTop();
                r >= h && (r = 0);
                f = DomesticRT.DepSelectedItem != null && DomesticRT.RetSelectedItem != null;
                u = 0;
                i == ".domestic-list-selected .show-section-all" && (u = $(".domestic-list-selected .flight").outerHeight(!1));
                e = myScroll.mainNavHeight + myScroll.headerHeight + myScroll.headerMarginBottom + u;
                $(i).each(function() {
                    var n = $(this),
                        i = DomesticRT.DepartureHeader;
                    n.hasClass("return-flight") && (i = DomesticRT.ReturnHeader);
                    myScroll.ScrollHelper(n, "domestic-list-selected-fixed", e, n.outerWidth(), r, t, f, i, "item-header-fixed")
                })
            }
        },
        ScrollsectionAllShow: function(n) {
            var t = n.parent(".domestic-list-selected").find(".show-section-all");
            t.hide();
            setTimeout(function() {
                DomesticRT.ScrollFlightItem(window, 840, ".domestic-list-selected .show-section-all");
                t.show()
            }, 200)
        }
    },
    InternationalRT = {
        Template: null,
        TotalCount: null,
        Wrapper: null,
        Header: null,
        Render: function() {
            InternationalRT.SortByPrice();
            InternationalRT.RenderTitle();
            InternationalRT.RenderFlights();
            InternationalRT.RenderOnScrollDown()
        },
        RenderFlightCount: function(n) {
            for (var i = 0, t = 0; t < n.length; t++) i = i + n[t].Dep.length * n[t].Ret.length;
            return i
        },
        RenderTitle: function() {
            var t, i, n;
            InternationalRT.TotalCount = InternationalRT.RenderFlightCount(model.filteredResponse.Combs);
            t = InternationalRT.RenderFlightCount(model.response.Combs);
            InternationalRT.Template = $(model.filteredResponse.Template);
            InternationalRT.Wrapper = $(".div-search-list-items");
            i = $.datepicker._defaults.dateFormat.replace("D", "DD");
            $(InternationalRT.Template.find(".date-info")).each(function() {
                var n = $(this).html(),
                    t = $.datepicker.formatDate(i, new Date(n));
                $(this).html(t)
            });
            n = InternationalRT.Wrapper.find(".sorting-title");
            n.length ? n.find(".filtered-result").html(InternationalRT.TotalCount + "/" + t) : (InternationalRT.Wrapper.html(""), n = InternationalRT.Template.find(".sorting-title"), n.find(".filtered-result").html(InternationalRT.TotalCount + "/" + t), InternationalRT.Wrapper.append(n), InternationalRT.Header = InternationalRT.Template.find(".item-header"), InternationalRT.Wrapper.append(InternationalRT.Header), myScroll.SetValues(InternationalRT.Header), InternationalRT.Wrapper.append('<div class="flights-wrapper"><\/div>'));
            InternationalRT.Wrapper = InternationalRT.Wrapper.find(".flights-wrapper");
            InternationalRT.Wrapper.html("");
            t != InternationalRT.TotalCount ? n.find(".filter-show-all").show() : n.find(".filter-show-all").hide()
        },
        SortByPrice: function() {
            for (var i = model.newResult(), o, r, s, u, f, n, e = 0; e < model.filteredResponse.Combs.length; e++) {
                var t = model.filteredResponse.Combs[e],
                    h = t.Dep,
                    c = t.Ret;
                for (o = 0; o < h.length; o++)
                    for (r = h[o], s = 0; s < c.length; s++) {
                        if (u = c[s], f = t.Price, f == null && (f = InternationalRT.SumPrice(r.Price, u.Price)), n = model.newComb(r, u, f, t.Price == null), n.RID = t.RID, n.PID = t.PID, n.Id = t.Id, InternationalRT.removeExistingItemFromList(i, n, f)) i.Combs.push(n);
                        else continue;
                        i[r.Id + u.Id] = n;
                        r.SL == -100 && u.SL == -100 && (model.sponsor = n)
                    }
            }
            i.Combs = i.Combs.sort(function(n, t) {
                return n.Price.F - n.Price.D - (t.Price.F - t.Price.D)
            });
            model.SetResponse(i);
            model.setSponsorForInternationalRT()
        },
        getIdFromItem: function(n) {
            var t = n.Dep[0],
                i = n.Ret[0],
                r = t.BGG + ";" + t.O + ";" + t.D + ";" + t.FNS + ";" + t.Ddate + ";" + t.Adate,
                u = i.BGG + ";" + i.O + ";" + i.D + ";" + i.FNS + ";" + i.Ddate + ";" + i.Adate;
            return r + u
        },
        removeExistingItemFromList: function(n, t, i) {
            var u = InternationalRT.getIdFromItem(t),
                f = i.F - i.D + i.SC,
                r = n[u];
            if (r)
                if (f < r.totalPrice) n[r.comb.Dep[0].Id + r.comb.Ret[0].Id] = undefined, n.Combs.splice(n.Combs.indexOf(r.comb), 1);
                else return !1;
            return n[u] = {
                totalPrice: f,
                comb: t
            }, !0
        },
        RenderFlights: function() {
            for (var t = 1, u = InternationalRT.Template.find(".item"), r, n = 0; n < model.filteredResponse.Combs.length; n++) {
                var i = model.filteredResponse.Combs[n],
                    f = i.Dep[0],
                    e = i.Ret[0],
                    o = i.Price;
                model.resultCounter < 20 && (model.resultCounter += 1, r = InternationalRT.RenderFlightItem(f, e, o, u.clone()), InternationalRT.ShowFlightItem(r, t), t = t + 1)
            }
        },
        RenderFlightItem: function(n, t, i, r) {
            model.scrollResults[n.Id + t.Id] || (model.scrollResults[n.Id + t.Id] = !0, model.scrollResults.items.push({
                depFlight: n,
                retFlight: t,
                handled: !1
            }));
            n.SL == -100 && t.SL == -100 ? r.addClass("sponsor-item") : r.find(".sponsor").remove();
            render.flightId(r, n, t);
            var u = r.find(".departure-flight"),
                f = r.find(".return-flight");
            return render.seat(r, n, t), render.point(i, r), render.airlineName(r, n, t), render.transfer(n, u), render.date(n, u, !1), render.itemAirport(u.find(".origin"), n.O, "origin"), render.itemAirport(u.find(".destination"), n.D, "destination"), render.duration(n, u), render.baggageAllowance(n, u), render.transfer(t, f), render.date(t, f, !1), render.itemAirport(f.find(".origin"), t.O, "origin"), render.itemAirport(f.find(".destination"), t.D, "destination"), render.duration(t, f), render.baggageAllowance(t, f), n.O != t.D && (u.find(".origin span").addClass("labeled-color"), f.find(".destination span").addClass("labeled-color")), n.D != t.O && (u.find(".destination span").addClass("labeled-color"), f.find(".origin span").addClass("labeled-color")), render.promotion(r, n, t), render.price(i, r), render.click(r, InternationalRT.RenderFlightDetails, n, t), render.ChooseClick(model.response[n.Id + t.Id], null, r.find(".bt-choose")), r
        },
        SumPrice: function(n, t) {
            return {
                F: n.F + t.F,
                D: n.D + t.D,
                LP: n.LP + t.LP,
                LPC: n.LPC + t.LPC,
                SLP: n.SLP + t.SLP,
                SC: n.SC + t.SC
            }
        },
        ShowFlightItem: function(n, t) {
            var i = t * 250;
            t > 5 && (i = 1250);
            n.hide();
            InternationalRT.Wrapper.append(n);
            setTimeout(function() {
                n.fadeIn("slow")
            }, i)
        },
        RenderFlightsDirectly: function() {
            $(".div-search-nav").removeClass("filter-sticked-bottom").removeAttr("style");
            model.resultCounter = 0;
            InternationalRT.RenderTitle();
            InternationalRT.RenderFlightPartial();
            myScroll.scrollToUp()
        },
        RenderFlightPartial: function() {
            var r = model.filteredResponse.Combs.length,
                e, i, t, n, f;
            if (model.resultCounter != r) {
                e = model.resultCounter;
                model.resultCounter += 20;
                model.resultCounter > r && (model.resultCounter = r);
                var o = "",
                    s = InternationalRT.Template.find(".item"),
                    u = [];
                for (t = e; t < model.resultCounter; t++) i = model.filteredResponse.Combs[t], n = InternationalRT.RenderFlightItem(i.Dep[0], i.Ret[0], i.Price, s.clone()), o += jQuery("<p>").append(n).html(), u.push({
                    dep: i.Dep[0],
                    ret: i.Ret[0]
                });
                for (InternationalRT.Wrapper.append(o), t = 0; t < u.length; t++) n = u[t], f = "#" + n.dep.Id + "-" + n.ret.Id, render.click($(f), InternationalRT.RenderFlightDetails, n.dep, n.ret), render.ChooseClick(model.response[n.dep.Id + n.ret.Id], null, $(f + " .bt-choose"))
            }
        },
        RenderOnScrollDown: function() {
            $(window).scroll(function() {
                $(window).scrollTop() > ($(document).height() - $(window).height()) * .8 && InternationalRT.RenderFlightPartial();
                myScroll.ScrollHeader(this, InternationalRT.Header, InternationalRT.Header.parent(), 0)
            })
        },
        RenderFlightDetails: function(n, t, i, r) {
            var h = t.find(".details-wrapper"),
                u = $('<div class="flight-details details"><\/div>'),
                f = InternationalRT.Template.find(".flight-details").clone(),
                e = f.find(".other-flight-details").clone(),
                o, s;
            f.find(".other-flight-details").remove();
            o = render.renderFlightDetailsSegmentCombination(f.clone(), n[0], t, i, "departure");
            u.append(o.html());
            render.flightDetail.otherFlightDetails(n[0], e.clone(), u);
            s = render.renderFlightDetailsSegmentCombination(f.clone(), n[1], t, r, "return");
            u.append(s.html());
            render.flightDetail.otherFlightDetails(n[1], e.clone(), u);
            h.append(u.hide());
            t.addClass("selected-flight");
            u.addClass("show-details").slideDown("fast")
        }
    },
    OneWay = {
        Template: null,
        Dep: null,
        DepCount: null,
        Wrapper: null,
        Header: null,
        Render: function() {
            OneWay.SortByPrice();
            OneWay.RenderTitle();
            OneWay.RenderFlights();
            OneWay.RenderOnScrollDown()
        },
        RenderFlightCount: function() {
            OneWay.Dep = model.filteredResponse.Combs;
            OneWay.DepCount = OneWay.RenderCount(OneWay.Dep)
        },
        RenderCount: function(n) {
            for (var i = 0, t = 0; t < n.length; t++) i = i + n[t].Dep.length;
            return i
        },
        RenderTitle: function() {
            var t, n;
            OneWay.RenderFlightCount();
            t = OneWay.RenderCount(model.response.Combs);
            OneWay.Template = $(model.filteredResponse.Template);
            var i = $.datepicker._defaults.dateFormat.replace("D", "DD"),
                r = OneWay.Template.find(".date-info").html(),
                u = $.datepicker.formatDate(i, new Date(r));
            OneWay.Template.find(".date-info").html(u);
            OneWay.Wrapper = $(".div-search-list-items");
            n = OneWay.Wrapper.find(".sorting-title");
            n.length ? n.find(".filtered-result").html(OneWay.DepCount + "/" + t) : (OneWay.Wrapper.html(""), n = OneWay.Template.find(".sorting-title"), n.find(".filtered-result").html(OneWay.DepCount + "/" + t), OneWay.Wrapper.append(n), OneWay.Header = OneWay.Template.find(".item-header"), OneWay.Wrapper.append(OneWay.Header), myScroll.SetValues(OneWay.Header), OneWay.Wrapper.append('<div class="flights-wrapper"><\/div>'));
            OneWay.Wrapper = OneWay.Wrapper.find(".flights-wrapper");
            OneWay.Wrapper.html("");
            t != OneWay.DepCount ? n.find(".filter-show-all").show() : n.find(".filter-show-all").hide()
        },
        SortByPrice: function() {
            for (var r = model.newResult(), t, o, e, i, u, n, f = 0; f < model.filteredResponse.Combs.length; f++)
                for (t = model.filteredResponse.Combs[f], o = t.Dep, e = 0; e < o.length; e++) {
                    if (i = o[e], u = t.Price, u != null ? (i.Price = jQuery.extend({}, t.Price), i.Price.Paxes = null) : (u = jQuery.extend({}, i.Price), u.Paxes = null), n = model.newComb(i, null, u, !1), n.RID = t.RID, n.PID = t.PID, n.Id = t.Id, OneWay.removeExistingItemFromList(r, n, u)) r.Combs.push(n);
                    else continue;
                    r[i.Id] = n;
                    i.SL == -100 && (model.sponsor = n)
                }
            r.Combs = r.Combs.sort(function(n, t) {
                return n.Price.F - n.Price.D - (t.Price.F - t.Price.D)
            });
            model.SetResponse(r);
            model.setSponsorForOneWay()
        },
        getIdFromItem: function(n) {
            var t = n.Dep[0];
            return t.BGG + ";" + t.O + ";" + t.D + ";" + t.FNS + ";" + t.Ddate + ";" + t.Adate
        },
        removeExistingItemFromList: function(n, t, i) {
            var u = OneWay.getIdFromItem(t),
                f = i.F - i.D + i.SC,
                r = n[u];
            if (r)
                if (f < r.totalPrice) n[r.comb.Dep[0].Id] = undefined, n.Combs.splice(n.Combs.indexOf(r.comb), 1);
                else return !1;
            return n[u] = {
                totalPrice: f,
                comb: t
            }, !0
        },
        RenderFlights: function() {
            for (var t = 1, f = OneWay.Template.find(".one-way-item"), i, r, u, n = 0; n < model.filteredResponse.Combs.length; n++) i = model.filteredResponse.Combs[n], r = i.Dep[0], model.resultCounter < 20 && (model.resultCounter += 1, u = OneWay.RenderFlightItem(r, f.clone()), OneWay.ShowFlightItem(u, t), t = t + 1)
        },
        RenderFlightItem: function(n, t) {
            return model.scrollResults[n.Id] || (model.scrollResults[n.Id] = !0, model.scrollResults.items.push({
                item: n,
                handled: !1
            })), n.SL == -100 ? t.addClass("sponsor-item") : t.find(".sponsor").remove(), render.flightId(t, n, null), render.seat(t, n, null), render.point(n.Price, t), render.airlineName(t, n, null), render.transfer(n, t), render.baggageAllowance(n, t), render.date(n, t, !1), render.itemAirport(t.find(".origin"), n.O, "origin"), render.itemAirport(t.find(".destination"), n.D, "destination"), render.duration(n, t), render.promotion(t, n, null), render.price(n.Price, t), render.click(t, OneWay.RenderFlightDetails, n, null), render.ChooseClick(model.response[n.Id], null, t.find(".bt-choose")), t
        },
        ShowFlightItem: function(n, t) {
            var i = t * 250;
            t > 5 && (i = 1250);
            n.hide();
            OneWay.Wrapper.append(n);
            setTimeout(function() {
                n.fadeIn("slow")
            }, i)
        },
        RenderFlightsDirectly: function() {
            $(".div-search-nav").removeClass("filter-sticked-bottom").removeAttr("style");
            model.resultCounter = 0;
            OneWay.RenderTitle();
            OneWay.RenderFlightPartial();
            myScroll.scrollToUp()
        },
        RenderFlightPartial: function() {
            var i = model.filteredResponse.Combs.length,
                f, u, n, t;
            if (model.resultCounter != i) {
                f = model.resultCounter;
                model.resultCounter += 20;
                model.resultCounter > i && (model.resultCounter = i);
                var e = "",
                    o = OneWay.Template.find(".one-way-item"),
                    r = [];
                for (n = f; n < model.resultCounter; n++) u = model.filteredResponse.Combs[n], t = OneWay.RenderFlightItem(u.Dep[0], o.clone()), r.push(u.Dep[0]), e += jQuery("<p>").append(t).html();
                for (OneWay.Wrapper.append(e), n = 0; n < r.length; n++) t = r[n], render.click($("#" + t.Id), OneWay.RenderFlightDetails, t, null), render.ChooseClick(model.response[t.Id], null, $("#" + t.Id + " .bt-choose"))
            }
        },
        RenderOnScrollDown: function() {
            $(window).scroll(function() {
                $(window).scrollTop() > ($(document).height() - $(window).height()) * .8 && OneWay.RenderFlightPartial();
                myScroll.ScrollHeader(this, OneWay.Header, OneWay.Header.parent(), 0)
            })
        },
        RenderFlightDetails: function(n, t, i) {
            var f = t.find(".details-wrapper"),
                u = $('<div class="flight-details details"><\/div>'),
                r = OneWay.Template.find(".flight-details").clone(),
                e = r.find(".other-flight-details").clone();
            r.find(".other-flight-details").remove();
            r = render.renderFlightDetailsSegmentCombination(r, n[0], t, i, "departure");
            u.append(r.html());
            f.append(u.hide());
            render.flightDetail.otherFlightDetails(n[0], e, u);
            t.addClass("selected-flight");
            u.addClass("show-details").slideDown("fast")
        }
    },
    filterInitialize = {
        refreshValues: function() {
            filterInitialize.initializeCheckBox(model.filter.transfers);
            filterInitialize.initializeCheckBox(model.filter.refundables);
            filterInitialize.initializeTimeSliders();
            filterInitialize.initializeCheckBox(model.filter.airports);
            filterInitialize.initializeCheckBox(model.filter.airlines);
            filterInitialize.initializeCheckBox(model.filter.stopAirports);
            filterInitialize.initializePriceSliders();
            filterInitialize.initializeDurationSlider()
        },
        initializeCheckBox: function(n) {
            for (var i, t = 0; t < n.length; t++) i = n[t], $("#" + i.id).find("input").prop("checked", !0), i.value = !0;
            $(".rt").find("input").prop("checked", !1)
        },
        initializeTimeSliders: function() {
            var r = model.filter.departure.takeOffTime,
                n, t, i;
            filterInitialize.initializeTimeSlidersHelper(r);
            n = model.filter.departure.landingTime;
            filterInitialize.initializeTimeSlidersHelper(n);
            model.filter.ret.takeOffTime != null && (t = model.filter.ret.takeOffTime, filterInitialize.initializeTimeSlidersHelper(t), i = model.filter.ret.landingTime, filterInitialize.initializeTimeSlidersHelper(i))
        },
        initializePriceSliders: function() {
            var n, t;
            model.response.Type == 0 && (n = model.filter.ret.priceSlider, filterInitialize.initializeSlidersHelper(n.slide, n.min, n.max), n.begin.find(".value").html(n.min), n.end.find(".value").html(n.max), model.filter.ret.price[0] = n.min, model.filter.ret.price[1] = n.max);
            t = model.filter.departure.priceSlider;
            filterInitialize.initializeSlidersHelper(t.slide, t.min, t.max);
            t.begin.find(".value").html(t.min);
            t.end.find(".value").html(t.max);
            model.filter.departure.price[0] = t.min;
            model.filter.departure.price[1] = t.max
        },
        initializeDurationSlider: function() {
            var n, t, i;
            model.response.Type != 2 && (n = model.filter.ret.durationSlider, filterInitialize.initializeSlidersHelper(n.slide, n.min, n.max), t = model.getTimeFormatted(n.min), n.begin.find(".value").html(t), i = model.getTimeFormatted(n.max), n.end.find(".value").html(i), model.filter.ret.minDuration = n.min, model.filter.ret.maxDuration = n.max);
            n = model.filter.departure.durationSlider;
            filterInitialize.initializeSlidersHelper(n.slide, n.min, n.max);
            t = model.getTimeFormatted(n.min);
            n.begin.find(".value").html(t);
            i = model.getTimeFormatted(n.max);
            n.end.find(".value").html(i);
            model.filter.departure.minDuration = n.min;
            model.filter.departure.maxDuration = n.max
        },
        initializeSlidersHelper: function(n, t, i) {
            var r = n.getValue();
            r[0] = t;
            r[1] = i;
            n.setValue(r);
            n.refresh()
        },
        initializeTimeSlidersHelper: function(n) {
            filterInitialize.initializeSlidersHelper(n.slider, 0, n.InitialMax);
            n.addMinMax(0, n.InitialMax);
            var t = n.getTimes();
            n.beginTime.html(t[0]);
            n.endTime.html(t[1])
        }
    },
    filterSetting = {
        currency: null,
        setFilterValues: function() {
            filterSetting.setCurrency();
            filterSetting.setTransferType();
            filterSetting.setRefundableType();
            filterSetting.setTimes();
            filterSetting.setPrices();
            filterSetting.setAirports();
            filterSetting.setAirlines();
            filterSetting.stopAirports();
            filterSetting.setDurations();
            filterSetting.setTitleClickAll();
            filterSetting.showFilters();
            myScroll.scrollFilter()
        },
        showFilters: function() {
            $("#filter-top-two, #filter-top").removeClass("display-none");
            $(".initial-show").addClass("in");
            $(".is-disabled").removeClass("is-disabled");
            $(".div-search-nav .nav-item .title").click(function(n) {
                var i = $(this).find(".filter-section-all"),
                    t;
                i.is(n.target) || (t = $(this).parent(".nav-item").find(".collapse"), t.hasClass("in") ? (t.slideUp(), setTimeout(function() {
                    t.removeClass("in")
                }, 250)) : t.slideDown().addClass("in"))
            })
        },
        setCurrency: function() {
            filterSetting.currency = model.currency == "USD" ? "$" : model.currency == "EUR" ? "€" : model.currency == "TRY" ? "TL" : model.currency.toLowerCase()
        },
        setHover: function(n, t, i, r) {
            var u = $(t).hasClass(r);
            $(n).unbind("mouseenter mouseleave").hover(function() {
                u && $(t).removeClass(r);
                $(t).addClass(i)
            }, function() {
                u && $(t).addClass(r);
                $(t).removeClass(i)
            })
        },
        setFilterClick: function(n, t) {
            var i = $(n).parents(".nav-item").find(".title"),
                r = i.find(".filter-section-all"),
                u = i.attr("data-toggle");
            $(n).click(function(f) {
                var e = $(this).find("input"),
                    l = $(this).find(".check-box-wrapper"),
                    c, h, o, s;
                for ($(e).is(f.target) || ($(l).has(f.target).length > 0 ? e.is(":checked") ? e.removeAttr("checked") : e.prop("checked", !0) : $(f.target).is("a") && (c = $("#airline-multiple input").is(":checked"), $(n + " input").removeAttr("checked"), e.prop("checked", !0), $("#airline-multiple input").prop("checked", c), f.preventDefault())), h = !1, o = 0; o < t.length; o++) s = t[o], s.value = $("#" + s.id).find("input").is(":checked"), s.value == !1 && (h = !0);
                r.length && (h ? (r.show(), i.removeAttr("data-toggle")) : (r.hide(), i.attr("data-toggle", u)));
                filterApply.applyFilter()
            })
        },
        setFilterAllClick: function(n, t, i) {
            var r = $(n).parents(".nav-item").find(".title"),
                u = r.find(".filter-section-all"),
                f = r.attr("data-toggle");
            u.click(function(n) {
                t(i);
                filterApply.applyFilter();
                n.preventDefault();
                $(this).hide();
                setTimeout(function() {
                    r.attr("data-toggle", f)
                }, 300)
            })
        },
        setTitleClickAll: function() {
            $(".filter-show-all").click(function() {
                return filterInitialize.refreshValues(), model.response.Type == 0 && (DomesticRT.DepSelectedItem = null, DomesticRT.RetSelectedItem = null), filterApply.applyFilter(), $(".filter-section-all").hide(), !1
            })
        },
        setTransferType: function() {
            var i, r, n, t;
            if (model.response.Filter.Transfers.length <= 1) {
                $("#filter-top").remove();
                return
            }
            for (filterSetting.setHover("#filter-top li", ".flight-transfer", "filter-hover-color", "color-turquoise"), i = model.response.Filter.Transfers, filterSetting.setFilterClick("#filter-top li", model.filter.transfers), r = ["direct-flight", "one-stop", "two-or-more-stop"], n = 0; n < i.length; n++) t = i[n], filterSetting.helper.setTopFilterValues(r[t.Type], t.Type, t.Price, model.filter.transfers);
            $("#filter-top li").each(function() {
                $(this).find("input").is(":checked") || $(this).remove()
            })
        },
        setRefundableType: function() {
            var i, r, n, t;
            for (filterSetting.setHover("#filter-top-two li", ".promotion", "filter-hover-color", "color-turquoise"), i = model.response.Filter.Refundables, filterSetting.setFilterClick("#filter-top-two li", model.filter.refundables), r = ["refundable-filter", "promotion-filter"], n = 0; n < i.length; n++) t = i[n], filterSetting.helper.setTopFilterValues(r[t.Type], t.Type, t.Price, model.filter.refundables);
            $("#filter-top-two li").each(function() {
                $(this).find("input").is(":checked") || $(this).remove()
            })
        },
        setTimes: function() {
            filterSetting.setFilterAllClick(".flight-time", filterInitialize.initializeTimeSliders, null);
            $(".showlandingTimes").click(function() {
                $(this).hide();
                $("#filter-time-landing").removeClass("display-none")
            });
            var n = filterSetting.helper.getPartialName($("#flight-from").val()),
                t = filterSetting.helper.getPartialName($("#flight-to").val());
            $(".flight-time .departure").html(n);
            $(".flight-time .return").html(t);
            filterSetting.setTimeFilter(".departure-times", model.response.Filter.Departure, model.filter.departure);
            filterSetting.setTimeFilter(".return-times", model.response.Filter.Return, model.filter.ret);
            filterSetting.setHover("#filter-time-takeoff .departure-times .slider", ".departure-flight .departure-date", "filter-hover-color", "color-turquoise");
            filterSetting.setHover("#filter-time-takeoff .return-times .slider", ".return-flight .departure-date", "filter-hover-color", "color-turquoise");
            filterSetting.setHover("#filter-time-landing .departure-times .slider", ".departure-flight .arrival-date", "filter-hover-color", "color-turquoise");
            filterSetting.setHover("#filter-time-landing .return-times .slider", ".return-flight .arrival-date", "filter-hover-color", "color-turquoise")
        },
        setTimeFilter: function(n, t, i) {
            var u, r, f;
            t == null ? ($("#filter-time-takeoff " + n).remove(), $("#filter-time-landing " + n).remove()) : (i.takeOffTime = new FilterTime(t.DMinT, t.DMaxT), u = i.takeOffTime.getTimes(), $("#filter-time-takeoff " + n + " .begin-time").html(u[0]), $("#filter-time-takeoff " + n + " .end-time").html(u[1]), r = "#filter-time-takeoff " + n + " .slider-range", filterSetting.setTimeSlider(r, i.takeOffTime), i.landingTime = new FilterTime(t.AMinT, t.AMaxT), f = i.landingTime.getTimes(), $("#filter-time-landing " + n + " .begin-time").html(f[0]), $("#filter-time-landing " + n + " .end-time").html(f[1]), r = "#filter-time-landing " + n + " .slider-range", filterSetting.setTimeSlider(r, i.landingTime))
        },
        setTimeSlider: function(n, t) {
            var i = new Slider(n, {
                range: !0,
                min: 0,
                max: t.MaxSlider,
                value: [0, t.MaxSlider]
            });
            $(n).parent().find(".tooltip").hide();
            var r = $(n).parents("li").find(".begin-time"),
                u = $(n).parents("li").find(".end-time"),
                f = "slider-color-change";
            i.on("slide", function() {
                var n = i.getValue(),
                    e;
                t.MinSlider != n[0] && r.addClass(f);
                t.MaxSlider != n[1] && u.addClass(f);
                t.addMinMax(n[0], n[1]);
                e = t.getTimes();
                r.html(e[0]);
                u.html(e[1])
            });
            var e = $(".flight-time").parents(".nav-item").find(".title"),
                o = e.find(".filter-section-all"),
                h = e.attr("data-toggle"),
                s = 0;
            i.on("slideStop", function() {
                if (++s > 1) {
                    s = 0;
                    return
                }
                r.removeClass(f);
                u.removeClass(f);
                filterApply.applyFilter();
                var n = i.getValue();
                n[0] == 0 && n[1] == t.InitialMax ? (o.hide(), e.attr("data-toggle", h)) : (o.show(), e.removeAttr("data-toggle"))
            });
            t.slider = i;
            t.beginTime = r;
            t.endTime = u
        },
        setPrices: function() {
            var t, n, i;
            filterSetting.setFilterAllClick("#filter-price", filterInitialize.initializePriceSliders, null);
            t = model.response.Filter.Departure;
            n = model.response.Filter.Return;
            model.response.Type != 1 ? (filterSetting.setPriceFilter(" .departure-price ", t, model.filter.departure), filterSetting.setHover("#filter-price .departure-price .slider", ".departure-flight .price", "filter-hover-color", "color-turquoise"), filterSetting.setPriceFilter(" .return-price ", n, model.filter.ret), n != null && filterSetting.setHover("#filter-price .return-price .slider", ".return-flight .price", "filter-hover-color", "color-turquoise")) : (filterSetting.setPriceFilter(" .departure-price ", model.response.Filter, model.filter.departure), filterSetting.setHover("#filter-price .departure-price .slider", ".flight .price", "filter-hover-color", "color-turquoise"), $("#filter-price .return-price").remove(), i = $("#filter-price .departure-price .filter-sub-header").html(""))
        },
        setPriceFilter: function(n, t, i) {
            var r = i.price,
                o, u, f, e;
            t == null ? ($("#filter-price .return-price").remove(), o = $("#filter-price .departure-price .filter-sub-header").html("")) : (u = $("#filter-price " + n + " .begin-price"), f = $("#filter-price " + n + " .end-price"), r[0] = Math.floor(t.MinP), r[1] = Math.ceil(t.MaxP, 0), u.find(".currency").html(filterSetting.currency), u.find(".value").html(r[0]), f.find(".currency").html(filterSetting.currency), f.find(".value").html(r[1]), e = "#filter-price " + n + " .flight-filter-slider input", filterSetting.setPriceSlider(e, u, f, i))
        },
        setPriceSlider: function(n, t, i, r) {
            var u = r.price,
                f = new Slider(n, {
                    range: !0,
                    min: u[0],
                    max: u[1],
                    value: [u[0], u[1]]
                }),
                e;
            r.priceSlider = f;
            r.begin = t;
            r.end = i;
            $(n).parent().find(".tooltip").hide();
            e = "slider-color-change";
            f.on("slide", function() {
                var n = f.getValue();
                u[0] != n[0] && (u[0] = n[0], t.addClass(e));
                u[1] != n[1] && (u[1] = n[1], i.addClass(e));
                t.find(".value").html(u[0]);
                i.find(".value").html(u[1])
            });
            r.priceSlider = {
                slide: f,
                begin: t,
                end: i,
                min: u[0],
                max: u[1]
            };
            var o = $("#filter-price").parents(".nav-item").find(".title"),
                s = o.find(".filter-section-all"),
                c = o.attr("data-toggle"),
                h = 0;
            f.on("slideStop", function() {
                if (++h > 1) {
                    h = 0;
                    return
                }
                t.removeClass(e);
                i.removeClass(e);
                filterApply.applyFilter();
                var n = f.getValue();
                n[0] == r.priceSlider.min && n[1] == r.priceSlider.max ? (s.hide(), o.attr("data-toggle", c)) : (s.show(), o.removeAttr("data-toggle"))
            })
        },
        setAirports: function() {
            var u, n, o, i, s, r, h, f;
            filterSetting.setFilterAllClick("#filter-airports", filterInitialize.initializeCheckBox, model.filter.airports);
            var c = $("#airport-slug").val().capitalize(),
                t = $("#filter-airports"),
                l = t.find(".rt").clone(),
                e = t.find("ul").clone(),
                a = e.find("li").clone(),
                v = t.find(".filter-sub-header");
            for (e.html(""), t.html(""), u = 0; u < model.response.Filter.Airports.length; u++)(n = model.response.Filter.Airports[u], n.IsActive != "f") && (o = n.City.split(" ").join(""), i = t.find("." + o), i.length == 0 && (i = e.clone(), i.addClass("airport-groups " + o), s = v.clone(), s.html(n.City), t.append(s), t.append(i)), r = a.clone(), r.find(".min-price").html(n.Price + " " + filterSetting.currency), r.find(".check-box-wrapper label").html(n.Code + ": " + n.Name + " " + c), model.filter.airports.push({
                code: n.Code,
                value: !0,
                id: "airport-" + n.Code,
                isDep: n.IsDep == "t" ? !0 : !1
            }), r.attr("id", "airport-" + n.Code), i.append(r));
            h = t.find("ul");
            h.length == 2 && (f = !0, h.each(function() {
                $(this).find("li").length > 1 && (f = !1)
            }), f && (t.parents(".nav-item").remove(), model.filter.airports = []));
            f || model.response.Type != 1 || (t.prepend(l), filterSetting.setAirportRTClick());
            $(".airport-groups").each(function(n) {
                $(this).removeClass("airport-groups").addClass("airport-groups-" + n);
                filterSetting.setFilterClick(".airport-groups-" + n + " li", model.filter.airports)
            });
            filterSetting.setHover("#filter-airports li", ".flight .origin,  .flight .destination, .flight .origin-destination", "filter-hover-color", "color-turquoise")
        },
        setAirportRTClick: function() {
            var n = $(".rt").parents(".nav-item").find(".title"),
                t = n.find(".filter-section-all"),
                i = n.attr("data-toggle");
            $(".rt").click(function(r) {
                var u = $(this).find("input");
                $(u).is(r.target) || (u.is(":checked") ? u.removeAttr("checked") : u.prop("checked", !0));
                $(".rt").find("input").is(":checked") ? (t.show(), n.removeAttr("data-toggle")) : (t.hide(), n.attr("data-toggle", i));
                filterApply.applyFilter()
            })
        },
        setAirlines: function() {
            var r, t, n;
            filterSetting.setFilterAllClick("#filter-airlines", filterInitialize.initializeCheckBox, model.filter.airlines);
            var u = $("#filter-airlines"),
                i = u.find("ul"),
                f = i.find("li").clone();
            for (i.html(""), r = 0; r < model.response.Filter.AirLines.length; r++)(t = model.response.Filter.AirLines[r], t.IsActive != "f") && (n = f.clone(), n.addClass(t.Code), n.find(".min-price").html(t.Price + " " + filterSetting.currency), n.find(".check-box-wrapper label").html(t.Name), model.filter.airlines.push({
                code: t.Code,
                value: !0,
                id: "airline-" + t.Code
            }), n.attr("id", "airline-" + t.Code), i.append(n));
            i.find("li").length == 1 ? u.parents(".nav-item").remove() : (n = f.clone(), n.addClass("multiple"), n.attr("id", "airline-multiple"), n.find(".min-price").remove(), n.find(".filter-only").remove(), i.append(n), model.filter.airlines.push({
                code: "multiple",
                value: !0,
                id: "airline-multiple"
            }), filterSetting.setFilterClick("#filter-airlines ul li", model.filter.airlines), filterSetting.setHover("#filter-airlines ul li", ".flight .airline-name", "filter-hover-color", "color-turquoise"))
        },
        stopAirports: function() {
            var r, n, t;
            filterSetting.setFilterAllClick("#filter-stop-airlines", filterInitialize.initializeCheckBox, model.filter.stopAirports);
            var u = $("#filter-stop-airlines"),
                i = u.find("ul"),
                f = i.find("li").clone();
            for (i.html(""), r = 0; r < model.response.Filter.Airports.length; r++)(n = model.response.Filter.Airports[r], n.IsActive != "t") && (model.filter.stopAirports.push({
                code: n.Code,
                value: !0,
                id: "stop-airline-" + n.Code
            }), t = f.clone(), t.addClass(n.Code), t.attr("id", "stop-airline-" + n.Code), t.find(".min-price").html(n.Price + " " + filterSetting.currency), t.find(".check-box-wrapper label").html(n.City + " (" + n.Code + ")"), i.append(t));
            i.find("li").length == 0 ? (u.parents(".nav-item").remove(), model.filter.stopAirports = []) : (filterSetting.setFilterClick("#filter-stop-airlines ul li", model.filter.stopAirports), filterSetting.setHover("#filter-stop-airlines ul li", ".flight .flight-transfer", "filter-hover-color", "color-turquoise"))
        },
        setDurations: function() {
            var n, t, i;
            filterSetting.setFilterAllClick("#filter-duration", filterInitialize.initializeDurationSlider, null);
            n = model.response.Filter.Departure;
            t = model.response.Filter.Return;
            model.response.Type != 2 ? (filterSetting.setDurationFilter(" .departure-duration ", n, model.filter.departure), filterSetting.setHover("#filter-duration .departure-duration .slider", ".departure-flight .duration", "filter-hover-color", "color-turquoise"), filterSetting.setDurationFilter(" .return-duration ", t, model.filter.ret), filterSetting.setHover("#filter-duration .return-duration .slider", ".return-flight .duration", "filter-hover-color", "color-turquoise")) : (filterSetting.setDurationFilter(" .departure-duration ", n, model.filter.departure), filterSetting.setHover("#filter-duration .departure-duration .slider", ".departure-flight .duration", "filter-hover-color", "color-turquoise"), $("#filter-duration .return-duration").remove(), i = $("#filter-duration .departure-duration .filter-sub-header").remove())
        },
        setDurationFilter: function(n, t, i) {
            var s, r, e;
            i.minDuration = t.DMinD;
            i.maxDuration = t.DMaxD;
            var u = $("#filter-duration " + n + " .begin-duration"),
                f = $("#filter-duration " + n + " .end-duration"),
                l = model.getTimeFormatted(i.minDuration);
            u.find(".value").html(l);
            s = model.getTimeFormatted(i.maxDuration);
            f.find(".value").html(s);
            r = new Slider("#filter-duration " + n + " .slider-range", {
                range: !0,
                min: i.minDuration,
                max: i.maxDuration,
                value: [i.minDuration, i.maxDuration]
            });
            i.durationSlider = {
                slide: r,
                begin: u,
                end: f,
                min: i.minDuration,
                max: i.maxDuration
            };
            $("#filter-duration " + n).find(".tooltip").hide();
            $("#filter-duration " + n + " .min-slider-handle").hide();
            e = "slider-color-change";
            r.on("slide", function() {
                var n = r.getValue(),
                    t, o;
                i.minDuration != n[0] && (i.minDuration = n[0], u.addClass(e));
                i.maxDuration != n[1] && (i.maxDuration = n[1], f.addClass(e));
                t = model.getTimeFormatted(i.minDuration);
                u.find(".value").html(t);
                o = model.getTimeFormatted(i.maxDuration);
                f.find(".value").html(o)
            });
            var o = $("#filter-duration").parents(".nav-item").find(".title"),
                h = o.find(".filter-section-all"),
                a = o.attr("data-toggle"),
                c = 0;
            r.on("slideStop", function() {
                if (++c > 1) {
                    c = 0;
                    return
                }
                u.removeClass(e);
                f.removeClass(e);
                filterApply.applyFilter();
                var n = r.getValue();
                n[0] == i.durationSlider.min && n[1] == i.durationSlider.max ? (h.hide(), o.attr("data-toggle", a)) : (h.show(), o.removeAttr("data-toggle"))
            })
        },
        helper: {
            setTopFilterValues: function(n, t, i, r) {
                $("#" + n).find("input").prop("checked", !0);
                $("#" + n).find(".min-price").html(i + " " + filterSetting.currency);
                var u = {};
                u.id = n;
                u.value = !0;
                u.number = t;
                r.push(u)
            },
            getPartialName: function(n) {
                var t = n.substring(0, Math.min(n.length, 13));
                return t != n && (t = t + "..."), t
            }
        }
    },
    filterApply = {
        applyFilter: function() {
            var n = [filterApply.applyRTDomesticFilter, filterApply.applyRTInternationalFilter, filterApply.applyOneWayFilter],
                t = [DomesticRT, InternationalRT, OneWay];
            n[model.response.Type]();
            t[model.response.Type].RenderFlightsDirectly()
        },
        applyRTDomesticFilter: function() {
            var i = model.response.Combs[0].Dep,
                r = model.response.Combs[0].Ret,
                f = Math.max(i.length, r.length),
                u, n, t;
            for (model.filteredResponse = model.newResult(), u = {
                    Dep: [],
                    Ret: [],
                    CombSC: model.response.Combs[0].CombSC,
                    Price: null
                }, model.filteredResponse.Combs.push(u), n = 0; n < f; n++) n < i.length && (t = filterApply.applyFilterToOneFlight(i[n], "d"), t && model.filteredResponse.Combs[0].Dep.push(i[n])), n < r.length && (t = filterApply.applyFilterToOneFlight(r[n], "r"), t && model.filteredResponse.Combs[0].Ret.push(r[n]));
            DomesticRT.SelectedFilterResults = model.filteredResponse
        },
        applyFilterToOneFlight: function(n, t) {
            var i = filterApply.applyTransfer(n);
            return i && (i = filterApply.applyPromotion(n.IsP)), i && t == "d" && (i = filterApply.applyDate(n, model.filter.departure)), i && t == "r" && (i = filterApply.applyDate(n, model.filter.ret)), i && (i = filterApply.applyAirport(t, n)), i && (i = filterApply.applyAirline(n)), i && (i = filterApply.applyStopAirports(n)), i && t == "d" && (i = filterApply.applyDuration(n, model.filter.departure)), i && t == "r" && (i = filterApply.applyDuration(n, model.filter.ret)), i && t == "d" && (i = filterApply.applyPrice(n.Price, model.filter.departure.price[0], model.filter.departure.price[1])), i && t == "r" && (i = filterApply.applyPrice(n.Price, model.filter.ret.price[0], model.filter.ret.price[1])), i
        },
        applyRTInternationalFilter: function() {
            var u;
            for (model.filteredResponse = model.newResult(), u = 0; u < model.response.Combs.length; u++) {
                var r = model.response.Combs[u],
                    t = r.Dep[0],
                    i = r.Ret[0],
                    f = r.Price,
                    n = filterApply.applyTransferRT(t, i);
                n && (n = filterApply.applyPromotionRT(t, i));
                n && (n = filterApply.applyDate(t, model.filter.departure));
                n && (n = filterApply.applyDate(i, model.filter.ret));
                n && (n = filterApply.applyAirportRT(t, i));
                n && (n = filterApply.applyAirportRTSame(t, i));
                n && (n = filterApply.applyAirline(t) || filterApply.applyAirline(i));
                n && (n = filterApply.applyStopAirports(t) && filterApply.applyStopAirports(i));
                n && (n = filterApply.applyDuration(t, model.filter.departure));
                n && (n = filterApply.applyDuration(i, model.filter.ret));
                n && (n = filterApply.applyPrice(r.Price, model.filter.departure.price[0], model.filter.departure.price[1]));
                n && model.filteredResponse.Combs.push(r)
            }
        },
        applyOneWayFilter: function() {
            var n, t, i;
            for (model.filteredResponse = model.newResult(), n = 0; n < model.response.Combs.length; n++) t = model.response.Combs[n], i = filterApply.applyFilterToOneFlight(t.Dep[0], "d"), i && model.filteredResponse.Combs.push(t)
        },
        applyTransfer: function(n) {
            for (var t, i, r = 0; r < model.filter.transfers.length; r++)
                if (t = model.filter.transfers[r], i = n.TRN, t.value == !1 && ((i == 0 || i == 1) && t.number == i || t.number == 2 && i >= t.number)) return !1;
            return !0
        },
        applyTransferRT: function(n, t) {
            for (var i = 0; i < model.filter.transfers.length; i++) {
                var r = model.filter.transfers[i],
                    u = n.TRN,
                    f = t.TRN;
                if (r.value == !1 && (r.number == 2 && (u > 1 || f > 1) || r.number == 1 && (u == 1 || f == 1) && u + f < 3 || r.number == 0 && u == 0 && f == 0)) return !1
            }
            return !0
        },
        applyPromotion: function(n) {
            for (var i, t = 0; t < model.filter.refundables.length; t++)
                if (i = model.filter.refundables[t], !i.value && (i.number == 0 && n == "f" || i.number == 1 && n == "t")) return !1;
            return !0
        },
        applyPromotionRT: function(n, t) {
            var i = "f";
            return (n.IsP == "t" || t.IsP == "t") && (i = "t"), filterApply.applyPromotion(i)
        },
        applyDate: function(n, t) {
            var i = [!0, !0],
                r, u;
            return n.hasOwnProperty("dates") || (n.dates = new FlightDate(n.Ddate, n.Adate)), r = n.dates.DepDate, u = n.dates.ArrDate, (r < t.takeOffTime.MinDateAsTime || r > t.takeOffTime.MaxDateAsTime) && (i[0] = !1), (u < t.landingTime.MinDateAsTime || u > t.landingTime.MaxDateAsTime) && (i[1] = !1), i[0] && i[1]
        },
        applyAirport: function(n, t) {
            for (var i, r = 0; r < model.filter.airports.length; r++)
                if (i = model.filter.airports[r], i.value == !1)
                    if (n == "d") {
                        if (i.isDep == !0) {
                            if (t.O == i.code) return !1
                        } else if (t.D == i.code) return !1
                    } else if (i.isDep == !0) {
                if (t.D == i.code) return !1
            } else if (t.O == i.code) return !1;
            return !0
        },
        applyAirportRT: function(n, t) {
            for (var i, r = 0; r < model.filter.airports.length; r++)
                if (i = model.filter.airports[r], i.value == !1 && (i.isDep == !0 && (n.O == i.code || t.D == i.code) || i.isDep == !1 && (n.D == i.code || t.O == i.code))) return !1;
            return !0
        },
        applyAirportRTSame: function(n, t) {
            return $(".rt").find("input").is(":checked") && (n.O != t.D || n.D != t.O) ? !1 : !0
        },
        applyAirline: function(n) {
            for (var f = n.MA.split(";"), r = null, u = !1, t, i = 0; i < model.filter.airlines.length; i++) {
                if (t = model.filter.airlines[i], t.code == "multiple") {
                    r = t;
                    continue
                }
                t.value == !0 && n.MA.indexOf(t.code) > -1 && (u = !0)
            }
            return (r == null || r.value == !1) && f.length > 1 ? !1 : u
        },
        applyStopAirports: function(n) {
            var t, i;
            if (n.TRN == 0) return !0;
            for (t = 0; t < model.filter.stopAirports.length; t++)
                if (i = model.filter.stopAirports[t], i.value == !1 && n.TRF.indexOf(i.code) > -1) return !1;
            return !0
        },
        applyDuration: function(n, t) {
            return (n.hasOwnProperty("duration") || (n.duration = model.TimeToMinutes(n.DR)), n.duration < t.minDuration || n.duration > t.maxDuration) ? !1 : !0
        },
        applyPrice: function(n, t, i) {
            return (n.hasOwnProperty("totalAmount") || model.SetTotalPrice(n), n.totalAmount < t || n.totalAmount > i) ? !1 : !0
        }
    },
    flightSorters = {
        init: function() {
            model.response.Type == 2 && $("#flight-sorting .rt").remove();
            $("#flight-sorting").width($("#width_tmp").width() + 30);
            $("#flight-sorting").change(function() {
                var n = $(this).find(":selected"),
                    t;
                $("#width_tmp").html(n.text());
                $(this).width($("#width_tmp").width() + 30);
                t = n.val();
                flightSorters.sort(t)
            })
        },
        sort: function(n) {
            switch (n) {
                case "pa":
                    flightSorters.sortByPrice(!1);
                    break;
                case "pd":
                    flightSorters.sortByPrice(!0);
                    break;
                case "dta":
                    flightSorters.sortByTime(!1, "Dep", "DepDate");
                    break;
                case "dtd":
                    flightSorters.sortByTime(!0, "Dep", "DepDate");
                    break;
                case "dla":
                    flightSorters.sortByTime(!1, "Dep", "ArrDate");
                    break;
                case "dld":
                    flightSorters.sortByTime(!0, "Dep", "ArrDate");
                    break;
                case "rta":
                    flightSorters.sortByTime(!1, "Ret", "DepDate");
                    break;
                case "rtd":
                    flightSorters.sortByTime(!0, "Ret", "DepDate");
                    break;
                case "rla":
                    flightSorters.sortByTime(!1, "Ret", "ArrDate");
                    break;
                case "rld":
                    flightSorters.sortByTime(!0, "Ret", "ArrDate");
                    break;
                case "da":
                    flightSorters.sortByDuration(!1);
                    break;
                case "dd":
                    flightSorters.sortByDuration(!0);
                    break;
                case "aa":
                    flightSorters.sortByAirline(!1);
                    break;
                default:
                    flightSorters.sortByPrice(!1)
            }
            flightSorters.setSponsorToTop();
            filterApply.applyFilter()
        },
        setSponsorToTop: function() {
            var n = [model.setSponsorForDomesticRT, model.setSponsorForInternationalRT, model.setSponsorForOneWay, ];
            n[model.response.Type]()
        },
        sortByPrice: function(n) {
            var t = [flightSorters.sortByPriceDomestic, flightSorters.sortByPriceCombo, flightSorters.sortByPriceCombo];
            t[model.response.Type](n)
        },
        sortByPriceCombo: function(n) {
            model.response.Combs = n ? model.response.Combs.sort(function(n, t) {
                return t.Price.F - t.Price.D - (n.Price.F - n.Price.D)
            }) : model.response.Combs.sort(function(n, t) {
                return n.Price.F - n.Price.D - (t.Price.F - t.Price.D)
            })
        },
        sortByPriceDomestic: function(n) {
            n ? (model.response.Combs[0].Dep = model.response.Combs[0].Dep.sort(function(n, t) {
                return t.Price.F - t.Price.D - (n.Price.F - n.Price.D)
            }), model.response.Combs[0].Ret = model.response.Combs[0].Ret.sort(function(n, t) {
                return t.Price.F - t.Price.D - (n.Price.F - n.Price.D)
            })) : (model.response.Combs[0].Dep = model.response.Combs[0].Dep.sort(function(n, t) {
                return n.Price.F - n.Price.D - (t.Price.F - t.Price.D)
            }), model.response.Combs[0].Ret = model.response.Combs[0].Ret.sort(function(n, t) {
                return n.Price.F - n.Price.D - (t.Price.F - t.Price.D)
            }))
        },
        sortByTime: function(n, t, i) {
            var r = [flightSorters.sortByTimeDomestic, flightSorters.sortByTimeCombo, flightSorters.sortByTimeCombo];
            r[model.response.Type](n, t, i)
        },
        sortByTimeCombo: function(n, t, i) {
            for (var r = 0; r < model.response.Combs.length; r++) flightSorters.helperSetDepAndRet(model.response.Combs[r][t][0]);
            model.response.Combs = n ? model.response.Combs.sort(function(n, r) {
                return r[t][0].dates[i] - n[t][0].dates[i]
            }) : model.response.Combs.sort(function(n, r) {
                return n[t][0].dates[i] - r[t][0].dates[i]
            })
        },
        sortByTimeDomestic: function(n, t, i) {
            for (var r = 0; r < model.response.Combs[0][t].length; r++) flightSorters.helperSetDepAndRet(model.response.Combs[0][t][r]);
            model.response.Combs[0][t] = n ? model.response.Combs[0][t].sort(function(n, t) {
                return t.dates[i] - n.dates[i]
            }) : model.response.Combs[0][t].sort(function(n, t) {
                return n.dates[i] - t.dates[i]
            })
        },
        sortByDuration: function(n) {
            var t = [flightSorters.sortByDurationDomestic, flightSorters.sortByDurationInternational, flightSorters.sortByDurationOneWay];
            t[model.response.Type](n)
        },
        sortByDurationInternational: function(n) {
            for (var t = 0; t < model.response.Combs.length; t++) flightSorters.helperSetDepAndRetDuration(model.response.Combs[t].Dep[0]), flightSorters.helperSetDepAndRetDuration(model.response.Combs[t].Ret[0]);
            model.response.Combs = n ? model.response.Combs.sort(function(n, t) {
                return t.Dep[0].duration + t.Ret[0].duration - (n.Dep[0].duration + n.Ret[0].duration)
            }) : model.response.Combs.sort(function(n, t) {
                return n.Dep[0].duration + n.Ret[0].duration - (t.Dep[0].duration + t.Ret[0].duration)
            })
        },
        sortByDurationOneWay: function(n) {
            for (var t = 0; t < model.response.Combs.length; t++) flightSorters.helperSetDepAndRetDuration(model.response.Combs[t].Dep[0]);
            model.response.Combs = n ? model.response.Combs.sort(function(n, t) {
                return t.Dep[0].duration - n.Dep[0].duration
            }) : model.response.Combs.sort(function(n, t) {
                return n.Dep[0].duration - t.Dep[0].duration
            })
        },
        sortByDurationDomestic: function(n) {
            for (var t = 0; t < model.response.Combs[0].Dep.length; t++) flightSorters.helperSetDepAndRetDuration(model.response.Combs[0].Dep[t]);
            for (t = 0; t < model.response.Combs[0].Ret.length; t++) flightSorters.helperSetDepAndRetDuration(model.response.Combs[0].Ret[t]);
            n ? (model.response.Combs[0].Dep = model.response.Combs[0].Dep.sort(function(n, t) {
                return t.duration - n.duration
            }), model.response.Combs[0].Ret = model.response.Combs[0].Ret.sort(function(n, t) {
                return t.duration - n.duration
            })) : (model.response.Combs[0].Dep = model.response.Combs[0].Dep.sort(function(n, t) {
                return n.duration - t.duration
            }), model.response.Combs[0].Ret = model.response.Combs[0].Ret.sort(function(n, t) {
                return n.duration - t.duration
            }))
        },
        sortByAirline: function() {
            var n = [flightSorters.sortByAirlineDomestic, flightSorters.sortByAirlineInternational, flightSorters.sortByAirlineOneWay];
            n[model.response.Type](!1)
        },
        sortByAirlineInternational: function() {
            model.response.Combs = model.response.Combs.sort(function(n, t) {
                return flightSorters.helperSortAlpabetically(n.Dep[0], t.Dep[0]) || flightSorters.helperSortAlpabetically(n.Ret[0], t.Ret[0])
            })
        },
        sortByAirlineOneWay: function() {
            model.response.Combs = model.response.Combs.sort(function(n, t) {
                return flightSorters.helperSortAlpabetically(n.Dep[0], t.Dep[0])
            })
        },
        sortByAirlineDomestic: function() {
            model.response.Combs[0].Dep = model.response.Combs[0].Dep.sort(function(n, t) {
                return flightSorters.helperSortAlpabetically(n, t)
            });
            model.response.Combs[0].Ret = model.response.Combs[0].Ret.sort(function(n, t) {
                return flightSorters.helperSortAlpabetically(n, t)
            })
        },
        helperSetDepAndRet: function(n) {
            n.hasOwnProperty("dates") || (n.dates = new FlightDate(n.Ddate, n.Adate))
        },
        helperSetDepAndRetDuration: function(n) {
            n.hasOwnProperty("duration") || (n.duration = model.TimeToMinutes(n.DR))
        },
        helperGetAirlineName: function(n) {
            var t = n.MA.split(";")[0],
                i = model.getAirlineFromCode(t);
            return i.Name.toLowerCase()
        },
        helperSortAlpabetically: function(n, t) {
            var i = flightSorters.helperGetAirlineName(n),
                r = flightSorters.helperGetAirlineName(t);
            return i < r ? -1 : i > r ? 1 : 0
        }
    };
$(document).ready(function() {
    flightSearch.init()
});
flightSearch = {
    SC: null,
    loading: !0,
    init: function() {
        flightSearch.doSearch()
    },
    makeLoading: function() {
        var n = 0,
            u = $(".div-search-list .loading-bubble").offset().top - 100,
            t = $(".loading-bubble").width(),
            i = $(window).height() - u,
            r;
        flightSearch.flightLoading(".loading-bubble", n++, t, i, 0);
        r = setInterval(function() {
            flightSearch.loading ? flightSearch.flightLoading(".loading-bubble", n++, t, i, 0) : ($(".dream").remove(), clearInterval(r))
        }, 600)
    },
    doSearch: function() {
        flightSearch.makeLoading();
        $.ajax({
            url: "/Flight/GetResults",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: !1,
            data: JSON.stringify(flightSearch.getSearchData()),
            async: !0,
            success: function(n) {
                n.HasError == !0 ? $(".flight-search-loading").hide() : (flightSearch.loading = !1, flightSearch.renderResults(n), remarketing.init(), flightSearch.TrackSearchResultEvent())
            },
            error: function() {
                flightSearch.loading = !1;
                $(".flight-search-loading").hide()
            }
        })
    },
    getSearchData: function() {
        var f = $("#rd-one-way-research").is(":checked"),
            c = $("#direct-fight-only").val(),
            l = $("#refundable-only").val(),
            r = $(".adult-count").val(),
            n, u, t, i, o, e;
        r && r != "undefined" && r != "" || (r = "0");
        n = $(".child-count").val();
        n && n != "undefined" && n != "" || (n = "0");
        u = $(".infant-count").val();
        u && u != "undefined" && u != "" || (u = "0");
        t = $(".senior-count").val();
        t && t != "undefined" && t != "" || (t = "0");
        i = $(".student-count").val();
        i && i != "undefined" && i != "" || (i = "0");
        o = $(".fromdate-next").val();
        e = "";
        f == !1 && (e = $(".todate-next").val());
        var a = $("#flight_origincode").val(),
            v = $("#flight_destcode").val(),
            y = $("#flight-class").val(),
            s = $("#campaign-code").val(),
            p = $(".redirectUrl").val(),
            h = {
                Origin: {
                    Slug: a
                },
                Destination: {
                    Slug: v
                },
                DepartureDate: o,
                ReturnDate: f == !1 ? e : null,
                AdultCount: r,
                ChildCount: n,
                InfantCount: u,
                SeniorCount: t,
                StudentCount: i,
                defaultClassValue: y,
                IsOneWay: f,
                DirectFlightOnly: c,
                RefundableOnly: l,
                CampaignCode: s == "" ? null : s,
                URL: p
            };
        return model.searchData = h, model.passCountWithoutInfant = parseInt(r) + parseInt(n) + parseInt(t) + parseInt(i), h
    },
    saveInCookie: function(n, t) {
        SessionCookie.Fields.SHOPPING_ID = n;
        SessionCookie.Fields.REQUEST_ID = t;
        SessionCookie.Save()
    },
    renderResults: function(n) {
        model.response = n;
        model.filteredResponse = n;
        model.currency = n.CUR;
        model.dateFormat = $(".fromdate").datepicker("option", "dateFormat");
        model.dateFormat = model.dateFormat.replace(/\./g, " ").replace(/\//g, " ").replace("M", "MM");
        model.dateFormat = model.dateFormat.replace("D", "DD");
        var t = [DomesticRT.Render, InternationalRT.Render, OneWay.Render];
        t[n.Type]();
        filterSetting.setFilterValues();
        flightSorters.init()
    },
    randomBetween: function(n, t) {
        return Math.floor(Math.random() * (t - n + 1) + n)
    },
    flightLoading: function(n, t, i, r, u) {
        var s = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")",
            o = flightSearch.randomBetween(100, 300),
            e = Math.floor(Math.random() * i),
            f;
        e < 150 ? e += 150 : e >= i - 150 && (e -= 150);
        f = Math.floor(Math.random() * r);
        f <= u + 150 ? f = f + u + 150 : f >= r - 150 && (f -= 150);
        drawingpix = $('<span class="dream" style="position:absolute;">').attr({
            id: "drawingpix-" + t
        }).hide();
        $(n).append(drawingpix);
        drawingpix.css({
            "background-color": s,
            "border-radius": "100px",
            "-moz-border-radius": "100px",
            "-webkit-border-radius": "100px",
            opacity: .16,
            top: f - 14,
            left: e - 14
        }).show().animate({
            height: o + "px",
            width: o + "px",
            "border-radius": o + "px",
            "-moz-border-radius": o + "px",
            "-webkit-border-radius": o + "px",
            opacity: .1,
            top: f - 150,
            left: e - 150
        }, 2e3).fadeOut(900);
        setTimeout(function() {
            $("#drawingpix-" + t).remove()
        }, 2900)
    },
    TrackSearchResultEvent: function() {
        try {
            flightSearchTracking.TrackFlightSearchResult()
        } catch (n) {}
    }
};
remarketing = {
    init: function() {
        var n = remarketing.getParams();
        remarketing.trackConversion(n)
    },
    getParams: function() {
        var i = remarketing.getPrice(),
            r = $("#remarket-currency-code").val(),
            n = $("#remarket-flight-return-date").val(),
            t = {
                flight_pagetype: "searchresults",
                flight_destid: $("#remarket-flight-destination-city-code").val(),
                flight_originid: $("#remarket-flight-origin-city-code").val(),
                flight_startdate: $("#remarket-flight-departure-date").val(),
                flight_totalvalue: remarketing.getPrice()
            };
        return n != "" && (t.flight_enddate = n), t
    },
    getFinalUrl: function() {
        var n = window.location.pathname,
            t = $("#domain-base-url").val();
        return t + n
    },
    getImageUrl: function() {
        var n = $("#remarket-flight-destination-city-code").val().toLowerCase();
        return "https://res.cloudinary.com/turna/image/upload/q_auto/Images/Pictures/Content/City/" + n + "-description.jpg"
    },
    getTripType: function() {
        return model.response.Type == 2 ? "OW" : "RT"
    },
    getPrice: function() {
        for (var t = Number.MAX_VALUE, i = model.response.Filter.Refundables, n = 0; n < i.length; n++) t = Math.min(t, i[n].Price);
        return t
    },
    trackConversion: function(n) {
        window.google_trackConversion({
            google_conversion_id: $("#remarket-google-conversion-id").val(),
            google_custom_params: n,
            google_remarketing_only: !0
        })
    }
};
$(document).ready(function() {
    ecommerce.init()
});
ecommerce = {
    counter: 1,
    originCode: $("#graph-origin-code").val(),
    originCityCode: $("#origin-city-code").val(),
    destinationCode: $("#graph-destination-code").val(),
    destinationCityCode: $("#destination-city-code").val(),
    departureDate: base.getDateFromString($("#graph-departure-date").val()),
    returnDate: $("#graph-return-date").val() != "" ? base.getDateFromString($("#graph-return-date").val()) : null,
    currencyCode: $("#api-currency-code").val(),
    isOriginDomestic: $("#graph-origin-is-domestic").val() === "true",
    isDestinationDomestic: $("#graph-destination-is-domestic").val() === "true",
    init: function() {
        ecommerce.beginProcessingImpressionData()
    },
    isDomestic: function() {
        return (ecommerce.originCode == "ECN" || ecommerce.isOriginDomestic) && (ecommerce.destinationCode == "ECN" || ecommerce.isDestinationDomestic)
    },
    isDomOrINT: function() {
        return ecommerce.isDomestic() ? "DOM" : "INT"
    },
    roundTripList: function() {
        return ecommerce.isDomOrINT() + "-ROUND-TRIP-RESULT"
    },
    oneWayList: function() {
        return ecommerce.isDomOrINT() + "-ONE-WAY-RESULT"
    },
    send: function(n) {
        n && ga("send", "event", "Scroll Tracking", "impression", {
            nonInteraction: !0
        })
    },
    beginProcessingImpressionData: function() {
        setInterval(function() {
            try {
                ecommerce.roundTripDomesticView();
                ecommerce.roundTripInternationalView();
                ecommerce.onewayView()
            } catch (n) {}
        }, 5e3)
    },
    roundTripDomesticView: function() {
        var i, r, t, n;
        if (model.response != null && model.response.Type == 0) {
            for (i = !1, r = 0, t = 0; t < model.scrollResults.items.length; t++)
                if ((n = model.scrollResults.items[t], !n.handled) && (ecommerce.roundTripSingleImpression(n.item, n.type), n.handled = !0, i = !0, ++r > 12)) break;
            ecommerce.send(i)
        }
    },
    domesticChoosenRTImpression: function(n, t) {
        try {
            model.scrollResults[n.Id + t.Id] || (model.scrollResults[n.Id + t.Id] = !0, model.scrollResults.items.push({
                handled: !0
            }), ecommerce.roundTripImpression(n, t), ecommerce.send(!0))
        } catch (i) {}
    },
    roundTripInternationalView: function() {
        var r, i, t, n;
        if (model.response != null && model.response.Type == 1) {
            for (r = !1, i = 0, t = 0; t < model.scrollResults.items.length; t++)
                if ((n = model.scrollResults.items[t], !n.handled) && (ecommerce.roundTripImpression(n.depFlight, n.retFlight), n.depFlight.separate && (ecommerce.roundTripSingleImpression(n.depFlight, "dep"), ecommerce.roundTripSingleImpression(n.retFlight, "ret"), i += 2), n.handled = !0, r = !0, ++i > 12)) break;
            ecommerce.send(!0)
        }
    },
    roundTripImpression: function(n, t) {
        var i = ecommerce.getRouteFromType("dep"),
            r = ecommerce.getOriginFromType("dep"),
            u = ecommerce.getDestinationFromType("dep"),
            f = {
                id: ecommerce.getIdFromItem(n) + "|" + ecommerce.getIdFromItem(t),
                name: n.FNS + "|" + t.FNS,
                category: ecommerce.isDomOrINT() + "/" + i + "/" + r + "/" + u,
                brand: n.MA != t.MA ? n.MA + " / " + t.MA : n.MA,
                variant: "RT",
                list: ecommerce.roundTripList(),
                position: ecommerce.counter++
            };
        ga("ec:addImpression", f)
    },
    roundTripSingleImpression: function(n, t) {
        var i = ecommerce.getRouteFromType(t),
            r = ecommerce.getOriginFromType(t),
            u = ecommerce.getDestinationFromType(t),
            f = {
                id: ecommerce.getIdFromItem(n),
                name: n.FNS,
                category: ecommerce.isDomOrINT() + "/" + i + "/" + r + "/" + u,
                brand: n.MA,
                variant: "RT",
                list: ecommerce.roundTripList(),
                position: ecommerce.counter++
            };
        ga("ec:addImpression", f)
    },
    onewayView: function() {
        var i, r, t, n;
        if (model.response != null && model.response.Type == 2) {
            for (i = !1, r = 0, t = 0; t < model.scrollResults.items.length; t++)
                if (n = model.scrollResults.items[t], !n.handled) {
                    var u = ecommerce.getRouteFromType("dep"),
                        f = ecommerce.getOriginFromType("dep"),
                        e = ecommerce.getDestinationFromType("dep"),
                        o = {
                            id: ecommerce.getIdFromItem(n.item),
                            name: n.item.FNS,
                            category: ecommerce.isDomOrINT() + "/" + u + "/" + f + "/" + e,
                            brand: n.item.MA,
                            variant: "OW",
                            list: ecommerce.oneWayList(),
                            position: ecommerce.counter++
                        };
                    if (ga("ec:addImpression", o), n.handled = !0, i = !0, ++r > 12) break
                }
            ecommerce.send(!0)
        }
    },
    getIdFromItem: function(n) {
        var t = n.O + ";" + n.D + ";" + n.FNS + ";" + n.Ddate;
        return t.replace(" ", "_")
    },
    getRouteFromType: function(n) {
        var t = ecommerce.originCityCode + "-" + ecommerce.destinationCityCode;
        return n == "ret" && (t = ecommerce.destinationCityCode + "-" + ecommerce.originCityCode), t
    },
    getOriginFromType: function(n) {
        var t = "from:" + ecommerce.originCityCode;
        return n == "ret" && (t = "from:" + ecommerce.destinationCityCode), t
    },
    getDestinationFromType: function(n) {
        var t = "to:" + ecommerce.destinationCityCode;
        return n == "ret" && (t = "to:" + ecommerce.originCityCode), t
    }
};
EstimationGraph.prototype.setMonthNamesForGraph = function() {
    var u = "." + this.Type + "-month",
        i, r, n, f, t, e;
    for ($(u).html(""), i = 0; i < 12; i++) r = new Date, n = new Date(r.getFullYear(), r.getMonth(), 1), n.setMonth(n.getMonth() + i), f = $.datepicker.formatDate("M", n).toUpperCase(), t = document.createElement("a"), $(t).html(f).attr("href", "#"), e = new Date(n.getFullYear(), n.getMonth(), 1), $(t).attr("data-date", $.datepicker.formatDate("yy-mm-dd", e)), n.getMonth() == graphRender.getSelectedDate(this.Type).getMonth() && $(t).addClass("active"), $(u).append(t)
};
EstimationGraph.prototype.setDateText = function() {
    var n = ".graph-" + this.Type + "-text",
        t = $.datepicker.formatDate("dd M yy", graphRender.getSelectedDate(this.Type));
    $(n).html(t)
};
EstimationGraph.prototype.updateGraphUnderline = function() {
    for (var i = [], r = [], o = this.EstimationNodes.length, u, t, f, s, e, h, n = 0; n < o; n++) u = this.EstimationNodes[n].Day, t = new Date(u.getFullYear(), u.getMonth(), 1), r[t] ? r[t] = r[t] + 1 : (i.push(t), r[t] = 1);
    for (f = "." + this.Type + "-month-line", $(f).html(""), s = $(".trn-search").length, n = 0; n < i.length; n++) e = r[i[n]] / o * 100, s > 0 && (e -= 1), h = $.datepicker.formatDate("M", i[n]).toUpperCase(), $("<p><\/p>").attr("data-date", $.datepicker.formatDate("yy-mm-dd", i[n])).css("width", e + "%").append($("<i>" + h + "<\/i>")).appendTo(f)
};
EstimationGraph.prototype.setGraphData = function(n) {
    var t = graphRender.getStartDate(this.Type);
    this.fixSelectedDateIndex(t);
    t.setDate(t.getDate() - graphRender.paddings[this.Type]);
    this.setEstimationNodes(n, this.Type);
    this.updateGraphUnderline()
};
EstimationGraph.prototype.setEstimationNodes = function(n, t) {
    var i = null,
        r, u, f;
    for (t == "departure" ? i = n.DepartureCalendar : t == "return" && (i = n.ReturnCalendar), r = 0; r < i.Prices.length; r++) u = graphRender.getStartDate(this.Type), u.setHours(0, 0, 0, 0), u.setDate(u.getDate() + r), f = new EstimationNode(u, i.Prices[r], i.Currency), this.EstimationNodes.push(f)
};
EstimationGraph.prototype.fixSelectedDateIndex = function(n) {
    if (isNaN(graphRender.paddings[this.Type])) {
        var t = n - graphRender.Graphs[this.Type].EstimationNodes[0].Day;
        graphRender.paddings[this.Type] = Math.floor(t / 864e5);
        graphRender.paddings[this.Type] = this.SelectedDateIndex % graphRender.graphNodeCount
    }
};
EstimationGraph.prototype.lastDate = function() {
    return this.EstimationNodes[this.EstimationNodes.length - 1].Day
};
EstimationGraph.prototype.firstDate = function() {
    return this.EstimationNodes[0].Day
};
EstimationGraph.prototype.dateExistsInGraph = function(n) {
    var t = n.setHours(0, 0, 0, 0);
    return this.lastDate().setHours(0, 0, 0, 0) >= t && this.firstDate().setHours(0, 0, 0, 0) <= t ? !0 : !1
};
$(document).ready(function() {
    $(".search-graph-init").length == 0 && flightSearchGraphHelper.init()
});
flightSearchGraphHelper = {
    init: function() {
        initGoogleChartForEstimationGraph();
        flightSearchGraphHelper.changeGraphDataEvents();
        flightSearchGraphHelper.searchChartDatesOnClick();
        flightSearchGraphHelper.datepickerOnSelect();
        flightSearchGraphHelper.oneOrTwoWayClick();
        flightSearchGraphHelper.addLinearGradientToBody()
    },
    changeGraphDataEvents: function() {
        flightSearchGraphHelper.changeGraphDataOnNavigation();
        flightSearchGraphHelper.changeGraphDataOnMonthSelect()
    },
    changeGraphDataOnNavigation: function() {
        $(".right").click(function() {
            var i = flightSearchGraphHelper.getGraphType(this, "right"),
                r = flightSearchGraphHelper.getNextDate(i),
                n, t;
            base.getNextYearToday() < r || (n = !0, t = !0, i == "return" && (n = !1), (graphRender.returnDate >= r || graphRender.isOneWay) && (t = !1), graphRender.isRoundTripInternational() && (n = !0, t = !0), flightSearchGraphHelper.setHiddenInputsAndDrawGraph(i, r, n, t))
        });
        $(".left").click(function() {
            var r = flightSearchGraphHelper.getGraphType(this, "left"),
                n = flightSearchGraphHelper.getPreviousDate(r),
                t, i;
            n = base.getTodayIfEarlierThanToday(n);
            t = !0;
            i = !0;
            (r == "departure" || graphRender.isOneWay) && (i = !1);
            graphRender.departureDate <= n && (t = !1);
            graphRender.isRoundTripInternational() && (t = !0, i = !0);
            flightSearchGraphHelper.setHiddenInputsAndDrawGraph(r, n, t, i)
        })
    },
    changeGraphDataOnMonthSelect: function() {
        $(".month").delegate("a", "click", function(n) {
            flightSearchGraphHelper.changeGraphDataOnMonthChange("month", this);
            n.preventDefault()
        });
        $(".month-line").delegate("p", "click", function() {
            flightSearchGraphHelper.changeGraphDataOnMonthChange("month-line", this)
        })
    },
    changeGraphDataOnMonthChange: function(n, t) {
        var i = base.getDateFromString($(t).attr("data-date")),
            r, u, f;
        i = base.getTodayIfEarlierThanToday(i);
        r = flightSearchGraphHelper.getGraphType($(t).parent("." + n), n);
        graphRender.paddings[r] = 0;
        u = !0;
        f = !0;
        r == "departure" && i < graphRender.returnDate ? u = !1 : r == "return" && i > graphRender.departureDate && (f = !1);
        graphRender.isRoundTripInternational() && (f = !0, u = !0);
        flightSearchGraphHelper.setHiddenInputsAndDrawGraph(r, i, f, u)
    },
    getNextDate: function(n) {
        var t = graphRender.getSelectedDate(n),
            i = new Date(t);
        return i.setDate(t.getDate() + graphRender.graphNodeCount), i
    },
    getPreviousDate: function(n) {
        var t = graphRender.getSelectedDate(n),
            i = new Date(t);
        return i.setDate(t.getDate() - graphRender.graphNodeCount), i
    },
    getGraphType: function(n, t) {
        return $(n).hasClass("departure-" + t) ? "departure" : $(n).hasClass("return-" + t) ? "return" : null
    },
    setGraphDateOnHiddenInput: function(n, t) {
        var u = new Date(graphRender.departureDate),
            f = new Date(graphRender.returnDate),
            e = $.datepicker.formatDate("yy-mm-dd", t),
            i, r;
        n == "departure" ? (t > f && !graphRender.isOneWay && (graphRender.returnDate = t), graphRender.departureDate = t) : n == "return" && (t < u && (graphRender.departureDate = t), graphRender.returnDate = t);
        i = new Date(graphRender.departureDate.valueOf());
        i.setDate(i.getDate() - graphRender.paddings.departure);
        graphRender.departureStartDate = i;
        $("#graph-departure-date").val($.datepicker.formatDate("yy-mm-dd", graphRender.departureDate));
        graphRender.isOneWay || (r = new Date(graphRender.returnDate.valueOf()), r.setDate(r.getDate() - graphRender.paddings["return"]), graphRender.returnStartDate = r, $("#graph-return-date").val($.datepicker.formatDate("yy-mm-dd", graphRender.returnDate)))
    },
    updateGraphMessage: function() {
        var t = graphRender.departureDate,
            i = $.datepicker.formatDate("dd MM, yy", t),
            n = 0,
            r = $("#graph-departure-fare-selected").val();
        if ($(".message-departure-date").html(i), n += parseFloat(r), !graphRender.isOneWay) {
            var u = graphRender.returnDate,
                f = $.datepicker.formatDate("dd MM, yy", u),
                e = $("#graph-return-fare-selected").val();
            n += parseFloat(e);
            $(".message-return-date").html(f)
        }
        isNaN(n) ? $(".message-price").hide() : ($(".message-estimated-value").html(n.toFixed(2)), $(".message-price").show());
        $("#cookie-hide-graph").val() === "" && ($(".div-chart-message-wrapper").show(), $(".chart-search-button").delay(100).animate({
            opacity: "0.3"
        }, 300).animate({
            opacity: "1"
        }, 200).animate({
            opacity: "0.6"
        }, 200).animate({
            opacity: "1"
        }, 200))
    },
    updateHiddenSelectedFields: function(n, t) {
        flightSearchGraphHelper.updateHiddenSelectedDate(n, t);
        flightSearchGraphHelper.updateHiddenSelectedFare(n, t)
    },
    updateHiddenSelectedDate: function(n, t) {
        var i = $(t).find(".graph-tooltip-date").attr("data-date");
        $("#graph-" + n + "-date").val(i);
        n == "departure" ? graphRender.departureDate = new Date(i) : n == "return" && (graphRender.returnDate = new Date(i))
    },
    updateHiddenSelectedFare: function(n, t) {
        var i = t.find(".graph-tooltip-fare").find("strong").html().trim();
        $("#graph-" + n + "-fare-selected").val(i)
    },
    setHiddenInputsAndDrawGraph: function(n, t, i, r) {
        flightSearchGraphHelper.setGraphDateOnHiddenInput(n, t);
        n == "departure" ? graphRender.departureDate = t : n == "return" && (graphRender.returnDate = t);
        graphRender.init(i, r)
    },
    searchChartDatesOnClick: function() {
        $(".chart-search-button").click(function() {
            var i = graphRender.departureDate,
                r = $.datepicker.formatDate("yy-mm-dd", i),
                n, t;
            $(".fromdate-next").val(r);
            graphRender.isOneWay || (n = graphRender.returnDate, t = $.datepicker.formatDate("yy-mm-dd", n), $(".todate-next").val(t));
            flightSearchGraphHelper.ChartSearchButtonEventTracker();
            $("#btnSearch").trigger("click")
        })
    },
    changeGraphDateBySearchDate: function(n) {
        var t, i, r, u;
        n ? (t = $(".fromdate-next").val(), i = new Date(t), flightSearchGraphHelper.setHiddenInputsAndDrawGraph("departure", i, !0, !0)) : (r = $(".todate-next").val(), u = new Date(r), flightSearchGraphHelper.setHiddenInputsAndDrawGraph("return", u, !0, !0))
    },
    drawAndShowReturnGraph: function() {
        graphRender.isOneWay = !1;
        var n = graphRender.departureDate;
        $(".return-chart-month").removeClass("display-none");
        $(".message-date-spacer").removeClass("display-none");
        $(".message-return-date").removeClass("display-none");
        flightSearchGraphHelper.setHiddenInputsAndDrawGraph("return", n, !1, !0);
        flightSearchGraphHelper.updateGraphMessage()
    },
    hideReturnGraph: function() {
        graphRender.isOneWay = !0;
        $(".return-chart-month").addClass("display-none");
        $(".message-date-spacer").addClass("display-none");
        $(".message-return-date").addClass("display-none");
        flightSearchGraphHelper.updateGraphMessage()
    },
    redrawOnDepartureChanged: function(n, t, i) {
        graphRender.isOriginCity = i === "true";
        graphRender.isOriginDomestic = t.toUpperCase() === "TR";
        flightSearchGraphHelper.redrawOnAirportChanged("origin", n, t, i)
    },
    redrawOnReturnChanged: function(n, t, i) {
        graphRender.isDestinationCity = i === "true";
        graphRender.isDestinationDomestic = t.toUpperCase() === "TR";
        flightSearchGraphHelper.redrawOnAirportChanged("destination", n, t, i)
    },
    redrawOnAirportChanged: function(n, t, i, r) {
        var u = flightSearchGraphHelper.getCodeFromAirportText(t);
        $("#graph-" + n + "-code").val(u);
        $("#graph-" + n + "-is-city").val(r);
        n == "origin" ? (graphRender.originCode = u, graphRender.isOriginCity = r) : n == "destination" && (graphRender.destinationCode = u, graphRender.isDestinationCity = r);
        graphRender.init(!0, !graphRender.isOneWay)
    },
    getCodeFromAirportText: function(n) {
        var t = n.split("(")[1];
        return t.substring(0, t.length - 1)
    },
    fixDatesForDepartureReturn: function(n, t, i, r) {
        var f, e, h, s, u, o;
        graphRender.isOneWay || (f = graphRender.departureDate, f.setHours(0, 0, 0, 0), e = graphRender.returnDate, e.setHours(0, 0, 0, 0), h = !1, s = !1, n == "departure" && f > e && (u = graphRender.Graphs["return"].EstimationNodes, f <= u[u.length - 1].Day.setHours(0, 0, 0, 0) && (o = base.getDateDifferenceAsDays(u[0].Day, f), graphRender.paddings["return"] = o), flightSearchGraphHelper.setHiddenInputsAndDrawGraph("return", f, i, r), s = !0), n == "return" && f > e && (u = graphRender.Graphs.departure.EstimationNodes, e >= u[0].Day.setHours(0, 0, 0, 0) && (o = base.getDateDifferenceAsDays(u[0].Day, e), graphRender.paddings.departure = o), flightSearchGraphHelper.setHiddenInputsAndDrawGraph("departure", e, i, r), s = !0), graphRender.isRoundTripInternational() && graphRender.init(!h, !s))
    },
    datepickerOnSelect: function() {
        var n = $("input.datepick").datepicker("option", "onSelect");
        $("input.datepick").datepicker("option", "onSelect", function(t, i) {
            n(t, i, $(this));
            flightSearchGraphHelper.changeGraphDateBySearchDate($(this).hasClass("fromdate"))
        })
    },
    oneOrTwoWayClick: function() {
        $("#rd-one-way-research").change(function() {
            $(this).is(":checked") ? (flightSearchGraphHelper.hideReturnGraph(), graphRender.isDomestic() || graphRender.init(!0, !1)) : flightSearchGraphHelper.drawAndShowReturnGraph()
        })
    },
    addLinearGradientToBody: function() {
        $("body").append('<div style="height:0; width:0; bottom:0; position:absolute; visibility:hidden"><svg height="0" width="400"><defs><linearGradient id="grad2" x1="0%" y1="100%" x2="40%" y2="0%"><stop offset="0%" style="stop-color:#38b0ae;stop-opacity:1" /><stop offset="100%" style="stop-color:#64CAC7 ;stop-opacity:1" /><\/linearGradient><\/defs><\/svg><\/div>')
    },
    ChartSearchButtonEventTracker: function() {
        try {
            searchGraphEventTracking.InitTrackUpdateSearchFromGraph()
        } catch (n) {}
    }
};
$(document).ready(function() {
    graphRender.setDefaults()
});
var graphRender = {
        Graphs: [],
        departureStartDate: null,
        returnStartDate: null,
        originCode: $("#graph-origin-code").val(),
        destinationCode: $("#graph-destination-code").val(),
        departureDate: base.getDateFromString($("#graph-departure-date").val()),
        returnDate: base.getDateFromString($("#graph-return-date").val()),
        currencyCode: $("#api-currency-code").val(),
        paddings: [],
        graphNodeCount: 16,
        isOneWay: $("#rd-one-way-research").is(":checked"),
        isOriginDomestic: $("#graph-origin-is-domestic").val() === "true",
        isOriginCity: $("#graph-origin-is-city").val() === "true",
        isDestinationDomestic: $("#graph-destination-is-domestic").val() === "true",
        isDestinationCity: $("#graph-destination-is-city").val() === "true",
        graphUpperLimit: 0,
        initCallCount: 0,
        lastSelectedRoute: null,
        isDomestic: function() {
            return (graphRender.originCode == "ECN" || graphRender.isOriginDomestic) && (graphRender.destinationCode == "ECN" || graphRender.isDestinationDomestic)
        },
        isOneWayInternational: function() {
            return !graphRender.isDomestic() && graphRender.isOneWay
        },
        isRoundTripInternational: function() {
            return !graphRender.isDomestic() && !graphRender.isOneWay
        },
        setDefaults: function() {
            this.paddings.departure = 5;
            this.paddings["return"] = 5;
            graphRender.hideGraphsOnClick();
            graphRender.showGraphsOnClick()
        },
        init: function(n, t) {
            if ($("#cookie-hide-graph").val() === "") try {
                graphRender.showGraphs();
                var i = graphRender.getApi(),
                    r = graphRender.getRequestParams();
                graphRender.draw(i, r, n, t)
            } catch (u) {
                graphRender.hideGraphs()
            }
        },
        getApi: function() {
            return graphRender.isDomestic() ? graphRender.isOneWay ? new RestServiceJs("/analytics/calendar/oneway") : new RestServiceJs("/analytics/calendar/roundtrip") : graphRender.isOneWay ? new RestServiceJs("/analytics/calendar/oneway") : new RestServiceJs("/analytics/matrix")
        },
        getRequestParams: function() {
            var n = {
                    Origin: graphRender.originCode,
                    OriginIsCity: graphRender.isOriginCity,
                    Destination: graphRender.destinationCode,
                    DestinationIsCity: graphRender.isDestinationCity,
                    DepartureDay: null,
                    NumberOfDays: graphRender.graphNodeCount,
                    Currency: graphRender.currencyCode
                },
                t = new Date,
                i, r, u;
            return graphRender.departureStartDate = new Date(graphRender.departureDate), graphRender.departureStartDate.setDate(graphRender.departureStartDate.getDate() - graphRender.paddings.departure), graphRender.departureStartDate < t && (i = base.getDateDifferenceAsDays(graphRender.departureStartDate, t), graphRender.paddings.departure = graphRender.paddings.departure - i, graphRender.departureStartDate = t), n.DepartureDay = $.datepicker.formatDate("yy-mm-dd", graphRender.departureStartDate), graphRender.isOneWay || (graphRender.returnStartDate = new Date(graphRender.returnDate), graphRender.returnStartDate.setDate(graphRender.returnStartDate.getDate() - graphRender.paddings["return"]), graphRender.returnStartDate < t && (i = base.getDateDifferenceAsDays(graphRender.returnStartDate, t), graphRender.paddings["return"] = graphRender.paddings["return"] - i, graphRender.returnStartDate = t), n.ReturnDay = $.datepicker.formatDate("yy-mm-dd", graphRender.returnStartDate)), r = $.datepicker.parseDate("yy-mm-dd", n.DepartureDay), n.ReturnDay != null && (u = $.datepicker.parseDate("yy-mm-dd", n.ReturnDay), u < r && (n.ReturnDay = n.DepartureDay)), n
        },
        draw: function(n, t, i, r) {
            graphRender.showGraphLoading(i, r);
            graphCache.canLoadFromCache() ? graphCache.loadFromCache(i, r) : graphRender.loadFromApi(n, t, i, r)
        },
        loadFromApi: function(n, t, i, r) {
            n.add(t, function(n) {
                var t = JSON.parse(n),
                    u = graphRender.getResponseData(t);
                graphCache.cacheResponseData(t, u);
                graphRender.drawGraphsFromResponseData(u, i, r)
            }, graphRender.hideGraphs)
        },
        drawGraphsFromResponseData: function(n, t, i) {
            var r = graphRender.graphUpperLimit;
            graphRender.setGraphUpperLimit(n);
            r != graphRender.graphUpperLimit && (t = !0, i = !0);
            t && graphRender.drawGraphFromResponseData("departure", n);
            !graphRender.isOneWay && i && graphRender.drawGraphFromResponseData("return", n);
            graphRender.updateGraphMessageIfNotFirstDraw();
            graphRender.hideGraphLoading()
        },
        drawGraphFromResponseData: function(n, t) {
            graphRender.Graphs[n] = new EstimationGraph(n, t);
            drawFlightEstimationGraph(n, graphRender.Graphs[n])
        },
        getSelectedDate: function(n) {
            return n == "departure" ? new Date(graphRender.departureDate) : n == "return" ? new Date(graphRender.returnDate) : void 0
        },
        getStartDate: function(n) {
            return n == "departure" ? new Date(graphRender.departureStartDate) : n == "return" ? new Date(graphRender.returnStartDate) : void 0
        },
        setGraphUpperLimit: function(n) {
            var t;
            for (graphRender.graphUpperLimit = 0, t = 0; t < n.DepartureCalendar.Prices.length; t++) n.DepartureCalendar.Prices[t] > graphRender.graphUpperLimit && (graphRender.graphUpperLimit = n.DepartureCalendar.Prices[t]);
            if (n.ReturnCalendar)
                for (t = 0; t < n.ReturnCalendar.Prices.length; t++) n.ReturnCalendar.Prices[t] > graphRender.graphUpperLimit && (graphRender.graphUpperLimit = n.ReturnCalendar.Prices[t]);
            graphRender.graphUpperLimit = Math.ceil(graphRender.graphUpperLimit * 1.3);
            graphRender.graphUpperLimit = graphRender.graphUpperLimit
        },
        getResponseData: function(n) {
            return graphRender.isOneWay ? {
                DepartureCalendar: n
            } : graphRender.isDomestic() ? n : graphRender.convertMatrixResponseData(n)
        },
        convertMatrixResponseData: function(n) {
            for (var r = n.Prices, u = base.getDateDifferenceAsDays(graphRender.departureStartDate, graphRender.departureDate), f = base.getDateDifferenceAsDays(graphRender.returnStartDate, graphRender.returnDate), h = r[u][f], e = h / 2, o = [], s = [], t, i = 0; i < graphRender.graphNodeCount; i++) t = r[i][f] - e, t < 0 && (t = r[i][f] / 2), t = Math.round(t * 100) / 100, o.push(t);
            for (i = 0; i < graphRender.graphNodeCount; i++) t = r[u][i] - e, t < 0 && (t = r[u][i] / 2), t = Math.round(t * 100) / 100, s.push(t);
            return {
                DepartureCalendar: {
                    Prices: o,
                    Currency: graphRender.currencyCode
                },
                ReturnCalendar: {
                    Prices: s,
                    Currency: graphRender.currencyCode
                }
            }
        },
        showGraphLoading: function(n, t) {
            n && $(".departure-chart-loading").show();
            t && $(".return-chart-loading").show()
        },
        hideGraphLoading: function() {
            $(".chart-loading").hide()
        },
        updateGraphMessageIfNotFirstDraw: function() {
            graphRender.initCallCount++;
            graphRender.initCallCount > 1 && flightSearchGraphHelper.updateGraphMessage()
        },
        hideGraphs: function() {
            $(".div-chart").addClass("display-none");
            $(".div-chart-message-wrapper").hide()
        },
        showGraphs: function() {
            $(".div-chart").removeClass("display-none")
        },
        hideGraphsOnClick: function() {
            $(".hide-search-graph").click(function() {
                graphRender.hideGraphs();
                $(".show-search-graph-wrapper").removeClass("display-none");
                userPreferencesCookie.updateGraphStatus(!0);
                $("#cookie-hide-graph").val("true")
            })
        },
        showGraphsOnClick: function() {
            $(".show-search-graph").click(function() {
                $(".show-search-graph-wrapper").addClass("display-none");
                $("#cookie-hide-graph").val("");
                $(".div-chart").removeClass("display-none");
                graphRender.init();
                userPreferencesCookie.updateGraphStatus(!1)
            })
        },
        supportsBrowser: function() {
            return graphRender.detectIE() == !1 ? !0 : !1
        },
        detectIE: function() {
            var n = window.navigator.userAgent,
                i = n.indexOf("MSIE "),
                u, r, t;
            return i > 0 ? parseInt(n.substring(i + 5, n.indexOf(".", i)), 10) : (u = n.indexOf("Trident/"), u > 0) ? (r = n.indexOf("rv:"), parseInt(n.substring(r + 3, n.indexOf(".", r)), 10)) : (t = n.indexOf("Edge/"), t > 0) ? parseInt(n.substring(t + 5, n.indexOf(".", t)), 10) : !1
        }
    },
    graphCache = {
        Cache: {},
        loadFromCache: function(n, t) {
            var i = graphCache.getResponseDataFromCache();
            graphRender.drawGraphsFromResponseData(i, n, t)
        },
        getResponseDataFromCache: function() {
            return graphRender.isRoundTripInternational() ? matrixCache.getResponseDataFromCache() : calendarCache.getResponseDataFromCache()
        },
        cacheResponseData: function(n, t) {
            graphRender.isRoundTripInternational() ? matrixCache.cacheParsedData(n) : calendarCache.cacheResponseData(t)
        },
        canLoadFromCache: function() {
            return graphRender.isRoundTripInternational() ? matrixCache.canLoadFromCache() : calendarCache.canLoadFromCache()
        },
        getCacheDateKey: function(n, t) {
            var i = graphRender.getStartDate(n);
            return i.setHours(0, 0, 0, 0), i.setDate(i.getDate() + t), i
        }
    },
    matrixCache = {
        getResponseDataFromCache: function() {
            var r = matrixCache.getCacheKeyName(),
                e = {},
                o = [],
                s = [],
                u = graphRender.getSelectedDate("departure"),
                f = graphRender.getSelectedDate("return"),
                h = 0,
                c = 0,
                n;
            for (h = graphCache.Cache[r][u][f] / 2, c = graphCache.Cache[r][u][f] / 2, graphRender.lastSelectedRoute = null, n = 0; n < graphRender.graphNodeCount; n++) {
                var l = graphCache.getCacheDateKey("departure", n),
                    i = graphCache.Cache[r][l][f],
                    t = i - c;
                t < 0 && (t = i / 2);
                o.push(Math.round(t) / 1)
            }
            for (n = 0; n < graphRender.graphNodeCount; n++) {
                var a = graphCache.getCacheDateKey("return", n),
                    i = graphCache.Cache[r][u][a],
                    t = i - h;
                t < 0 && (t = i / 2);
                s.push(Math.round(t) / 1)
            }
            var v = {
                    Currency: graphRender.currencyCode,
                    Prices: o
                },
                y = {
                    Currency: graphRender.currencyCode,
                    Prices: s
                },
                e = {
                    DepartureCalendar: v,
                    ReturnCalendar: y
                };
            return e
        },
        cacheParsedData: function(n) {
            var t = matrixCache.getCacheKeyName();
            matrixCache.cachePrices(t, n.Prices)
        },
        cachePrices: function(n, t) {
            var i, f, u, r, e, o;
            for (graphCache.Cache[n] == null && (graphCache.Cache[n] = {}), i = 0; i < t.length; i++)
                for (f = t[i], u = graphCache.getCacheDateKey("departure", i), graphCache.Cache[n] == null && (graphCache.Cache[n] = []), graphCache.Cache[n][u] == null && (graphCache.Cache[n][u] = []), r = 0; r < f.length; r++) e = graphCache.getCacheDateKey("return", r), o = Math.round(f[r] * 100) / 100, graphCache.Cache[n][u][e] = o
        },
        canLoadFromCache: function() {
            var r = matrixCache.getCacheKeyName(),
                n, t, i;
            try {
                for (n = 0; n < graphRender.graphNodeCount; n++)
                    if (t = graphRender.getSelectedDate("departure"), i = graphCache.getCacheDateKey("return", n), graphCache.Cache[r][t][i] == null) return !1;
                for (n = 0; n < graphRender.graphNodeCount; n++)
                    if (t = graphCache.getCacheDateKey("departure", n), i = graphRender.getSelectedDate("return"), graphCache.Cache[r][t][i] == null) return !1;
                return !0
            } catch (u) {
                return !1
            }
        },
        getCacheKeyName: function() {
            return graphRender.originCode + graphRender.isOriginCity + "-" + graphRender.destinationCode + graphRender.isDestinationCity + "_RT_INT"
        }
    },
    calendarCache = {
        getResponseDataFromCache: function() {
            for (var o = calendarCache.getCacheKeyName(!0), s = calendarCache.getCacheKeyName(!1), i = {}, u = [], f, r, t, e, n = 0; n < graphRender.graphNodeCount; n++) t = graphCache.getCacheDateKey("departure", n), u.push(graphCache.Cache[o][t]);
            for (f = {
                    Currency: graphRender.currencyCode,
                    Prices: u
                }, r = [], n = 0; n < graphRender.graphNodeCount; n++) t = graphCache.getCacheDateKey("return", n), r.push(graphCache.Cache[s][t]);
            return e = {
                Currency: graphRender.currencyCode,
                Prices: r
            }, i = {
                DepartureCalendar: f,
                ReturnCalendar: e
            }, i
        },
        canLoadFromCache: function() {
            var n = !0,
                t = calendarCache.getCacheKeyName(!0),
                i = calendarCache.getCacheKeyName(!1);
            return n = n && calendarCache.canLoadSingleGraphFromCache(t, "departure"), n && calendarCache.canLoadSingleGraphFromCache(i, "return")
        },
        cacheResponseData: function(n) {
            var i = calendarCache.getCacheKeyName(!0),
                t;
            calendarCache.cachePrices(i, n.DepartureCalendar, "departure");
            graphRender.isOneWay || (t = calendarCache.getCacheKeyName(!1), calendarCache.cachePrices(t, n.ReturnCalendar, "return"))
        },
        cachePrices: function(n, t, i) {
            var r, u;
            for (graphCache.Cache[n] == null && (graphCache.Cache[n] = {}), r = 0; r < t.Prices.length; r++) u = graphCache.getCacheDateKey(i, r), graphCache.Cache[n][u] = t.Prices[r]
        },
        getCacheKeyName: function(n) {
            return n ? graphRender.originCode + graphRender.isOriginCity + "-" + graphRender.destinationCode + graphRender.isDestinationCity : graphRender.destinationCode + graphRender.isDestinationCity + "-" + graphRender.originCode + graphRender.isOriginCity
        },
        canLoadSingleGraphFromCache: function(n, t) {
            var i, r;
            try {
                for (i = 0; i < graphRender.graphNodeCount; i++)
                    if (r = graphCache.getCacheDateKey(t, i), graphCache.Cache[n][r] == null) return !1;
                return !0
            } catch (u) {
                return !1
            }
        }
    };
$(document).ready(function() {
    searchGraphEventTracking.Init()
});
searchGraphEventTracking = {
    Init: function() {},
    InitTrackUpdateSearchFromGraph: function() {
        try {
            var n = $("#graph-origin-code").val(),
                t = $("#graph-destination-code").val(),
                i = n + "-" + t;
            ga("send", "event", "FlightsGraphUpdateDate", i, base.getUserId(), 1)
        } catch (r) {}
    },
    InitTrackShowGraph: function() {
        $(".show-search-graph").click(function() {
            searchGraphEventTracking.TrackGraphEvent("ShowGraph")
        })
    },
    InitTrackHideGraph: function() {
        $(".hide-search-graph").click(function() {
            searchGraphEventTracking.TrackGraphEvent("HideGraph")
        })
    },
    TrackGraphEvent: function(n) {
        try {
            ga("send", "event", "FlightSearchGraph", "UserPreferences", n)
        } catch (t) {}
    }
};
$(document).ready(function() {
    flightSearchTracking.Init()
});
flightSearchTracking = {
    Init: function() {},
    TrackFlightSearchResult: function() {
        try {
            var n = flightSearchTracking.GetAirportCode("#flight-from"),
                t = flightSearchTracking.GetAirportCode("#flight-to"),
                i = n + "-" + t;
            ga("send", "event", "TicketFunnelFlights", i, base.getUserId(), 1)
        } catch (r) {}
    },
    GetAirportCode: function(n) {
        var t = $(n).val(),
            i = t.indexOf("(") + 1;
        return t.substring(i, i + 3)
    }
};
$(document).ready(function() {
    latestSearches.Init()
});
latestSearches = {
    Items: 0,
    Init: function() {
        latestSearches.ShowLatestLocationsOnClick();
        latestSearches.HideLatestLocationsOnBodyClick()
    },
    ShowLatestLocationsOnClick: function() {
        $(".flight-search.ui-autocomplete-input").click(function() {
            var n = $(this).attr("id") === "flight-from";
            latestSearches.ShowLatestLocations(n)
        })
    },
    ShowLatestLocations: function(n) {
        if (latestSearches.Items !== !1)
            if (latestSearches.Items === 0) {
                latestSearches.Items--;
                var t = latestSearches.GetLatestLocationIds();
                if (t === null || t === "") {
                    latestSearches.Items = !1;
                    return
                }
                if (latestSearches.Items < -1) return;
                $.ajax({
                    url: "/Flight/GetSlugDetails",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    cache: !1,
                    data: JSON.stringify(t),
                    async: !0,
                    success: function(t) {
                        t === null || t === "" ? latestSearches.Items = !1 : (latestSearches.Items = t, latestSearches.SetLatestLocations(), latestSearches.Show(n))
                    },
                    error: function() {
                        latestSearches.Items = !1
                    }
                })
            } else latestSearches.Show(n)
    },
    SetLatestLocations: function() {
        latestSearches.FillLatestLocationDiv("#flights-from-latest", latestSearches.Items.origins);
        latestSearches.FillLatestLocationDiv("#flights-to-latest", latestSearches.Items.destinations);
        latestSearches.SetLatestLocationIds();
        latestSearches.SelectLatestSearchItemOnClick()
    },
    SetLatestLocationIds: function() {
        $("#flights-from-latest li").each(function(n) {
            $(this).attr("data-index", n)
        });
        $("#flights-to-latest li").each(function(n) {
            $(this).attr("data-index", n)
        })
    },
    FillLatestLocationDiv: function(n, t) {
        for (var i = $(".latest-searches-items-template ul").clone(), u, r = 0; r < t.length; r++) u = $(i).find("li").first().clone(), $(u).html(t[r].label), i.append(u);
        $(i).find("li").first().remove();
        $(n).append(i);
        latestSearches.SetLatestSearchesPosition(n)
    },
    SetLatestSearchesPosition: function(n) {
        var t = n === "#flights-from-latest" ? $("#flight-from") : $("#flight-to"),
            i = t.offset(),
            r = i.top + $(t).outerHeight(),
            u = i.left;
        $(n).css("top", r);
        $(n).css("left", u)
    },
    Show: function(n) {
        latestSearches.ShowSpecificLocations(n)
    },
    ShowSpecificLocations: function(n) {
        latestSearches.Items === null || latestSearches.Items <= 0 || (n ? ($("#flights-to-latest").addClass("display-none"), $("#flights-from-latest").removeClass("display-none")) : ($("#flights-from-latest").addClass("display-none"), $("#flights-to-latest").removeClass("display-none")))
    },
    HideLatestLocations: function() {
        $("#flights-to-latest").addClass("display-none");
        $("#flights-from-latest").addClass("display-none")
    },
    SelectLatestSearchItemOnClick: function() {
        $(".latest-searches-items li").click(function() {
            var n = $(this).closest(".latest-searches-container").attr("id") == "flights-from-latest",
                t = $(this).attr("data-index"),
                i = n ? latestSearches.Items.origins[t] : latestSearches.Items.destinations[t],
                r = n ? $("#flight-from") : $("#flight-to");
            base.selectAutoCompleteItem(r, i);
            $(r).val(i.value);
            latestSearches.HideLatestLocations()
        })
    },
    GetLatestLocationIds: function() {
        var r, n;
        try {
            var u = $.cookie($("#titname").val()),
                f = $("#titdelimeter").val(),
                e = $("#titdelimeter-search-loc").val(),
                t = $("#titdelimeter-search-slug").val(),
                i = u.split(f);
            return i.length < 4 ? null : (r = i[3], n = r.split(e), n[0] === "") ? null : {
                OriginSlugIds: n[0].split(t),
                DestinationSlugIds: n[1].split(t)
            }
        } catch (o) {
            return null
        }
    },
    HideLatestLocationsOnBodyClick: function() {
        $(document).mouseup(function(n) {
            var t = $(".latest-searches-container");
            t.is(n.target) || t.has(n.target).length !== 0 || latestSearches.HideLatestLocations()
        })
    }
};
$(document).ready(function() {
    userPreferencesCookie.init()
});
userPreferencesCookie = {
    cookieName: $("#titname").val(),
    init: function() {},
    updateGraphStatus: function(n) {
        userPreferencesCookie.updateUserPreferences(n, 0)
    },
    updateVideoStatus: function(n) {
        userPreferencesCookie.updateUserPreferences(n, 1)
    },
    updateUserPreferences: function(n, t) {
        var i = userPreferencesCookie.getUserPreferences();
        i = n ? userPreferencesCookie.setBit(i, t) : userPreferencesCookie.clearBit(i, t);
        userPreferencesCookie.setUserPreferences(i)
    },
    getUserPreferences: function() {
        var n = userPreferencesCookie.getTITCookieSplitted();
        return n.length < 3 ? 0 : n[2]
    },
    setUserPreferences: function(n) {
        var t = $("#titdelimeter").val(),
            i = userPreferencesCookie.getTITCookie(),
            r = userPreferencesCookie.getTITCookieSplitted();
        r.length === 1 ? i += t + t + n : r.length === 2 ? i += t + n : (r[2] = n, i = r.join(t));
        $.cookie(userPreferencesCookie.cookieName, i, {
            expires: 999999,
            path: "/"
        })
    },
    getTITCookieSplitted: function() {
        var n = userPreferencesCookie.getTITCookie(),
            t = $("#titdelimeter").val();
        return n.split(t)
    },
    getTITCookie: function() {
        return $.cookie(userPreferencesCookie.cookieName)
    },
    getBit: function(n, t) {
        return n >> t & 1
    },
    setBit: function(n, t) {
        return n | 1 << t
    },
    clearBit: function(n, t) {
        return n & ~(1 << t)
    }
}