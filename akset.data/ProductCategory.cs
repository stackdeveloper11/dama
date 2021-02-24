using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class ProductCategory
    {
        [Display(Name = "Ürün")]
        [Required(ErrorMessage = "Ürün Seçmediniz!")]
        [Key, Column(Order = 1)]
        public int ProductId { get; set; }
        [Display(Name = "Kategori")]
        [Required(ErrorMessage = "Kategori Seçmediniz!")]
        [Key, Column(Order = 2)]
        public int KategoriId { get; set; }
        public int Level { get; set; } = 0;
        public virtual Product Product { get; set; }
        public virtual Kategori Kategori { get; set; }
    }
}
