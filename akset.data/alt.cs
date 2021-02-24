using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class alt
    {
        public int Id { get; set; }
        public int detayId { get; set; }
        public string adi { get; set; }
        public string engadi { get; set; }
        public virtual detay detay { get; set; }
    }
}
