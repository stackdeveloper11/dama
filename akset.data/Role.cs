using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Role: IdentityRole
    {
        public string Description { get; set; }
        public Role()
        {

        }

        public Role(string roleName, string description) : base(roleName)
        {
            this.Description = description;
        }
        public virtual ICollection<Permission> Permissions { get; set; }
    }
}
