using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class User: IdentityUser
    {
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public string RoleId { get; set; }
        public string Ip { get; set; }
        public DateTime Tarih { get; set; }
        public DateTime? DogumTarihi { get; set; }
        public virtual Role Role { get; set; }
        public string sifre { get; set; }
        public string cinsiyet { get; set; }
       public string adres { get; set; }
        public int Sehir { get; set; }
        public int ilce { get; set; }
        public string adrestelefon { get; set; }
        public string smskod { get; set; }
        public int? GroupId { get; set; }
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<Address> Addresss { get; set; }
        public virtual Group Group { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Komisyon> Komisyons { get; set; }

    }
}
