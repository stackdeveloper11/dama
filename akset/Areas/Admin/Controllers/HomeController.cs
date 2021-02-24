#region Using

using System.Web.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Google.Apis.AnalyticsReporting.v4;
using Google.Apis.AnalyticsReporting.v4.Data;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using System.Net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Google.Apis.Analytics.v3;
using Google.Apis.Auth.OAuth2;
using System.Threading;
using Google.Apis.Util.Store;
using Google.Apis.Services;
using System.Security.Cryptography.X509Certificates;
using System.IO;
using Google.Apis.Analytics.v3.Data;
using akset.data;
#endregion

namespace akset.Areas.Admin.Controllers
{
    //[Authorize(Roles="Admin")]
    public class HomeController : Controller
    {
        aksetDB db = new aksetDB();
        public ActionResult trafik(string bas = "", string bit = "")
        {
            // return Content(Convert.ToDateTime(bas).ToString("yyyy-dd-MM") + "-" + Convert.ToDateTime(bit).ToString("yyyy-dd-MM"));
            var filepath = Server.MapPath("~/alobilet724app-e14556dab4c9.json");  // path to the json file for the Service account
            GoogleCredential credentials;
            using (var stream = new FileStream(filepath, FileMode.Open, FileAccess.Read))
            {
                string[] scopes = { AnalyticsReportingService.Scope.AnalyticsReadonly };
                var googleCredential = GoogleCredential.FromStream(stream);
                credentials = googleCredential.CreateScoped(scopes);
            }

            var analyticsreporting = new AnalyticsReportingService(
            new BaseClientService.Initializer
            {
                HttpClientInitializer = credentials
            });
            string bass = "";
            string bitt = "";
            if (string.IsNullOrEmpty(bas))
            {

                bass = DateTime.Now.ToString("yyyy-MM-dd");
            }
            else
            {
                string basgun = bas.Substring(0, 2);
                string basay = bas.Substring(3, 2);
                string basyil = bas.Substring(6);
                bass = basyil + "-" + basay + "-" + basgun; //Convert.ToDateTime(bas).ToString("yyyy-dd-MM");
            }
            if (string.IsNullOrEmpty(bit))
            {

                bitt = DateTime.Now.ToString("yyyy-MM-dd");
            }
            else
            {
                string bitgun = bit.Substring(0, 2);
                string bitay = bit.Substring(3, 2);
                string bityil = bit.Substring(6);
                bitt = bityil + "-" + bitay + "-" + bitgun;//Convert.ToDateTime(bit).ToString("yyyy-dd-MM");
            }

            DateRange dateRange = new DateRange() { StartDate = bass, EndDate = bitt };
            Metric sessions = new Metric { Expression = "ga:pageviews", Alias = "Sessions" };
            Dimension landingpage = new Dimension { Name = "ga:landingPagePath" };
            Dimension pagetitle = new Dimension { Name = "ga:pageTitle" };
            Dimension date = new Dimension { Name = "ga:date" };

            ReportRequest reportRequest = new ReportRequest
            {
                ViewId = "150663033",
                DateRanges = new List<DateRange>() { dateRange },
                Dimensions = new List<Dimension>() { landingpage, pagetitle, date },
                Metrics = new List<Metric>() { sessions }
            };

            List<ReportRequest> requests = new List<ReportRequest>();
            requests.Add(reportRequest);
            GetReportsRequest getReport = new GetReportsRequest() { ReportRequests = requests };
            GetReportsResponse response = analyticsreporting.Reports.BatchGet(getReport).Execute();
            string ddd = "";
            int sss = 0;
            List<akset.data.ViewModel.trafik> ddf = new List<akset.data.ViewModel.trafik>();
            if (response.Reports.First().Data.Rows != null)
            {
                foreach (var x in response.Reports.First().Data.Rows)
                {
                    string dd = string.Join(", ", x.Dimensions);
                    akset.data.ViewModel.trafik trf = new akset.data.ViewModel.trafik();
                    trf.adres = dd.Split(',')[0];
                    trf.sayfabasligi = dd.Split(',')[1];
                    //  string trh = dd.Split(',')[2].Substring(0,4) +"-"+ dd.Split(',')[2].Substring(4, 2)+"-"+ dd.Split(',')[2].Substring(6);
                    //if (trf.tarih == 0)
                    //{
                    //    trf.tarih = 0;
                    //}
                    //else
                    //{
                    trf.tarih = Convert.ToInt32(dd.Split(',')[2] == "" ? dd.Split(',')[3] : dd.Split(',')[2]);
                    //}

                    trf.hit = Convert.ToInt32(string.Join(", ", x.Metrics.First().Values));
                    ddf.Add(trf);
                    // ddf.Add(dd + "---" + string.Join(", ", x.Metrics.First().Values));
                    //ddd +="<br/>"+dd+"---"+ string.Join(", ", x.Metrics.First().Values);
                    sss += Convert.ToInt32(string.Join(", ", x.Metrics.First().Values));
                }
            }

            ViewBag.total = sss.ToString();
            if (ddf.FirstOrDefault() == null)
            {
                return View();
            }
            else
            {
                return View(ddf.OrderBy(a => a.tarih).ThenByDescending(a => a.hit).ToList());
            }
            //      return View();
        }
        public JsonResult sayla()
        {
            var filepath = Server.MapPath("~/alobilet724app-e14556dab4c9.json");
            GoogleCredential credential;
            string[] scopes2 = new string[] { AnalyticsReportingService.Scope.Analytics };
            using (var stream = new FileStream(filepath, FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream)
                     .CreateScoped(scopes2);
            }


            var service = new AnalyticsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
            });
            string hh = "yok";
            DataResource.RealtimeResource.GetRequest request = service.Data.Realtime.Get(String.Format("ga:{0}", "150663033"), "rt:activeUsers");
            RealtimeData feed = request.Execute();

            if (feed != null && feed.Rows != null)
            {
                hh = feed.Rows.FirstOrDefault().FirstOrDefault().ToString();
            }

            GoogleCredential credentials;
            using (var stream = new FileStream(filepath, FileMode.Open, FileAccess.Read))
            {
                string[] scopes = { AnalyticsReportingService.Scope.AnalyticsReadonly };
                var googleCredential = GoogleCredential.FromStream(stream);
                credentials = googleCredential.CreateScoped(scopes);
            }
            var reportingService = new AnalyticsReportingService(
            new BaseClientService.Initializer
            {
                HttpClientInitializer = credentials
            });

            var dateRange = new DateRange
            {
                StartDate = DateTime.Now.ToString("yyyy-MM-dd"),
                EndDate = DateTime.Now.ToString("yyyy-MM-dd")
            };
            var dateRangedun = new DateRange
            {
                StartDate = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd"),
                EndDate = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")
            };
            var dateRangetum = new DateRange
            {
                StartDate = "2005-10-10",
                EndDate = DateTime.Now.ToString("yyyy-MM-dd")
            };

            var dat2e = new Dimension { Name = "ga:date" };

            var reportRequest = new ReportRequest
            {
                DateRanges = new List<DateRange> { dateRange },
                Dimensions = new List<Dimension> { dat2e },
                Metrics = new List<Metric>() { new Metric() { Expression = "ga:pageviews" }, new Metric() { Expression = "ga:users" }, new Metric() { Expression = "ga:sessions" } },
                ViewId = "150663033" // your view id
            };
            var getReportsRequest = new GetReportsRequest
            {
                ReportRequests = new List<ReportRequest> { reportRequest }
            };
            var batchRequest = reportingService.Reports.BatchGet(getReportsRequest);
            var response = batchRequest.Execute();



            var reportRequest8 = new ReportRequest
            {
                DateRanges = new List<DateRange> { dateRangedun },
                Dimensions = new List<Dimension> { dat2e },
                Metrics = new List<Metric>() { new Metric() { Expression = "ga:pageviews" } },
                ViewId = "150663033" // your view id
            };
            var getReportsRequest8 = new GetReportsRequest
            {
                ReportRequests = new List<ReportRequest> { reportRequest8 }
            };
            var batchRequest8 = reportingService.Reports.BatchGet(getReportsRequest8);
            var response8 = batchRequest8.Execute();

            string hhh = string.Join(",", response8.Reports.First().Data.Rows.FirstOrDefault().Metrics.First().Values);



            var reportRequest87 = new ReportRequest
            {
                DateRanges = new List<DateRange> { dateRangetum },
                Dimensions = new List<Dimension> { dat2e },
                Metrics = new List<Metric>() { new Metric() { Expression = "ga:pageviews" } },
                ViewId = "150663033" // your view id
            };
            var getReportsRequest87 = new GetReportsRequest
            {
                ReportRequests = new List<ReportRequest> { reportRequest87 }
            };
            var batchRequest87 = reportingService.Reports.BatchGet(getReportsRequest87);
            var response87 = batchRequest87.Execute();
            int ffs = 0;
            foreach (var x in response87.Reports.First().Data.Rows)
            {
                ffs += Convert.ToInt32(x.Metrics.First().Values.FirstOrDefault().ToString());
            }
            string hhh7 = ffs.ToString();

            string fff = "";
            try
            {
  if (response.Reports.First().Data.Rows.FirstOrDefault().Metrics.First()!= null)
            {
                fff = string.Join(",", response.Reports.First().Data.Rows.FirstOrDefault().Metrics.First().Values) + "," + hh + "," + hhh + ',' + hhh7;
            }
            }
            catch (Exception ex)
            {

               
            }
          
               

            return Json(fff, JsonRequestBehavior.AllowGet);
        }
        public void otuzla()
        {
            var filepath = Server.MapPath("~/alobilet724app-e14556dab4c9.json");  // path to the json file for the Service account
            GoogleCredential credentials;
            using (var stream = new FileStream(filepath, FileMode.Open, FileAccess.Read))
            {
                string[] scopes = { AnalyticsReportingService.Scope.AnalyticsReadonly };
                var googleCredential = GoogleCredential.FromStream(stream);
                credentials = googleCredential.CreateScoped(scopes);
            }

            var reportingService = new AnalyticsReportingService(
            new BaseClientService.Initializer
            {
                HttpClientInitializer = credentials
            });

            var dateRange30 = new DateRange
            {
                StartDate = DateTime.Now.AddDays(-30).ToString("yyyy-MM-dd"),
                EndDate = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd")
            };
            var dateRange60 = new DateRange
            {
                StartDate = DateTime.Now.AddDays(-60).ToString("yyyy-MM-dd"),
                EndDate = DateTime.Now.ToString("yyyy-MM-dd")
            };
            var dateRange90 = new DateRange
            {
                StartDate = DateTime.Now.AddDays(-90).ToString("yyyy-MM-dd"),
                EndDate = DateTime.Now.ToString("yyyy-MM-dd")
            };
            var pageviews = new Metric
            {
                Expression = "ga:pageviews"

            };

            var users = new Metric
            {
                Expression = "ga:users"

            };

            var session = new Metric
            {
                Expression = "ga:sessions"

            };
            var bounceRate = new Metric
            {
                Expression = "ga:bounceRate"

            };
            var date = new Dimension { Name = "ga:date" };
            var newold = new Dimension { Name = "ga:userType" };
            var mob = new Dimension { Name = "ga:mobileDeviceInfo" };
            //var sor = new Dimension { Name = "ga:source" };

            var reportRequest = new ReportRequest
            {
                Dimensions = new List<Dimension> { date },
                Metrics = new List<Metric>() { pageviews, users, session, bounceRate },
                ViewId = "150663033" // your view id
            };

            reportRequest.DateRanges = new List<DateRange> { dateRange30 };
            var getReportsRequest = new GetReportsRequest
            {
                ReportRequests = new List<ReportRequest> { reportRequest }
            };
            var batchRequest = reportingService.Reports.BatchGet(getReportsRequest);
            var response = batchRequest.Execute();
            string fff = "";
            string ddd = "";
            string eee = "";
            string pv = "";
            string us = "";
            string ku = "";

            int spv = 0;
            int sus = 0;
            int sku = 0;
            foreach (var x in response.Reports.First().Data.Rows)
            {
                string dd = x.Dimensions.FirstOrDefault().ToString();
                pv = string.Join(", ", x.Metrics.First().Values).Split(',')[0];
                fff += ",[" + string.Join(", ", helper.jstimestamp.ToJavascriptTimestamp(Convert.ToDateTime(dd.Substring(0, 4) + "-" + dd.Substring(4, 2) + "-" + dd.Substring(6)))) + "," + pv + "]";
                spv += Convert.ToInt32(pv);
                us = string.Join(", ", x.Metrics.First().Values).Split(',')[1];
                ddd += ",[" + string.Join(", ", helper.jstimestamp.ToJavascriptTimestamp(Convert.ToDateTime(dd.Substring(0, 4) + "-" + dd.Substring(4, 2) + "-" + dd.Substring(6)))) + "," + us + "]";
                sus += Convert.ToInt32(us);
                ku = string.Join(", ", x.Metrics.First().Values).Split(',')[2];
                eee += ",[" + string.Join(", ", helper.jstimestamp.ToJavascriptTimestamp(Convert.ToDateTime(dd.Substring(0, 4) + "-" + dd.Substring(4, 2) + "-" + dd.Substring(6)))) + "," + ku + "]";
                sku += Convert.ToInt32(ku);

            }
            ViewBag.hemencik30 = response.Reports.First().Data.Totals.FirstOrDefault().Values[3].ToString();
            ViewBag.son30p = fff.Substring(1);
            ViewBag.son30u = ddd.Substring(1);
            ViewBag.son30s = eee.Substring(1);
            ViewBag.son30ps = spv.ToString();
            ViewBag.son30us = sus.ToString();
            ViewBag.son30ss = sku.ToString();

            var reportRequestnewold = new ReportRequest
            {
                Dimensions = new List<Dimension> { newold },
                Metrics = new List<Metric>() { session },
                ViewId = "150663033" // your view id
            };

            reportRequestnewold.DateRanges = new List<DateRange> { dateRange30 };
            var getReportsRequestnewold = new GetReportsRequest
            {
                ReportRequests = new List<ReportRequest> { reportRequestnewold }
            };
            var batchRequestnewold = reportingService.Reports.BatchGet(getReportsRequestnewold);
            var responsenewold = batchRequestnewold.Execute();


            string fgg = "";
            foreach (var x in responsenewold.Reports.First().Data.Rows)
            {
                string dd = x.Dimensions.FirstOrDefault().ToString();
                fgg += "," + x.Metrics.First().Values.FirstOrDefault().ToString();
            }
            ViewBag.yeni30 = fgg.Substring(1).Split(',')[0].ToString();
            ViewBag.eski30 = fgg.Substring(1).Split(',')[1].ToString();

            var reportRequestmob = new ReportRequest
            {
                Dimensions = new List<Dimension> { mob },
                Metrics = new List<Metric>() { session },
                ViewId = "150663033" // your view id
            };

            reportRequestmob.DateRanges = new List<DateRange> { dateRange30 };
            var getReportsRequestmob = new GetReportsRequest
            {
                ReportRequests = new List<ReportRequest> { reportRequestmob }
            };
            var batchRequestmob = reportingService.Reports.BatchGet(getReportsRequestmob);
            var responsemob = batchRequestmob.Execute();

            int mobbi = 0;
            foreach (var x in responsemob.Reports.First().Data.Rows)
            {
                // string dd = x.Dimensions.FirstOrDefault().ToString();
                mobbi += Convert.ToInt32(x.Metrics.First().Values.FirstOrDefault().ToString());
            }
            ViewBag.mob30 = mobbi.ToString();
        }
        public void atmisla()
        {
            var filepath = Server.MapPath("~/alobilet724app-e14556dab4c9.json");  // path to the json file for the Service account
            GoogleCredential credentials;
            using (var stream = new FileStream(filepath, FileMode.Open, FileAccess.Read))
            {
                string[] scopes = { AnalyticsReportingService.Scope.AnalyticsReadonly };
                var googleCredential = GoogleCredential.FromStream(stream);
                credentials = googleCredential.CreateScoped(scopes);
            }

            var reportingService = new AnalyticsReportingService(
            new BaseClientService.Initializer
            {
                HttpClientInitializer = credentials
            });


            var dateRange60 = new DateRange
            {
                StartDate = DateTime.Now.AddDays(-59).ToString("yyyy-MM-dd"),

                EndDate = DateTime.Now.ToString("yyyy-MM-dd")
            };
            var dateRange90 = new DateRange
            {
                StartDate = DateTime.Now.AddDays(-90).ToString("yyyy-MM-dd"),
                EndDate = DateTime.Now.ToString("yyyy-MM-dd")
            };
            var pageviews = new Metric
            {
                Expression = "ga:pageviews"

            };

            var users = new Metric
            {
                Expression = "ga:users"

            };

            var session = new Metric
            {
                Expression = "ga:sessions"

            };
            var bounceRate = new Metric
            {
                Expression = "ga:bounceRate"

            };
            var date = new Dimension { Name = "ga:date" };
            var newold = new Dimension { Name = "ga:userType" };
            var mob = new Dimension { Name = "ga:mobileDeviceInfo" };
            //var sor = new Dimension { Name = "ga:source" };

            var reportRequest = new ReportRequest
            {
                Dimensions = new List<Dimension> { date },
                Metrics = new List<Metric>() { pageviews, users, session, bounceRate },
                ViewId = "150663033" // your view id
            };

            reportRequest.DateRanges = new List<DateRange> { dateRange60 };
            var getReportsRequest = new GetReportsRequest
            {
                ReportRequests = new List<ReportRequest> { reportRequest }
            };
            var batchRequest = reportingService.Reports.BatchGet(getReportsRequest);
            var response = batchRequest.Execute();
            string fff = "";
            string ddd = "";
            string eee = "";
            string pv = "";
            string us = "";
            string ku = "";

            int spv = 0;
            int sus = 0;
            int sku = 0;
            foreach (var x in response.Reports.First().Data.Rows)
            {
                string dd = x.Dimensions.FirstOrDefault().ToString();
                pv = string.Join(", ", x.Metrics.First().Values).Split(',')[0];
                fff += ",[" + string.Join(", ", helper.jstimestamp.ToJavascriptTimestamp(Convert.ToDateTime(dd.Substring(0, 4) + "-" + dd.Substring(4, 2) + "-" + dd.Substring(6)))) + "," + pv + "]";
                spv += Convert.ToInt32(pv);
                us = string.Join(", ", x.Metrics.First().Values).Split(',')[1];
                ddd += ",[" + string.Join(", ", helper.jstimestamp.ToJavascriptTimestamp(Convert.ToDateTime(dd.Substring(0, 4) + "-" + dd.Substring(4, 2) + "-" + dd.Substring(6)))) + "," + us + "]";
                sus += Convert.ToInt32(us);
                ku = string.Join(", ", x.Metrics.First().Values).Split(',')[2];
                eee += ",[" + string.Join(", ", helper.jstimestamp.ToJavascriptTimestamp(Convert.ToDateTime(dd.Substring(0, 4) + "-" + dd.Substring(4, 2) + "-" + dd.Substring(6)))) + "," + ku + "]";
                sku += Convert.ToInt32(ku);

            }
            ViewBag.hemencik60 = response.Reports.First().Data.Totals.FirstOrDefault().Values[3].ToString();
            ViewBag.son60p = fff.Substring(1);
            ViewBag.son60u = ddd.Substring(1);
            ViewBag.son60s = eee.Substring(1);
            ViewBag.son60ps = spv.ToString();
            ViewBag.son60us = sus.ToString();
            ViewBag.son60ss = sku.ToString();

            var reportRequestnewold = new ReportRequest
            {
                Dimensions = new List<Dimension> { newold },
                Metrics = new List<Metric>() { session },
                ViewId = "150663033" // your view id
            };

            reportRequestnewold.DateRanges = new List<DateRange> { dateRange60 };
            var getReportsRequestnewold = new GetReportsRequest
            {
                ReportRequests = new List<ReportRequest> { reportRequestnewold }
            };
            var batchRequestnewold = reportingService.Reports.BatchGet(getReportsRequestnewold);
            var responsenewold = batchRequestnewold.Execute();


            string fgg = "";
            foreach (var x in responsenewold.Reports.First().Data.Rows)
            {
                string dd = x.Dimensions.FirstOrDefault().ToString();
                fgg += "," + x.Metrics.First().Values.FirstOrDefault().ToString();
            }
            ViewBag.yeni60 = fgg.Substring(1).Split(',')[0].ToString();
            ViewBag.eski60 = fgg.Substring(1).Split(',')[1].ToString();

            var reportRequestmob = new ReportRequest
            {
                Dimensions = new List<Dimension> { mob },
                Metrics = new List<Metric>() { session },
                ViewId = "150663033" // your view id
            };

            reportRequestmob.DateRanges = new List<DateRange> { dateRange60 };
            var getReportsRequestmob = new GetReportsRequest
            {
                ReportRequests = new List<ReportRequest> { reportRequestmob }
            };
            var batchRequestmob = reportingService.Reports.BatchGet(getReportsRequestmob);
            var responsemob = batchRequestmob.Execute();

            int mobbi = 0;
            foreach (var x in responsemob.Reports.First().Data.Rows)
            {
                // string dd = x.Dimensions.FirstOrDefault().ToString();
                mobbi += Convert.ToInt32(x.Metrics.First().Values.FirstOrDefault().ToString());
            }
            ViewBag.mob60 = mobbi.ToString();
        }
        // GET: home/index
        public ActionResult Index()
        {
            //var f = responsenewold.Reports.First().Data.Totals.FirstOrDefault().Values.Count;
            //otuzla();
            //atmisla();
            //ViewBag.son60 = "";
            //ViewBag.son90 = "";
            // return Content();
            return View();
        }
        //DateRange June2015 = new DateRange() { StartDate = "2015-01-01", EndDate = "2015-06-30" };
        //DateRange June2016 = new DateRange() { StartDate = "2016-01-01", EndDate = "2016-06-30" };
        //List<DateRange> dateRanges = new List<DateRange>() { June2016, June2015 };
        //// Create the ReportRequest object.
        //// This should have a large number of rows
        //ReportRequest reportRequest = new ReportRequest
        //{
        //    ViewId = ConfigurationManager.AppSettings["GoogleAnaltyicsViewId"],
        //    DateRanges = dateRanges,
        //    Dimensions = new List<Dimension>() { new Dimension() { Name = "ga:date" }, new Dimension() { Name = "ga:usertype" } },
        //    Metrics = new List<Metric>() { new Metric() { Expression = "ga:users" }, new Metric() { Expression = "ga:sessions" } },
        //    PageSize = 1000,
        //};

        public ActionResult Social()
        {
            return View();
        }

        // GET: home/inbox
        public ActionResult Inbox()
        {
            return View();
        }
        public ActionResult mesajlar()
        {
            var msj = db.mesajs.ToList();
            return View(msj);
        }
        // GET: home/widgets
        public ActionResult Widgets()
        {
            return View();
        }

        // GET: home/chat
        public ActionResult Chat()
        {
            return View();
        }
    }
}