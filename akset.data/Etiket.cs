using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Etiket
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Etiket adı yazmadınız!")]
        [StringLength(100)]
        [Index(IsClustered = false)]
        public string adi { get; set; }
   
        public virtual ICollection<Makale> Makales { get; set; }
    }
}
