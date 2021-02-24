using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Brand
    {
        public int Id { get; set; }
        [Display(Name = "Marka")]
        [Required(ErrorMessage = "Marka Yazmadınız!")]
        public string BrandName { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
