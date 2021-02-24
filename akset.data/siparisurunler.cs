using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class siparisurunler
    {
        public int Id { get; set; }
        public int siparisId { get; set; }
        public int urunId { get; set; }
        public int adet { get; set; }
        public virtual urun urun { get; set; }
        public virtual siparis siparis { get; set; }
    }
}
