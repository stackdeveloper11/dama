using System;
using System.ComponentModel.DataAnnotations;
namespace akset.data
{
    public class Vitrinler
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Set Title!")]
        public string baslik { get; set; }
      
        [Required(ErrorMessage = "Set Url Address!")]
        public string adres { get; set; }
        public string buyukresim { get; set; }
        public string kucukresim { get; set; }
        public string vitrinmi { get; set; }
        public string sayac { get; set; }

        [Required(ErrorMessage = "Set Order!")]
        public int sira { get; set; }

        [Required(ErrorMessage = "Set Order!")]
        public string aktifmi { get; set; }
        public DateTime kapanis { get; set; }
        public string kampany { get; set; }
        public virtual Kategori Kategori { get; set; }
        public virtual urun urun { get; set; }
    }
}