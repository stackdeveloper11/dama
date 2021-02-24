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
    public class CategoryViewModelItemis
    {
        public int Value { get; set; }
        public string Text { get; set; }
    }
    public class katefiloesController : Controller
    {
        private aksetDB db = new aksetDB();
        public ActionResult Delete(int Id)
        {
            katefilo ft = db.katefilos.Find(Id);
            db.katefilos.Remove(ft);
            db.SaveChanges();
            return RedirectToAction("Index");
        }
        // GET: Admin/katefiloes
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

            ViewBag.datasix = new SelectList(items, "Value", "Text",items.FirstOrDefault().Value);
            ViewBag.datasi = items;
            ViewBag.filitresi = new SelectList(db.filitres.ToList(), "Id", "adi");

            var katefilos = db.katefilos.Include(k => k.filitre).Include(k => k.Kategori);
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
                    if (db.katefilos.Where(a => a.KategoriId == datasix && a.filitreId == filitresi).FirstOrDefault() != null)
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
                        ViewBag.filitresi = new SelectList(db.filitres.ToList(), "Id", "adi");

                        var katefilos = db.katefilos.Include(k => k.filitre).Include(k => k.Kategori);
                        return View(katefilos.ToList());
                    }
                    else
                    {
                        katefilo ft = new katefilo();
                        ft.filitreId = filitresi;
                        ft.KategoriId = datasix;
                        db.katefilos.Add(ft);
                        db.SaveChanges();
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    foreach (var item in db.Kategoris.Where(a => a.parentId == datasix).ToList())
                    {
                        if (db.katefilos.Where(a => a.KategoriId == item.Id && a.filitreId == filitresi).FirstOrDefault() == null)
                        {
                            katefilo ftv = new katefilo();
                            ftv.filitreId = filitresi;
                            ftv.KategoriId = item.Id;
                            db.katefilos.Add(ftv);
                            db.SaveChanges();
                            foreach (var itemx in db.Kategoris.Where(a => a.parentId == item.Id).ToList())
                            {
                                if (db.katefilos.Where(a => a.KategoriId == itemx.Id && a.filitreId == filitresi).FirstOrDefault() == null)
                                {
                                    katefilo ft = new katefilo();
                                    ft.filitreId = filitresi;
                                    ft.KategoriId = itemx.Id;
                                    db.katefilos.Add(ft);
                                    db.SaveChanges();
                                    foreach (var itemi in db.Kategoris.Where(a => a.parentId == itemx.Id).ToList())
                                    {
                                        if (db.katefilos.Where(a => a.KategoriId == itemx.Id && a.filitreId == filitresi).FirstOrDefault() == null)
                                        {
                                            katefilo fti = new katefilo();
                                            fti.filitreId = filitresi;
                                            fti.KategoriId = itemi.Id;
                                            db.katefilos.Add(fti);
                                            db.SaveChanges();
                                            foreach (var itemii in db.Kategoris.Where(a => a.parentId == itemi.Id).ToList())
                                            {
                                                if (db.katefilos.Where(a => a.KategoriId == itemii.Id && a.filitreId == filitresi).FirstOrDefault() == null)
                                                {
                                                    katefilo ftii = new katefilo();
                                                    ftii.filitreId = filitresi;
                                                    ftii.KategoriId = itemii.Id;
                                                    db.katefilos.Add(ftii);
                                                    db.SaveChanges();
                                                }
                                            }
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
                if (db.katefilos.Where(a => a.KategoriId == datasix && a.filitreId == filitresi && a.Id != Id).FirstOrDefault() != null)
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
                    ViewBag.filitresi = new SelectList(db.filitres.ToList(), "Id", "adi");

                    var katefilos = db.katefilos.Include(k => k.filitre).Include(k => k.Kategori);
                    return View(katefilos.ToList());
                }
                else
                {
                    katefilo ft = db.katefilos.Find(Id);
                    ft.filitreId = filitresi;
                    ft.KategoriId = datasix;
                    db.Entry(ft).State = EntityState.Modified;
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }
            return RedirectToAction("Index");
        }
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
        // GET: Admin/katefiloes/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            katefilo katefilo = db.katefilos.Find(id);
            if (katefilo == null)
            {
                return HttpNotFound();
            }
            return View(katefilo);
        }

        // GET: Admin/katefiloes/Create
        public ActionResult Create()
        {
            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi");

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

        // POST: Admin/katefiloes/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,KategoriId,filitreId")] katefilo katefilo)
        {
            if (ModelState.IsValid)
            {
                db.katefilos.Add(katefilo);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            List<CategoryViewModelItemis> items = new List<CategoryViewModelItemis>();
            List<Kategori> allCategories = db.Kategoris.OrderBy(a => a.sira).ToList();
            List<Kategori> parentCategories = allCategories.Where(c => c.parentId == null).ToList();
            foreach (var cat in parentCategories.OrderBy(a => a.sira))
            {
                items.Add(new CategoryViewModelItemis { Value = cat.Id, Text = cat.adi });
                GetSubTree(allCategories, cat, items, cat.Id);
            }

            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi", katefilo.filitreId);
            ViewBag.KategoriId = new SelectList(items, "Value", "Text", katefilo.KategoriId);// new SelectList(db.Kategoris, "Id", "adi", katefilo.KategoriId);
            return View(katefilo);
        }

        // GET: Admin/katefiloes/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            katefilo katefilo = db.katefilos.Find(id);
            if (katefilo == null)
            {
                return HttpNotFound();
            }
            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi", katefilo.filitreId);
            ViewBag.KategoriId = new SelectList(db.Kategoris, "Id", "adi", katefilo.KategoriId);
            return View(katefilo);
        }

        // POST: Admin/katefiloes/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,KategoriId,filitreId")] katefilo katefilo)
        {
            if (ModelState.IsValid)
            {
                db.Entry(katefilo).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi", katefilo.filitreId);
            ViewBag.KategoriId = new SelectList(db.Kategoris, "Id", "adi", katefilo.KategoriId);
            return View(katefilo);
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
