using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class altmenu
    {
        public int Id { get; set; }
        public int menuId { get; set; }
        public string adi { get; set; }
        public string linki { get; set; }
        public int sira { get; set; }
        public string yeri { get; set; }
        public virtual menu menu { get; set; }
    }
}
