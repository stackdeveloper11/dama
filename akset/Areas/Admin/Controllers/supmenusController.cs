using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using akset.data;
using System.Data.Entity.Validation;

namespace akset.Areas.Admin.Controllers
{
    public class supmenusController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/supmenus
        public ActionResult supmenu()
        {
            ViewModel.supview vmc = new ViewModel.supview
            {
                Kategorileri = db.supmenus.Where(x => x.parentId == null).OrderBy(a => a.sira).ToList(),
                altKategorileri = db.supmenus.Where(x => x.parentId != null).OrderBy(a => a.sira).ToList()
            };
            // var kategoris = db.Kategoris.Include(k => k.Parent);
            return View(vmc);
        }

        // GET: Admin/supmenus/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            supmenu supmenu = db.supmenus.Find(id);
            if (supmenu == null)
            {
                return HttpNotFound();
            }
            return View(supmenu);
        }

        // GET: Admin/supmenus/Create
        public ActionResult Create()
        {
            ViewBag.parentId = new SelectList(db.supmenus, "Id", "adi");
            return View();
        }

        // POST: Admin/supmenus/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,parentId,adi,sira,link,yeri")] supmenu supmenu)
        {
            if (ModelState.IsValid)
            {
                db.supmenus.Add(supmenu);
                db.SaveChanges();
                return RedirectToAction("supmenu");
            }

            ViewBag.parentId = new SelectList(db.supmenus, "Id", "adi", supmenu.parentId);
            return View(supmenu);
        }
        public JsonResult katdegis(string jsonu, int? idsi, int? parenti)
        {
            string hata = "";
            supmenu kategori = db.supmenus.Find(idsi);
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
                supmenu kategorig = db.supmenus.Find(Convert.ToInt32(fff[0].ToString()));
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
        // GET: Admin/supmenus/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            supmenu supmenu = db.supmenus.Find(id);
            if (supmenu == null)
            {
                return HttpNotFound();
            }
            ViewBag.parentId = new SelectList(db.supmenus, "Id", "adi", supmenu.parentId);
            return View(supmenu);
        }

        // POST: Admin/supmenus/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,parentId,adi,sira,link,yeri")] supmenu supmenu)
        {
            if (ModelState.IsValid)
            {
                db.Entry(supmenu).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("supmenu");
            }
            ViewBag.parentId = new SelectList(db.supmenus.Where(a => a.parentId != supmenu.Id), "Id", "adi", supmenu.parentId);
            return View(supmenu);
        }

        // GET: Admin/supmenus/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            supmenu supmenu = db.supmenus.Find(id);
            if (supmenu == null)
            {
                return HttpNotFound();
            }
          
            db.supmenus.Remove(supmenu);
            db.SaveChanges();
            return RedirectToAction("supmenu");
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
