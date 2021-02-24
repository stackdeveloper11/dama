using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class OrderHistory
    {
        public int Id { get; set; }
        [Display(Name = "Sipariş Durum")]
        [Required(ErrorMessage = "Sipraiş Durum Yazmadınız!")]
        public int OrderStatusId { get; set; }
        public virtual OrderStatus OrderStatus { get; set; }
        public DateTime Tarih { get; set; } = DateTime.Now;
    }
}
