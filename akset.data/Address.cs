using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Address
    {
        public int Id { get; set; }
        [Display(Name = "Kullanıcı")]
        [Required(ErrorMessage = "Kullanıcı Seçmediniz!")]
        public string UserId { get; set; }
        [Display(Name = "Adres Adı")]
        [Required(ErrorMessage = "Adres Adı Yazmadınız!")]
        public string AddressName { get; set; }
        [Display(Name = "Adres")]
        [Required(ErrorMessage = "Adres Yazmadınız!")]
        public string AddressValue { get; set; }
        public virtual User User { get; set; }
    }
}
