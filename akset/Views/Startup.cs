using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(akset.data.Identity.Startup))]
namespace akset
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            akset.data.Identity.Startup.ConfigureAuth(app);
        //    app.AddIdentity<User, IdentityRole>()
        //.AddErrorDescriber<CustomIdentityErrorDescriber>();
        }

    }
}