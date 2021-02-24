﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class ProductVariant
    {
        public int Id { get; set; }
        [Display(Name = "Resim")]
        public string Photo { get; set; }
        [Display(Name = "Adet")]
        [Required(ErrorMessage = "Adet Yazmadınız!")]
        public int Quantity { get; set; }
        [Display(Name = "Barkod")]
        [Required(ErrorMessage = "Barkod Yazmadınız!")]
        public string Barkod { get; set; }
        [Display(Name = "Tutar")]
        [Required(ErrorMessage = "Tutar Yazmadınız!")]
        [Range(0, 9999999999999999.99, ErrorMessage = "Geçersiz Para Tutarı")]
        public decimal Amount { get; set; }
        [Display(Name = "Öznitelik")]
        [Required(ErrorMessage = "Öznitelik  Seçmediniz!")]
        public int AttributeId { get; set; }
        [Display(Name = "Öznitelik Değeri")]
        [Required(ErrorMessage = "Öznitelik Değeri Seçmediniz!")]
        //[Key, Column(Order = 1)]
        public int AttributeValueId { get; set; }
        [Display(Name = "Ürün")]
        [Required(ErrorMessage = "Ürün Seçmediniz!")]
        //[Key, Column(Order = 2)]
        public int ProductId { get; set; }
        public virtual AttributeValue AttributeValue { get; set; }
        public virtual Attribute Attribute { get; set; }
        public virtual Product Product { get; set; }
    }
}
