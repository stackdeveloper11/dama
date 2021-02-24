using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Review
    {
        public int Id { get; set; }
        [Display(Name = "Yorum")]
        [Required(ErrorMessage = "Yorum Yazmadınız!")]
        public string Commment { get; set; }
        [Display(Name = "Ürün")]
        [Required(ErrorMessage = "Ürün Seçmediniz!")]
        public int ProductId { get; set; }
        [Display(Name = "Tarih")]
        [Required(ErrorMessage = "Tarih Belirtmediniz!")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        [Display(Name = "Onay")]
        [Required(ErrorMessage = "Onay Vermelisiniz!")]
        public bool Approved { get; set; } = false;
        public virtual Product Product { get; set; }
        [Display(Name = "Kullanıcı")]
        [Required(ErrorMessage = "Kullanıcı Seçmediniz!")]
        public string UserId { get; set; }
        public virtual User User { get; set; }

    }
}
