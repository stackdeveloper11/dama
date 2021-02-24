using System;
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
    public class sonucuz
    {
        public int value { get; set; }
        public string name { get; set; }
    }
    public class ustmenusController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/ustmenus
        public ActionResult ustmenu()
        {
            return View(db.ustmenus.ToList());
        }

        // GET: Admin/ustmenus/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ustmenu ustmenu = db.ustmenus.Find(id);
            if (ustmenu == null)
            {
                return HttpNotFound();
            }
            return View(ustmenu);
        }

        // GET: Admin/ustmenus/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Admin/ustmenus/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,ustmenuadi,sira,resimi,link")] ustmenu ustmenu, HttpPostedFileBase file =null)
        {
            if (ModelState.IsValid)
            {
                if (file != null && file.ContentLength > 0)
                {
                    string sonu = Path.GetExtension(file.FileName);
                    string filename = ustmenu.resimi;
                    ustmenu.resimi = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/MenuResimleri"), filename + sonu);
                    file.SaveAs(path);
                }
               
                db.ustmenus.Add(ustmenu);
                db.SaveChanges();
                return RedirectToAction("ustmenu");
            }
            return View(ustmenu);
        }

        // GET: Admin/ustmenus/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ustmenu ustmenu = db.ustmenus.Find(id);
            if (ustmenu == null)
            {
                return HttpNotFound();
            }
            return View(ustmenu);
        }
        public JsonResult katler(string searchText)
        {

            return Json(db.Kategoris.Where(a=>a.adi.Contains(searchText)).Select(a=> new sonucuz { name=a.adi,value=a.Id }), JsonRequestBehavior.AllowGet);
        }
        // POST: Admin/ustmenus/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,ustmenuadi,sira,resimi,link")] ustmenu ustmenu, HttpPostedFileBase file = null)
        {
          //  string[] liste = gizid.Split(',');
            
            if (ModelState.IsValid)
            {
                if (file != null && file.ContentLength > 0)
                {
                    try
                    {
                        System.IO.File.Delete(Server.MapPath("~/" + ustmenu.resimi));
                    }
                    catch (Exception)
                    {

                    }

                    string res = new Random().Next(1, 99999) + "-" + new Random().Next(1, 99999);
                    string sonu = Path.GetExtension(file.FileName);
                    string filename = res;
                    ustmenu.resimi = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/MenuResimleri"), filename + sonu);
                    file.SaveAs(path);
                }
              
                db.Entry(ustmenu).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("ustmenu");
            }
            return View(ustmenu);
        }

        // GET: Admin/ustmenus/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ustmenu ustmenu = db.ustmenus.Find(id);
            if (ustmenu == null)
            {
                return HttpNotFound();
            }
            foreach (var item in db.ustunaltis.Where(a=>a.ustmenuId==id).ToList())
            {
                db.ustunaltis.Remove(item);
            }
            db.SaveChanges();
            db.ustmenus.Remove(ustmenu);
            db.SaveChanges();
            return RedirectToAction("ustmenu");
        }

        // POST: Admin/ustmenus/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            ustmenu ustmenu = db.ustmenus.Find(id);
            db.ustmenus.Remove(ustmenu);
            db.SaveChanges();
            return RedirectToAction("ustmenu");
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
