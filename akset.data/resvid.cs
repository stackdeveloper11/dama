using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class resvid
    {
        public int id { get; set; }
        public string nere { get; set; }
        public string ne { get; set; }
        [MaxLength]
        public string data { get; set; }
    }
}
