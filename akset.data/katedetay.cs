using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class katedetay
    {
        public int Id { get; set; }
        public int KategoriId { get; set; }
        public int detayId { get; set; }
        public virtual Kategori Kategori { get; set; }
        public virtual detay detay { get; set; }
    }
}
