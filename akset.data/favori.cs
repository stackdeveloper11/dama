using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class favori
    {
        public int Id { get; set; }
      
        public int urunId { get; set; }
        public string userId { get; set; }
        public DateTime tarih { get; set; }
        public virtual urun urun { get; set; }
        public virtual User user { get; set; }
    }
}
