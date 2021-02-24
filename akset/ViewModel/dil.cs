using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.ViewModel
{
    public class dil
    {
        public int Id { get; set; }
        public string adi { get; set; }
        public virtual List<dzl> dzls { get; set; }
    }
}
