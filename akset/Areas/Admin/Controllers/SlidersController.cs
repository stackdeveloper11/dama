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
    [Authorize(Roles = "Admin")]
    public class SlidersController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/Sliders

        public ActionResult slider()
        {
            return View(db.Sliders.ToList());
        }
        // GET: Admin/Sliders/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Slider slider = db.Sliders.Find(id);
            if (slider == null)
            {
                return HttpNotFound();
            }
            return View(slider);
        }

        // GET: Admin/Sliders/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Admin/Sliders/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,adresi,sirasi,baslik,aciklama,cacheno,aktif")] Slider slider, HttpPostedFileBase file)
        {
            if (ModelState.IsValid)
            {
                HttpPostedFileBase ddd = file;
                bool nullmu = true;
                if (file != null && file.ContentLength > 0)
                {
                    int fileSizeInBytes = file.ContentLength;
                    MemoryStream target = new MemoryStream();
                    file.InputStream.CopyTo(target);
                    byte[] data = target.ToArray();
                    //if (helper.Genel.GetImageFormat(data) != helper.Genel.ImageFormat.jpeg)
                    //{
                    //    nullmu = true;
                    //    ModelState.AddModelError("res", "Resim .jpg formatlı/Uzantılı olmalıdır!");
                    //    return View(slider);
                    //}
                    //else
                    //{
                    //    nullmu = false;
                    //}
                }
                else
                {
                    nullmu = true;
                    ModelState.AddModelError("res", "Resim Seçmediniz!");
                    return View(slider);
                }
                //if (nullmu==false)
                //{
                    slider.aciklama = Path.GetExtension(ddd.FileName);
                    db.Sliders.Add(slider);
                    db.SaveChanges();
                    ddd.SaveAs(Server.MapPath("~/SlaytResimleri/" + slider.Id + Path.GetExtension(ddd.FileName)));
                    return RedirectToAction("slider");
                //}
            }
            return View(slider);
        }

        // GET: Admin/Sliders/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Slider slider = db.Sliders.Find(id);
            if (slider == null)
            {
                return HttpNotFound();
            }
            return View(slider);
        }

        // POST: Admin/Sliders/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,adresi,sirasi,baslik,aciklama,cacheno,aktif")] Slider slider,HttpPostedFileBase file=null)
        {
            if (ModelState.IsValid)
            {
                HttpPostedFileBase ddd = file;
                slider.cacheno = string.Concat(new Random().Next(10, 10000),"-",new Random().Next(100, 10000));
                db.Entry(slider).State = EntityState.Modified;
                db.SaveChanges();
                bool nullmu = true;
                //if (nullmu==false)
                //{
                if (file != null && file.ContentLength > 0)
                {
   slider.aciklama = Path.GetExtension(ddd.FileName);
                   ddd.SaveAs(Server.MapPath("~/SlaytResimleri/" + slider.Id + Path.GetExtension(ddd.FileName)));
                }
                 
                //}
               return RedirectToAction("slider");
            }
            return View(slider);
        }


        // POST: Admin/Sliders/Delete/5

        public ActionResult Delete(int id)
        {
            Slider slider = db.Sliders.Find(id);
            db.Sliders.Remove(slider);
            db.SaveChanges();
            try
            {
                System.IO.File.Delete(Server.MapPath("~/SlaytResimleri/" + slider.Id + slider.aciklama));
            }
            catch (Exception)
            {

            }
            return RedirectToAction("slider");
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
