using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class AttributeKategori
    {
        
    
        [Display(Name = "Öznitelik")]
        [Required(ErrorMessage = "Öznitelik Seçmediniz!")]
        [Key, Column(Order = 1)]
        public int AttributeId { get; set; }
        [Display(Name = "Kategori")]
        [Required(ErrorMessage = "Kategori Seçmediniz!")]
        [Key, Column(Order = 2)]
        public int KategoriId { get; set; }
        public virtual Attribute Attribute { get; set; }
        public virtual Kategori Kategori { get; set; }
    }
}
