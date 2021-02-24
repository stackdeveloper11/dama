using akset.data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace akset.ViewModel
{
    public class CategoryViewModelItem
    {
        public Kategori Kategori { get; set; }

        public List<Kategori> Kategorileri { get; set; }
        public List<Kategori> altKategorileri { get; set; }


        public List<SelectListItem> Kategoriler { get; set; }
        public List<SelectListItem> altKategoriler { get; set; }

        public List<SelectListItem> tumkategoriler
        {
            get
            {
                List<SelectListItem> sli = new List<SelectListItem>();
                foreach (SelectListItem item in Kategoriler)
                {
                    sli.Add(item);
                }
                foreach (SelectListItem item in altKategoriler)
                {
                    int i = item.Text.IndexOf(">");
                    string text = item.Text.Substring(0, i - 1);
                    foreach (SelectListItem listItem in altKategoriler)
                    {
                        int k = listItem.Text.LastIndexOf(">");
                        string text2 = listItem.Text.Substring(k + 1);
                        if (text2 == (text))
                        {
                            item.Text = listItem.Text + " > " + item.Text.Substring(i + 2);
                        }
                    }
                    sli.Add(item);
                }
                return sli;
            }
        }
    }
}
