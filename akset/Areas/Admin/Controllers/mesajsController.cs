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
    [Authorize(Roles = "Admin")]
    public class mesajsController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/mesajs
        public ActionResult mesaj()
        {
            return View(db.mesajs.OrderBy(a=>a.okundumu).ToList());
        }

        public ActionResult mesajoku(int Id)
        {
            var dd = db.mesajs.Find(Id);
            if (dd==null)
            {
                return HttpNotFound();
            }
            dd.okundumu = true;
            db.Entry(dd).State = EntityState.Modified;
            db.SaveChanges();
            return View(dd);
        }

    

       
        public ActionResult Delete(int id)
        {
            mesaj mesaj = db.mesajs.Find(id);
            db.mesajs.Remove(mesaj);
            db.SaveChanges();
            return RedirectToAction("mesaj");
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
