using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class ozellik
    {
        public int Id { get; set; }
        public int filitreId { get; set; }
        public string adi { get; set; }
        public virtual filitre filitre { get; set; }
    }
}
