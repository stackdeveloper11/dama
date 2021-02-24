using System.Web.Mvc;

namespace akset.Areas.Satici
{
    public class SaticiAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Satici";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {

            context.MapRoute(
                name: "urunler",
                url: "Satici/Urunler",
                defaults: new { controller = "Products", action = "Index" },
                namespaces: new[] { "akset.Areas.Satici.Controllers" }
           );

            context.MapRoute(
                "Satici_default",
                "Satici/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional },
                 new[] { "akset.Areas.Satici.Controllers" }
            );
        }
    }
}