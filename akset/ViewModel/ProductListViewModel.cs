using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace akset.ViewModel
{
    public class ProductListViewModel
    {
        public int Id { get; set; }
        public string ThumbnailImage { get; set; } 
        public string Name { get; set; }
        public string Added_By { get; set; }
        public int SoldCount { get; set; }
        public int TotalStock { get; set; }
        public decimal BaseAmount { get; set; }
        public bool TodayDeal { get; set; }
        public int Reviews { get; set; }
        public bool Publised { get; set; }
        public bool Featured { get; set; }
        public DateTime Date { get; set; }

    }
}