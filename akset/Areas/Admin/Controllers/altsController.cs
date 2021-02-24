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
    public class altsController : Controller
    {
        private aksetDB db = new aksetDB();
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index([Bind(Include = "Id,detayId,adi")] alt ozellik, string nere, int? Id)
        {
            ViewBag.Idsi = Id.ToString();
            if (ModelState.IsValid)
            {
                if (db.alts.Where(a => a.adi.ToLower() == ozellik.adi.ToLower() && a.detayId == Id).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "Bu özellik daha önce kayıt edilmniş!");
                    return View(ozellik);
                }
                else if (nere != "sil" && string.IsNullOrEmpty(ozellik.adi))
                {
                    ModelState.AddModelError("", "Özellik Adı Boş Geçilemez!");
                    return View(ozellik);
                }
                else
                {
                    if (nere == "ekle")
                    {
                        db.alts.Add(ozellik);
                        db.SaveChanges();
                        return RedirectToAction("Index", new { Id = ozellik.detayId });
                    }
                    if (nere == "duzenle")
                    {
                        db.Entry(ozellik).State = EntityState.Modified;
                        db.SaveChanges();
                        return RedirectToAction("Index", new { Id = ozellik.detayId });
                    }
                    if (nere == "sil")
                    {
                        alt ozelliki = db.alts.Find(ozellik.Id);
                        db.alts.Remove(ozelliki);
                        db.SaveChanges();
                        return RedirectToAction("Index", new { Id = ozellik.detayId });
                    }
                }

            }
            return View(ozellik);
        }
        // GET: Admin/alts
        public ActionResult Index(int Id)
        {
            ViewBag.Idsi = Id.ToString();
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,detayId,adi")] alt ozellik)
        {
            if (ModelState.IsValid)
            {
                if (db.alts.Where(a => a.adi.ToLower() == ozellik.adi.ToLower()).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "Bu özellik daha önce kayıt edilmniş!");
                    return View(ozellik);
                }
                else if (string.IsNullOrEmpty(ozellik.adi))
                {
                    ModelState.AddModelError("", "Özellik Adı Boş Geçilemez!");
                    return View(ozellik);
                }
                db.alts.Add(ozellik);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            // ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi", ozellik.filitreId);
            return View(ozellik);
        }
        // GET: Admin/alts/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            alt alt = db.alts.Find(id);
            if (alt == null)
            {
                return HttpNotFound();
            }
            return View(alt);
        }

        // GET: Admin/alts/Create
        public ActionResult Create()
        {
            ViewBag.detayId = new SelectList(db.detays, "Id", "adi");
            return View();
        }

    

        // GET: Admin/alts/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            alt alt = db.alts.Find(id);
            if (alt == null)
            {
                return HttpNotFound();
            }
            ViewBag.detayId = new SelectList(db.detays, "Id", "adi", alt.detayId);
            return View(alt);
        }

        // POST: Admin/alts/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,detayId,adi")] alt alt)
        {
            if (ModelState.IsValid)
            {
                db.Entry(alt).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.detayId = new SelectList(db.detays, "Id", "adi", alt.detayId);
            return View(alt);
        }

        // GET: Admin/alts/Delete/5


        // POST: Admin/alts/Delete/5
     
        public ActionResult Delete(int id)
        {
            alt alt = db.alts.Find(id);
            db.alts.Remove(alt);
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
