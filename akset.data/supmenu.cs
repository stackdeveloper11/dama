using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class supmenu
    {
        public int Id { get; set; }
        public int? parentId { get; set; }

        [Required(ErrorMessage = "Write Category Name!")]
        [StringLength(100)]
        [Index(IsClustered = false)]
        public string adi { get; set; }
     
        public int sira { get; set; }
        public string link { get; set; }
        public string yeri { get; set; }

        [ForeignKey("parentId")]
        public virtual supmenu parent { get; set; }
        [ForeignKey("parentId")]
        public virtual List<supmenu> parents { get; set; }
  
    }
}
