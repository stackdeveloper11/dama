using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Product
    {
        public int Id { get; set; }
        [Display(Name = "Cache")]
        public string Cache { get; set; } = new Random().Next(0,999999).ToString();
        public string Barkod { get; set; }
        [Display(Name = "Ürün Adı")]
        [Required(ErrorMessage = "Ürün Adı Yazmadınız!")]
        public string ProductName { get; set; }
        [Display(Name = "Ekleyen")]
        [Required(ErrorMessage = "Ekleyen Yazmadınız!")]
        public string Added_By { get; set; }
        [Display(Name = "Ekleme Tarihi")]
        public DateTime Created_At { get; set; } = DateTime.Now;
        [Display(Name = "Düzenleme Tarihi")]
        public DateTime Updated_At { get; set; } = DateTime.Now;
        [Display(Name = "Küçük resim")]
        [Required(ErrorMessage = "Resim Eklemediniz!")]
        public string Thumbnail_img { get; set; }
        public string Gallery { get; set; } = new Random().Next(100, 999999999).ToString();
        [Display(Name = "Açıklama")]
        [Required(ErrorMessage = "Açıklama Yazmadınız!")]
        public string Description { get; set; }
        [Display(Name = "Birim Fiyatı")]
        [Required(ErrorMessage = "Birim Fiyatı Yazmadınız!")]
        [Range(0, 9999999999999999.99, ErrorMessage = "Geçersiz Para Tutarı")]
        public decimal UnitPrice { get; set; }
        [Display(Name = "Adet")]
        [Required(ErrorMessage = "Adet Yazmadınız!")]
        public int Quantity { get; set; } = 0;
        [Display(Name = "Birim")]
        [Required(ErrorMessage = "Birim Yazmadınız!")]
        public string Unit { get; set; }
        [Display(Name = "Öne Çıkan")]
        [Required(ErrorMessage = "Öne Çıkan Belirtmediniz!")]
        public bool Featured { get; set; } = false;
        [Display(Name = "Geri Ödeme")]
        [Required(ErrorMessage = "Geri Ödeme Belirtmediniz!")]
        public bool Refundable { get; set; } = false;
        [Display(Name = "Puan")]
        [Required(ErrorMessage = "Puan Yazmadınız!")]
        public int Rating { get; set; } = 0;
        [Display(Name = "Eşsiz İsim (URL)")]
        [Required(ErrorMessage = "Eşsiz İsim Yazmadınız!")]
        public string Slug { get; set; }
        [Display(Name = "Meta Başlık")]
        public string MetaTitle { get; set; }
        [Display(Name = "Meta Açıklama")]
        public string MetaDescription { get; set; }
        [Display(Name = "Kargolama Tipi")]
        [Required(ErrorMessage = "Kargolama Tipi Yazmadınız!")]
        public string ShippingType { get; set; }
        [Display(Name = "Kargolama Masrafı")]
        [Required(ErrorMessage = "Kargolama Masrafı alanı gereklidir!")]
        public decimal ShippingCost { get; set; } = 0;
        [Display(Name = "İndirim")]
        public decimal Discount { get; set; } = 0;
        [Display(Name = "İndirim Tipi")]
        public string DiscountType { get; set; }
        [Display(Name = "Günün Ürünü")]
        public bool TodaysDeal { get; set; }
        [Display(Name = "Yayındamı")]
        public bool Published { get; set; } = false;
        [Display(Name = "Video Link")]
        public string VideoLink { get; set; }
        [Display(Name = "Video Tip")]
        public string VideoType { get; set; }
        [Display(Name = "Kullanıcı")]
        [Required(ErrorMessage = "Kullanıcı Seçmediniz!")]
        public string UserId { get; set; }
        [Display(Name = "Marka")]
        [Required(ErrorMessage = "Marka Seçmediniz!")]
        public int BrandId { get; set; }
        public int SoldCount { get; set; } = 0;
        public bool Delete { get; set; } = false;
        public string Photo1 { get; set; }
        public string Photo2 { get; set; }
        public string Photo3 { get; set; }
        public string Photo4 { get; set; }
        public string Photo5 { get; set; }
        public string Photo6 { get; set; }
        public virtual ICollection<Kategori> Kategoris { get; set; }
        public virtual ICollection<ProductStock> ProductStocks { get; set; }
        public virtual ICollection<ProductImage> ProductImages { get; set; }
        //public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual User User { get; set; }
        public virtual Brand Brand { get; set; }
    }
}
