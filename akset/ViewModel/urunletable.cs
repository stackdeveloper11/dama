using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.ViewModel
{

    public class urunletable
    {
        public int Id { get; set; }
        public string adi { get; set; }
        public string baslik { get; set; }
        public string v1 { get; set; }
        public string v2 { get; set; }
        public string eskifiyat { get; set; }
        public string fiyat { get; set; }
        public string satistami { get; set; }
        public string urunkodu { get; set; }
        public string link { get; set; }
        public string resim { get; set; }
        public DateTime tarih { get; set; }
        public virtual List<Areas.Admin.Controllers.filadtli> urunlefiltres { get; set; }

    }
}
