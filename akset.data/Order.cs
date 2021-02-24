using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Order
    {
        public int Id { get; set; }
        [Display(Name = "Kullanıcı")]
        [Required(ErrorMessage = "Kullanıcı Seçmediniz!")]
        public string UserId { get; set; }
        public DateTime Tarih { get; set; } = DateTime.Now;
        public virtual User Users { get; set; }
        //public virtual ICollection<Product> Products { get; set; }
    }
}