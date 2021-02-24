using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using akset.data;
using akset.ViewModel;
using System.Collections;
using System.Data.Entity.Validation;
using System.IO;
using System.Drawing;
using Newtonsoft.Json;
using System.Drawing.Drawing2D;

namespace akset.Areas.Admin.Controllers
{
    public class CategoryViewModelItemi
    {
        public int Value { get; set; }
        public string Text { get; set; }
    }

    [Authorize(Roles = "Admin")]
    public class KategorisController : Controller
    {
        private aksetDB db = new aksetDB();
        public JsonResult katdegis(string jsonu, int? idsi, int? parenti)
        {
            string hata = "";
            Kategori kategori = db.Kategoris.Find(idsi);
            kategori.parentId = parenti;
            try
            {
                db.Entry(kategori).State = EntityState.Modified;
                db.SaveChanges();
            }
            catch (DbEntityValidationException dbEx)
            {
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        hata = string.Format("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                    }
                }
            }
            string[] ddd = jsonu.Split(',');

            foreach (var item in ddd)
            {
                string[] fff = item.Split('-');
                Kategori kategorig = db.Kategoris.Find(Convert.ToInt32(fff[0].ToString()));
                kategorig.sira = Convert.ToInt32(fff[1].ToString());
                try
                {
                    db.Entry(kategorig).State = EntityState.Modified;
                    db.SaveChanges();
                }
                catch (DbEntityValidationException dbEx)
                {
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            hata = string.Format("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                        }
                    }
                }

            }
            return Json(hata);
        }
        // GET: Admin/Kategoris
        public ActionResult kategori()
        {
            CategoryViewModelItem vmc = new CategoryViewModelItem
            {
                Kategorileri = db.Kategoris.Include(kk => kk.parent).Where(x => x.parentId == null).OrderBy(a => a.sira).ToList(),
                altKategorileri = db.Kategoris.Include(kk => kk.parent).Where(x => x.parentId != null).OrderBy(a => a.sira).ToList()
            };
            // var kategoris = db.Kategoris.Include(k => k.Parent);
            return View(vmc);
        }
        public List<Kategori> Parentler { get; set; }
        public void HieararchyWalk(Kategori hierarchy)
        {
            if (hierarchy.parentId != null)
            {
                Parentler.Add(hierarchy);
                HieararchyWalk(hierarchy.parent);
            }
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
        //[OutputCache(Duration =int.MaxValue)]
        public ActionResult Create()
        {
            List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();

            //get all of them from DB
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            //get parent categories
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();

            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                //add the parent category to the item list
                items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                //now get all its children (separate function in case you need recursion)
                GetSubTree(allCategories, cat, items, cat.Id);
            }


            ViewBag.parentId = new SelectList(items, "Value", "Text");
            return View();


        }

        // POST: Admin/Kategoris/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,parentId,adi,baslik,aciklama,sira,icerik,faikon,resim,durumu,link,etiketler")] Kategori kategori, HttpPostedFileBase resimi)
        {
            if (ModelState.IsValid)
            {
                if (db.Kategoris.Where(a=>a.baslik.ToLower()==kategori.baslik.ToLower()).FirstOrDefault()!=null)
                {
                    List<CategoryViewModelItemi> items1 = new List<CategoryViewModelItemi>();
                    List<Kategori> allCategories1 = db.Kategoris.OrderBy(a => a.sira).ToList();
                    List<Kategori> parentCategories1 = allCategories1.Where(c => c.parentId == null).ToList();
                    foreach (var cat in parentCategories1.OrderBy(a => a.sira))
                    {
                        items1.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                        GetSubTree(allCategories1, cat, items1, cat.Id);
                    }
                    ViewBag.parentId = new SelectList(items1, "Value", "Text", kategori.parentId);
                    ModelState.AddModelError("","Bu Kategori Adı Mevcuttur!");
                    return View(kategori);
                }
                if (resimi != null && resimi.ContentLength > 0)
                {
                    string sonu = Path.GetExtension(resimi.FileName);
                    string filename = kategori.resim;
                    kategori.resim = filename + sonu;
                    kategori.sira = db.Kategoris.Count() + 1;
                    var path = Path.Combine(Server.MapPath("~/KategoriResimleri"), filename + sonu);
                    resimi.SaveAs(path);
                }
                if (!string.IsNullOrEmpty(kategori.link))
                {
                    kategori.link = (kategori.link);
                }
              
                db.Kategoris.Add(kategori);
                db.SaveChanges();
                return RedirectToAction("kategori");
            }

            List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }
            ViewBag.parentId = new SelectList(items, "Value", "Text",kategori.parentId);
            return View(kategori);
        }
      
        // GET: Admin/Kategoris/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Kategori kategori = db.Kategoris.Find(id);
            if (kategori == null)
            {
                return HttpNotFound();
            }
            List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();
            //get all of them from DB
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            //get parent categories
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                //add the parent category to the item list
                items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                //now get all its children (separate function in case you need recursion)
                GetSubTree(allCategories, cat, items, cat.Id);
            }
            ViewBag.parentId = new SelectList(items, "Value", "Text",kategori.parentId);
            return View(kategori);
        }

        // POST: Admin/Kategoris/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,parentId,adi,baslik,aciklama,sira,icerik,faikon,resim,durumu,link,etiketler")] Kategori kategori, HttpPostedFileBase resimi)
        {
            if (ModelState.IsValid)
            {
                if (db.Kategoris.Where(a => a.baslik .ToLower()== kategori.baslik.ToLower() && a.Id != kategori.Id).FirstOrDefault() != null)
                {
                    List<CategoryViewModelItemi> items1 = new List<CategoryViewModelItemi>();
                    List<Kategori> allCategories1 = db.Kategoris.OrderBy(a => a.sira).ToList();
                    List<Kategori> parentCategories1 = allCategories1.Where(c => c.parentId == null).ToList();
                    foreach (var cat in parentCategories1.OrderBy(a => a.sira))
                    {
                        items1.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                        GetSubTree(allCategories1, cat, items1, cat.Id);
                    }
                    ViewBag.parentId = new SelectList(items1, "Value", "Text", kategori.parentId);
                    ModelState.AddModelError("", "Bu Kategori Adı Mevcuttur!");
                    return View(kategori);
                }
                if (resimi != null && resimi.ContentLength > 0)
                {
                    System.IO.File.Delete(Server.MapPath("~/"+kategori.resim));
                    string res = new Random().Next(1, 99999) + "-" + new Random().Next(1, 99999);
                    string sonu = Path.GetExtension(resimi.FileName);
                    string filename =res;
                    kategori.resim = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/KategoriResimleri"), filename + sonu);
                    resimi.SaveAs(path);
                }
                if (!string.IsNullOrEmpty(kategori.link))
                {
                    kategori.link = kategori.link;
                }
                db.Entry(kategori).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("kategori");
            }
            List<CategoryViewModelItemi> items = new List<CategoryViewModelItemi>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemi { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }
            ViewBag.parentId = new SelectList(items, "Value", "Text",kategori.parentId);
            return View(kategori);
        }

        // GET: Admin/Kategoris/Delete/5
        //public ActionResult Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    Kategori kategori = db.Kategoris.Find(id);
        //    if (kategori == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(kategori);
        //}

        public ActionResult Delete(int id)
        {
            Kategori kategori = db.Kategoris.Find(id);
            foreach (var item in db.katefilos.Where(a=>a.KategoriId==kategori.Id))
            {
                db.katefilos.Remove(item);
            }
            db.SaveChanges();
            db.Kategoris.Remove(kategori);
            db.SaveChanges();
            return RedirectToAction("kategori");
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