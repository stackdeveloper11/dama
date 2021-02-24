using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Slider
    {
        public int Id { get; set; }
        [DisplayName("Adres")]
        public string adresi { get; set; }
        [DisplayName("Sıra No")]
        public int sirasi { get; set; }
        public bool aktif { get; set; }
        [Required(ErrorMessage ="Başlık Yazmadınız")]
        [DisplayName("Başlık")]
        public string baslik { get; set; }
        [DisplayName("Açıklama")]
        public string aciklama { get; set; }
        public string cacheno { get; set; }
    }
}
