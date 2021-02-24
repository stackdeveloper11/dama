using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class ProductStock
    {

        public int Id { get; set; }
        [Display(Name = "Adet")]
        [Required(ErrorMessage = "Adet Yazmadınız!")]
        public int Quantity { get; set; }
        [Display(Name = "Birim Fiyatı")]
        [Required(ErrorMessage = "Birim Fiyatı Yazmadınız!")]
        public Decimal UnitPrice { get; set; }
        [Display(Name = "Ürün")]
        [Required(ErrorMessage = "Ürün Seçmediniz!")]
        public int ProductId { get; set; }
        public virtual Product Product { get; set; }
    }
}
