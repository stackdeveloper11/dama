using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Makalekategori
    {
        public int Id { get; set; }
        [DisplayName("Makale Adı")]
        public string adi { get; set; }
        [DisplayName("Makale Başlığı")]
        public string title { get; set; }
        [DisplayName("Makale Açıklaması")]
        public string desc { get; set; }
        [DisplayName("Sıra")]
        public int sira { get; set; }
        public virtual List<Makale> Makales { get; set; }
    }
}
