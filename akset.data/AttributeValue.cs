using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class AttributeValue
    {
        public int Id { get; set; }
        [Display(Name = "Öznitelik Değeri")]
        [Required(ErrorMessage = "Öznitelik Değeri Yazmadınız!")]
        public string Value { get; set; }
        [Display(Name = "Öznitelik")]
        [Required(ErrorMessage = "Öznitelik Yazmadınız!")]
        public int AttributeId { get; set; }
        public virtual Attribute Attribute { get; set; }
    }
}
