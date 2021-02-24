using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Makale
    {
        public int Id { get; set; }
        public int? KategoriId { get; set; }
        [Display(Name = "Başlık")]
        [Required(ErrorMessage = "Başlık yazmadınız!")]
        [StringLength(150)]
        [MinLength(8,ErrorMessage ="Başlık minimum 8 karakter uzunluğunda olmalıdır.")]
        [Index(IsClustered = false)]
        public string baslik { get; set; }
        [Required(ErrorMessage = "Açıklama yazmadınız!")]
        public string aciklama { get; set; }
        public string url { get; set; }

        [Required(ErrorMessage = "İçerik yazmadınız!")]
        [Display(Name = "İçerik")]
        [DataType(DataType.MultilineText)]
        //[AllowHtml]
        public string Icerik { get; set; }
        [Display(Name = "Tarih")]
        [Index(IsClustered = false)]
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy, HH.mm.ss}", ApplyFormatInEditMode = true)]
        [Required(ErrorMessage = "Tarih belirtmelisiniz")]
        public DateTime tarih { get; set; }

        [Display(Name = "Okunma")]
        [Index(IsClustered = false)]
        public int goruntuleme { get; set; }
        [Display(Name = "Aktif")]
        [Index(IsClustered = false)]
        public bool aktif { get; set; }
        [Display(Name = "Makale Kapak Resmi")]
        public string resimi { get; set; }
        [Display(Name = "Meta Keywords")]
        public string keywords { get; set; }


        public virtual Kategori Kategori { get; set; }
        public virtual ICollection<Etiket> Etikets { get; set; }

    }
}
