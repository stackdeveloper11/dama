using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class hesap
    {
        public int Id { get; set; }
        public int urunId { get; set; }
        public int filitreId { get; set; }
        public int ozellikId { get; set; }
        public int adet { get; set; }
        public string kaclira { get; set; }
  //      public virtual urun urun { get; set; }
        public virtual filitre filitre { get; set; }
        public virtual ozellik ozellik { get; set; }
    }
}
