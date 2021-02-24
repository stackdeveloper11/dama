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
    public class altmenusController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/altmenus
        public ActionResult Index()
        {
            var altmenus = db.altmenus.Include(a => a.menu);
            return View(altmenus.ToList());
        }

        // GET: Admin/altmenus/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            altmenu altmenu = db.altmenus.Find(id);
            if (altmenu == null)
            {
                return HttpNotFound();
            }
            return View(altmenu);
        }

        // GET: Admin/altmenus/Create
        public ActionResult Create()
        {
            ViewBag.menuId = new SelectList(db.menus, "Id", "adi");
            return View();
        }

        // POST: Admin/altmenus/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,menuId,adi,linki,sira,yeri")] altmenu altmenu)
        {
            if (ModelState.IsValid)
            {
                db.altmenus.Add(altmenu);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.menuId = new SelectList(db.menus, "Id", "adi", altmenu.menuId);
            return View(altmenu);
        }

        // GET: Admin/altmenus/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            altmenu altmenu = db.altmenus.Find(id);
            if (altmenu == null)
            {
                return HttpNotFound();
            }
            ViewBag.menuId = new SelectList(db.menus, "Id", "adi", altmenu.menuId);
            return View(altmenu);
        }

        // POST: Admin/altmenus/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,menuId,adi,linki,sira,yeri")] altmenu altmenu)
        {
            if (ModelState.IsValid)
            {
                db.Entry(altmenu).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.menuId = new SelectList(db.menus, "Id", "adi", altmenu.menuId);
            return View(altmenu);
        }

        // GET: Admin/altmenus/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            altmenu altmenu = db.altmenus.Find(id);
            if (altmenu == null)
            {
                return HttpNotFound();
            }
            return View(altmenu);
        }

        // POST: Admin/altmenus/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            altmenu altmenu = db.altmenus.Find(id);
            db.altmenus.Remove(altmenu);
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
