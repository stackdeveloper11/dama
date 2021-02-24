using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class yorum
    {
        public int Id { get; set; }
        public int urunId { get; set; }
        public string UserId { get; set; }
        public string yorumu { get; set; }
        public DateTime tarih { get; set; }
        public virtual urun urun { get; set; }
        public virtual User User { get; set; }
    }
}
