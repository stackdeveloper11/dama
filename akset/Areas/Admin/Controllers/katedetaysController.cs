using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using akset.data;

namespace akset.Areas.Admin.Controllers
{
    public class katedetaysController : Controller
    {
        private aksetDB db = new aksetDB();

        private void GetSubTree(IList<Kategori> allCats, Kategori parent, IList<CategoryViewModelItemis> items, int prt)
        {
            var subCats = allCats.Where(c => c.parentId == prt);
            foreach (var cat in subCats)
            {
                //add this category
                items.Add(new CategoryViewModelItemis { Value = cat.Id, Text = string.Concat(parent.parent != null ? parent.parent.adi + " >> " : "") + parent.adi + " >> " + cat.adi });
                //recursive call in case your have a hierarchy more than 1 level deep
                GetSubTree(allCats, cat, items, cat.Id);
            }
        }
        public ActionResult Index()
        {
            List<CategoryViewModelItemis> items = new List<CategoryViewModelItemis>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemis { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }

            ViewBag.datasix = new SelectList(items, "Value", "Text");
            ViewBag.datasi = items;
            ViewBag.filitresi = new SelectList(db.detays.ToList(), "Id", "adi");

            var katefilos = db.katedetays.Include(k => k.detay).Include(k => k.Kategori);
            return View(katefilos.ToList().OrderByDescending(a => a.Id));
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(int datasix, int filitresi, string nere, int? Id, string submit)
        {
            if (nere == "ekle")
            {

                if (submit == "Ekle")
                {
                    if (db.katedetays.Where(a => a.KategoriId == datasix && a.detayId == filitresi).FirstOrDefault() != null)
                    {
                        ModelState.AddModelError("", "Aynı Kayıt Mecvut!");
                        List<CategoryViewModelItemis> items = new List<CategoryViewModelItemis>();
                        List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
                        List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
                        foreach (var cat in parentCategories.OrderBy(a => a.sira))
                        {
                            items.Add(new CategoryViewModelItemis { Value = cat.Id, Text = cat.adi });
                            GetSubTree(allCategories, cat, items, cat.Id);
                        }

                        ViewBag.datasix = new SelectList(items, "Value", "Text");
                        ViewBag.datasi = items;
                        ViewBag.filitresi = new SelectList(db.detays.ToList(), "Id", "adi");

                        var katefilos = db.katedetays.Include(k => k.detay).Include(k => k.Kategori);
                        return View(katefilos.ToList());
                    }
                    else
                    {
                        katedetay ft = new katedetay();
                        ft.detayId = filitresi;
                        ft.KategoriId = datasix;
                        db.katedetays.Add(ft);
                        db.SaveChanges();
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    foreach (var item in db.Kategoris.Where(a => a.parentId == datasix).ToList())
                    {
                        if (db.katedetays.Where(a => a.KategoriId == item.Id && a.detayId == filitresi).FirstOrDefault() == null)
                        {
                            katedetay ft = new katedetay();
                            ft.detayId = filitresi;
                            ft.KategoriId = item.Id;
                            db.katedetays.Add(ft);
                            db.SaveChanges();
                            foreach (var itemi in db.Kategoris.Where(a => a.parentId == item.Id).ToList())
                            {
                                if (db.katedetays.Where(a => a.KategoriId == item.Id && a.detayId == filitresi).FirstOrDefault() == null)
                                {
                                    katedetay fti = new katedetay();
                                    fti.detayId = filitresi;
                                    fti.KategoriId = itemi.Id;
                                    db.katedetays.Add(fti);
                                    db.SaveChanges();
                                    foreach (var itemii in db.Kategoris.Where(a => a.parentId == itemi.Id).ToList())
                                    {
                                        if (db.katedetays.Where(a => a.KategoriId == itemii.Id && a.detayId == filitresi).FirstOrDefault() == null)
                                        {
                                            katedetay ftii = new katedetay();
                                            ftii.detayId = filitresi;
                                            ftii.KategoriId = itemii.Id;
                                            db.katedetays.Add(ftii);
                                            db.SaveChanges();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return RedirectToAction("Index");
                }
            }
            if (nere == "duzenle")
            {


                if (db.katedetays.Where(a => a.KategoriId == datasix && a.detayId == filitresi && a.Id != Id).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "Aynı Kayıt Mecvut!");
                    List<CategoryViewModelItemis> items = new List<CategoryViewModelItemis>();
                    List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
                    List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
                    foreach (var cat in parentCategories.OrderBy(a => a.sira))
                    {
                        items.Add(new CategoryViewModelItemis { Value = cat.Id, Text = cat.adi });
                        GetSubTree(allCategories, cat, items, cat.Id);
                    }

                    ViewBag.datasix = new SelectList(items, "Value", "Text");
                    ViewBag.datasi = items;
                    ViewBag.filitresi = new SelectList(db.detays.ToList(), "Id", "adi");

                    var katefilos = db.katedetays.Include(k => k.detay).Include(k => k.Kategori);
                    return View(katefilos.ToList());
                }
                else
                {
                    katedetay ft = db.katedetays.Find(Id);
                    ft.detayId = filitresi;
                    ft.KategoriId = datasix;
                    db.Entry(ft).State = EntityState.Modified;
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }
            return RedirectToAction("Index");
        }



        // GET: Admin/katedetays
        //public ActionResult Index()
        //{
        //    var katedetays = db.katedetays.Include(k => k.detay).Include(k => k.Kategori);
        //    return View(katedetays.ToList());
        //}

        // GET: Admin/katedetays/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            katedetay katedetay = db.katedetays.Find(id);
            if (katedetay == null)
            {
                return HttpNotFound();
            }
            return View(katedetay);
        }

        // GET: Admin/katedetays/Create
        public ActionResult Create()
        {
            ViewBag.detayId = new SelectList(db.detays, "Id", "adi");
            List<CategoryViewModelItemis> items = new List<CategoryViewModelItemis>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemis { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }
            ViewBag.KategoriId = new SelectList(items, "Value", "Text");
            return View();
        }

        // POST: Admin/katedetays/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,KategoriId,detayId")] katedetay katedetay)
        {
            if (ModelState.IsValid)
            {
                db.katedetays.Add(katedetay);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.detayId = new SelectList(db.detays, "Id", "adi", katedetay.detayId);
            List<CategoryViewModelItemis> items = new List<CategoryViewModelItemis>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemis { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }
            ViewBag.KategoriId = new SelectList(items, "Value", "Text",katedetay.KategoriId);
            return View(katedetay);
        }

        // GET: Admin/katedetays/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            katedetay katedetay = db.katedetays.Find(id);
            if (katedetay == null)
            {
                return HttpNotFound();
            }
            ViewBag.detayId = new SelectList(db.detays, "Id", "adi", katedetay.detayId);
            ViewBag.KategoriId = new SelectList(db.Kategoris, "Id", "adi", katedetay.KategoriId);
            return View(katedetay);
        }

        // POST: Admin/katedetays/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,KategoriId,detayId")] katedetay katedetay)
        {
            if (ModelState.IsValid)
            {
                db.Entry(katedetay).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.detayId = new SelectList(db.detays, "Id", "adi", katedetay.detayId);
            ViewBag.KategoriId = new SelectList(db.Kategoris, "Id", "adi", katedetay.KategoriId);
            return View(katedetay);
        }
      

        // GET: Admin/katedetays/Delete/5

        // POST: Admin/katedetays/Delete/5
      
        public ActionResult Delete(int id)
        {
            katedetay katedetay = db.katedetays.Find(id);
            db.katedetays.Remove(katedetay);
            db.SaveChanges();
            return RedirectToAction("Index");
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
