using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using akset.data;
using akset.data.Identity;
using System.Net.Mail;
using System.Net;
using System.Data.Entity;
using akset.helper.ActionFilters;
using akset.data.ViewModel;
using System.IO;
using System.Web.Http.ModelBinding;

namespace akset.Controllers
{
    [Authorize]
    [HandleError]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        //
        // GET: /Account/Login

        [AllowAnonymous]
        //[WhitespaceFilter]
        //[OutputCache(Duration = 120, VaryByCustom = "User")]
        public ActionResult Login(string returnUrl)
        {
            //if (Request.IsAuthenticated)
            //{
            //    return Redirect("https://www.binbirhayvan.com");
            //}
            ViewBag.Title = "jjj";
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                // find user by username first
                var user = db.Users.Where(a => a.PhoneNumber == model.Phone.Replace(" ", "").Replace("(", "").Replace(")", "")).FirstOrDefault();// await UserManager.FindByEmailAsync(model.Email);
 
                if (user != null)
                {
                    //if (user.onay == false)
                    //{
                    //    ModelState.AddModelError("", "Hesabınız askıya alınmıştır.");
                    //    return View(model);
                    //}
                    var validCredentials = await UserManager.FindAsync(user.UserName, model.Password);
                  
                    // When a user is lockedout, this check is done to ensure that even if the credentials are valid
                    // the user can not login until the lockout duration has passed
                    if (await UserManager.IsLockedOutAsync(user.Id))
                    {
                        ModelState.AddModelError("", string.Format("Hesabınız {0} dakikalığına çok fazla hatalı giriş yapmanızdan dolayı askıya alınmıştır.", TimeSpan.FromMinutes(5).ToString()));
                    }
                    if (user.PhoneNumberConfirmed==false)
                    {
                        ModelState.AddModelError("", "Doğrulanmamış üyelik. Lütfen Sms doğrulama işlemini gerçekleştiriniz. <a href='/home/smsdogrula/"+user.Id+"'>Kayıt Doğrula</a>");
                    }
                    // if user is subject to lockouts and the credentials are invalid
                    // record the failure and check if user is lockedout and display message, otherwise, 
                    // display the number of attempts remaining before lockout
                    else if (await UserManager.GetLockoutEnabledAsync(user.Id) && validCredentials == null)
                    {
                        // Record the failure which also may cause the user to be locked out
                        await UserManager.AccessFailedAsync(user.Id);

                        string message;

                        if (await UserManager.IsLockedOutAsync(user.Id))
                        {
                            message = string.Format("Hesabınız {0} dakikalığına çok fazla hatalı giriş yapmanızdan dolayı askıya alınmıştır.", TimeSpan.FromMinutes(5).ToString());
                        }
                        else
                        {
                            int accessFailedCount = await UserManager.GetAccessFailedCountAsync(user.Id);

                            int attemptsLeft = 5 - accessFailedCount;

                            message = string.Format(
                                "Geçersiz giriş bilgisi. Hesabınız {0} kere daha hatalı giriş yaparsanız askıya alınacaktır.", attemptsLeft);

                        }

                        ModelState.AddModelError("", message);
                    }
                    else if (validCredentials == null)
                    {
                        ModelState.AddModelError("", "Geçersiz giriş bilgisi. Lütfen tekrar deneyiniz.");
                    }
                    else
                    {
                        // await SignInManager.SignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: true);
                        // await SignInManager.SignInAsync(user,true, model.RememberMe); 



                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: true);

                        var ff = db.Roles.Where(a => a.Name == "User").FirstOrDefault();
                        var zz = db.Roles.Where(a => a.Name == "Admin").FirstOrDefault();

                        // When token is verified correctly, clear the access failed count used for lockout
                        await UserManager.ResetAccessFailedCountAsync(user.Id);
                        if (user.RoleId == ff.Id)
                        {
                            return RedirectToLocal(returnUrl);
                        }
                        else
                        {
                            if (user.RoleId==zz.Id)
                            {

                            }
                            return RedirectToAction("index", "Home", new { area = "Admin" });
                        }


                        // When token is verified correctly, clear the access failed count used for lockout
                        // await UserManager.ResetAccessFailedCountAsync(user.Id);

                        return RedirectToLocal(returnUrl);
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Geçersiz giriş bilgisi. Lütfen tekrar deneyiniz.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);


            //if (!ModelState.IsValid)
            //{
            //    return View(model);
            //}

            //// This doesn't count login failures towards account lockout
            //// To enable password failures to trigger account lockout, change to shouldLockout: true
            //var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: false);
            //switch (result)
            //{
            //    case SignInStatus.Success:
            //        return RedirectToLocal(returnUrl);
            //    case SignInStatus.LockedOut:
            //        return View("Lockout");
            //    case SignInStatus.RequiresVerification:
            //        return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
            //    case SignInStatus.Failure:
            //    default:
            //        ModelState.AddModelError("", "Invalid login attempt.");
            //        return View(model);
            //}
        }

        //
        // GET: /Account/VerifyCode
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(model.Provider, model.Code, isPersistent: model.RememberMe, rememberBrowser: model.RememberBrowser);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }
        aksetDB db = new aksetDB();
        //
        // GET: /Account/Register
        [AllowAnonymous]
        [WhitespaceFilter]
        //   [OutputCache(Duration = 120, VaryByCustom = "User")]
        public ActionResult Register()
        {
            if (Request.IsAuthenticated)
            {
                return Redirect("/");
            }
            //ViewBag.sehirId = new SelectList(db.sehirs.ToList(), "Id", "bolge", db.sehirs.Where(a => a.bolge.ToLower() == "istanbul").ToList().FirstOrDefault().Id);
            //ViewBag.ilceId = new SelectList(db.ilces.Where(a => a.sehirId == db.sehirs.Where(b => b.bolge.ToLower() == "istanbul").ToList().FirstOrDefault().Id).ToList(), "Id", "ilcesi");
            // ViewBag.RoleId = new SelectList(db.Roles.Where(a => a.Name != "Admin").ToList(), "Id", "Description");
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {

            if (ModelState.IsValid)
            {
                if (db.Users.Where(a=>a.PhoneNumber==model.Phone.Replace(" ","").Replace("(","").Replace(")","")).FirstOrDefault()!=null)
                {
                    ModelState.AddModelError("","Bu Telefon Numarası ile Daha Önce Kayıt Oluşturulmuştur.");
                    return View(model);
                }
                string phn ="9"+ model.Phone.Replace(" ","").Replace("(","").Replace(")","");
                string kod = helper.Genel.RandomString(6);
                var user = new User {smskod=kod, RoleId = db.Roles.Where(a => a.Name == "User").FirstOrDefault().Id, UserName = "uye" + new Random().Next(1, 100) + new Random().Next(100, 999), Email = model.Email, Tarih = DateTime.Now,Ad=model.Ad,Soyad=model.Soyad,Ip=helper.Genel.GetIPAddress(),sifre = model.Password,PhoneNumber=model.Phone.Replace(" ","").Replace("(","").Replace(")","") };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                    UserManager.AddToRole(user.Id, db.Roles.Where(a => a.Name == "User").FirstOrDefault().Name);
                   //  await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: true);

                    //   string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    //    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    helper.Genel.smsyolla2(helper.Genel.trle(model.Soyad.ToUpper()), "Selmahanim.com ailesine hos geldiniz.Uyelik dogrulama kodunuz: "+kod+" olarak dogrulama sayfasinda giriniz." + kod,phn);
                  //  string neresi = "";
                    var uri = new Uri(Request.Url.ToString());
                    var authority = uri.GetLeftPart(UriPartial.Authority);
                   // helper.Genel.mailyolla("AloBilet724 - Yeni Üyelik", "<a href='"+ callbackUrl + "' target='_blank'/>" + "Buraya tıklayarak E-Posta adresinizi doğrulayabilirsiniz." + "</a>", model.Soyad, model.Email);
                    return Redirect(authority+"/home/smsdogrula/"+ user.Id);
                }
                AddErrors(result);
            }
            //ViewBag.sehirId = new SelectList(db.sehirs.ToList(), "Id", "bolge", model.sehirId);
            //ViewBag.ilceId = new SelectList(db.ilces.Where(a => a.sehirId == model.sehirId).ToList(), "Id", "ilcesi", model.ilceId);
            return View(model);
        }
        public ActionResult kayit()
        {
            return View();
        }
        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            //if (Request.IsAuthenticated)
            //{
            //    if (result.Succeeded)
            //    {
            //        return Redirect("https://hesap.ozelderslistesi.com");
            //    }
            //}


            return View(result.Succeeded ? "ConfirmEmail" : "dogrulamahata");
        }

        //
        // GET: /Account/ForgotPassword
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ForgotPassword(string phone)
        {
            if (!string.IsNullOrEmpty(phone))
            {
                if (db.Users.Where(a=>a.PhoneNumber==phone.Replace(" ","").Replace("(","").Replace(")","")).FirstOrDefault() != null)
                {
                  
                    string phn = "9" + phone.Replace(" ", "").Replace("(", "").Replace(")", "");
                    string kod = helper.Genel.RandomString(6);
                    helper.Genel.smsyolla2(db.Users.Where(a => a.PhoneNumber == phone.Replace(" ", "").Replace("(", "").Replace(")", "")).FirstOrDefault().Soyad, "Uyelik Dogrulama Kodunuz:" + kod + " iyi gunler dileriz.", phn);
                    var usr = db.Users.Where(a => a.PhoneNumber == phone.Replace(" ", "").Replace("(", "").Replace(")", "")).FirstOrDefault();
                    usr.smskod = kod;
                    db.Entry(usr).State = EntityState.Modified;
                    db.SaveChanges();
                    var uri = new Uri(Request.Url.ToString());
                    var authority = uri.GetLeftPart(UriPartial.Authority);
                    return Redirect(authority + "/kayit-dogrula/"+ db.Users.Where(a => a.PhoneNumber == phone.Replace(" ", "").Replace("(", "").Replace(")", "")).FirstOrDefault().Id);
                }
                else
                {
                    return RedirectToAction("ForgotPassword");
                }
            }
            else
            {
                return RedirectToAction("ForgotPassword");
            }
         //   if (ModelState.IsValid)
         //   {
                //var user = await UserManager.FindByEmailAsync(model.Phone);
                //if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                //{
                //    return View("ForgotPasswordConfirmation");
                //}
                //string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                //var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                //helper.Genel.mailyolla("AloBilet724 - Şifre Yenileme", "<a href='" + callbackUrl + "&maili=" + model.Phone + "' target='_blank'/>" + "Buraya tıklayarak Şifre yenileme işlemini gerçekleştiriniz." + "</a>", user.Soyad, model.Phone);
                //return RedirectToAction("ForgotPasswordConfirmation", "Account");
          //  }
            return View();
        }

        //
        // GET: /Account/ForgotPasswordConfirmation
        //  
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        // GET: /Account/ResetPassword
        [AllowAnonymous]
        public ActionResult ResetPassword(string code)
        {
            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await UserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                string idsi = user.Id;
                var ddd = db.Users.Where(a => a.Id == idsi).FirstOrDefault();
                ddd.sifre= model.Password;
                db.Entry(ddd).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // return Content(returnUrl.re);
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/SendCode
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("Error");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
                case SignInStatus.Failure:
                default:
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    if (loginInfo.Login.LoginProvider == "Twitter")
                    {
                        //string atokini = loginInfo.ExternalIdentity.Claims.First(c => c.Type == "urn:twitter:access_token").Value;
                        //string atokensecreti = loginInfo.ExternalIdentity.Claims.First(c => c.Type == "urn:twitter:AccessTokenSecret").Value;
                        //string profili = "https://twitter.com/" + loginInfo.ExternalIdentity.Claims.First(c => c.Type == "urn:twitter:ScreenName").Value;
                        //string twitidsi = loginInfo.ExternalIdentity.Claims.First(c => c.Type == "urn:twitter:UserId").Value;
                        //string usrsiip = User.Identity.GetUserId();
                        //Sosyal ddp = new Sosyal();
                        //if (db.Sosyals.Where(a => a.no == twitidsi).FirstOrDefault() != null)
                        //{
                        //    ddp = db.Sosyals.Where(a => a.no == twitidsi).FirstOrDefault();
                        //    ddp.hangisi = "twitter";
                        //    ddp.UserId = usrsiip;
                        //    ddp.token = atokini;
                        //    ddp.deger1 = atokensecreti;
                        //    ddp.no = twitidsi;
                        //    ddp.profillink = profili;
                        //    ddp.etarih = DateTime.Now;
                        //    db.Entry(ddp).State = System.Data.Entity.EntityState.Modified;
                        //    db.SaveChanges();
                        //    SiteAyarlari ddkk = db.SiteAyarlaris.FirstOrDefault();
                        //    ddkk.sonGuncellemesi = DateTime.Now;
                        //    db.Entry(ddkk).State = EntityState.Modified;
                        //    db.SaveChanges();
                        //}
                        //else
                        //{
                        //    ddp.hangisi = "twitter";
                        //    ddp.UserId = usrsiip;
                        //    ddp.token = atokini;
                        //    ddp.deger1 = atokensecreti;
                        //    ddp.no = twitidsi;
                        //    ddp.profillink = profili;
                        //    ddp.etarih = DateTime.Now;
                        //    db.Sosyals.Add(ddp);
                        //    db.SaveChanges();
                        //    SiteAyarlari ddkk = db.SiteAyarlaris.FirstOrDefault();
                        //    ddkk.sonGuncellemesi = DateTime.Now;
                        //    db.Entry(ddkk).State = EntityState.Modified;
                        //    db.SaveChanges();

                        //}

                        return RedirectToLocal(returnUrl);

                    }

                    if (loginInfo.Login.LoginProvider == "Facebook")
                    {

                        //var name = loginInfo.ExternalIdentity.Claims.First(c => c.Type == "urn:facebook:first_name").Value;
                        //var idi = loginInfo.ExternalIdentity.Claims.First(c => c.Type == "urn:facebook:id").Value;
                        //var link = "https://www.facebook.com/" + idi;


                        //var sehirid = db.sehirs.Where(a => a.bolge.ToLower() == "istanbul").FirstOrDefault().Id;
                        //var semtid = db.semts.Where(a => a.ilceId == sehirid).FirstOrDefault().Id;
                        //var roleid = db.Roles.Where(a => a.Name == "DersAlan").FirstOrDefault().Id;
                        //int utid = db.uyeliktips.Where(a => a.uyelik == "Bedava").FirstOrDefault().Id;
                        //string jjj = name + "_" + new Random().Next(99, 99999);
                        //var accessToken = loginInfo.ExternalIdentity.FindFirstValue("FacebookAccessToken");
                        //var fb = new Facebook.FacebookClient();
                        //dynamic resultato = fb.Get("oauth/access_token",
                        //new
                        //{
                        //    client_id = "315214115603158",
                        //    client_secret = "d8559c48f7e0ce5a63695fc6cc69c944",
                        //    grant_type = "fb_exchange_token",
                        //    fb_exchange_token = accessToken
                        //});

                        //var longToken = resultato.access_token as string;

                        //if (db.Sosyals.Where(a => a.no == idi.ToString()).FirstOrDefault() == null)
                        //{
                        //    if (!Helper.Common.IsAuthenticated)
                        //    {
                        //        var user = new User { nealdi = "Bedava", RoleId = roleid, uyeliktipId = utid, uyelikdurum = "Bitti", uyelikbaslamatarihi = DateTime.Now, uyelikbitistarihi = null, Adi = name, mailbildirim = true, Cinsiyeti = true, Soyadi = name, sifresi = name + "-" + new Random().Next(100, 99999), DogumTarihi = DateTime.Now.AddYears(-20), adminonay = true, sehirId = sehirid, semtId = semtid, UserName = jjj + "@ozelderslistesi.com", Email = jjj + "@ozelderslistesi.com", Ip = OzelDers.Helper.getIp.GetIPAddress(), onaylimi = false, kTarih = DateTime.Now, cTarih = DateTime.Now, gTarih = DateTime.Now, dTarih = DateTime.Now, nerdeveriyorsun = true };

                        //        var resulti = await UserManager.CreateAsync(user);
                        //        if (resulti.Succeeded)
                        //        {
                        //            resulti = await UserManager.AddLoginAsync(user.Id, loginInfo.Login);
                        //            if (resulti.Succeeded)
                        //            {
                        //                await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        //                Sosyal dd = new Sosyal();
                        //                dd.hangisi = "facebook";
                        //                dd.UserId = user.Id;
                        //                dd.token = longToken;
                        //                dd.no = idi;
                        //                dd.profillink = link;
                        //                dd.etarih = DateTime.Now;
                        //                db.Sosyals.Add(dd);
                        //                db.SaveChanges();
                        //                SiteAyarlari ddkk = db.SiteAyarlaris.FirstOrDefault();
                        //                ddkk.sonGuncellemesi = DateTime.Now;
                        //                db.Entry(ddkk).State = EntityState.Modified;
                        //                db.SaveChanges();
                        //                return RedirectToLocal(returnUrl);
                        //            }
                        //        }
                        //    }
                        //    else
                        //    {
                        //        string usrsii = User.Identity.GetUserId();
                        //        Sosyal dd = new Sosyal();
                        //        dd.hangisi = "facebook";
                        //        dd.UserId = usrsii;
                        //        dd.token = longToken;
                        //        dd.no = idi;
                        //        dd.profillink = link;
                        //        dd.etarih = DateTime.Now;
                        //        db.Sosyals.Add(dd);
                        //        db.SaveChanges();
                        //        SiteAyarlari ddkk = db.SiteAyarlaris.FirstOrDefault();
                        //        ddkk.sonGuncellemesi = DateTime.Now;
                        //        db.Entry(ddkk).State = EntityState.Modified;
                        //        db.SaveChanges();
                        //        return RedirectToLocal(returnUrl);
                        //    }
                        //}
                    }
                    //string dddk = "";
                    //foreach (var item in loginInfo.ExternalIdentity.Claims)
                    //{
                    //    dddk += "--------------" + item.Type + ":" + item.Value;
                    //}
                    //  return Content(dddk);
                    //  var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                    // var firstName = loginInfo.ExternalIdentity.Claims.First(c => c.Type == "first_name").Value;
                    // var lastName = info.ExternalIdentity.Claims.First(c => c.Type == "last_name").Value;


                    //dynamic resulte = fb.Get("debug_token", new
                    //{
                    //    access_token = "d8559c48f7e0ce5a63695fc6cc69c944",
                    //    input_token = fbToken
                    //});
                    return RedirectToLocal(returnUrl);
                    //   return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email,Adi=name.ToString() });
            }
        }
        [AllowAnonymous]
        public ActionResult facebook(string url)
        {
            return new ChallengeResult("Facebook", Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = url.Replace("/account/facebook?url=", "") }));
        }
        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            //if (User.Identity.IsAuthenticated)
            //{
            //    return RedirectToAction("Index", "Manage");
            //}

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }

                var user = new User { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("login", "account");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}