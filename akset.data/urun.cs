using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class urun
    {
        public int Id { get; set; }
        public int KategoriId { get; set; }
        public string eskifiyat { get; set; }
        public string satistami { get; set; }
        public string adminaciklama { get; set; }
        public int? adet { get; set; }
        public string alisfiyati { get; set; }
        [Required(ErrorMessage = "Ürün Kodu yazmadınız!")]
        public string UrunKodu { get; set; }

        [DisplayName("Ürün Başlık")]
        [Required(ErrorMessage = "Başlık yazmadınız!")]
        public string urunbaslik { get; set; }
        [DisplayName("Ürün Adı")]
        [Required(ErrorMessage = "Ürün Adı yazmadınız!")]
        public string urunadi { get; set; }
        [DisplayName("Ürün Kısa Açıklama")]
        [Required(ErrorMessage = "Ürün Kısa Açıklama yazmadınız!")]
        public string urunkisaaciklama { get; set; }
        [DisplayName("Ürün Fiyatı")]
        [Required(ErrorMessage = "Ürün Fiyatı yazmadınız!")]

        public string fiyat { get; set; }
        [DisplayName("Ürün Özellikleri")]
        public string urunozellikleri { get; set; }
        [DisplayName("Ürün Detayı")]
        public string urundetayi { get; set; }
        [DisplayName("Ürün Durumu")]
        public string urundurumu { get; set; }

        public DateTime tarih { get; set; }
        public string resim { get; set; }
        public string oneri { get; set; }
        public string anasayfa { get; set; }
        public string link { get; set; }
        public string etiketler { get; set; }
        public int sira { get; set; }
        public virtual Kategori Kategori { get; set; }
        public virtual List<yorum> yorums { get; set; }
        
        public virtual List<favori> favoris { get; set; }
        public virtual List<urunfilitreozellik> urunfilitreozelliks { get; set; }
        public virtual List<Vitrinler> Vitrinlers { get; set; }
        public virtual List<urundetayalt> urundetayalts { get; set; }

    }
}
