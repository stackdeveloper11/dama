using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using akset.data;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using akset.App_Start;
using System.Web.Optimization;
using akset.Controllers;
using StackExchange.Redis;
using RedisSessionProvider.Config;
using System.Globalization;
using System.Threading;

namespace akset
{
    public class Global : HttpApplication
    {
        protected void Application_BeginRequest(Object sender, EventArgs e)
        {
            //if (Request.Url.ToString().Contains("yenileniyoruz.net"))
            //{

            //}
            //else
            //{
            //    switch (Request.Url.Scheme)
            //    {
            //        case "https":
            //            Response.AddHeader("Strict-Transport-Security", "max-age=300");
            //            break;
            //        case "http":
            //            var path = "https://" + Request.Url.Host + Request.Url.PathAndQuery;
            //            Response.Status = "301 Moved Permanently";
            //            Response.AddHeader("Location", path);
            //            break;
            //    }
            //    if (!Request.Url.Host.StartsWith("www") && !Request.Url.IsLoopback)
            //    {
            //        UriBuilder builder = new UriBuilder(Request.Url);
            //        builder.Host = "www." + Request.Url.Host;
            //        Response.StatusCode = 301;
            //        Response.AddHeader("Location", builder.ToString());
            //        Response.End();
            //    }
            //}
            //string currentUrl = HttpContext.Current.Request.Url.ToString().ToLower();

            //Response.Status = "301 Moved Permanently";
            //Response.AddHeader("Location", currentUrl.Replace("eryamanescortbayanim.com", "eryamanescortbayanim.org"));
            //Response.End();

            CultureInfo culture = new CultureInfo("tr-TR");
            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;
        }
        public static void RegisterViewEngine(ViewEngineCollection viewEngines, string namesi)
        {
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new RazorViewEngine());
        }

        void Application_Start(object sender, EventArgs e)
        {
            //ConfigurationOptions redisConfigOpts = ConfigurationOptions.Parse("178.32.127.89:10286");
            //redisConfigOpts.Ssl = false;
            //redisConfigOpts.AllowAdmin = true;
            //redisConfigOpts.Password = "D98;75I?7r!9;WNbjM1):2ga";
            //  option.AbortOnConnectFail = true;
            //https://github.com/neuecc/Owin.RedisSession
            //https://github.com/welegan/RedisSessionProvider
            // pass it to RedisSessionProvider configuration class
            //RedisConnectionConfig.GetSERedisServerConfig = (HttpContextBase context) =>
            //{
            //    return new KeyValuePair<string, ConfigurationOptions>("DefaultConnection", redisConfigOpts);
            //};
            ViewEngines.Engines.Clear();
            var ve = new RazorViewEngine();
            ve = new RazorViewEngine() { FileExtensions = new string[] { "cshtml" } };
            ViewEngines.Engines.Add(ve);
            Database.SetInitializer<aksetDB>(new MigrateDatabaseToLatestVersion<aksetDB, akset.data.Migrations.Configuration>());
            var dbMigrator = new DbMigrator(new data.Migrations.Configuration());
            dbMigrator.Update();
            //ViewEngines.Engines.Clear();
            //var ve = new RazorViewEngine();
            //ve = new RazorViewEngine() { FileExtensions = new string[] { "cshtml" } };
            //ViewEngines.Engines.Add(new RazorViewEngine());
            // Code that runs on application startup
            AreaRegistration.RegisterAllAreas();

            BundleConfig.RegisterBundles(BundleTable.Bundles);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}