using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class urundetayalt
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int detayId { get; set; }
        public int altId { get; set; }
        public int urunId { get; set; }
        public virtual detay detay { get; set; }
        public virtual alt alt { get; set; }
        public virtual urun urun { get; set; }
        public virtual User User { get; set; }
    }
}
