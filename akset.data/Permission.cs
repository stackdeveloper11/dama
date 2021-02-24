using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Permission
    {
        public int Id { get; set; }
        [Display(Name = "İzin Adı")]
        [Required(ErrorMessage = "Ad Yazmadınız!")]
        public string Name { get; set; }
        public virtual ICollection<Role> Roles { get; set; }
    }
}
