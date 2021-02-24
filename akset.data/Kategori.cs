using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Kategori
    {
        public int Id { get; set; }
        public int? parentId { get; set; }
        [Required(ErrorMessage = "Durum Belirtiniz!")]
        [StringLength(100)]
        [Index(IsClustered = false)]
        public string durumu { get; set; }
       
        [StringLength(100)]
        [Index(IsClustered = false)]
        public string faikon { get; set; }
        [StringLength(255)]
        [Index(IsClustered = false)]
        [Required(ErrorMessage = "Kategori Resmi Belirtiniz!")]
        public string resim { get; set; }
        [Required(ErrorMessage = "Kategori İsmi Yazınız!")]
        [StringLength(100)]
        [Index(IsClustered = false)]
        public string adi { get; set; }
        [Required(ErrorMessage = "Kategori İsmi Yazınız!")]
        [StringLength(100)]
        [Index(IsClustered = false)]
        public string baslik { get; set; }

 


        public string etiketler { get; set; }

        [Required(ErrorMessage = "Kategori Açıklaması Yazınız!")]
        [StringLength(450)]
        [Index(IsClustered = false)]
        [DataType(DataType.MultilineText)]
        public string aciklama { get; set; }
        [Required(ErrorMessage = "Kategori Sırası Yazınız!")]
        public int sira { get; set; }
        public string link { get; set; }
        public string slug { get; set; }
        [Required(ErrorMessage = "Kategori İçeriği Yazınız!")]
        [StringLength(450)]
        [DataType(DataType.MultilineText)]
        [Index(IsClustered = false)]
        public string icerik { get; set; }
        [ForeignKey("parentId")]
        public virtual Kategori parent { get; set; }
        [ForeignKey("parentId")]
        public virtual List<Kategori> parents { get; set; }
        public virtual ICollection<Product> Products { get; set; }
        //public virtual ICollection<Attribute> Attributes { get; set; }

    }
}