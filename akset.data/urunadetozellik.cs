using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class urunadetozellik
    {
        public int Id { get; set; }
        public int filitreId { get; set; }
        public int ozellikId { get; set; }
        public int urunId { get; set; }
        public string durum { get; set; }
        public int adet { get; set; }
        public virtual urun urun { get; set; }
        public virtual filitre filitre { get; set; }
        public virtual ozellik ozellik { get; set; }
    }
}
