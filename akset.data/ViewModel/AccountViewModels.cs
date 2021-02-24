using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Xunit.Sdk;

namespace akset.data.ViewModel
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required(ErrorMessage = "Adınızı Yazmadınız")]
        public string Adi { get; set; }
        [Required(ErrorMessage = "Soyadınızı Yazmadınız")]
        public string Soyadi { get; set; }
        [Required(ErrorMessage = "Email Adresi Yazmalısınız.")]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Lütfen geçerli bir email adresi yazınız!")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Adınız Soyadınız Yazmalısınız.")]
        [StringLength(40, ErrorMessage = "{0} en az {2} karakter olmalı.", MinimumLength = 3)]
        [Display(Name = "Adınız Soyadınız")]
        public string UserName { get; set; }
      
        [Required(ErrorMessage = "Şifre Yazmalısınız.")]
        [StringLength(100, ErrorMessage = "{0} en az {2} karakter olmalı.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Şifreniz")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Şifre Tekrar")]
     //   [systemCompare("Password", ErrorMessage = "Şifre ve Şifre tekrar bilgileri uyuşmuyor.")]
        public string ConfirmPassword { get; set; }
        
        public  string accesstoken { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        [Display(Name = "Code")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required(ErrorMessage = "Email Adresi Yazmalısınız.")]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Lütfen geçerli bir email adresi yazınız!")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
       
    }

    public class LoginViewModel
    {
        [Required(ErrorMessage = "Telefon Numarası Yazmalısınız.")]
        //[RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Lütfen geçerli bir email adresi yazınız!")]
        //[DataType(DataType.EmailAddress)]
        //[EmailAddress]
        //[Display(Name = "Email")]
        //public string Email { get; set; }
        public string Phone { get; set; }

        [Required(ErrorMessage = "Şifre Yazmalısınız.")]
        [StringLength(100, ErrorMessage = "{0} en az {2} karakter olmalı.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Şifreniz")]
        public string Password { get; set; }

        [Display(Name = "Beni Hatırla?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Adınızı Yazmalısınız.")]
        public string Ad { get; set; }
        [Required(ErrorMessage = "Soyadınızı Yazmalısınız.")]
        public string Soyad { get; set; }
        public string Phone { get; set; }
        public DateTime Tarih { get; set; }
        
        [Required(ErrorMessage = "Email Adresi Yazmalısınız.")]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Lütfen geçerli bir email adresi yazınız!")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Şifre Yazmalısınız.")]
        [StringLength(100, ErrorMessage = "{0} en az {2} karakter olmalı.", MinimumLength = 6)]
        [DataType(DataType.Password)]   
        [Display(Name = "Şifreniz")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Şifre Tekrar")]
        //[Compare("Password", ErrorMessage = "Şifre ve Şifre tekrar bilgileri uyuşmuyor.")]
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordViewModel
    {
        [Required(ErrorMessage = "Email Adresi Yazmalısınız.")]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Lütfen geçerli bir email adresi yazınız!")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Şifre Yazmalısınız.")]
        [StringLength(100, ErrorMessage = "{0} en az {2} karakter olmalı.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Şifre")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Şifre Tekrar")]
      //  [Compare("Password", ErrorMessage = "Şifre ve Şifre tekrar bilgileri uyuşmuyor.")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        [Required(ErrorMessage = "Telefon Numarası Yazmalısınız.")]
        // [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Lütfen geçerli bir email adresi yazınız!")]

        [RegularExpression(@"(05|5)[0-9][0-9][1-9]([0-9]){6}", ErrorMessage = "Lütfen geçerli bir numara yazınız!")]
        [DataType(DataType.PhoneNumber)]
        [EmailAddress]
        [Display(Name = "Telefon")]
        public string Phone { get; set; }
    }
}
