using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class Ayar
    {
        public int Id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string keywords { get; set; }
        public string analitics { get; set; }
        public string aramametalar { get; set; }
        public int KategoriSonLevel { get; set; } = 3;


    }
}
