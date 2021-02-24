using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Sayfa
    {
        public int Id { get; set; }
        [Display(Name = "Adı")]
        [Required(ErrorMessage = "Ad yazmadınız!")]
        [StringLength(50)]
        [Index(IsClustered = false)]
        public string Adi { get; set; }

        [Display(Name = "Başlığı")]
        [Required(ErrorMessage = "Başlık yazmadınız!")]
        [StringLength(150)]
        [Index(IsClustered = false)]
        public string Baslik { get; set; }


        [Display(Name = "Açıklama")]
        [Required(ErrorMessage = "Açıklama yazmadınız!")]
        [StringLength(450)]
        [Index(IsClustered = false)]
        [DataType(DataType.MultilineText)]
        public string Aciklama { get; set; }

        [Display(Name = "İçerik")]
         [Required(ErrorMessage = "İçerik yazmadınız!")]
        [DataType(DataType.MultilineText)]
     //   [AllowHtml]
        public string Icerik { get; set; }

        [Display(Name = "Durum")]
        [Index(IsClustered = false)]
        public bool Durum { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime tarih { get; set; }
    
  
    }
}
