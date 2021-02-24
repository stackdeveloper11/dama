using System.Web.Mvc;

namespace akset.Areas.Uye
{
    public class UyeAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Uye";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Uye_default",
                "Uye/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional },
                 new[] { "akset.Areas.Uye.Controllers" }
            );
        }
    }
}