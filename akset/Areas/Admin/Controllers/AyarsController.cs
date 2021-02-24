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
    public class AyarsController : Controller
    {
        private aksetDB db = new aksetDB();
        // GET: Admin/Ayars
        public ActionResult ayar()
        {
            if (db.Ayars.FirstOrDefault() != null)
            {
                return View();
            }
            else
            {
                return View(db.Ayars.FirstOrDefault());
            }

        }
        // POST: Admin/Ayars/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ayar([Bind(Include = "Id,title,description,keywords,analitics,aramametalar")] Ayar ayar)
        {
            if (ModelState.IsValid)
            {
                ayar.analitics = Microsoft.JScript.GlobalObject.unescape(ayar.analitics);
                ayar.aramametalar = Microsoft.JScript.GlobalObject.unescape(ayar.aramametalar);
                db.Entry(ayar).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("ayar");
            }
            return View(ayar);
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
