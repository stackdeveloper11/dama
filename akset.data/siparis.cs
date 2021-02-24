using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class siparis
    {
        public int Id { get; set; }
        public string  adi { get; set; }
        public string soyadi { get; set; }
        public string email { get; set; }
    
  
       
        public string adres { get; set; }
     
        public string telefon { get; set; }
   
        public string satissiparisno { get; set; }
    
        public string UserId { get; set; }
        public string siparisnotu { get; set; }
        public bool ulasildimi { get; set; }
        public string siparisdurum { get; set; }
        public string siparisdurumaciklama { get; set; }
        public string odemesekli { get; set; }
        public DateTime yenisiparistarih { get; set; }
        public DateTime? onaylanditarih { get; set; }
        public DateTime? faturatarih { get; set; }
        public DateTime? kargotarih { get; set; }
        public DateTime? iptalarih { get; set; }
        public virtual User User { get; set; }
        public virtual string sehir { get; set; }
    
    }
}
