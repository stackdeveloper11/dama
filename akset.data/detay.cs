using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class detay
    {
        public int Id { get; set; }
        public string adi { get; set; }
        public string engadi { get; set; }
        public bool multi { get; set; }
        public virtual ICollection<alt> alts { get; set; }
    }
}
