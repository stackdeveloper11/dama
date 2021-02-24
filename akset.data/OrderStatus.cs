using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class OrderStatus
    {
        public int Id { get; set; }
        [Display(Name = "Sipariş Durum")]
        [Required(ErrorMessage = "Sipariş Durum Yazmadınız!")]
        public string Statu { get; set; }
    }
}
