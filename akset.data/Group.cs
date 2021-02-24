using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Group
    {
        public int Id { get; set; }
        [Display(Name = "Grup Adı")]
        [Required(ErrorMessage = "Grup Adı Yazmadınız!")]
        public string Name { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
