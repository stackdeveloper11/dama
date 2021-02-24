using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class filadtli
    {
        public int Id { get; set; }
        public string adi { get; set; }
        public bool adetlimi { get; set; }
        public virtual List<ozladtli> ozls { get; set; }
    }

    public class ozladtli
    {
        public int Id { get; set; }
        public string ozellik { get; set; }
        public string durum { get; set; }
        public int adet { get; set; }
    }
}
