using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace akset
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                 name: "sepeııt",
                 url: "myaccounts",
                 defaults: new { controller = "Home", action = "profil" },
                 namespaces: new[] { "akset.Controllers" }
            );

            routes.MapRoute(
                 name: "mypofil",
                 url: "myprofil",
                 defaults: new { controller = "Home", action = "profil" },
                 namespaces: new[] { "akset.Controllers" }
            );

            routes.MapRoute(
                 name: "kayitdogrul",
                 url: "kayit-dogrula/{kod}",
                 defaults: new { controller = "Home", action = "kayitdogrula" },
                 namespaces: new[] { "akset.Controllers" }
            );

            routes.MapRoute(
               name: "girisyap",
               url: "giris-yap",
               defaults: new { controller = "account", action = "login" },
               namespaces: new[] { "akset.Controllers" }
          );

            routes.MapRoute(
                   name: "uyeol",
                   url: "uye-ol",
                   defaults: new { controller = "account", action = "register" },
                   namespaces: new[] { "akset.Controllers" }
            );

            routes.MapRoute(
                 name: "unuttum",
                 url: "sifremi-unuttum",
                 defaults: new { controller = "account", action = "forgotpassword" },
                 namespaces: new[] { "akset.Controllers" }
            );

            routes.MapRoute(
                name: "ordersk",
                url: "myorders",
                defaults: new { controller = "Home", action = "order" },
                namespaces: new[] { "akset.Controllers" }
            );


            routes.MapRoute(
                 name: "myadr",
                 url: "myaddress",
                 defaults: new { controller = "Home", action = "adres" },
                 namespaces: new[] { "akset.Controllers" }
            );


            routes.MapRoute(
                 name: "sepet",
                 url: "myshopcart",
                 defaults: new { controller = "Home", action = "sepetim" },
                 namespaces: new[] { "akset.Controllers" }
            );

            routes.MapRoute(
                 name: "favor",
                 url: "myfavorites",
                 defaults: new { controller = "Home", action = "favorite" },
                 namespaces: new[] { "akset.Controllers" }
            );

            routes.MapRoute(
                name: "sms",
                url: "home/smsdogrula/{kod}",
                defaults: new { controller = "Home", action = "smsdogrula" },
                namespaces: new[] { "akset.Controllers" }
           );

           routes.MapRoute(
                  name: "arama",
                  url: "ara/{ara}",
                  defaults: new { controller = "Home", action = "searching" },
                  namespaces: new[] { "akset.Controllers" }
            );

            routes.MapRoute(
                name: "num",
                url: "{dty}-urunid-{bnm}",
                defaults: new { controller = "Home", action = "detay" },
                constraints: new { bnm = @"[0-9]+" },
                namespaces: new[] { "akset.Controllers" }
           );

            routes.MapRoute(
                name: "ddd",
                url: "{ilk}",
                defaults: new { controller = "Home", action = "category" },
              
                namespaces: new[] { "akset.Controllers" }
           );

           routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new[] { "akset.Controllers" }
           );
          
        }
    }
}