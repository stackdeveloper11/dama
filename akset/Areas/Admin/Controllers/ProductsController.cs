using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http.Results;
using System.Web.Mvc;
using akset.data;
using akset.ViewModel;

namespace akset.Areas.Admin.Controllers
{
    public class ProductsController : Controller
    {
        private aksetDB db = new aksetDB();
        private List<ProductListViewModel> LoadDataYetkinliks()
        {
            List<ProductListViewModel> lst = db.Products.Include(a => a.User).Include(a => a.ProductStocks).Include(a => a.Reviews).Include(a => a.Brand).Include(a => a.Kategoris).OrderByDescending(a => a.Updated_At).ToList().Select(z => new ProductListViewModel
            {
                Id = z.Id,
                Added_By = z.User.Ad,
                Name = z.ProductName,
                SoldCount = z.SoldCount,
                TotalStock = z.ProductStocks.Count,
                Featured = z.Featured,
                ThumbnailImage = z.Thumbnail_img,
                BaseAmount = z.UnitPrice,
                Publised = z.Published,
                Reviews = z.Reviews.Count,
                TodayDeal = z.TodaysDeal,
                Date = z.Updated_At
            }).ToList();
            return lst;
        }
        public JsonResult attachment_upload()
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
                var filePath = Server.MapPath("~/UrunAciklamaResimleri/") + Request.Files[i].FileName;
                string sss = (new Random().Next(10, 99) + "-" + new Random().Next(100, 9999)).ToString();

                ImageCodecInfo jpgInfo = ImageCodecInfo.GetImageEncoders().Where(codecInfo => codecInfo.MimeType == "image/jpeg").First();
                using (EncoderParameters encParams = new EncoderParameters(1))
                {
                    var image = Bitmap.FromStream(Request.Files[i].InputStream);
                    encParams.Param[0] = new EncoderParameter(Encoder.Quality, (long)50);
                    image.Save(Server.MapPath("~/UrunAciklamaResimleri/") + sss + ".jpg", jpgInfo, encParams);
                }




                //using (var fs = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
                //{
                //    Request.Files[i].InputStream.CopyTo(fs);
                //}
                return Json(sss + ".jpg", JsonRequestBehavior.AllowGet);
            }
            return Json("ok", JsonRequestBehavior.AllowGet);
        }
        private List<ProductListViewModel> SortByColumnWithOrderMakale(string order, string orderDir, List<ProductListViewModel> data)
        {
            List<ProductListViewModel> lst = new List<ProductListViewModel>();
            try
            {
                // Sorting   
                switch (order)
                {
                    case "0":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.Id).ToList() : data.OrderBy(p => p.Id).ToList();
                        break;
                    case "1":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.Name).ToList() : data.OrderBy(p => p.Name).ToList();
                        break;
                    case "2":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.Added_By).ToList() : data.OrderBy(p => p.Added_By).ToList();
                        break;
                    case "3":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.SoldCount).ToList() : data.OrderBy(p => p.SoldCount).ToList();
                        break;
                    case "4":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.TotalStock).ToList() : data.OrderBy(p => p.TotalStock).ToList();
                        break;
                    case "5":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.BaseAmount).ToList() : data.OrderBy(p => p.BaseAmount).ToList();
                        break;
                    case "6":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.TodayDeal).ToList() : data.OrderBy(p => p.TodayDeal).ToList();
                        break;
                    case "7":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.Reviews).ToList() : data.OrderBy(p => p.Reviews).ToList();
                        break;
                    case "8":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.Publised).ToList() : data.OrderBy(p => p.Publised).ToList();
                        break;
                    case "9":
                        lst = orderDir.Equals("DESC", StringComparison.CurrentCultureIgnoreCase) ? data.OrderByDescending(p => p.Featured).ToList() : data.OrderBy(p => p.Featured).ToList();
                        break;
                    default:
                        lst = data.OrderByDescending(p => p.Date).ToList();
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }
            return lst;
        }
        public static string str = "";
        public static void getparent(Kategori cat)
        {
            str += " m-" + cat.Id;
            if (cat.parent != null)
            {
                getparent(cat.parent);
            }
        }
        public JsonResult GetSubCategories(int id)
        {
            if (id == 0)
            {
                AutoCompCate acmc = new AutoCompCate();
                return Json(acmc, JsonRequestBehavior.AllowGet);
            }
            List<AutoComplateViewModel> Liste = new List<AutoComplateViewModel>();
            foreach (var item in db.Kategoris.Where(a => a.parentId == id).ToList())
            {
                Liste.Add(new AutoComplateViewModel { Value = item.adi, Id = item.Id });
            }
            AutoCompCate acm = new AutoCompCate();
            Kategori ilk = db.Kategoris.Include(a => a.parent).Where(a => a.Id == id).FirstOrDefault();
            string son = " m-" + ilk.Id;
            if (ilk.parentId != null)
            {
                int prt = Convert.ToInt32(ilk.parentId);
                Kategori iki = db.Kategoris.Where(a => a.Id == prt).FirstOrDefault();
                son += " m-" + iki.Id;
                if (iki.parentId != null)
                {
                    int crt = Convert.ToInt32(iki.parentId);
                    Kategori uc = db.Kategoris.Where(a => a.Id == crt).FirstOrDefault();
                    son += " m-" + uc.Id;
                    if (uc.parentId != null)
                    {
                        int urt = Convert.ToInt32(uc.parentId);
                        Kategori dort = db.Kategoris.Where(a => a.Id == urt).FirstOrDefault();
                        son += " m-" + dort.Id;
                        if (dort.parentId != null)
                        {
                            int frt = Convert.ToInt32(dort.parentId);
                            Kategori bes = db.Kategoris.Where(a => a.Id == frt).FirstOrDefault();
                            son += " m-" + bes.Id;
                            if (bes.parentId != null)
                            {
                                int trt = Convert.ToInt32(bes.parentId);
                                Kategori alti = db.Kategoris.Where(a => a.Id == trt).FirstOrDefault();
                                son += " m-" + alti.Id;
                                if (alti.parentId != null)
                                {
                                    int mrt = Convert.ToInt32(alti.parentId);
                                    Kategori yedi = db.Kategoris.Where(a => a.Id == mrt).FirstOrDefault();
                                    son += " m-" + yedi.Id;
                                    if (yedi.parentId != null)
                                    {
                                        int mrit = Convert.ToInt32(yedi.parentId);
                                        Kategori sekiz = db.Kategoris.Where(a => a.Id == mrit).FirstOrDefault();
                                        son += " m-" + sekiz.Id;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //if (ilk.parent!=null)
            //{
            //    son += "m-" + ilk.parent.Id;
            //}
            acm.Id = son;
            acm.AutoComplateViewModels = Liste;
            return Json(acm, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCategories(string q)
        {
            List<AutoComplateViewModel> Liste = new List<AutoComplateViewModel>();
            foreach (var item in db.Kategoris.Where(a => a.parentId == null && a.adi.ToLower().Contains(q)).ToList())
            {
                Liste.Add(new AutoComplateViewModel { Value = item.adi });
            }
            return Json(Liste, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetProducts()
        {

            JsonResult result = new JsonResult();
            try
            {
                string search = Request.Form.GetValues("search[value]")[0];
                string draw = Request.Form.GetValues("draw")[0];
                string order = Request.Form.GetValues("order[0][column]")[0];
                string orderDir = Request.Form.GetValues("order[0][dir]")[0];
                int startRec = Convert.ToInt32(Request.Form.GetValues("start")[0]);
                int pageSize = Convert.ToInt32(Request.Form.GetValues("length")[0]);

                List<ProductListViewModel> data = this.LoadDataYetkinliks();
                int totalRecords = data.Count;
                if (!string.IsNullOrEmpty(search) && !string.IsNullOrWhiteSpace(search))
                {
                    data = data.Where(p => p.Name.ToString().ToLower().Contains(search.ToLower()) || p.Id.ToString() == search).ToList();
                }

                data = this.SortByColumnWithOrderMakale(order, orderDir, data);
                // Filter record count.   
                int recFilter = data.Count;
                // Apply pagination.   
                data = data.Skip(startRec).Take(pageSize).ToList();
                // Loading drop down lists.   
                result = this.Json(new
                {
                    draw = Convert.ToInt32(draw),
                    recordsTotal = totalRecords,
                    recordsFiltered = recFilter,
                    data = data
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string ff = ex.Message;
            }
            // Return info.   
            //    return Json(result,JsonRequestBehavior.AllowGet);
            return result;
        }
        // GET: Admin/Products
        public ActionResult Index()
        {
            // var products = db.Products.Include(p => p.Brand).Include(p => p.User);
            return View();
        }

        // GET: Admin/Products/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Product product = db.Products.Find(id);
            if (product == null)
            {
                return HttpNotFound();
            }
            return View(product);
        }
        public JsonResult Copy(int id)
        {
            var product = db.Products.Find(id);
            Product prd = product;
            db.Products.Add(prd);
            db.SaveChanges();
            var PAD = db.ProductAttributes.Where(a => a.ProductId == product.Id).ToList();
            foreach (var item in PAD)
            {
                item.ProductId = prd.Id;
                db.ProductAttributes.Add(item);
                db.SaveChanges();
            }

            var PVD = db.ProductVariants.Where(a => a.ProductId == product.Id).ToList();
            foreach (var item in PVD)
            {
                item.ProductId = prd.Id;
                db.ProductVariants.Add(item);
                db.SaveChanges();
            }
            var ct = db.ProductCategorys.Where(a => a.ProductId == product.Id).FirstOrDefault();
            ct.ProductId = prd.Id;
            db.ProductCategorys.Add(ct);
            db.SaveChanges();
            if (!Directory.Exists(Server.MapPath("~/UrunResimleri/" + prd.Id + "/")))
            {
                Directory.CreateDirectory(Server.MapPath("~/UrunResimleri/" + prd.Id + "/"));
            }
            foreach (var file in Directory.GetFiles(Server.MapPath("~/UrunResimleri/" + product.Id + "/")))
            {
                System.IO.File.Copy(file, Path.Combine(Server.MapPath("~/UrunResimleri/" + prd.Id + "/"), Path.GetFileName(file)));
            }
            return Json("Ok", JsonRequestBehavior.AllowGet);
        }
        public JsonResult TodayDeal(int id)
        {
            var product = db.Products.Find(id);

            if (product.TodaysDeal)
            {
                product.TodaysDeal = false;
            }
            else
            {
                product.TodaysDeal = true;
            }
            db.Entry(product).State = EntityState.Modified;
            db.SaveChanges();
            return Json("Ok", JsonRequestBehavior.AllowGet);
        }
        public JsonResult Published(int id)
        {
            var product = db.Products.Find(id);

            if (product.Published)
            {
                product.Published = false;
            }
            else
            {
                product.Published = true;
            }
            db.Entry(product).State = EntityState.Modified;
            db.SaveChanges();
            return Json("Ok", JsonRequestBehavior.AllowGet);
        }
        public JsonResult Featured(int id)
        {
            var product = db.Products.Find(id);

            if (product.Featured)
            {
                product.Featured = false;
            }
            else
            {
                product.Featured = true;
            }
            db.Entry(product).State = EntityState.Modified;
            db.SaveChanges();
            return Json("Ok", JsonRequestBehavior.AllowGet);
        }
        // GET: Admin/Products/Create
        public ActionResult Create()
        {
            ViewBag.BrandId = new SelectList(db.Brands, "Id", "BrandName");
            ViewBag.UserId = new SelectList(db.Users, "Id", "Ad");
            return View();
        }
        public JsonResult RemovePhoto(string name, string ne, int id)
        {
            Product pr = db.Products.Find(id);
            string nosu = pr.Thumbnail_img;

            switch (ne)
            {
                case "1":
                    pr.Photo1 = null;
                    db.Entry(pr).State = EntityState.Modified;
                    db.SaveChanges();
                    break;
                case "2":
                    pr.Photo2 = null;
                    db.Entry(pr).State = EntityState.Modified;
                    db.SaveChanges();
                    break;
                case "3":
                    pr.Photo3 = null;
                    db.Entry(pr).State = EntityState.Modified;
                    db.SaveChanges();
                    break;
                case "4":
                    pr.Photo4 = null;
                    db.Entry(pr).State = EntityState.Modified;
                    db.SaveChanges();
                    break;
                case "5":
                    pr.Photo5 = null;
                    db.Entry(pr).State = EntityState.Modified;
                    db.SaveChanges();
                    break;
                case "6":
                    pr.Photo6 = null;
                    db.Entry(pr).State = EntityState.Modified;
                    db.SaveChanges();
                    break;
                default:
                    break;
            }
            string durum = "OK";
            try
            {
                if (System.IO.File.Exists(Server.MapPath("~/urunresimleri/" + id + "/" + name)))
                {
                    System.IO.File.Delete(Server.MapPath("~/urunresimleri/" + id + "/" + name));
                }
            }
            catch (Exception)
            {
                durum = "Silemedi";
            }

            if (pr.Photo1 != null)
            {
                pr.Thumbnail_img = "1";
            }
            if (pr.Photo2 != null)
            {
                pr.Thumbnail_img = "2";
            }
            if (pr.Photo3 != null)
            {
                pr.Thumbnail_img = "3";
            }
            if (pr.Photo4 != null)
            {
                pr.Thumbnail_img = "4";
            }
            if (pr.Photo5 != null)
            {
                pr.Thumbnail_img = "5";
            }
            if (pr.Photo6 != null)
            {
                pr.Thumbnail_img = "6";
            }

            db.Entry(pr).State = EntityState.Modified;
            db.SaveChanges();
            return Json(durum, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAttribute(int id)
        {
            var attrler = db.AttributeKategoris.Where(a => a.KategoriId == id).ToList();
            List<AttrListesi> AL = new List<AttrListesi>();
            foreach (var item in db.Attributes.ToList())
            {
                if (attrler.Where(a => a.AttributeId == item.Id).FirstOrDefault() != null)
                {
                    AttrListesi ALL = new AttrListesi();
                    ALL.Id = item.Id;
                    ALL.Insertable = item.Insertable;
                    ALL.Attrs = item.Name;
                    ALL.stringValues = string.Join(",", db.AttributeValues.Where(a => a.AttributeId == item.Id).Select(a => a.Value).ToArray());
                    List<IdValue> IVS = new List<IdValue>();
                    foreach (var itemi in db.AttributeValues.Where(a => a.AttributeId == item.Id).ToList())
                    {
                        IdValue IV = new IdValue();
                        IV.Id = itemi.Id;
                        IV.Value = itemi.Value;
                        IVS.Add(IV);
                    }
                    ALL.Values = IVS;
                    AL.Add(ALL);
                }
            }
            return Json(AL, JsonRequestBehavior.AllowGet);
        }
        private ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }
        public static string FixBase64ForImage(string Image)
        {
            System.Text.StringBuilder sbText = new System.Text.StringBuilder(Image, Image.Length);
            sbText.Replace("\r\n", String.Empty); sbText.Replace(" ", String.Empty);
            return sbText.ToString();
        }
        public string SavePhoto(string id, string name, string rsm)
        {


            Byte[] bitmapData = Convert.FromBase64String(FixBase64ForImage(rsm.Replace("data:image/jpeg;base64,", "").Replace("data:image/jpg;base64,", "").Replace("data:image/png;base64,", "")));
            System.IO.MemoryStream streamBitmap = new System.IO.MemoryStream(bitmapData);
            Image bitImage = new Bitmap((Bitmap)Image.FromStream(streamBitmap));
            if (!Directory.Exists(Server.MapPath("~/UrunResimleri/" + id + "/")))
            {
                Directory.CreateDirectory(Server.MapPath("~/UrunResimleri/" + id + "/"));
            }
            // akset.helper.Genel.Resize();
            //byte[] photoarray = bytes;// Convert.FromBase64String(rsm.Replace("data:image/jpeg;base64,", "").Replace("data:image/jpg;base64,", "").Replace("data:image/png;base64,", ""));
            //MemoryStream ms = new MemoryStream(photoarray, 0, photoarray.Length);
            //ms.Write(photoarray, 0, photoarray.Length);
            //Image image = new Bitmap(ms);//3984 2656

            string nos1 = akset.helper.Genel.URLFriendly(name) + "-" + akset.helper.Genel.RandomString(10).ToString() + ".jpg";
            helper.Genel.resizeImage(Server.MapPath("~/UrunResimleri/" + id + "/" + "625" + "-" + nos1), bitImage, 625, 625);
            helper.Genel.resizeImage(Server.MapPath("~/UrunResimleri/" + id + "/" + "450" + "-" + nos1), bitImage, 450, 625);
            helper.Genel.resizeImage(Server.MapPath("~/UrunResimleri/" + id + "/" + "222" + "-" + nos1), bitImage, 200, 200);
            helper.Genel.resizeImage(Server.MapPath("~/UrunResimleri/" + id + "/" + "200" + "-" + nos1), bitImage, 200, 150);
            helper.Genel.resizeImage(Server.MapPath("~/UrunResimleri/" + id + "/" + "180" + "-" + nos1), bitImage, 180, 250);

            //50
            //110
            //270
            //200
            //85
            //200*200

            //200*150
            //180*250
            //450*625
            //625*625



            //Image gg = akset.helper.Genel.ScaleImage(bitImage, 450, 625);
            //Bitmap bmp = new Bitmap(gg);
            //bmp.SetResolution(72, 72);
            //EncoderParameters encoderParameters = new EncoderParameters(1);
            //encoderParameters.Param[0] = new EncoderParameter(Encoder.Compression, 100);          // 100% Percent Compression


            //bmp.Save(Server.MapPath("~/UrunResimleri/" + id + "/" + nos1), ImageCodecInfo.GetImageEncoders()[1], encoderParameters);
            //bmp.Dispose();





            //using (var imageFile = new FileStream(Server.MapPath("~/UrunResimleri/" + id + "/" + nos1), FileMode.Create))
            //{
            //    imageFile.Write(bytes, 0, bytes.Length);
            //    imageFile.Flush();
            //}
            //ImageCodecInfo jgpEncoder = GetEncoder(ImageFormat.Jpeg);
            //System.Drawing.Imaging.Encoder myEncoder = System.Drawing.Imaging.Encoder.Quality;
            //EncoderParameters myEncoderParameters = new EncoderParameters(1);
            //EncoderParameter myEncoderParameter = new EncoderParameter(myEncoder, 80L);
            //myEncoderParameters.Param[0] = myEncoderParameter;

            //Image gg = akset.helper.Genel.ScaleImage(image, 450, 625);
            //Bitmap bmp = new Bitmap(gg);
            //bmp.Save(Server.MapPath("~/UrunResimleri/" + id + "/" + nos1), jgpEncoder, myEncoderParameters);
            return nos1;
            //  return "null";
        }

        // POST: Admin/Products/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,ProductName,Added_By,Created_At,Updated_At,Thumbnail_img,Description,UnitPrice,Quantity,Unit,Featured,Refundable,Rating,Slug,MetaTitle,MetaDescription,ShippingType,ShippingCost,Discount,DiscountType,TodaysDeal,Published,VideoLink,VideoType,UserId,BrandId,SoldCount,Barkod,Gallery,Cache,Photo1,Photo2,Photo3,Photo4,Photo5,Photo6")] Product product, string rsmlerxx1, string rsmlerxx2, string rsmlerxx3, string rsmlerxx4, string rsmlerxx5, string rsmlerxx6, string Sonlar, string resimvtrin, string KategoriIdsi, string ozellikler)
        {
            if (ModelState.IsValid)
            {
                product.Description = Microsoft.JScript.GlobalObject.unescape(product.Description);
                db.Products.Add(product);
                db.SaveChanges();
                if (KategoriIdsi != "0")
                {
                    ProductCategory PC = new ProductCategory();
                    PC.KategoriId = Convert.ToInt32(KategoriIdsi.Split('-')[0]);
                    PC.Level = Convert.ToInt32(KategoriIdsi.Split('-')[1]);
                    PC.ProductId = product.Id;
                    db.ProductCategorys.Add(PC);
                    db.SaveChanges();
                }
                if (resimvtrin != "bos")
                {
                    product.Thumbnail_img = resimvtrin.Replace("rsmlerxx", "");
                }
                else
                {
                    product.Thumbnail_img = "1";
                }
                if (!string.IsNullOrEmpty(rsmlerxx1))
                {
                    product.Photo1 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx1);
                }
                if (!string.IsNullOrEmpty(rsmlerxx2))
                {
                    product.Photo2 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx2);
                }
                if (!string.IsNullOrEmpty(rsmlerxx3))
                {
                    product.Photo3 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx3);
                }
                if (!string.IsNullOrEmpty(rsmlerxx4))
                {
                    product.Photo4 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx4);
                }
                if (!string.IsNullOrEmpty(rsmlerxx5))
                {
                    product.Photo5 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx5);
                }
                if (!string.IsNullOrEmpty(rsmlerxx6))
                {
                    product.Photo6 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx6);
                }
                //VARYANTLAR RESİMLİ
                if (Sonlar != "bos")
                {
                    string[] son = Sonlar.Split('_');
                    List<VaryantViewModal> VVMList = new List<VaryantViewModal>();
                    foreach (var item in son)
                    {
                        if (item.Split('-')[2] != "yok" && item.Split('-')[4] != "yok")
                        {
                            int attAdi = Convert.ToInt32(item.Split('-')[0]);
                            int attDeg = Convert.ToInt32(item.Split('-')[1]);
                            VaryantViewModal VVM = new VaryantViewModal();
                            VVM.Ad = item.Split('-')[0];
                            VVM.Deger = item.Split('-')[1];
                            VVM.Fiyat = item.Split('-')[2];
                            VVM.Barkod = item.Split('-')[3];
                            VVM.Miktar = item.Split('-')[4];
                            if (item.Split('-')[5] != "yok")
                            {
                                VVM.Resim = SavePhoto(product.Id.ToString(), product.ProductName + "-" + akset.helper.Genel.URLFriendly(db.Attributes.Where(a => a.Id == attAdi).FirstOrDefault().Name) + "-" + akset.helper.Genel.URLFriendly(db.AttributeValues.Where(a => a.Id == attDeg).FirstOrDefault().Value), item.Split('-')[5]);
                            }
                            else
                            {
                                VVM.Resim = item.Split('-')[5];
                            }
                            VVMList.Add(VVM);
                        }
                    }
                    foreach (var item in VVMList.ToList())
                    {
                        ProductVariant PV = new ProductVariant();
                        PV.Amount = Convert.ToDecimal(item.Fiyat);
                        PV.Barkod = item.Barkod;
                        PV.Photo = item.Resim;
                        PV.ProductId = product.Id;
                        PV.Quantity = Convert.ToInt32(item.Miktar);
                        PV.AttributeValueId = Convert.ToInt32(item.Deger);
                        PV.AttributeId = Convert.ToInt32(item.Ad);
                        db.ProductVariants.Add(PV);
                        db.SaveChanges();
                    }
                }
                //ÜRÜN ÖZELLİKLERİ
                if (ozellikler != "bos")
                {
                    ProductAttribute PA = new ProductAttribute();
                    if (!ozellikler.Contains(","))
                    {
                        PA.AttributeId = Convert.ToInt32(ozellikler.Split('-')[0]);
                        PA.AttributeValueId = Convert.ToInt32(ozellikler.Split('-')[1]);
                        PA.ProductId = product.Id;
                        db.ProductAttributes.Add(PA);
                        db.SaveChanges();
                    }
                    else
                    {
                        foreach (var item in ozellikler.Split(','))
                        {
                            PA.AttributeId = Convert.ToInt32(item.Split('-')[0]);
                            PA.AttributeValueId = Convert.ToInt32(item.Split('-')[1]);
                            PA.ProductId = product.Id;
                            db.ProductAttributes.Add(PA);
                            db.SaveChanges();
                        }
                    }
                }
                return RedirectToAction("Index");
            }

            ViewBag.BrandId = new SelectList(db.Brands, "Id", "BrandName", product.BrandId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "Ad", product.UserId);
            return View(product);
        }

        // GET: Admin/Products/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Product product = db.Products.Include(a => a.Kategoris).Where(a => a.Id == id).FirstOrDefault();
            if (product == null)
            {
                return HttpNotFound();
            }
            ViewBag.BrandId = new SelectList(db.Brands, "Id", "BrandName", product.BrandId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "Ad", product.UserId);
            return View(product);
        }

        // POST: Admin/Products/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,ProductName,Added_By,Created_At,Updated_By,Thumbnail_img,Description,UnitPrice,Quantity,Unit,Featured,Refundable,Rating,Slug,MetaTitle,MetaDescription,ShippingType,ShippingCost,Discount,DiscountType,TodaysDeal,Published,VideoLink,VideoType,UserId,BrandId,Gallery,Barkod,SoldCount,Cache,Photo1,Photo2,Photo3,Photo4,Photo5,Photo6")] Product product, string rsmlerxx1, string rsmlerxx2, string rsmlerxx3, string rsmlerxx4, string rsmlerxx5, string rsmlerxx6, string Sonlar, string resimvtrin, string KategoriIdsi, string ozellikler)
        {
            if (ModelState.IsValid)
            {
                if (KategoriIdsi != "0")
                {
                    var PCd = db.ProductCategorys.Where(a => a.ProductId == product.Id).FirstOrDefault();
                    PCd.KategoriId = Convert.ToInt32(KategoriIdsi.Split('-')[0]);
                    PCd.Level = Convert.ToInt32(KategoriIdsi.Split('-')[1]);
                    db.Entry(PCd).State = EntityState.Modified;
                    db.SaveChanges();
                }

                //VARYANTLAR RESİMLİ
                if (Sonlar != "bos")
                {
                    string[] son = Sonlar.Split('_');
                    List<VaryantViewModal> VVMList = new List<VaryantViewModal>();
                    foreach (var item in son)
                    {
                        if (item.Split('-')[2] != "yok" && item.Split('-')[4] != "yok")
                        {
                            int attAdi = Convert.ToInt32(item.Split('-')[0]);
                            int attDeg = Convert.ToInt32(item.Split('-')[1]);
                            VaryantViewModal VVM = new VaryantViewModal();
                            VVM.Ad = item.Split('-')[0];
                            VVM.Deger = item.Split('-')[1];
                            VVM.Fiyat = item.Split('-')[2];
                            VVM.Barkod = item.Split('-')[3];
                            VVM.Miktar = item.Split('-')[4];
                            if (item.Split('-')[6] == "yok")
                            {
                                VVM.Id = 0;
                            }
                            else
                            {
                                VVM.Id = Convert.ToInt32(item.Split('-')[6]);
                            }

                            if (item.Split('-')[5] != "yok")
                            {
                                if (!item.Split('-')[5].Contains("["))
                                {
                                    VVM.Resim = SavePhoto(product.Id.ToString(), product.ProductName + "-" + akset.helper.Genel.URLFriendly(db.Attributes.Where(a => a.Id == attAdi).FirstOrDefault().Name) + "-" + akset.helper.Genel.URLFriendly(db.AttributeValues.Where(a => a.Id == attDeg).FirstOrDefault().Value), item.Split('-')[5]);
                                }
                                else
                                {
                                  string gg = item.Split('-')[5].Replace("[", "-").Replace("[", "-").Replace("[", "-").Replace("[", "-").Replace("[", "-").Replace("[", "-").Replace("[", "-").Replace("[", "-");
                                    VVM.Resim = gg.Substring(gg.LastIndexOf("/")+5);
                                }
                            }
                            else
                            {
                                VVM.Resim = "yok";
                            }
                            VVMList.Add(VVM);
                        }
                    }

                    foreach (var item in VVMList.ToList())
                    {
                        int AV = Convert.ToInt32(item.Deger);
                        int AT = Convert.ToInt32(item.Ad);
                        if (item.Id == 0)
                        {
                            ProductVariant PVc = new ProductVariant();

                            PVc.Amount = Convert.ToDecimal(item.Fiyat);
                            PVc.Barkod = item.Barkod;
                            PVc.Photo = item.Resim;
                            PVc.ProductId = product.Id;
                            PVc.Quantity = Convert.ToInt32(item.Miktar);
                            PVc.AttributeValueId = Convert.ToInt32(item.Deger);
                            PVc.AttributeId = Convert.ToInt32(item.Ad);
                            db.ProductVariants.Add(PVc);
                            db.SaveChanges();
                        }
                        else
                        {
                            var bul = db.ProductVariants.Find(item.Id);
                            bul.Amount = Convert.ToDecimal(item.Fiyat);
                            bul.Barkod = item.Barkod;
                            bul.Photo = item.Resim;
                            bul.ProductId = product.Id;
                            bul.Quantity = Convert.ToInt32(item.Miktar);
                            bul.AttributeValueId = Convert.ToInt32(item.Deger);
                            bul.AttributeId = Convert.ToInt32(item.Ad);
                            db.Entry(bul).State = EntityState.Modified;
                            db.SaveChanges();
                        }


                    }
                }
                //ÜRÜN ÖZELLİKLERİ
                if (ozellikler != "bos")
                {
                    var PAd = db.ProductAttributes.Where(a => a.ProductId == product.Id).ToList();
                    foreach (var item in PAd)
                    {
                        db.ProductAttributes.Remove(item);
                        db.SaveChanges();
                    }
                    if (!ozellikler.Contains(","))
                    {
                        int atid = Convert.ToInt32(ozellikler.Split('-')[0]);
                        int atvid = Convert.ToInt32(ozellikler.Split('-')[1]);

                        ProductAttribute PA = new ProductAttribute();
                        PA.AttributeId = Convert.ToInt32(ozellikler.Split('-')[0]);
                        PA.AttributeValueId = Convert.ToInt32(ozellikler.Split('-')[1]);
                        PA.ProductId = product.Id;
                        db.ProductAttributes.Add(PA);
                        db.SaveChanges();
                    }
                    else
                    {
                        foreach (var item in ozellikler.Split(','))
                        {
                            ProductAttribute PA = new ProductAttribute();
                            PA.AttributeId = Convert.ToInt32(item.Split('-')[0]);
                            PA.AttributeValueId = Convert.ToInt32(item.Split('-')[1]);
                            PA.ProductId = product.Id;
                            db.ProductAttributes.Add(PA);
                            db.SaveChanges();
                        }
                    }
                }

                product.Description = Microsoft.JScript.GlobalObject.unescape(product.Description);
                if (resimvtrin != "bos")
                {
                    product.Thumbnail_img = resimvtrin.Replace("rsmlerxx", "");
                }
                else
                {
                    product.Thumbnail_img = "1";
                }

                if (!string.IsNullOrEmpty(rsmlerxx1))
                {
                    product.Photo1 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx1);
                }

                if (!string.IsNullOrEmpty(rsmlerxx2))
                {
                    product.Photo2 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx2);
                }
                if (!string.IsNullOrEmpty(rsmlerxx3))
                {
                    product.Photo3 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx3);
                }
                if (!string.IsNullOrEmpty(rsmlerxx4))
                {
                    product.Photo4 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx4);
                }
                if (!string.IsNullOrEmpty(rsmlerxx5))
                {
                    product.Photo5 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx5);
                }
                if (!string.IsNullOrEmpty(rsmlerxx6))
                {
                    product.Photo6 = SavePhoto(product.Id.ToString(), product.ProductName, rsmlerxx6);
                }

                product.Thumbnail_img = resimvtrin;
                db.Entry(product).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.BrandId = new SelectList(db.Brands, "Id", "BrandName", product.BrandId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "Ad", product.UserId);
            return View(product);
        }

        //// GET: Admin/Products/Delete/5
        //public ActionResult Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    Product product = db.Products.Find(id);
        //    if (product == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(product);
        //}

        // POST: Admin/Products/Delete/5

        public JsonResult Delete(int id)
        {
            Product product = db.Products.Find(id);
            product.Delete = true;
            db.Entry(product).State = EntityState.Modified;
            db.SaveChanges();
            return Json("Index", JsonRequestBehavior.AllowGet);
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
