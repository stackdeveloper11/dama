using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class OrderProduct
    {
        [Display(Name = "Sipariş")]
        [Required(ErrorMessage = "Sipariş Seçmediniz!")]
        [Key, Column(Order = 1)]
        public int OrderId { get; set; }
        [Display(Name = "Ürün")]
        [Required(ErrorMessage = "Ürün Seçmediniz!")]
        [Key, Column(Order = 2)]
        public int ProductId { get; set; }
        [Display(Name = "Adet")]
        [Required(ErrorMessage = "Adet Yazmadınız!")]
        public int Quantity { get; set; }
        [Display(Name = "Ücrfet")]
        [Required(ErrorMessage = "Ücret Yazmadınız!")]
        public decimal Price { get; set; }
        public DateTime Tarih { get; set; } = DateTime.Now;
        public virtual Order Order { get; set; }
        public virtual Product Product { get; set; }
    }
}
