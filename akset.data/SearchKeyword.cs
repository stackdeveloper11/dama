using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class SearchKeyword
    {
        public int Id { get; set; }
        public string Keyword { get; set; }
        public DateTime Tarih { get; set; } = DateTime.Now;
    }
}
