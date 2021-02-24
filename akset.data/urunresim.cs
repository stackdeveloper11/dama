using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class urunresim
    {
        public int Id { get; set; }
        public int urunId { get; set; }
        public string resimadi { get; set; }
        public virtual urun urun { get; set; }
    }
}
