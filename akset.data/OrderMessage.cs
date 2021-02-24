using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class OrderMessage
    {
        public int Id { get; set; }
        [Display(Name = "Sipariş")]
        [Required(ErrorMessage = "Sipariş Seçmediniz!")]
        public int OrderId { get; set; }
        [Display(Name = "Mesaj")]
        [Required(ErrorMessage = "Mesaj Yazmadınız!")]
        public string Message { get; set; }
        [Display(Name = "Mesajı Yazan")]
        [Required(ErrorMessage = "Mesajı Yazanı Yazmadınız!")]
        public string Who { get; set; }
        public virtual Order Order { get; set; }
    }
}
