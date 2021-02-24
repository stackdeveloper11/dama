﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using akset.data;
using System.IO;

namespace akset.Areas.Admin.Controllers
{
    public class MarkasController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/Markas
        public ActionResult Marka()
        {
            return View(db.Markas.ToList());
        }

        // GET: Admin/Markas/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Marka marka = db.Markas.Find(id);
            if (marka == null)
            {
                return HttpNotFound();
            }
            return View(marka);
        }

        // GET: Admin/Markas/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Admin/Markas/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,MarkaAdi,MarkaResim,MarkaAciklama")] Marka marka,HttpPostedFileBase resim)
        {
            if (ModelState.IsValid)
            {
                if (resim != null && resim.ContentLength > 0)
                {
                    string sonu = Path.GetExtension(resim.FileName);
                    string filename = Path.GetFileName(resim.FileName);
                    marka.MarkaResim = filename + sonu;

                    var path = Path.Combine(Server.MapPath("~/MarkaResimleri"), filename + sonu);
                    resim.SaveAs(path);
                }
                db.Markas.Add(marka);
                db.SaveChanges();
                return RedirectToAction("Marka");
            }

            return View(marka);
        }

        // GET: Admin/Markas/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Marka marka = db.Markas.Find(id);
            if (marka == null)
            {
                return HttpNotFound();
            }
            return View(marka);
        }

        // POST: Admin/Markas/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,MarkaAdi,MarkaResim,MarkaAciklama")] Marka marka,HttpPostedFileBase resim)
        {
            if (ModelState.IsValid)
            {
                if (resim != null && resim.ContentLength > 0)
                {
                    string sonu = Path.GetExtension(resim.FileName);
                    string filename = Path.GetFileName(resim.FileName);
                    marka.MarkaResim = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/MarkaResimleri"), filename + sonu);
                    resim.SaveAs(path);
                }
                db.Entry(marka).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Marka");
            }
            return View(marka);
        }

        // GET: Admin/Markas/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Marka marka = db.Markas.Find(id);
            if (marka == null)
            {
                return HttpNotFound();
            }
            db.Markas.Remove(marka);
            db.SaveChanges();
            return RedirectToAction("Marka");
        }

        // POST: Admin/Markas/Delete/5
     
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
