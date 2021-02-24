using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace akset.ViewModel
{
    public class AttrListesi
    {
        public int Id { get; set; }
        public string Attrs { get; set; }
        public bool Insertable { get; set; }
        public string stringValues { get; set; }
        public List<IdValue> Values { get; set; }
    }
}