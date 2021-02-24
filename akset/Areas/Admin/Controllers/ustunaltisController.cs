using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using akset.data;
using System.Text.RegularExpressions;
using System.IO;

namespace akset.Areas.Admin.Controllers
{
    public class ustunaltisController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/ustunaltis
        public ActionResult Index(int id)
        {
            var ustunaltis = db.ustunaltis.Where(a=>a.ustmenuId == id).Include(u => u.Kategori).Include(u => u.ustmenu);
            return View(ustunaltis.ToList());
        }

        // GET: Admin/ustunaltis/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ustunalti ustunalti = db.ustunaltis.Find(id);
            if (ustunalti == null)
            {
                return HttpNotFound();
            }
            return View(ustunalti);
        }
        private void GetSubTree(IList<Kategori> allCats, Kategori parent, IList<CategoryViewModelItemi> items, int prt)
        {
            foreach (Kategori kategori in allCats.Where<Kategori>((Kategori c) =>
            {
                int? nullable = c.parentId;
                int ınt32 = prt;
                if (nullable.GetValueOrDefault() != ınt32)
                {
                    return false;
                }
                return nullable.HasValue;
            }))
            {
                items.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = string.Concat((parent.parent != null ? string.Concat(parent.parent.adi, " >> ") : ""), parent.adi, " >> ", kategori.adi)
                });
                this.GetSubTree(allCats, kategori, items, kategori.Id);
            }
        }
        // GET: Admin/ustunaltis/Create
        public ActionResult Create(int Id)
        {
            List<Kategori> ktg = new List<Kategori>();
            foreach (var item in db.Kategoris.Where(a => a.parentId == null).ToList())
            {
                ktg.AddRange(db.Kategoris.Where(a => a.parentId == item.Id).ToList());
            }
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }
            List<CategoryViewModelItemi> iki = new List<CategoryViewModelItemi>();
            foreach (var item in categoryViewModelItemis.ToList())
            {
                if (Regex.Matches(item.Text, ">>").Count == 1)
                {
                    iki.Add(item);
                }
            }
            foreach (var item in db.Kategoris.Where(a => a.parentId == null).ToList())
            {
                CategoryViewModelItemi ff = new CategoryViewModelItemi();
                ff.Text = item.adi;
                ff.Value = item.Id;
                iki.Add(ff);
            }
            ((dynamic)base.ViewBag).KategoriId = new SelectList(iki, "Value", "Text");
           
            ViewBag.ustmenuId = new SelectList(db.ustmenus, "Id", "ustmenuadi",Id);
            return View();
        }

        // POST: Admin/ustunaltis/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,ustunaltiadi,ustmenuId,KategoriId,sira,kacli,katler,resimi")] ustunalti ustunalti,string kati,HttpPostedFileBase file = null)
        {
            if (ModelState.IsValid)
            {
                if (file != null && file.ContentLength > 0)
                {
                    string sonu = Path.GetExtension(file.FileName);
                    string filename = ustunalti.resimi;
                    ustunalti.resimi = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/MenuResimleri"), filename + sonu);
                    file.SaveAs(path);
                }
                ustunalti.katler = kati;
                db.ustunaltis.Add(ustunalti);
                db.SaveChanges();
                return RedirectToAction("Index",new { id=ustunalti.ustmenuId });
            }
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }

            List<CategoryViewModelItemi> iki = new List<CategoryViewModelItemi>();
            foreach (var item in categoryViewModelItemis.ToList())
            {
                if (Regex.Matches(item.Text, ">>").Count == 1)
                {
                    iki.Add(item);
                }
            }
            foreach (var item in db.Kategoris.Where(a => a.parentId == null).ToList())
            {
                CategoryViewModelItemi ff = new CategoryViewModelItemi();
                ff.Text = item.adi;
                ff.Value = item.Id;
                iki.Add(ff);
            }
            ((dynamic)base.ViewBag).KategoriId = new SelectList(categoryViewModelItemis, "Value", "Text",ustunalti.KategoriId);
            ViewBag.ustmenuId = new SelectList(db.ustmenus, "Id", "ustmenuadi", ustunalti.ustmenuId);
            return View(ustunalti);

        }

        // GET: Admin/ustunaltis/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ustunalti ustunalti = db.ustunaltis.Find(id);
            if (ustunalti == null)
            {
                return HttpNotFound();
            }
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }
            List<CategoryViewModelItemi> iki = new List<CategoryViewModelItemi>();
            foreach (var item in categoryViewModelItemis.ToList())
            {
                if (Regex.Matches(item.Text, ">>").Count == 1)
                {
                    iki.Add(item);
                }
            }
            foreach (var item in db.Kategoris.Where(a => a.parentId == null).ToList())
            {
                CategoryViewModelItemi ff = new CategoryViewModelItemi();
                ff.Text = item.adi;
                ff.Value = item.Id;
                iki.Add(ff);
            }
            ((dynamic)base.ViewBag).KategoriId = new SelectList(iki, "Value", "Text", ustunalti.KategoriId);
            ViewBag.ustmenuId = new SelectList(db.ustmenus, "Id", "ustmenuadi", ustunalti.ustmenuId);
            return View(ustunalti);
        }

        // POST: Admin/ustunaltis/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,ustunaltiadi,ustmenuId,KategoriId,sira,kacli,katler,resimi")] ustunalti ustunalti,string kati,HttpPostedFileBase file = null)
        {
            if (ModelState.IsValid)
            {
                
                if (file != null && file.ContentLength > 0)
                {
                    try
                    {
                        System.IO.File.Delete(Server.MapPath("~/" + ustunalti.resimi));
                    }
                    catch (Exception)
                    {

                    }

                    string res = new Random().Next(1, 99999) + "-" + new Random().Next(1, 99999);
                    string sonu = Path.GetExtension(file.FileName);
                    string filename = res;
                    ustunalti.resimi = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/MenuResimleri"), filename + sonu);
                    file.SaveAs(path);
                }
                ustunalti.katler = kati;
                db.Entry(ustunalti).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index",new { id=ustunalti.ustmenuId});
            }
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }
            List<CategoryViewModelItemi> iki = new List<CategoryViewModelItemi>();
            foreach (var item in categoryViewModelItemis.ToList())
            {
                if (Regex.Matches(item.Text, ">>").Count == 1)
                {
                    iki.Add(item);
                }
            }
            foreach (var item in db.Kategoris.Where(a => a.parentId == null).ToList())
            {
                CategoryViewModelItemi ff = new CategoryViewModelItemi();
                ff.Text = item.adi;
                ff.Value = item.Id;
                iki.Add(ff);
            }
            ((dynamic)base.ViewBag).KategoriId = new SelectList(iki, "Value", "Text", ustunalti.KategoriId);
            ViewBag.ustmenuId = new SelectList(db.ustmenus, "Id", "ustmenuadi", ustunalti.ustmenuId);
            return View(ustunalti);
        }

        // GET: Admin/ustunaltis/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ustunalti ustunalti = db.ustunaltis.Find(id);
            db.ustunaltis.Remove(ustunalti);
            db.SaveChanges();
            if (ustunalti == null)
            {
                return HttpNotFound();
            }
            return RedirectToAction("Index",new { id=ustunalti.ustmenuId });
        }

        // POST: Admin/ustunaltis/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            ustunalti ustunalti = db.ustunaltis.Find(id);
            db.ustunaltis.Remove(ustunalti);
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
