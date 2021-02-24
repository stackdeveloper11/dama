using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class ustunalti
    {
        public int Id { get; set; }
        public string ustunaltiadi { get; set; }
        public int ustmenuId { get; set; }
        public int KategoriId { get; set; }
        public int kacli { get; set; }
        public int sira { get; set; }
        public string katler { get; set; }
        public string resimi { get; set; }
        public virtual ustmenu ustmenu { get; set; }
        public virtual Kategori Kategori { get; set; }
    }
}

