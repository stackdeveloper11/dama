using akset.data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace akset.Areas.Admin.Controllers
{
    public class SpotsController : Controller
    {
        akset.data.aksetDB db = new data.aksetDB();
        // GET: Admin/Spots
        public ActionResult Spot()
        {
            return View(db.sagtarafs.ToList());
        }

     
        public ActionResult Delete(int Id)
        {
            var bul = db.sagtarafs.Where(a => a.Id == Id).FirstOrDefault();
            try
            {
                System.IO.File.Delete(Server.MapPath("~/SagResimleri/") + bul.resim);
            }
            catch (Exception)
            {

            }
            db.sagtarafs.Remove(bul);
            db.SaveChanges();
            return RedirectToAction("Spot");
        }
        public ActionResult Edit(int Id)
        {
            var bul = db.sagtarafs.Where(a => a.Id == Id).FirstOrDefault();
            return View(bul);
        }

        public ActionResult Create()
        {

            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,baslik,resim,sira,adres,aktifmi")] sagtaraf sagtaraf, HttpPostedFileBase resimi)
        {
            if (ModelState.IsValid)
            {
                if (resimi != null && resimi.ContentLength > 0)
                {
                    string resadi = new Random().Next(100, 1000) + "-" + new Random().Next(1, 1000);
                    string sonu = Path.GetExtension(resimi.FileName);
                    string filename = resadi;
                    sagtaraf.resim = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/SagResimleri/"), filename + sonu);
                    try
                    {
                        System.IO.File.Delete(Server.MapPath("~/SagResimleri/") + sagtaraf.resim);
                    }
                    catch (Exception)
                    {

                    }
                    resimi.SaveAs(path);
                }


                db.Entry(sagtaraf).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Spot");

            }
            return View(sagtaraf);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,baslik,resim,sira,adres,aktifmi")] sagtaraf sagtaraf, HttpPostedFileBase resim)
        {
            if (ModelState.IsValid)
            {
                if (resim != null && resim.ContentLength > 0)
                {
                    string resadi = new Random().Next(100, 1000) + "-" + new Random().Next(1, 1000);
                    string sonu = Path.GetExtension(resim.FileName);
                    string filename = resadi;
                    sagtaraf.resim = filename + sonu;
                    var path = Path.Combine(Server.MapPath("~/SagResimleri/"), filename + sonu);
                    try
                    {
                        System.IO.File.Delete(Server.MapPath("~/SagResimleri/") + sagtaraf.resim);
                    }
                    catch (Exception)
                    {
                    }
                    resim.SaveAs(path);
                }

                db.sagtarafs.Add(sagtaraf);
                db.SaveChanges();
                return RedirectToAction("Spot");
            }
            return View(sagtaraf);
        }
    }
}