using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class filitre
    {
        public int Id { get; set; }
        public string adi { get; set; }
        public bool multi { get; set; }
        public bool adetlimi { get; set; }
        public virtual List<ozellik> ozelliks { get; set; }
    }
}