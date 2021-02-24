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

namespace akset.Areas.Admin.Controllers
{
    public class AttributeKategorisController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/AttributeKategoris
        public ActionResult Index()
        {
            var attributeKategoris = db.AttributeKategoris.Include(a => a.Attribute).Include(a => a.Kategori);
            return View(attributeKategoris.ToList());
        }

        // GET: Admin/AttributeKategoris/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AttributeKategori attributeKategori = db.AttributeKategoris.Find(id);
            if (attributeKategori == null)
            {
                return HttpNotFound();
            }
            return View(attributeKategori);
        }

        // GET: Admin/AttributeKategoris/Create
        public ActionResult Create()
        {
            ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name");

            ViewBag.KategoriId = new SelectList(listef(), "Id", "Kategorisi");
            return View();
        }
        public List<KategoriViewModel> listef()
        {
            List<KategoriViewModel> KVMLIST = new List<KategoriViewModel>();
            foreach (var item in db.Kategoris.Include(a => a.parent).Include(a => a.parent.parent).ToList())
            {
                KategoriViewModel KVM = new KategoriViewModel();
                if (item.parent != null && item.parent.parent != null)
                {
                    KVM.Kategorisi = item.parent.parent.adi + " > " + item.parent.adi + " > " + item.adi;
                    KVM.Id = item.Id;
                    KVMLIST.Add(KVM);
                }
                if (item.parent != null && item.parent.parent == null) // && db.Kategoris.Where(a => a.parentId == item.Id).FirstOrDefault() == null
                {
                    KVM.Kategorisi = item.parent.adi + " > " + item.adi;
                    KVM.Id = item.Id;
                    KVMLIST.Add(KVM);
                }
            }
            //foreach (var item in db.Kategoris.Where(a => a.parentId == null).ToList())
            //{
            //    KategoriViewModel KVM = new KategoriViewModel();
            //    KVM.Kategorisi = item.adi;
            //    KVM.Id = item.Id;
            //    KVMLIST.Add(KVM);
            //}
            return KVMLIST;
        }
        // POST: Admin/AttributeKategoris/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "AttributeId,KategoriId")] AttributeKategori attributeKategori, string tagler)
        {
            if (ModelState.IsValid)
            {
                if (string.IsNullOrEmpty(tagler))
                {
                    ModelState.AddModelError("", "Değer Eklemediniz!");
                    ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name", attributeKategori.AttributeId);
                    ViewBag.KategoriId = new SelectList(listef(), "Id", "kategorisi", attributeKategori.KategoriId);
                    return View(attributeKategori);
                }
                if (!tagler.Contains(","))
                {

                    if (db.AttributeKategoris.Where(a => a.AttributeId == attributeKategori.AttributeId && a.KategoriId == attributeKategori.KategoriId).FirstOrDefault() != null)
                    {
                        ModelState.AddModelError("", "Aynı Özellik Daha Önce Eklenmiştir.");
                        ViewBag.KategoriId = new SelectList(listef(), "Id", "kategorisi", attributeKategori.KategoriId);
                        ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name", attributeKategori.AttributeId);
                        return View(attributeKategori);
                    }
                    else
                    {

                        AttributeKategori Ak = new AttributeKategori();
                        Ak.AttributeId = Convert.ToInt32(tagler);
                        Ak.KategoriId = attributeKategori.KategoriId;
                        db.AttributeKategoris.Add(Ak);
                        db.SaveChanges();
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    foreach (var item in tagler.Split(','))
                    {
                        if (db.AttributeKategoris.Where(a => a.AttributeId == attributeKategori.AttributeId && a.KategoriId == attributeKategori.KategoriId).FirstOrDefault() != null)
                        {
                            //ModelState.AddModelError("", "Aynı Özellik Daha Önce Eklenmiştir.");
                            //ViewBag.KategoriId = new SelectList(listef(), "Id", "kategorisi", attributeKategori.KategoriId);
                            //ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name", attributeKategori.AttributeId);
                            //return View(attributeKategori);
                        }
                        else
                        {
                            AttributeKategori Ak = new AttributeKategori();
                            Ak.AttributeId = Convert.ToInt32(item);
                            Ak.KategoriId = attributeKategori.KategoriId;
                            db.AttributeKategoris.Add(Ak);
                            db.SaveChanges();

                        }
                    }
                    return RedirectToAction("Index");
                }
            }
            ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name", attributeKategori.AttributeId);
            ViewBag.KategoriId = new SelectList(listef(), "Id", "kategorisi", attributeKategori.KategoriId);
            return View(attributeKategori);
        }

        // GET: Admin/AttributeKategoris/Edit/5
        public ActionResult Edit(int id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AttributeKategori attributeKategori = db.AttributeKategoris.Where(a => a.KategoriId == id).FirstOrDefault();
            if (attributeKategori == null)
            {
                return HttpNotFound();
            }
            ViewBag.KategoriId = new SelectList(listef(), "Id", "Kategorisi", attributeKategori.KategoriId);
            ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name",attributeKategori.AttributeId);
            return View(attributeKategori);
        }

        // POST: Admin/AttributeKategoris/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "AttributeId,KategoriId")] AttributeKategori attributeKategori, string tagler)
        {
            if (ModelState.IsValid)
            {
                var nedi = db.AttributeKategoris.Where(a => a.KategoriId == attributeKategori.KategoriId).FirstOrDefault();
                foreach (var item in db.AttributeKategoris.Where(a => a.KategoriId == attributeKategori.KategoriId).ToList())
                {
                    db.AttributeKategoris.Remove(item);
                    db.SaveChanges();
                }
                if (string.IsNullOrEmpty(tagler))
                {
                    ModelState.AddModelError("", "Değer Eklemediniz!");
                    ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name", attributeKategori.AttributeId);
                    ViewBag.KategoriId = new SelectList(listef(), "Id", "kategorisi", attributeKategori.KategoriId);
                    return View(attributeKategori);
                }
                if (!tagler.Contains(","))
                {

                    if (db.AttributeKategoris.Where(a => a.AttributeId == attributeKategori.AttributeId && a.KategoriId == attributeKategori.KategoriId).FirstOrDefault() != null)
                    {
                        ModelState.AddModelError("", "Aynı Özellik Daha Önce Eklenmiştir.");
                        ViewBag.KategoriId = new SelectList(listef(), "Id", "kategorisi", attributeKategori.KategoriId);
                        ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name", attributeKategori.AttributeId);
                        return View(attributeKategori);
                    }
                    else
                    {

                        AttributeKategori Ak = new AttributeKategori();
                        Ak.AttributeId = Convert.ToInt32(tagler);
                        Ak.KategoriId = attributeKategori.KategoriId;
                        db.AttributeKategoris.Add(Ak);
                        db.SaveChanges();
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    foreach (var item in tagler.Split(','))
                    {
                        if (db.AttributeKategoris.Where(a => a.AttributeId == attributeKategori.AttributeId && a.KategoriId == attributeKategori.KategoriId).FirstOrDefault() != null)
                        {
                            //ModelState.AddModelError("", "Aynı Özellik Daha Önce Eklenmiştir.");
                            //ViewBag.KategoriId = new SelectList(listef(), "Id", "kategorisi", attributeKategori.KategoriId);
                            //ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name", attributeKategori.AttributeId);
                            //return View(attributeKategori);
                        }
                        else
                        {
                            AttributeKategori Ak = new AttributeKategori();
                            Ak.AttributeId = Convert.ToInt32(item);
                            Ak.KategoriId = attributeKategori.KategoriId;
                            db.AttributeKategoris.Add(Ak);
                            db.SaveChanges();

                        }
                    }
                    return RedirectToAction("Index");
                }
            }
            ViewBag.AttributeId = new SelectList(db.Attributes, "Id", "Name", attributeKategori.AttributeId);
            ViewBag.KategoriId = new SelectList(listef(), "Id", "Kategorisi", attributeKategori.KategoriId);
            return View(attributeKategori);
        }



        public ActionResult Delete(int id)
        {
            var attributeKategori = db.AttributeKategoris.Where(a => a.KategoriId == id).ToList();
            foreach (var item in attributeKategori)
            {
                db.AttributeKategoris.Remove(item);
                db.SaveChanges();
            }

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
