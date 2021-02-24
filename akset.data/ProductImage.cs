using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class ProductImage
    {
        public int Id { get; set; }
        [Display(Name = "Ürün")]
        [Required(ErrorMessage = "Ürün Seçmediniz!")]
        public int ProductId { get; set; }
        [Display(Name = "Resim")]
        [Required(ErrorMessage = "Resim Eklemediniz!")]
        public string Image { get; set; }
        public virtual Product Product { get; set; }
    }
}
