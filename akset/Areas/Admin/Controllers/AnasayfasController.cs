using akset.data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace akset.Areas.Admin.Controllers
{
    public class AnasayfasController : Controller
    {
        aksetDB db = new aksetDB();
        public ActionResult Edit(int Id)
        {
            var bul = db.Vitrinlers.Where(a => a.Id == Id).FirstOrDefault();
            List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }
            return View(bul);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,baslik,buyukresim,kucukresim,vitrinmi,sira,aktifmi,kapanis,kampany,adres")] Vitrinler vitrinler, HttpPostedFileBase buyukresimi, HttpPostedFileBase kucukresimi)
        {
            if (ModelState.IsValid)
            {
                if (buyukresimi != null && buyukresimi.ContentLength > 0)
                {
                    string resadi = new Random().Next(100, 1000) + "-" + new Random().Next(1, 1000);
                    string sonu = Path.GetExtension(buyukresimi.FileName);
                    string filename = resadi;
                    vitrinler.buyukresim = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/VitrinResimleri/"), filename + sonu);
                    try
                    {
                        System.IO.File.Delete(Server.MapPath("~/VitrinResimleri/") + vitrinler.buyukresim);
                    }
                    catch (Exception)
                    {
                    }
                    buyukresimi.SaveAs(path);
                }

                if (kucukresimi != null && kucukresimi.ContentLength > 0)
                {
                    string resadi = new Random().Next(1100, 99999) + "-" + new Random().Next(1000, 99999);
                    string sonu = Path.GetExtension(kucukresimi.FileName);
                    string filename = resadi;
                    vitrinler.kucukresim = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/VitrinResimleri/"), filename + sonu);
                    try
                    {
                        System.IO.File.Delete(Server.MapPath("~/VitrinResimleri/") + vitrinler.kucukresim);
                    }
                    catch (Exception)
                    {
                    }
                    kucukresimi.SaveAs(path);
                }

                db.Entry(vitrinler).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("anasayfa");

            }
            List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }
            return View(vitrinler);
        }

        public ActionResult Create()
        {
            List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }
            return View();
        }
        public ActionResult Delete(int Id)
        {
            var bul = db.Vitrinlers.Where(a => a.Id == Id).FirstOrDefault();
            try
            {
                System.IO.File.Delete(Server.MapPath("~/VitrinResimleri/") + bul.buyukresim);
            }
            catch (Exception)
            {

            }

            try
            {
                System.IO.File.Delete(Server.MapPath("~/VitrinResimleri/") + bul.kucukresim);
            }
            catch (Exception)
            {

            }

            db.Vitrinlers.Remove(bul);
            db.SaveChanges();
            return RedirectToAction("Anasayfa");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,baslik,buyukresim,kucukresim,vitrinmi,sira,aktifmi,kapanis,kampany,adres")] Vitrinler vitrinler, HttpPostedFileBase buyukresim, HttpPostedFileBase kucukresim)
        {
            if (ModelState.IsValid)
            {
                if (buyukresim != null && buyukresim.ContentLength > 0)
                {
                    string resadi = new Random().Next(100, 1000) + "-" + new Random().Next(1, 1000);
                    string sonu = Path.GetExtension(buyukresim.FileName);
                    string filename = resadi;
                    vitrinler.buyukresim = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/VitrinResimleri"), filename + sonu);
                    buyukresim.SaveAs(path);
                }
                if (kucukresim != null && kucukresim.ContentLength > 0)
                {
                    string resadi = new Random().Next(1100, 99999) + "-" + new Random().Next(1000, 99999);
                    string sonu = Path.GetExtension(kucukresim.FileName);
                    string filename = resadi;
                    vitrinler.kucukresim = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/VitrinResimleri"), filename + sonu);
                    kucukresim.SaveAs(path);
                }
                db.Vitrinlers.Add(vitrinler);
                db.SaveChanges();
                return RedirectToAction("Anasayfa");
            }
            List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }
            return View();
        }
        // GET: Admin/Anasayfas
        public ActionResult Anasayfa()
        {
            List<Kategori> ktg = new List<Kategori>();
            foreach (var item in db.Kategoris.Where(a => a.parentId != null))
            {
                if (db.Kategoris.Where(a => a.parentId == item.Id).FirstOrDefault() == null)
                {
                    Kategori ktgk = new Kategori();
                    ktgk = item;
                    ktg.Add(ktgk);
                }
            }

            return View(db.Vitrinlers.ToList());
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
    }
}