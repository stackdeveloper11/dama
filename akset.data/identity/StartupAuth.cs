using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using System.Threading.Tasks;

using System.Security.Claims;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.Owin.Security.Google;

namespace akset.data.Identity
{
   
    public static class Startup
    {

        public static IDataProtectionProvider DataProtectionProvider { get; set; }
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public static void ConfigureAuth(IAppBuilder app)
        {
            DataProtectionProvider = app.GetDataProtectionProvider();
            // Configure the db context, user manager and signin manager to use a single instance per request
            app.CreatePerOwinContext(aksetDB.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            // Configure the sign in cookie
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
                Provider = new CookieAuthenticationProvider
                {
                    // Enables the application to validate the security stamp when the user logs in.
                    // This is a security feature which is used when you change a password or add an external login to your account.
                    OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, User>(
                    validateInterval: TimeSpan.FromMinutes(30),
                    regenerateIdentity: (manager, user) => user.GenerateUserIdentityAsync(manager))
                }
            });
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enables the application to temporarily store user information when they are verifying the second factor in the two-factor authentication process.
            //  app.UseTwoFactorSignInCookie(DefaultAuthenticationTypes.TwoFactorCookie, TimeSpan.FromMinutes(5));

            // Enables the application to remember the second login verification factor such as phone or email.
            // Once you check this option, your second step of verification during the login process will be remembered on the device where you logged in from.
            // This is similar to the RememberMe option when you log in.
            //  app.UseTwoFactorRememberBrowserCookie(DefaultAuthenticationTypes.TwoFactorRememberBrowserCookie);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");
            //https://developers.google.com/identity/sign-in/web/people

            app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = "144239955861-cd3dcbdqgo1s5qf2mulu2eu05ds5eb5t.apps.googleusercontent.com",
                ClientSecret = "XfHZRyXstRyQUeK6ceiEPg23"
            });

            app.UseFacebookAuthentication(
               appId: "322318775026761",
               appSecret: "ef2e4cbb959e7a8ea0a4767122001e7e"
            );


            //var twitterOptions = new TwitterAuthenticationOptions
            //{
            //    ConsumerKey = "pW9qGmpCSCyKhlyeQzgET2olt",
            //    ConsumerSecret = "7HEem51gyWJitr8APYJLSTbUjXQwiUvGxNFeesrapWp0MCANyq",
            //    Provider = new TwitterAuthenticationProvider
            //    {
            //        OnAuthenticated = (context) =>
            //        {
            //            context.Identity.AddClaim(new Claim("urn:twitter:AccessTokenSecret", context.AccessTokenSecret, "XmlSchemaString", "Twitter"));
            //            context.Identity.AddClaim(new Claim("urn:twitter:ScreenName", context.ScreenName, "XmlSchemaString", "Twitter"));
            //            context.Identity.AddClaim(new Claim("urn:twitter:UserId", context.UserId, "XmlSchemaString", "Twitter"));
            //            context.Identity.AddClaim(new Claim("urn:twitter:access_token", context.AccessToken, "XmlSchemaString", "Twitter"));
            //            return Task.FromResult(0);
            //        }
            //    }
            //};

            //app.UseTwitterAuthentication(twitterOptions);












            ////http://www.c-sharpcorner.com/uploadfile/4b0136/social-provider-access-in-web-application-with-mvc-5/
            ////https://aurir.wordpress.com/2016/05/03/integrating-facebook-profile-details-into-an-asp-net-mvc-site/
            ////http://stackoverflow.com/questions/20378043/getting-the-email-from-external-providers-google-and-facebook-during-account-ass
            ////http://stackoverflow.com/questions/35833994/getting-facebook-user-access-token-from-facebook-sdk-for-net-in-asp-net-mvc-app
            ////http://www.theroks.com/social-login-owin-authentication-mvc5/
            ////User Access Token , App Access Token , Page Access Token , Client Token
            ////https://forums.asp.net/t/1927914.aspx?Adding+Facebook+scope+permissions+when+authenticating+users+Owin+
            //var facebookAuthenticationOptions = new FacebookAuthenticationOptions()
            //{
            //    AppId = "315214115603158",
            //    AppSecret = "d8559c48f7e0ce5a63695fc6cc69c944",
            //    BackchannelHttpHandler = new FacebookBackChannelHandler(),
            //    UserInformationEndpoint = "https://graph.facebook.com/v2.9/me?fields=id,name,email,first_name,last_name",
            //    Provider = new FacebookAuthenticationProvider
            //    {
            //        OnAuthenticated = (context) =>
            //        {
            //            var accessToken = context.AccessToken;
            //            context.Identity.AddClaim(new Claim("FacebookAccessToken", context.AccessToken));
            //            foreach (var claim in context.User)
            //            {
            //                var claimType = string.Format("urn:facebook:{0}", claim.Key);
            //                string claimValue = claim.Value.ToString();
            //                if (!context.Identity.HasClaim(claimType, claimValue))
            //                    context.Identity.AddClaim(new System.Security.Claims.Claim(claimType, claimValue, "XmlSchemaString", "Facebook"));

            //            }
            //            return Task.FromResult(true);
            //        }
            //    }
            //};
            //facebookAuthenticationOptions.Scope.Add("public_profile");
            //facebookAuthenticationOptions.Scope.Add("publish_actions");
            //facebookAuthenticationOptions.Scope.Add("email");

            //facebookAuthenticationOptions.UserInformationEndpoint = "https://graph.facebook.com/v2.4/me?fields=email";
            //app.UseFacebookAuthentication(facebookAuthenticationOptions);
            //https://github.com/RockstarLabs/oauthforaspnet/blob/master/src/DemoMVC5/OAuthDemoMVC5/App_Start/Startup.Auth.cs

            //2021213364.d9af2b2.6f47e5a0b78f46758b299e6e5e261907
            //var iinstagramAuthenticationOptions = new InstagramAuthenticationOptions()
            //{
            //    ClientId = "d9af2b2b8fdb425fb4be8bef889b1513",
            //    ClientSecret = "bbc194f937ad4fde8b21659ecd6f3ba6",

            //    Provider = new InstagramAuthenticationProvider()
            //    {
            //        OnAuthenticated = (context) =>
            //        {
            //            context.Identity.AddClaim(new Claim("instagramaccesstoken", context.AccessToken));
            //            return Task.FromResult(0);
            //        }
            //    }
            //};
            //iinstagramAuthenticationOptions.Scope.Add("basic");
            //iinstagramAuthenticationOptions.Scope.Add("public_content");
            //app.UseInstagramAuthentication(iinstagramAuthenticationOptions);


            //app.UseInstagramInAuthentication(
            // ApplicationId:
            // );
            //app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "",
            //    ClientSecret = ""
            //});
        }
    }
}