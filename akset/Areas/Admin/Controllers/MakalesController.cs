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
using akset.ViewModel;
using System.Drawing.Imaging;
using System.Drawing;

namespace akset.Areas.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    public class MakalesController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/Makales
        public ActionResult makale()
        {
            return View(db.Makales.Include(a=>a.Kategori).ToList());
        }
        
            public JsonResult attachment_uploadmakale()
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
                var filePath = Server.MapPath("~/MakaleResimleri/") + Request.Files[i].FileName;
                string sss = (new Random().Next(10, 99) + "-" + new Random().Next(100, 9999)).ToString();
                ImageCodecInfo jpgInfo = ImageCodecInfo.GetImageEncoders().Where(codecInfo => codecInfo.MimeType == "image/jpeg").First();
                using (EncoderParameters encParams = new EncoderParameters(1))
                {
                    var image = Bitmap.FromStream(Request.Files[i].InputStream);
                    encParams.Param[0] = new EncoderParameter(Encoder.Quality, (long)50);
                    image.Save(Server.MapPath("~/MakaleResimleri/") + sss + ".jpg", jpgInfo, encParams);
                }
                //using (var fs = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
                //{
                //    Request.Files[i].In putStream.CopyTo(fs);
                //}
                return Json(sss + ".jpg", JsonRequestBehavior.AllowGet);
            }
            return Json("ok", JsonRequestBehavior.AllowGet);
        }
        // GET: Admin/Makales/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Makale makale = db.Makales.Find(id);
            if (makale == null)
            {
                return HttpNotFound();
            }
            return View(makale);
        }

        // GET: Admin/Makales/Create
        public ActionResult Create()
        {
            ViewBag.KategoriId = new SelectList(db.Kategoris.Where(a => db.Kategoris.Where(b => b.parentId == a.Id).FirstOrDefault() == null), "Id", "adi");
            return View();
        }

     
        // POST: Admin/Makales/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,baslik,url,icerik,tarih,goruntuleme,aktif,resimi,aciklama,KategoriId,keywords")] Makale makale)
        {
            if (ModelState.IsValid)
            {
                if (db.Makales.Where(a => a.baslik == makale.baslik).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("bsl", "Bu başlık daha önce kullanılmış. Farklı bir başlık belirtiniz");
                    makale.Icerik = Microsoft.JScript.GlobalObject.unescape(makale.Icerik);
                    ViewBag.KategoriId = new SelectList(db.Kategoris.Where(a => db.Kategoris.Where(b => b.parentId == a.Id).FirstOrDefault() == null), "Id", "adi", makale.KategoriId);
                    makale.Icerik = Microsoft.JScript.GlobalObject.unescape(makale.Icerik);
                    return View(makale);
                }
                if (!string.IsNullOrEmpty(makale.resimi))
                {
                   
                        string nos1 = new Random().Next(100, 99999) + "-" + new Random().Next(1, 99999);
                        string converted = makale.resimi.Split(',')[1];
                        var bytes = Convert.FromBase64String(converted);
                        string idsi = nos1;
                        using (var imageFile = new FileStream(Server.MapPath("~/MakaleResimleri/" + idsi + ".jpg"), FileMode.Create))
                        {
                            imageFile.Write(bytes, 0, bytes.Length);
                            imageFile.Flush();
                        }
                        makale.resimi = nos1 + ".jpg";
                    
                }
                makale.Icerik = Microsoft.JScript.GlobalObject.unescape(makale.Icerik);
                makale.url = helper.Genel.URLFriendly(makale.baslik);
                db.Makales.Add(makale);
                db.SaveChanges();
                return RedirectToAction("makale");
            }
            makale.Icerik = Microsoft.JScript.GlobalObject.unescape(makale.Icerik);
            ViewBag.KategoriId = new SelectList(db.Kategoris.Where(a => db.Kategoris.Where(b => b.parentId == a.Id).FirstOrDefault() == null), "Id", "adi",makale.KategoriId);
            return View(makale);
        }

        // GET: Admin/Makales/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Makale makale = db.Makales.Include(a=>a.Kategori).Where(a=>a.Id==id).FirstOrDefault();
            if (makale == null)
            {
                return HttpNotFound();
            }
            ViewBag.KategoriId = new SelectList(db.Kategoris.Where(a => db.Kategoris.Where(b => b.parentId == a.Id).FirstOrDefault() == null), "Id", "adi",makale.KategoriId);
            return View(makale);
        }

        // POST: Admin/Makales/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,baslik,url,icerik,tarih,goruntuleme,aktif,resimi,aciklama,KategoriId,keywords")] Makale makale)
        {
          //  return Content(makale.resimi);
            if (ModelState.IsValid)
            {
                makale.Icerik = Microsoft.JScript.GlobalObject.unescape(makale.Icerik);
                if (db.Makales.Where(a=>a.baslik==makale.baslik && a.Id!=makale.Id).FirstOrDefault()!=null)
                {
                    ModelState.AddModelError("bsl","Bu başlık daha önce kullanılmış. Farklı bir başlık belirtiniz");
                    ViewBag.KategoriId = new SelectList(db.Kategoris.Where(a => db.Kategoris.Where(b => b.parentId == a.Id).FirstOrDefault() == null), "Id", "adi", makale.KategoriId);
                    makale.Icerik = Microsoft.JScript.GlobalObject.unescape(makale.Icerik);
                    return View(makale);
                }
                if (!string.IsNullOrEmpty(makale.resimi) && !makale.resimi.Contains(".jpg"))
                {

                    string nos1 = new Random().Next(100, 99999) + "-" + new Random().Next(1, 99999);
                    string converted = makale.resimi.Split(',')[1];
                    var bytes = Convert.FromBase64String(converted);
                    string idsi = nos1;
                    using (var imageFile = new FileStream(Server.MapPath("~/MakaleResimleri/" + idsi + ".jpg"), FileMode.Create))
                    {
                        imageFile.Write(bytes, 0, bytes.Length);
                        imageFile.Flush();
                    }
                    makale.resimi = nos1 + ".jpg";

                }
                makale.url = helper.Genel.URLFriendly(makale.baslik);
                db.Entry(makale).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("makale");
            }
            ViewBag.KategoriId = new SelectList(db.Kategoris.Where(a => db.Kategoris.Where(b => b.parentId == a.Id).FirstOrDefault() == null), "Id", "adi", makale.KategoriId);
            makale.Icerik = Microsoft.JScript.GlobalObject.unescape(makale.Icerik);
            return View(makale);
        }

     


        public ActionResult Delete(int id)
        {
            Makale makale = db.Makales.Find(id);
            db.Makales.Remove(makale);
            db.SaveChanges();
            return RedirectToAction("makale");
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
