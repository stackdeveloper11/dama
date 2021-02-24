using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.ViewModel
{
    public class urunlefiltre
    {
        public string filitre { get; set; }
        public virtual List<urunozellik> urunozelliks { get; set; }
    }
}
