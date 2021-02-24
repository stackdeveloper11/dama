﻿using System;
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
    public class ozelliksController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/ozelliks
        public ActionResult Index(int Id)
        {
            //   var ozelliks = db.ozelliks.Include(o => o.filitre).Where(a=>a.filitreId==Id).FirstOrDefault();
            ViewBag.Idsi = Id.ToString();
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index([Bind(Include = "Id,filitreId,adi")] ozellik ozellik, string nere,int? Id)
        {
            ViewBag.Idsi = Id.ToString();
            if (ModelState.IsValid)
            {
                if (db.ozelliks.Where(a => a.adi.ToLower() == ozellik.adi.ToLower() && a.filitreId==Id).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "Bu özellik daha önce kayıt edilmniş!");
                    return View(ozellik);
                }
                else if (nere !="sil" && string.IsNullOrEmpty(ozellik.adi))
                {
                    ModelState.AddModelError("", "Özellik Adı Boş Geçilemez!");
                    return View(ozellik);
                }
                else
                {
                    if (nere=="ekle")
                    {
                        db.ozelliks.Add(ozellik);
                        db.SaveChanges();
                        return RedirectToAction("Index", new { Id = ozellik.filitreId });
                    }
                    if (nere == "duzenle")
                    {
                        db.Entry(ozellik).State = EntityState.Modified;
                        db.SaveChanges();
                        return RedirectToAction("Index",new { Id=ozellik.filitreId });
                    }
                    if (nere=="sil")
                    {
                        ozellik ozelliki = db.ozelliks.Find(ozellik.Id);
                        db.ozelliks.Remove(ozelliki);
                        db.SaveChanges();
                        return RedirectToAction("Index", new { Id = ozellik.filitreId });
                    }
                }

            }
            return View(ozellik);
        }
        // GET: Admin/ozelliks/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ozellik ozellik = db.ozelliks.Find(id);
            if (ozellik == null)
            {
                return HttpNotFound();
            }
            return View(ozellik);
        }

        // GET: Admin/ozelliks/Create
        public ActionResult Create()
        {
            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi");
            return View();
        }

        // POST: Admin/ozelliks/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,filitreId,adi")] ozellik ozellik)
        {
            if (ModelState.IsValid)
            {
                if (db.ozelliks.Where(a => a.adi.ToLower() == ozellik.adi.ToLower()).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "Bu özellik daha önce kayıt edilmniş!");
                    return View(ozellik);
                }
                else if (string.IsNullOrEmpty(ozellik.adi))
                {
                    ModelState.AddModelError("", "Özellik Adı Boş Geçilemez!");
                    return View(ozellik);
                }
                db.ozelliks.Add(ozellik);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            // ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi", ozellik.filitreId);
            return View(ozellik);
        }

        // GET: Admin/ozelliks/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ozellik ozellik = db.ozelliks.Find(id);
            if (ozellik == null)
            {
                return HttpNotFound();
            }
            ViewBag.filitreId = new SelectList(db.filitres, "Id", "adi", ozellik.filitreId);
            return View(ozellik);
        }

        // POST: Admin/ozelliks/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        

        // GET: Admin/ozelliks/Delete/5
        //public ActionResult Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    ozellik ozellik = db.ozelliks.Find(id);
        //    if (ozellik == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(ozellik);
        //}

        // POST: Admin/ozelliks/Delete/5
      
      
        public ActionResult Delete(int id)
        {
            ozellik ozellik = db.ozelliks.Find(id);
            db.ozelliks.Remove(ozellik);
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
