using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace akset.ViewModel
{
    public class AutoCompCate
    {
        public string Id { get; set; }
        public ICollection<AutoComplateViewModel> AutoComplateViewModels { get; set; }
    }
}