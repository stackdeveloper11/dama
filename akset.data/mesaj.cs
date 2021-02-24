using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class mesaj
    {
        public int Id { get; set; }
        public string adisoyadi { get; set; }
        public string telno { get; set; }
        public string mail { get; set; }
        public string ip { get; set; }
        [Index(IsClustered = false)]
        [MaxLength(450, ErrorMessage = "450 Kareketerden Uzun Olamaz!"), MinLength(2, ErrorMessage = "2 karakterden küçük olamaz!")]
        [Required(ErrorMessage = "Mesaj Boş Geçilemez!")]
        public string mesaji { get; set; }
        public bool okundumu { get; set; }
        public DateTime tarih { get; set; }
       
      
    }
}
