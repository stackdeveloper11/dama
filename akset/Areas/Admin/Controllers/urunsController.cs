using akset.data;

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Runtime.CompilerServices;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using Javi.FFmpeg;
using System.ServiceModel.Configuration;
using FFmpeg.NET;
using System.Threading.Tasks;
using FFmpeg.NET.Enums;
using System.Web.Hosting;
using System.IO.Compression;

namespace akset.Areas.Admin.Controllers
{
    public class fil
    {
        public int Id { get; set; }
        public string adi { get; set; }
        public virtual List<ozl> ozls { get; set; }
    }
    public class filadtli
    {
        public int Id { get; set; }
        public string adi { get; set; }
        public bool adetlimi { get; set; }
        public virtual List<ozladtli> ozls { get; set; }
    }
    public class ozl
    {
        public int Id { get; set; }
        public string ozellik { get; set; }
        public int durum { get; set; }
    }
    public class ozladtli
    {
        public int Id { get; set; }
        public string ozellik { get; set; }
        public string durum { get; set; }
        public int adet { get; set; }

    }
    [Authorize(Roles = "Admin")]
    public class urunsController : Controller
    {
        private aksetDB db = new aksetDB();

        public urunsController()
        {
        }

        public JsonResult attachment_uploadurun()
        {
            int ınt32 = 0;
            if (ınt32 >= base.Request.Files.Count)
            {
                return base.Json("ok", JsonRequestBehavior.AllowGet);
            }
            string.Concat(base.Server.MapPath("~/urunresimleri/"), base.Request.Files[ınt32].FileName);
            string str = string.Concat((new Random()).Next(10, 99), "-", (new Random()).Next(100, 9999)).ToString();
            ImageCodecInfo ımageCodecInfo = (
                from codecInfo in (IEnumerable<ImageCodecInfo>)ImageCodecInfo.GetImageEncoders()
                where codecInfo.MimeType == "image/jpeg"
                select codecInfo).First<ImageCodecInfo>();
            using (EncoderParameters encoderParameter = new EncoderParameters(1))
            {
                Image ımage = Image.FromStream(base.Request.Files[ınt32].InputStream);
                encoderParameter.Param[0] = new EncoderParameter(Encoder.Quality, (long)50);
                ımage.Save(string.Concat(base.Server.MapPath("~/urunresimleri/"), str, ".jpg"), ımageCodecInfo, encoderParameter);
            }
            return base.Json(string.Concat(str, ".jpg"), JsonRequestBehavior.AllowGet);
        }

        public ActionResult Create()
        {
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }
            ((dynamic)base.ViewBag).KategoriId = new SelectList(categoryViewModelItemis, "Value", "Text");
            dynamic viewBag = base.ViewBag;
            DbSet<Marka> markas = this.db.Markas;
            viewBag.MarkaId = new SelectList(
                from a in markas
                orderby a.MarkaAdi
                select a, "Id", "MarkaAdi");
            return base.View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,KategoriId,MarkaId,adet,alisfiyati,UrunKodu,urunbaslik,urunadi,urunkisaaciklama,fiyat,urunozellikleri,urundetayi,urundurumu,tarih,resim,oneri,etiketler,sira,eskifiyat,satistami,adminaciklama,anasayfa,link")] akset.data.urun urun, HttpPostedFileBase file, ICollection<HttpPostedFileBase> files, string resimi)
        {
            if (ModelState.IsValid)
            {
                string str = string.Concat((new Random()).Next(100, 99999), "-", (new Random()).Next(1, 99999));
                if (string.IsNullOrEmpty(resimi))
                {
                    urun.resim = "";
                }
                else
                {
                    byte[] numArray = System.Convert.FromBase64String(resimi.Split(new char[] { ',' })[1]);
                    string str1 = str;
                    using (FileStream fileStream = new FileStream(base.Server.MapPath(string.Concat("~/urunresimleri/", str1, ".jpg")), FileMode.Create))
                    {
                        fileStream.Write(numArray, 0, (int)numArray.Length);
                        fileStream.Flush();
                    }
                    urun.resim = str;
                }
                if (!Directory.Exists(base.Server.MapPath(string.Concat("~/urunresimleri/", str))))
                {
                    Directory.CreateDirectory(base.Server.MapPath(string.Concat("~/urunresimleri/", str)));
                }
                int ınt32 = 0;
                foreach (HttpPostedFileBase httpPostedFileBase in files)
                {
                    if (httpPostedFileBase == null || httpPostedFileBase.ContentLength <= 0)
                    {
                        continue;
                    }
                    ınt32++;
                    httpPostedFileBase.SaveAs(base.Server.MapPath(string.Concat(new object[] { "~/urunresimleri/", str, "/", str, "-", ınt32, Path.GetExtension(httpPostedFileBase.FileName) })));
                }
                if (!string.IsNullOrEmpty(urun.urundetayi))
                {
                    urun.urundetayi = Microsoft.JScript.GlobalObject.unescape(urun.urundetayi);
                }
                this.db.uruns.Add(urun);
                this.db.SaveChanges();
                return RedirectToAction("urun");
            }
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }
            ((dynamic)ViewBag).KategoriId = new SelectList(categoryViewModelItemis, "Value", "Text", (object)urun.KategoriId);

            return View(urun);
        }

        public ActionResult Delete(int id)
        {
            var urunadetozellik = db.urunadetozelliks.Where(a => a.urunId == id).ToList();
            foreach (var item in urunadetozellik)
            {
                db.urunadetozelliks.Remove(item);
                db.SaveChanges();
            }
            urun _urun = this.db.uruns.Find(new object[] { id });
            this.db.uruns.Remove(_urun);
            this.db.SaveChanges();
            //Array.ForEach(Directory.GetFiles(Server.MapPath("~/urunresimleri/") + _urun.resim), delegate (string path) { System.IO.File.Delete(path); });
            //if (Directory.Exists(Server.MapPath("~/urunresimleri/") + _urun.resim))
            //{
            //    Directory.Delete(Server.MapPath("~/urunresimleri/") + _urun.resim);
            //}

            return base.RedirectToAction("urun");
        }
        public async Task<JsonResult> Dosyalaricek()
        {
            string hh = "";
            int gg = 0;
            string[] filePaths = Directory.GetFiles(Server.MapPath("~/videotemp"), "*.mp4");
            foreach (var item in filePaths)
            {
                gg++;
                var inputFile = new MediaFile(item);
                var outputFile = new MediaFile(HostingEnvironment.MapPath("~/outtemp/" + gg + ".mp4"));
                var ffmpeg = new Engine(HostingEnvironment.MapPath("~/ffmpeg.exe"));
                var options = new ConversionOptions();
                options.VideoFps = 23;
                options.AudioBitRate = 0;
                options.VideoBitRate = 1000;
                options.MaxVideoDuration = TimeSpan.FromSeconds(12);
                options.VideoAspectRatio = VideoAspectRatio.Default;
                options.AudioSampleRate = AudioSampleRate.Default;
                await ffmpeg.ConvertAsync(inputFile, outputFile, options);
            }
            string startPath = HostingEnvironment.MapPath("~/outtemp/");
            string zipPath = HostingEnvironment.MapPath("~/sonuc.zip");
            ZipFile.CreateFromDirectory(startPath, zipPath);
            //   ZipFile.ExtractToDirectory(zipPath, extractPath);
            return Json(zipPath, JsonRequestBehavior.AllowGet);
        }
        public JsonResult filitregetir(int id)
        {
            List<katefilo> _urun = db.katefilos.Include(a => a.filitre).Include(a => a.filitre.ozelliks).Where(a => a.KategoriId == id).ToList();
            List<filadtli> flt = new List<filadtli>();

            foreach (var item in _urun.ToList())
            {
                filadtli ddd = new filadtli();
                ddd.adi = item.filitre.adi;
                ddd.adetlimi = item.filitre.adetlimi;
                ddd.Id = item.filitreId;
                List<ozladtli> gg = new List<ozladtli>();
                foreach (var itemi in item.filitre.ozelliks)
                {
                    ozladtli ff = new ozladtli();
                    ff.Id = itemi.Id;
                    ff.ozellik = itemi.adi;
                    ff.adet = 0;
                    ff.durum = "false";
                    gg.Add(ff);
                }
                ddd.ozls = gg;
                flt.Add(ddd);
            }

            //string json = JsonConvert.SerializeObject(flt.ToList(), Formatting.Indented);
            return base.Json(flt, JsonRequestBehavior.AllowGet);
        }
        public JsonResult filitregetir2(int id, int urnid)
        {
            List<katefilo> _urun = db.katefilos.Include(a => a.filitre).Include(a => a.filitre.ozelliks).Where(a => a.KategoriId == id).ToList();
            List<filadtli> flt = new List<filadtli>();

            foreach (var item in _urun.ToList())
            {
                filadtli ddd = new filadtli();
                ddd.adi = item.filitre.adi;
                ddd.adetlimi = item.filitre.adetlimi;
                ddd.Id = item.filitreId;
                List<ozladtli> gg = new List<ozladtli>();
                foreach (var itemi in item.filitre.ozelliks)
                {
                    ozladtli ff = new ozladtli();
                    ff.Id = itemi.Id;
                    ff.ozellik = itemi.adi;
                    ff.adet = db.urunadetozelliks.Where(a => a.ozellikId == itemi.Id && a.urunId == urnid).FirstOrDefault() != null ? db.urunadetozelliks.Where(a => a.ozellikId == itemi.Id && a.urunId == urnid).FirstOrDefault().adet : 0;
                    ff.durum = db.urunadetozelliks.Where(a => a.ozellikId == itemi.Id && a.urunId == urnid).FirstOrDefault() != null ? db.urunadetozelliks.Where(a => a.ozellikId == itemi.Id && a.urunId == urnid).FirstOrDefault().durum : "false";
                    gg.Add(ff);
                }
                ddd.ozls = gg;
                flt.Add(ddd);
            }

            //string json = JsonConvert.SerializeObject(flt.ToList(), Formatting.Indented);
            return base.Json(flt, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ozellikgetir(int id)
        {
            List<ozellik> _urun = this.db.ozelliks.Where(a => a.filitreId == id).ToList();

            return base.Json(_urun, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Details(int? id)
        {
            if (!id.HasValue)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            urun _urun = this.db.uruns.Find(new object[] { id });

            if (_urun == null)
            {
                return base.HttpNotFound();
            }
            return base.View(_urun);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this.db.Dispose();
            }
            base.Dispose(disposing);
        }
        public ActionResult resimekle()
        {
            return View();
        }
        public bool resokmi(List<HttpPostedFileBase> files)
        {
            bool fls = true;
            foreach (HttpPostedFileBase httpPostedFileBase in files)
            {
                if (httpPostedFileBase == null || httpPostedFileBase.ContentLength <= 0)
                {
                    fls = false;
                }
            }
            return fls;
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult resimekle(List<HttpPostedFileBase> files)
        {
            string str = new Random().Next(1000, 5000) + "-" + new Random().Next(5000, 9999);
            int length = 0;
            if (resokmi(files))
            {
                foreach (HttpPostedFileBase httpPostedFileBase in files)
                {
                    string ne = "";
                    switch (ne)
                    {
                        case "1":
                            ne = "v1-";
                            length = 1;
                            break;
                        case "2":
                            ne = "v2-";
                            length = 2;
                            break;
                        case "3":
                            ne = "kpk-";
                            length = 3;
                            break;
                    }
                    httpPostedFileBase.SaveAs(base.Server.MapPath(string.Concat(new object[] { "~/urunresimleri/", ne, str, "/", str, "-", length, Path.GetExtension(httpPostedFileBase.FileName) })));
                }
            }
            return View();
        }
        public ActionResult wizardurumedit(int? id)
        {
            if (!id.HasValue)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            urun _urun = db.uruns.Include(a => a.urunfilitreozelliks).Where(a => a.Id == id).FirstOrDefault();
            if (_urun == null)
            {
                return base.HttpNotFound();
            }
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }
            ((dynamic)base.ViewBag).KategoriId = new SelectList(categoryViewModelItemis, "Value", "Text", (object)_urun.KategoriId);

            //ViewBag.fltsi = flt;
            return base.View(_urun);
        }
        public ActionResult Edit(int? id)
        {
            if (!id.HasValue)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            urun _urun = db.uruns.Include(a => a.urunfilitreozelliks).Where(a => a.Id == id).FirstOrDefault();
            if (_urun == null)
            {
                return base.HttpNotFound();
            }
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }
            ((dynamic)base.ViewBag).KategoriId = new SelectList(categoryViewModelItemis, "Value", "Text", (object)_urun.KategoriId);

            List<filitre> flt = new List<filitre>();
            flt.Add(new filitre { adi = "Seçim Yapınız", Id = 0 });
            foreach (var item in db.katefilos.Include(a => a.filitre).Where(a => a.KategoriId == _urun.KategoriId).ToList())
            {
                filitre fllt = new filitre();
                fllt.adi = item.filitre.adi;
                fllt.Id = item.filitre.Id;
                fllt.multi = item.filitre.multi;
                fllt.ozelliks = item.filitre.ozelliks;
                flt.Add(fllt);
            }
            ViewBag.FilitreId = new SelectList(flt.ToList(), "Id", "adi");
            //ViewBag.fltsi = flt;
            return base.View(_urun);
        }
        public static Image ResizeImage(Image image, Size size, bool preserveAspectRatio = true)
        {
            int newWidth;
            int newHeight;
            if (preserveAspectRatio)
            {
                int originalWidth = image.Width;
                int originalHeight = image.Height;
                float percentWidth = (float)size.Width / (float)originalWidth;
                float percentHeight = (float)size.Height / (float)originalHeight;
                float percent = percentHeight < percentWidth ? percentHeight : percentWidth;
                newWidth = (int)(originalWidth * percent);
                newHeight = (int)(originalHeight * percent);
            }
            else
            {
                newWidth = size.Width;
                newHeight = size.Height;
            }
            Image newImage = new Bitmap(newWidth, newHeight);
            using (Graphics graphicsHandle = Graphics.FromImage(newImage))
            {
                //graphicsHandle.InterpolationMode = InterpolationMode.HighQualityBicubic;
                //graphicsHandle.SmoothingMode = SmoothingMode.HighQuality;
                //graphicsHandle.CompositingQuality = CompositingQuality.HighQuality;
                // 

                graphicsHandle.InterpolationMode = InterpolationMode.HighQualityBicubic;// System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                graphicsHandle.DrawImage(image, 0, 0, newWidth, newHeight);
            }
            return newImage;
        }
        [HttpGet]
        public JsonResult sifirlah(int id)
        {

            var urun = db.uruns.Where(a => a.Id == id).FirstOrDefault();
            string directorisi = urun.resim;

            string[] filePaths = Directory.GetFiles(Server.MapPath("~/urunresimleri/") + directorisi);
            foreach (string filePath in filePaths)
            {
                if (filePath.Contains(".jpg") || filePath.Contains(".jpeg"))
                {
                    Image image2 = Image.FromFile(filePath);
                    image2.Dispose();
                    System.IO.File.Delete(filePath);  // works
                }
                else
                {
                    System.IO.File.Delete(filePath);
                }
            }

            //if (Directory.Exists(Server.MapPath("~/urunresimleri/") + directorisi))
            //{
            //    Directory.Delete(Server.MapPath("~/urunresimleri/") + directorisi);
            //}

            if (!Directory.Exists(base.Server.MapPath(string.Concat("~/urunresimleri/", directorisi))))
            {
                Directory.CreateDirectory(base.Server.MapPath(string.Concat("~/urunresimleri/", directorisi)));
            }



            return Json("sifirok", JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult resimlerial(resvid resvid)
        {

            string ne = resvid.ne;
            string nere = resvid.nere;
            string data = resvid.data;
            int id = resvid.id;

            var urun = db.uruns.Where(a => a.Id == id).FirstOrDefault();
            string directorisi = urun.resim;

            int fileCount = Directory.GetFiles(Server.MapPath("~/urunresimleri/" + directorisi + "/"), "*.*", SearchOption.AllDirectories).Length;
            string dsyadi = "";
            if (ne == "resim")
            {
                if (nere == "v1")
                {
                    dsyadi = "v1-" + directorisi + "-" + fileCount;
                }
                if (nere == "v2")
                {
                    dsyadi = "v2-" + directorisi + "-" + fileCount;
                }
                if (nere == "kpk")
                {
                    dsyadi = "kpk-" + directorisi + "-" + fileCount;
                }
                if (nere != "kpk" && nere != "v1" && nere != "v2")
                {
                    dsyadi = directorisi + "-" + fileCount;
                }
            }
            else
            {
                //video
                if (nere == "v1")
                {
                    dsyadi = "v1-" + directorisi + "-" + fileCount;
                }
                if (nere == "v2")
                {
                    dsyadi = "v2-" + directorisi + "-" + fileCount;
                }
                if (nere == "kpk")
                {
                    dsyadi = "kpk-" + directorisi + "-" + fileCount;
                }
                if (nere != "kpk" && nere != "v1" && nere != "v2")
                {
                    dsyadi = directorisi + "-" + fileCount;
                }
            }
            //data.Contains("/jpeg") || data.Contains("/jpg")
            if (data.Contains("data:image/jpeg;base64") || data.Contains("data:image/jpg;base64"))
            {
                //     dsyadi += dsyadi + "-" + fileCount + ".jpg";
                byte[] numArray = Convert.FromBase64String(data.Replace("data:image/jpeg;base64,", "").Replace("data:image/jpg;base64,", ""));
                string imageFilePath = Server.MapPath(string.Concat("~/urunresimleri/", directorisi, "/", dsyadi, ".jpg"));
                Stream stream = new MemoryStream(numArray);
                Bitmap bitmap = (Bitmap)Image.FromStream(stream);
                Bitmap gfff = new Bitmap(bitmap);
                bitmap.Save(imageFilePath);
            }
            else
            {
              //  dsyadi += dsyadi + "-" + fileCount;
                string base64data = data.ToString().Replace("data:video/mp4;base64,", "");
                byte[] ret = Convert.FromBase64String(base64data);
                System.IO.File.WriteAllBytes(Server.MapPath("~/urunresimleri/") + directorisi + "/" + dsyadi + ".mp4", ret);
            }
            return Json("bitti", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult wizardurumedit([Bind(Include = "Id,KategoriId,adet,alisfiyati,UrunKodu,urunbaslik,urunadi,urunkisaaciklama,fiyat,urunozellikleri,urundetayi,urundurumu,tarih,resim,oneri,etiketler,sira,eskifiyat,satistami,adminaciklama,anasayfa,link")] urun urun, List<HttpPostedFileBase> files, string v1, string v2, string kpk, string imgexz = "", string chkler = "")
        {
            if (ModelState.IsValid)
            {
                if (db.uruns.Where(a => a.UrunKodu == urun.UrunKodu && a.Id != urun.Id).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "BU ÜRÜN KODU DAHA ÖNCE KULLANILMIŞTIR!...");
                    List<CategoryViewModelItemi> categoryViewModelItemisH = new List<CategoryViewModelItemi>();
                    List<Kategori> listH = (
                        from a in this.db.Kategoris
                        orderby a.sira
                        select a).ToList<Kategori>();
                    foreach (Kategori kategori in
                        from a in (
                            from c in listH
                            where !c.parentId.HasValue
                            select c).ToList<Kategori>()
                        orderby a.sira
                        select a)
                    {
                        categoryViewModelItemisH.Add(new CategoryViewModelItemi()
                        {
                            Value = kategori.Id,
                            Text = kategori.adi
                        });
                        this.GetSubTree(listH, kategori, categoryViewModelItemisH, kategori.Id);
                    }

                    //List<CategoryViewModelItemi> sonH = new List<CategoryViewModelItemi>();
                    //foreach (var item in categoryViewModelItemisH)
                    //{
                    //    if (Regex.Matches(item.Text, ">>").Count == 2)
                    //    {
                    //        sonH.Add(item);
                    //    }
                    //}
                    urun.urundetayi = Microsoft.JScript.GlobalObject.unescape(urun.urundetayi);
                    ((dynamic)base.ViewBag).KategoriId = new SelectList(categoryViewModelItemisH, "Value", "Text", urun.KategoriId);
                    return View(urun);
                }


                urun.urundetayi = Microsoft.JScript.GlobalObject.unescape(urun.urundetayi);
                db.Entry(urun).State = EntityState.Modified;
                db.SaveChanges();
                if (chkler != "")
                {
                    foreach (var itemii in db.urunadetozelliks.Where(a => a.urunId == urun.Id))
                    {
                        db.urunadetozelliks.Remove(itemii);
                    }
                    db.SaveChanges();
                    string[] chkleri = chkler.Split(',');
                    foreach (var item in chkleri)
                    {
                        string[] itemi = item.Split('-');
                        string durum = itemi[0].ToString();
                        string pilitre = itemi[1].ToString();
                        string pzellik = itemi[2].ToString();
                        int adet = 0;

                        if (!string.IsNullOrEmpty(itemi[3].ToString().Replace("undefined", "")))
                        {
                            adet = Convert.ToInt32(itemi[3].ToString());
                        }

                        urunadetozellik uao = new urunadetozellik();
                        string drm = "false";
                        if (adet != 0 && !string.IsNullOrEmpty(adet.ToString()))
                        {
                            drm = "true";
                        }
                        if (durum == "true")
                        {
                            drm = "true";
                        }
                        if (drm == "true")
                        {
                            uao.durum = drm;
                            uao.filitreId = System.Convert.ToInt32(pilitre);
                            uao.ozellikId = System.Convert.ToInt32(pzellik);
                            uao.urunId = urun.Id;
                            uao.adet = adet;
                            db.urunadetozelliks.Add(uao);
                        }
                    }
                    db.SaveChanges();
                }
                else
                {
                    foreach (var itemii in db.urunadetozelliks.Where(a => a.urunId == urun.Id))
                    {
                        db.urunadetozelliks.Remove(itemii);
                    }
                    db.SaveChanges();
                }




                //int pFrom = lines[0].IndexOf("[", StringComparison.Ordinal).ToString().Length;
                //int pTo = lines[0].LastIndexOf("]", StringComparison.Ordinal);
                //String result = lines[0].Substring(pFrom, pTo - pFrom);
                //string[] ayirmali = Regex.Split(lines[0], "{ahmet}");
                //string res = ayirmali[1].ToString().Split(new char[] { ',' })[1];
                //byte[] numArray = Convert.FromBase64String(res);
                //string str1 = str;
                //using (FileStream fileStream = new FileStream(base.Server.MapPath(string.Concat("~/urunresimleri/", str, "/", str1, ".jpg")), FileMode.Create))
                //{
                //    fileStream.Write(numArray, 0, (int)numArray.Length);
                //    fileStream.Flush();
                //}

                return RedirectToAction("wizardurumedit", new { Id = urun.Id });
            }
            else
            {
                var message = string.Join(" | ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                urun.urundetayi = Microsoft.JScript.GlobalObject.unescape(urun.urundetayi);
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, message);
            }

            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }

            List<CategoryViewModelItemi> son = new List<CategoryViewModelItemi>();
            foreach (var item in categoryViewModelItemis)
            {
                if (Regex.Matches(item.Text, ">>").Count == 2)
                {
                    son.Add(item);
                }
            }

        ((dynamic)base.ViewBag).KategoriId = new SelectList(son, "Value", "Text", urun.KategoriId);
            urun.urundetayi = Microsoft.JScript.GlobalObject.unescape(urun.urundetayi);
            return View();
        }
        //Image to byte[]   
        public static byte[] BitmapToBytes(Bitmap Bitmap)
        {
            MemoryStream ms = null;
            try
            {
                ms = new MemoryStream();
                Bitmap.Save(ms, Bitmap.RawFormat);
                byte[] byteImage = new Byte[ms.Length];
                byteImage = ms.ToArray();
                return byteImage;
            }
            catch (ArgumentNullException ex)
            {
                throw ex;
            }
            finally
            {
                ms.Close();
            }
        }

        public static Bitmap WatermarkImage(Bitmap image, Bitmap watermark)
        {
            //  string firstText              = "selmahanim.com";
            //   PointF firstLocation          = new PointF(((image.Width - watermark.Width) / 2) - 90, (image.Height) - 150);
            //   Font arialFont                = new Font("Arial", 18, FontStyle.Bold, GraphicsUnit.Pixel);
            using (Graphics imageGraphics = Graphics.FromImage(image))
            {
                watermark.SetResolution(imageGraphics.DpiX, imageGraphics.DpiY);
                int x = 10; //((image.Width - watermark.Width) / 2);
                int y = (image.Height) - 80;
                //imageGraphics.SmoothingMode     = SmoothingMode.AntiAlias;
                //imageGraphics.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;
                //imageGraphics.InterpolationMode = InterpolationMode.High;
                //  imageGraphics.DrawString(firstText, arialFont, Brushes.Black, firstLocation);
                imageGraphics.DrawImage(watermark, x, y, watermark.Width, watermark.Height);
            }
            return image;
        }
        public ActionResult vidolar(int? id)
        {
            ViewBag.ok = "yok";
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> vidolar(List<HttpPostedFileBase> files)
        {

            DirectoryInfo di = new DirectoryInfo(Server.MapPath("~/Videotemp/"));
            DirectoryInfo di2 = new DirectoryInfo(Server.MapPath("~/dosyalar/"));
            DirectoryInfo di3 = new DirectoryInfo(Server.MapPath("~/outtemp/"));
            foreach (FileInfo file in di.GetFiles())
            {
                file.Delete();
            }
            foreach (FileInfo file in di2.GetFiles())
            {
                file.Delete();
            }
            foreach (FileInfo file in di3.GetFiles())
            {
                file.Delete();
            }
            foreach (DirectoryInfo dir in di.GetDirectories())
            {
                dir.Delete(true);
            }

            int rr = 0;
            foreach (HttpPostedFileBase httpPostedFileBase in files)
            {
                if (httpPostedFileBase == null || httpPostedFileBase.ContentLength <= 0)
                {
                    continue;
                }
                rr++;
                httpPostedFileBase.SaveAs(base.Server.MapPath(string.Concat(new object[] { "~/videotemp/", rr, Path.GetExtension(httpPostedFileBase.FileName) })));
            }
            string hh = "";
            int gg = 0;
            string[] filePaths = Directory.GetFiles(Server.MapPath("~/videotemp"), "*.mp4");
            foreach (var item in filePaths)
            {
                gg++;
                var inputFile = new MediaFile(item);
                var outputFile = new MediaFile(HostingEnvironment.MapPath("~/outtemp/" + gg + ".mp4"));
                var ffmpeg = new Engine(HostingEnvironment.MapPath("~/ffmpeg.exe"));
                var options = new ConversionOptions();
                options.VideoFps = 23;
                options.AudioBitRate = 0;
                options.VideoBitRate = 1000;
                options.MaxVideoDuration = TimeSpan.FromSeconds(12);
                options.VideoAspectRatio = VideoAspectRatio.Default;
                options.AudioSampleRate = AudioSampleRate.Default;
                await ffmpeg.ConvertAsync(inputFile, outputFile, options);
            }
            string startPath = HostingEnvironment.MapPath("~/outtemp/");
            string dadi = "/dosyalar/sonuc" + new Random().Next(1, 99999) + ".zip";
            string zipPath = HostingEnvironment.MapPath("~" + dadi);
            ZipFile.CreateFromDirectory(startPath, zipPath);
            ViewBag.ok = dadi;
            return View("vidolar");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult wizardurum([Bind(Include = "Id,KategoriId,adet,alisfiyati,UrunKodu,urunbaslik,urunadi,urunkisaaciklama,fiyat,urunozellikleri,urundetayi,urundurumu,tarih,resim,oneri,etiketler,sira,eskifiyat,satistami,adminaciklama,link,anasayfa")] urun urun, List<HttpPostedFileBase> files, string v1, string v2, string kpk, string imgexz = "", string chkler = "")
        {
            if (ModelState.IsValid)
            {
                if (db.uruns.Where(a => a.UrunKodu == urun.UrunKodu).FirstOrDefault() != null)
                {
                    ModelState.AddModelError("", "BU ÜRÜN KODU DAHA ÖNCE KULLANILMIŞTIR!...");
                    List<CategoryViewModelItemi> categoryViewModelItemisH = new List<CategoryViewModelItemi>();
                    List<Kategori> listH = (
                        from a in this.db.Kategoris
                        orderby a.sira
                        select a).ToList<Kategori>();
                    foreach (Kategori kategori in from a in (from c in listH where !c.parentId.HasValue select c).ToList<Kategori>() orderby a.sira select a)
                    {
                        categoryViewModelItemisH.Add(new CategoryViewModelItemi()
                        {
                            Value = kategori.Id,
                            Text = kategori.adi
                        });
                        this.GetSubTree(listH, kategori, categoryViewModelItemisH, kategori.Id);
                    }

                    //List<CategoryViewModelItemi> sonH = new List<CategoryViewModelItemi>();
                    //foreach (var item in categoryViewModelItemisH)
                    //{
                    //    if (Regex.Matches(item.Text, ">>").Count == 2)
                    //    {
                    //        sonH.Add(item);
                    //    }
                    //}

                    ((dynamic)base.ViewBag).KategoriId = new SelectList(categoryViewModelItemisH, "Value", "Text", urun.KategoriId);
                    return View(urun);
                }
                string str = string.Concat((new Random()).Next(100, 99999), "-", (new Random()).Next(1, 99999));
                urun.resim = str;
                urun.urundetayi = Microsoft.JScript.GlobalObject.unescape(urun.urundetayi);
                db.uruns.Add(urun);
                db.SaveChanges();
                if (chkler != "")
                {
                    string[] chkleri = chkler.Split(',');
                    foreach (var item in chkleri)
                    {
                        string[] itemi = item.Split('-');
                        string durum = itemi[0].ToString();
                        string pilitre = itemi[1].ToString();
                        string pzellik = itemi[2].ToString();
                        int adet = 0;

                        if (!string.IsNullOrEmpty(itemi[3].ToString().Replace("undefined", "")))
                        {
                            adet = Convert.ToInt32(itemi[3].ToString());
                        }

                        urunadetozellik uao = new urunadetozellik();
                        string drm = "false";
                        if (adet != 0 && !string.IsNullOrEmpty(adet.ToString()))
                        {
                            drm = "true";
                        }
                        if (durum == "true")
                        {
                            drm = "true";
                        }
                        if (drm == "true")
                        {
                            uao.durum = drm;
                            uao.filitreId = System.Convert.ToInt32(pilitre);
                            uao.ozellikId = System.Convert.ToInt32(pzellik);
                            uao.urunId = urun.Id;
                            uao.adet = adet;
                            db.urunadetozelliks.Add(uao);
                        }

                    }
                }
                db.SaveChanges();
                if (!Directory.Exists(base.Server.MapPath(string.Concat("~/urunresimleri/", str))))
                {
                    Directory.CreateDirectory(base.Server.MapPath(string.Concat("~/urunresimleri/", str)));
                }
                string[] lines = Regex.Split(imgexz, "ayirbuber");
                //int pFrom = lines[0].IndexOf("[", StringComparison.Ordinal).ToString().Length;
                //int pTo = lines[0].LastIndexOf("]", StringComparison.Ordinal);
                //String result = lines[0].Substring(pFrom, pTo - pFrom);
                //string[] ayirmali = Regex.Split(lines[0], "{ahmet}");
                //string res = ayirmali[1].ToString().Split(new char[] { ',' })[1];
                //byte[] numArray = Convert.FromBase64String(res);
                //string str1 = str;
                //using (FileStream fileStream = new FileStream(base.Server.MapPath(string.Concat("~/urunresimleri/", str, "/", str1, ".jpg")), FileMode.Create))
                //{
                //    fileStream.Write(numArray, 0, (int)numArray.Length);
                //    fileStream.Flush();
                //}
                int rr = 0;
                if (lines != null && lines[0] != "" && lines.Length > 0)
                {
                    foreach (var item in lines)
                    {
                        rr++;
                        int pFrom = item.IndexOf("[", StringComparison.Ordinal).ToString().Length;
                        int pTo = item.LastIndexOf("]", StringComparison.Ordinal);
                        String result = item.Substring(pFrom, pTo - pFrom);
                        string[] ayirmali = Regex.Split(item, "{ahmet}");
                        string res = ayirmali[1].ToString().Split(new char[] { ',' })[1];
                        byte[] numArray = Convert.FromBase64String(res);
                        string str1 = str;
                        string hhh = ayirmali[0].ToString().Replace("f-", "").Replace("[", "").Replace("]", "");

                        if (hhh == v1)
                        {
                            str1 = "v1-" + str1;
                        }
                        if (hhh == v2)
                        {
                            str1 = "v2-" + str1;
                        }

                        if (hhh == kpk)
                        {
                            str1 = "kpk-" + str1;
                        }

                        if (ayirmali[1].ToString().Contains("video/mp4"))
                        {
                            string base64data = ayirmali[1].ToString().Replace("data:video/mp4;base64,", "");
                            byte[] ret = Convert.FromBase64String(base64data);
                            System.IO.File.WriteAllBytes(Server.MapPath("~/urunresimleri/") + str + "/" + str1 + "-" + rr + ".mp4", ret);
                        }
                        else
                        {
                            string imageFilePath = Server.MapPath(string.Concat("~/urunresimleri/", urun.resim, "/", str1 + "-" + rr, ".jpg"));
                            Stream stream = new MemoryStream(numArray);

                            Bitmap bitmap = (Bitmap)Image.FromStream(stream);
                            bitmap.Save(imageFilePath);
                        }
                    }
                }
                return RedirectToAction("wizardurum");
            }
            else
            {
                List<CategoryViewModelItemi> categoryViewModelItemisp = new List<CategoryViewModelItemi>();
                List<Kategori> listp = (
                    from a in this.db.Kategoris
                    orderby a.sira
                    select a).ToList<Kategori>();
                foreach (Kategori kategori in
                    from a in (
                        from c in listp
                        where !c.parentId.HasValue
                        select c).ToList<Kategori>()
                    orderby a.sira
                    select a)
                {
                    categoryViewModelItemisp.Add(new CategoryViewModelItemi()
                    {
                        Value = kategori.Id,
                        Text = kategori.adi
                    });
                    this.GetSubTree(listp, kategori, categoryViewModelItemisp, kategori.Id);
                }

                List<CategoryViewModelItemi> sonp = new List<CategoryViewModelItemi>();
                foreach (var item in categoryViewModelItemisp)
                {
                    if (Regex.Matches(item.Text, ">>").Count == 2)
                    {
                        sonp.Add(item);
                    }
                }

            ((dynamic)base.ViewBag).KategoriId = new SelectList(sonp, "Value", "Text", urun.KategoriId);
                return View(urun);
            }
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }
            List<CategoryViewModelItemi> son = new List<CategoryViewModelItemi>();
            foreach (var item in categoryViewModelItemis)
            {
                if (Regex.Matches(item.Text, ">>").Count == 2)
                {
                    son.Add(item);
                }
            }
            ((dynamic)base.ViewBag).KategoriId = new SelectList(son, "Value", "Text", urun.KategoriId);
            return View(urun);
        }

        public ActionResult wizardurum()
        {
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }

            //List<CategoryViewModelItemi> son = new List<CategoryViewModelItemi>();
            //foreach (var item in categoryViewModelItemis)
            //{
            //    if (Regex.Matches(item.Text, ">>").Count == 2)
            //    {
            //        son.Add(item);
            //    }
            //}

            ((dynamic)base.ViewBag).KategoriId = new SelectList(categoryViewModelItemis, "Value", "Text");
            dynamic viewBag = base.ViewBag;
            DbSet<Marka> markas = this.db.Markas;
            viewBag.MarkaId = new SelectList(
                from a in markas
                orderby a.MarkaAdi
                select a, "Id", "MarkaAdi");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,KategoriId,MarkaId,adet,alisfiyati,UrunKodu,urunbaslik,urunadi,urunkisaaciklama,fiyat,urunozellikleri,urundetayi,urundurumu,tarih,resim,oneri,etiketler,sira,eskifiyat,satistami,adminaciklama,anasayfa,link")] akset.data.urun urun, HttpPostedFileBase file, List<HttpPostedFileBase> files, string katler, string resimi = "")
        {
            if (ModelState.IsValid)
            {
                string str = urun.resim;
                if (!string.IsNullOrEmpty(resimi))
                {
                    byte[] numArray = System.Convert.FromBase64String(resimi.Split(new char[] { ',' })[1]);
                    string str1 = str;
                    using (FileStream fileStream = new FileStream(base.Server.MapPath(string.Concat("~/urunresimleri/", str1, ".jpg")), FileMode.Create))
                    {
                        fileStream.Write(numArray, 0, (int)numArray.Length);
                        fileStream.Flush();
                    }
                    urun.resim = str;
                }
                if (!Directory.Exists(base.Server.MapPath(string.Concat("~/urunresimleri/", str))))
                {
                    Directory.CreateDirectory(base.Server.MapPath(string.Concat("~/urunresimleri/", str)));
                }
                int length = (int)Directory.GetFiles(base.Server.MapPath(string.Concat("~/urunresimleri/", str)), "*.*", SearchOption.AllDirectories).Length;
                foreach (HttpPostedFileBase httpPostedFileBase in files)
                {
                    if (httpPostedFileBase == null || httpPostedFileBase.ContentLength <= 0)
                    {
                        continue;
                    }
                    length++;
                    httpPostedFileBase.SaveAs(base.Server.MapPath(string.Concat(new object[] { "~/urunresimleri/", str, "/", str, "-", length, Path.GetExtension(httpPostedFileBase.FileName) })));
                }
                if (!string.IsNullOrEmpty(urun.urundetayi))
                {
                    urun.urundetayi = Microsoft.JScript.GlobalObject.unescape(urun.urundetayi);
                }
                this.db.Entry<akset.data.urun>(urun).State = EntityState.Modified;
                this.db.SaveChanges();
                (
                    from a in this.db.uruns
                    where a.Id == urun.Id
                    select a).FirstOrDefault<akset.data.urun>();
                return base.RedirectToAction("urun");
            }
            List<CategoryViewModelItemi> categoryViewModelItemis = new List<CategoryViewModelItemi>();
            List<Kategori> list = (
                from a in this.db.Kategoris
                orderby a.sira
                select a).ToList<Kategori>();
            foreach (Kategori kategori in
                from a in (
                    from c in list
                    where !c.parentId.HasValue
                    select c).ToList<Kategori>()
                orderby a.sira
                select a)
            {
                categoryViewModelItemis.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = kategori.adi
                });
                this.GetSubTree(list, kategori, categoryViewModelItemis, kategori.Id);
            }
            ((dynamic)base.ViewBag).KategoriId = new SelectList(categoryViewModelItemis, "Value", "Text", (object)urun.KategoriId);

            List<filitre> flt = new List<filitre>();
            foreach (var item in db.katefilos.Include(a => a.filitre).Where(a => a.KategoriId == urun.KategoriId).ToList())
            {
                filitre fllt = new filitre();
                fllt.adi = item.filitre.adi;
                fllt.Id = item.filitre.Id;
                fllt.multi = item.filitre.multi;
                fllt.ozelliks = item.filitre.ozelliks;
                flt.Add(fllt);
            }
            ViewBag.FilitreId = new SelectList(flt.ToList(), "Id", "adi");
            return base.View(urun);
        }

        private void GetSubTree(IList<Kategori> allCats, Kategori parent, IList<CategoryViewModelItemi> items, int prt)
        {
            foreach (Kategori kategori in allCats.Where<Kategori>((Kategori c) =>
            {
                int? nullable = c.parentId;
                int ınt32 = prt;
                if (nullable.GetValueOrDefault() != ınt32)
                {
                    return false;
                }
                return nullable.HasValue;
            }))
            {
                items.Add(new CategoryViewModelItemi()
                {
                    Value = kategori.Id,
                    Text = string.Concat((parent.parent != null ? string.Concat(parent.parent.adi, " >> ") : ""), parent.adi, " >> ", kategori.adi)
                });
                this.GetSubTree(allCats, kategori, items, kategori.Id);
            }
        }
        public JsonResult urunkodukullanidsiz(string kod, int Id)
        {
            var rrr = db.uruns.Where(a => a.Id != Id && a.UrunKodu == kod).FirstOrDefault();
            if (rrr != null)
            {
                return Json("notok", JsonRequestBehavior.AllowGet);
            }
            return Json("ok", JsonRequestBehavior.AllowGet);
        }
        public JsonResult urunkodukullan(string kod)
        {
            var rrr = db.uruns.Where(a => a.UrunKodu == kod).FirstOrDefault();
            if (rrr != null)
            {
                return Json("notok", JsonRequestBehavior.AllowGet);
            }
            return Json("ok", JsonRequestBehavior.AllowGet);
        }
        public JsonResult silkatefilo(int kat, int fil, int urn)
        {
            var katfilozl = db.urunfilitreozelliks.Where(a => a.urunId == urn && a.filitreId == fil).ToList();
            foreach (var item in katfilozl)
            {
                db.urunfilitreozelliks.Remove(item);
                db.SaveChanges();
            }
            return base.Json("ok", JsonRequestBehavior.AllowGet);
        }
        public JsonResult ozlayar(bool drm, int fil, int ozl, int urn)
        {
            if (!drm)
            {
                var urnozlfil = db.urunfilitreozelliks.Where(a => a.filitreId == fil && a.ozellikId == ozl && a.urunId == urn).ToList();
                foreach (var item in urnozlfil)
                {
                    db.urunfilitreozelliks.Remove(item);
                    db.SaveChanges();
                }
            }
            else
            {
                var user = User.Identity.GetUserId();
                var uuu = new urunfilitreozellik();
                uuu.degeri = -1;
                uuu.filitreId = fil;
                uuu.ozellikId = ozl;
                uuu.urunId = urn;
                uuu.UserId = user;
                db.urunfilitreozelliks.Add(uuu);
                db.SaveChanges();
            }
            return base.Json("ok", JsonRequestBehavior.AllowGet);
        }
        public JsonResult resimsil(string name)
        {
            System.IO.File.Delete(base.Server.MapPath(string.Concat("~/urunresimleri/", name.Substring(0, name.LastIndexOf("-", StringComparison.Ordinal)), "/", name)));
            return base.Json("ok", JsonRequestBehavior.AllowGet);
        }

        public ActionResult urun()
        {
            return base.View(QueryableExtensions.Include<urun, List<yorum>>(this.db.uruns, (urun a) => a.yorums).ToList<urun>());
        }
    }
}