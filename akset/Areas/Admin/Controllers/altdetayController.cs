using akset.data;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace akset.Areas.Admin.Controllers
{
    public class altdetayController : Controller
    {
        data.aksetDB db = new data.aksetDB();
        // GET: Admin/altdetay
        public ActionResult alto()
        {
            return View(db.detays.Include(a => a.alts).ToList());
        }
        private void GetSubTree(IList<Kategori> allCats, Kategori parent, IList<CategoryViewModelItemi> items, int prt)
        {
            var subCats = allCats.Where(c => c.parentId == prt);
            foreach (var cat in subCats)
            {
                //add this category
                items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = string.Concat(parent.parent != null ? parent.parent.adi + " >> " : "") + parent.adi + " >> " + cat.adi });
                //recursive call in case your have a hierarchy more than 1 level deep
                GetSubTree(allCats, cat, items, cat.Id);
            }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult alto(string detay, string nere, int? Id, bool multi)
        {
            if (nere == "ekle")
            {
                if (String.IsNullOrEmpty(detay))
                {
                    ModelState.AddModelError("", "Detay Adı Boş geçilemez!");
                }
                else if (db.detays.Where(a => a.adi.ToLower() == detay.ToLower()).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "Detay Adı Mevcut!");
                }
                else
                {
                    detay dd = new detay();
                    dd.adi = detay;
                    dd.multi = multi;
                    db.detays.Add(dd);
                    db.SaveChanges();
                }
            }
            if (nere == "duzenle")
            {
                if (String.IsNullOrEmpty(detay))
                {
                    ModelState.AddModelError("", "Detay Adı Boş geçilemez!");

                }
                else if (db.detays.Where(a => a.adi.ToLower() == detay.ToLower() && a.Id != Id).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "Detay Adı Mevcut!");
                }
                else
                {
                    var dd = db.detays.Where(a => a.Id == Id).FirstOrDefault();
                    dd.adi = detay;
                    dd.multi = multi;
                    db.Entry(dd).State = EntityState.Modified;
                    db.SaveChanges();
                }

            }
            return RedirectToAction("alto");
        }


        public ActionResult Delete(int id)
        {
            data.detay detay = db.detays.Find(id);
            db.detays.Remove(detay);
            db.SaveChanges();
            return RedirectToAction("alto");
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}