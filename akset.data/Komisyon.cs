using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Komisyon
    {
        public int Id { get; set; }
        public decimal KomisyonOrani { get; set; }
        public int KategoriId { get; set; }
        public string UserId { get; set; }
        public DateTime Tarih { get; set; } = DateTime.Now;
        public virtual Kategori Kategori { get; set; }
        public virtual User User { get; set; }
    }
}
