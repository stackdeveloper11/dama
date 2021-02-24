using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class RolePermission
    {
        [Display(Name = "Role")]
        [Required(ErrorMessage = "Role Seçmediniz!")]
        [Key, Column(Order = 1)]
        public int RoleId { get; set; }
        [Display(Name = "İzin")]
        [Required(ErrorMessage = "İzin Seçmediniz!")]
        [Key, Column(Order = 2)]
        public int PermissionId { get; set; }
        public virtual Permission Permission { get; set; }
        public virtual Role Role { get; set; }
    }
}
