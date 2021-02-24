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
    public class hesapsController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/hesaps
        public ActionResult hesap()
        {
            var hesaps = db.hesaps.Include(h => h.filitre).Include(h => h.ozellik);
            return View(hesaps.ToList());
        }

        // GET: Admin/hesaps/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            hesap hesap = db.hesaps.Find(id);
            if (hesap == null)
            {
                return HttpNotFound();
            }
            return View(hesap);
        }

        // GET: Admin/hesaps/Create
        public ActionResult Create()
        {
            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi");
            ViewBag.ozellikId = new SelectList(db.ozelliks, "Id", "adi");
            ViewBag.urunId = new SelectList(db.uruns, "Id", "urunadi");
            return View();
        }

        // POST: Admin/hesaps/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,urunId,filitreId,ozellikId,adet,kaclira")] hesap hesap)
        {
            if (ModelState.IsValid)
            {
                db.hesaps.Add(hesap);
                db.SaveChanges();
                return RedirectToAction("hesap");
            }

            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi", hesap.filitreId);
            ViewBag.ozellikId = new SelectList(db.ozelliks, "Id", "adi", hesap.ozellikId);
            ViewBag.urunId = new SelectList(db.uruns, "Id", "urunadi", hesap.urunId);
            return View(hesap);
        }

        // GET: Admin/hesaps/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            hesap hesap = db.hesaps.Find(id);
            if (hesap == null)
            {
                return HttpNotFound();
            }
            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi", hesap.filitreId);
            ViewBag.ozellikId = new SelectList(db.ozelliks, "Id", "adi", hesap.ozellikId);
            ViewBag.urunId = new SelectList(db.uruns, "Id", "urunadi", hesap.urunId);
            return View(hesap);
        }

        // POST: Admin/hesaps/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,urunId,filitreId,ozellikId,adet,kaclira")] hesap hesap)
        {
            if (ModelState.IsValid)
            {
                db.Entry(hesap).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("hesap");
            }
            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi", hesap.filitreId);
            ViewBag.ozellikId = new SelectList(db.ozelliks, "Id", "adi", hesap.ozellikId);
            ViewBag.urunId = new SelectList(db.uruns, "Id", "urunadi", hesap.urunId);
            return View(hesap);
        }
        // POST: Admin/hesaps/Delete/5
        public ActionResult Delete(int id)
        {
            hesap hesap = db.hesaps.Find(id);
            db.hesaps.Remove(hesap);
            db.SaveChanges();
            return RedirectToAction("hesap");
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
