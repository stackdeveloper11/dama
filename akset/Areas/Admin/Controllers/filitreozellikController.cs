using akset.data;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace akset.Areas.Admin.Controllers
{
    public class filitreozellikController : Controller
    {
        data.aksetDB db = new data.aksetDB();
        public ActionResult filto()
        {
            //List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();
            //List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            //List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            //foreach (var cat in parentCategories.OrderBy(a => a.sira))
            //{
            //    items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
            //    GetSubTree(allCategories, cat, items, cat.Id);
            //}

            //ViewBag.KategoriId = new SelectList(items, "Value", "Text");
            //ViewBag.datasi = items;
            //ViewBag.KategoriIdsi = new SelectList(items, "Value", "Text");
            return View(db.filitres.Include(a=>a.ozelliks).ToList());
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
        public ActionResult filto(string filitre, string nere, int? Id,bool multi,bool adetlimi)
        {
            if (nere == "ekle")
            {
                if (String.IsNullOrEmpty(filitre))
                {
                    ModelState.AddModelError("", "Filitre Adı Boş geçilemez!");
                }
                else if (db.filitres.Where(a => a.adi.ToLower() == filitre.ToLower()).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "Filitre Adı Mevcut!");
                }
                else
                {
                    filitre dd = new filitre();
                    dd.adi = filitre;
                    dd.adetlimi = adetlimi;
                   // dd.KategoriId = KategoriId;
                    dd.multi = multi;
                    db.filitres.Add(dd);
                    db.SaveChanges();
                }
            }
            if (nere == "duzenle")
            {
                if (String.IsNullOrEmpty(filitre))
                {
                    ModelState.AddModelError("", "Filitre Adı Boş geçilemez!");

                }
                else if (db.filitres.Where(a => a.adi.ToLower() == filitre.ToLower() && a.Id!=Id).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "Filitre Adı Mevcut!");
                }
                else
                {
                    var dd = db.filitres.Where(a => a.Id == Id).FirstOrDefault();
                    dd.adi = filitre;
                    dd.adetlimi = adetlimi;
              //      dd.KategoriId = KategoriId;
                    dd.multi = multi;
                    db.Entry(dd).State = EntityState.Modified;
                    db.SaveChanges();
                }

            }
            //List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();
            //List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            //List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            //foreach (var cat in parentCategories.OrderBy(a => a.sira))
            //{
            //    items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
            //    GetSubTree(allCategories, cat, items, cat.Id);
            //}

            //   ViewBag.KategoriId = new SelectList(items, "Value", "Text");
            //   ViewBag.datasi = items;
            return RedirectToAction("filto");
           // return View(db.filitres.Include(a=>a.ozelliks).ToList());
        }

      
        public ActionResult Delete(int id)
        {
            data.filitre ozellik = db.filitres.Find(id);
            foreach (var item in db.katefilos.Where(a=>a.filitreId==ozellik.Id).ToList())
            {
                db.katefilos.Remove(item);
                db.SaveChanges();
            }
            db.filitres.Remove(ozellik);
            db.SaveChanges();
            return RedirectToAction("filto");
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