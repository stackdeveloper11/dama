using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using akset.data;
using System.Drawing.Imaging;
using System.Drawing;

namespace akset.Areas.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    public class SayfasController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/Sayfas
        public ActionResult sayfa()
        {
            return View(db.Sayfas.ToList());
        }
        
            public JsonResult attachment_uploadsayfa()
        {
            //var fileName = Request.Files[0].FileName;
            //var base64 = string.Empty;

            //using (var memoryStream = new MemoryStream())
            //{
            //    Request.Files[0].InputStream.CopyTo(memoryStream);
            //    var fileContent = memoryStream.ToArray();
            //    base64 = Convert.ToBase64String(fileContent);
            //}

            ////  return Json(base64);
            for (int i = 0; i < Request.Files.Count; i++)
            {
                var filePath = Server.MapPath("~/SayfaResimleri/") + Request.Files[i].FileName;
                string sss = (new Random().Next(10, 99) + "-" + new Random().Next(100, 9999)).ToString();

                ImageCodecInfo jpgInfo = ImageCodecInfo.GetImageEncoders().Where(codecInfo => codecInfo.MimeType == "image/jpeg").First();
                using (EncoderParameters encParams = new EncoderParameters(1))
                {
                    var image = Bitmap.FromStream(Request.Files[i].InputStream);
                    encParams.Param[0] = new EncoderParameter(Encoder.Quality, (long)50);
                    image.Save(Server.MapPath("~/SayfaResimleri/") + sss + ".jpg", jpgInfo, encParams);
                }




                //using (var fs = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
                //{
                //    Request.Files[i].InputStream.CopyTo(fs);
                //}
                return Json(sss + ".jpg", JsonRequestBehavior.AllowGet);
            }
            return Json("ok", JsonRequestBehavior.AllowGet);
        }
        // GET: Admin/Sayfas/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sayfa sayfa = db.Sayfas.Find(id);
            if (sayfa == null)
            {
                return HttpNotFound();
            }
            return View(sayfa);
        }
        private void GetSubTree(IList<Kategori> allCats, Kategori parent, IList<CategoryViewModelItemis> items, int prt)
        {
            var subCats = allCats.Where(c => c.parentId == prt);
            foreach (var cat in subCats)
            {
                //add this category
                items.Add(new CategoryViewModelItemis { Value = cat.Id, Text = string.Concat(parent.parent != null ? parent.parent.adi + " >> " : "") + parent.adi + " >> " + cat.adi });
                //recursive call in case your have a hierarchy more than 1 level deep
                GetSubTree(allCats, cat, items, cat.Id);
            }
        }
        // GET: Admin/Sayfas/Create
        public ActionResult Create()
        {
       

            return View();
        }

        // POST: Admin/Sayfas/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Adi,Baslik,Aciklama,Icerik,Durum,tarih")] Sayfa sayfa)
        {
            if (ModelState.IsValid)
            {
                var sa = db.Sayfas.Where(a => a.Adi == sayfa.Adi).FirstOrDefault();
                if (sa != null)
                {
                    ModelState.AddModelError("", "Bu sayfa adı mevcut. Lütfen başka bir ad yazınız!");
                    sayfa.Icerik = Microsoft.JScript.GlobalObject.unescape(sayfa.Icerik);
                    return View(sayfa);
                }
                else
                {
                    sayfa.Icerik = Microsoft.JScript.GlobalObject.unescape(sayfa.Icerik);
                    sayfa.tarih = DateTime.Now;
                    db.Sayfas.Add(sayfa);
                    db.SaveChanges();
                    return RedirectToAction("sayfa");
                }

            }

            sayfa.Icerik = Microsoft.JScript.GlobalObject.unescape(sayfa.Icerik);
            return View(sayfa);
        }

        // GET: Admin/Sayfas/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sayfa sayfa = db.Sayfas.Find(id);
            if (sayfa == null)
            {
                return HttpNotFound();
            }
            sayfa.Icerik = Microsoft.JScript.GlobalObject.unescape(sayfa.Icerik);
            return View(sayfa);
        }

        // POST: Admin/Sayfas/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Adi,Baslik,Aciklama,Icerik,Durum,tarih")] Sayfa sayfa)
        {
            if (ModelState.IsValid)
            {
                var sa = db.Sayfas.Where(a => a.Adi == sayfa.Adi && a.Id != sayfa.Id).FirstOrDefault();
                if (sa != null)
                {
                    ModelState.AddModelError("", "Bu sayfa adı mevcut. Lütfen başka bir ad yazınız!");
                    sayfa.Icerik = Microsoft.JScript.GlobalObject.unescape(sayfa.Icerik);
                    return View(sayfa);
                }
                else
                {
                    db.Entry(sayfa).State = EntityState.Modified;
                    db.SaveChanges();
                    return RedirectToAction("sayfa");
                }

            }
            if (!string.IsNullOrEmpty(sayfa.Icerik))
            {
                sayfa.Icerik = Microsoft.JScript.GlobalObject.unescape(sayfa.Icerik);
            }

            return View(sayfa);
        }



        public ActionResult Delete(int id)
        {
            Sayfa sayfa = db.Sayfas.Find(id);
            db.Sayfas.Remove(sayfa);
            db.SaveChanges();
            return RedirectToAction("sayfa");
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
