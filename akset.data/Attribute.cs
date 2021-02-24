using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Attribute
    {
        public int Id { get; set; }
        [Display(Name = "Öznitelik")]
        [Required(ErrorMessage = "Öznitelik Yazmadınız!")]
        public string Name { get; set; }
        [Display(Name = "Eklenebilir")]
        public bool Insertable { get; set; } = false;
        public virtual ICollection<AttributeValue> AttributeValues { get; set; }
        //public virtual ICollection<Kategori> Kategoris { get; set; }

    }
}
