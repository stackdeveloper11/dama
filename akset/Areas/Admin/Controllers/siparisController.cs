using akset.data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
namespace akset.Areas.Admin.Controllers
{
    public class suruns
    {
        public string urun { get; set; }
        public int adet { get; set; }
        public string fiyat { get; set; }
    }
    [Authorize(Roles = "Admin")]
    public class siparisController : Controller
    {
        aksetDB db = new aksetDB();
        // GET: Admin/siparis
        public ActionResult siparisi()
        {

            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Include(a => a.User).OrderByDescending(a => a.Id).ToList();
            return View(siparis);

            //  return View();

        }
        public ActionResult siparisurunleri(int nosu)
        {
            List<suruns> surunu = new List<suruns>();
            foreach (var item in db.siparisurunlers.Include(a => a.urun).Where(a => a.siparisId == nosu).ToList())
            {

                suruns sr = new suruns();
                sr.urun = item.urun.urunbaslik;
                sr.adet = item.adet;
                sr.fiyat = item.urun.fiyat;
                surunu.Add(sr);
            }
            return Json(surunu, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Create(int id)
        {
            ViewBag.urunler = db.uruns.ToList();
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(string odemesekli, string siparisaciklama, int id, int urunler)
        {
            string usrid = User.Identity.GetUserId();
            siparis sp = new siparis();
            sp.siparisdurum = "Yeni Sipariş";

            sp.yenisiparistarih = DateTime.Now;
            sp.siparisdurumaciklama = siparisaciklama;
            sp.odemesekli = odemesekli;
            sp.UserId = usrid;
            // sp.urunId = urunler;
            db.sipariss.Add(sp);
            db.SaveChanges();
            return RedirectToAction("yenisiparis");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult topluiptalolansiparis(string idler, string neresi, string aciklama = "")
        {
            if (neresi == "sil")
            {
                if (User.IsInRole("Admin"))
                {
                    if (idler.Contains(","))
                    {
                        foreach (var item in idler.Split(','))
                        {
                            int gg = Convert.ToInt32(item);
                            var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                            db.sipariss.Remove(ff);
                            db.SaveChanges();
                        }
                    }
                    else
                    {
                        int gg = Convert.ToInt32(idler);
                        var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                        db.sipariss.Remove(ff);
                        db.SaveChanges();
                    }
                }
            }
            if (neresi == "iptal")
            {
                if (idler.Contains(","))
                {
                    foreach (var item in idler.Split(','))
                    {
                        int gg = Convert.ToInt32(item);
                        var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                        if (!string.IsNullOrEmpty(aciklama))
                        {
                            ff.siparisdurumaciklama = aciklama;
                        }
                        ff.iptalarih = DateTime.Now;
                        ff.siparisdurum = "İptal Oldu";
                        db.Entry(ff).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
                else
                {
                    int gg = Convert.ToInt32(idler);
                    var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                    if (!string.IsNullOrEmpty(aciklama))
                    {
                        ff.siparisdurumaciklama = aciklama;
                    }
                    ff.iptalarih = DateTime.Now;
                    ff.siparisdurum = "İptal Oldu";
                    db.Entry(ff).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return RedirectToAction("iptalsiparis");
            }
            if (neresi == "onayla")
            {
                if (idler.Contains(","))
                {
                    foreach (var item in idler.Split(','))
                    {
                        int gg = Convert.ToInt32(item);
                        var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                        ff.onaylanditarih = DateTime.Now;
                        ff.siparisdurum = "Onaylandı";
                        db.Entry(ff).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
                else
                {
                    int gg = Convert.ToInt32(idler);
                    var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                    ff.onaylanditarih = DateTime.Now;
                    ff.siparisdurum = "Onaylandı";
                    db.Entry(ff).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return RedirectToAction("onaylanansiparis");
            }
            if (neresi == "ulasilamadi")
            {
                if (idler.Contains(","))
                {
                    foreach (var item in idler.Split(','))
                    {
                        int gg = Convert.ToInt32(item);
                        var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                        ff.ulasildimi = false;
                        ff.siparisdurum = "Ulaşılamadı";
                        db.Entry(ff).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                    return RedirectToAction("onaylanansiparis");
                }
                else
                {
                    int gg = Convert.ToInt32(idler);
                    var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                    ff.ulasildimi = false;
                    ff.siparisdurum = "Ulaşılamadı";
                    db.Entry(ff).State = EntityState.Modified;
                    db.SaveChanges();
                    return RedirectToAction("onaylanansiparis");
                }
            }
            if (neresi == "faturakes")
            {
                if (idler.Contains(","))
                {
                    foreach (var item in idler.Split(','))
                    {
                        int gg = Convert.ToInt32(item);
                        var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                        ff.faturatarih = DateTime.Now;
                        ff.siparisdurum = "Fatura Kesildi";
                        db.Entry(ff).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
                else
                {
                    int gg = Convert.ToInt32(idler);
                    var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                    ff.faturatarih = DateTime.Now;
                    ff.siparisdurum = "Fatura Kesildi";
                    db.Entry(ff).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return RedirectToAction("faturakesilensiparis");
            }
            if (neresi == "iptaliptal")
            {
                if (idler.Contains(","))
                {
                    foreach (var item in idler.Split(','))
                    {
                        int gg = Convert.ToInt32(item);
                        var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                        string usrid = User.Identity.GetUserId();
                        ff.siparisdurum = "Yeni Sipariş";
                        ff.siparisdurumaciklama = "";
                        ff.yenisiparistarih = DateTime.Now;
                        ff.ulasildimi = false;
                        ff.onaylanditarih = null;
                        ff.iptalarih = null;
                        ff.faturatarih = null;
                        ff.kargotarih = null;
                        ff.siparisdurumaciklama = "";
                        db.Entry(ff).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
                else
                {
                    int gg = Convert.ToInt32(idler);
                    var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                    string usrid = User.Identity.GetUserId();
                    ff.siparisdurum = "Yeni Sipariş";
                    ff.siparisdurumaciklama = "";
                    ff.yenisiparistarih = DateTime.Now;
                    ff.ulasildimi = false;
                    ff.onaylanditarih = null;
                    ff.faturatarih = null;
                    ff.iptalarih = null;
                    ff.kargotarih = null;
                    ff.siparisdurumaciklama = "";
                    db.Entry(ff).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return RedirectToAction("yenisiparis");
            }
            if (neresi == "kargoyaver")
            {
                if (idler.Contains(","))
                {
                    foreach (var item in idler.Split(','))
                    {
                        int gg = Convert.ToInt32(item);
                        var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                        ff.kargotarih = DateTime.Now;
                        ff.siparisdurum = "Kargoya Verildi";
                        db.Entry(ff).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
                else
                {
                    int gg = Convert.ToInt32(idler);
                    var ff = db.sipariss.Where(a => a.Id == gg).FirstOrDefault();
                    ff.kargotarih = DateTime.Now;
                    ff.siparisdurum = "Kargoya Verildi";
                    db.Entry(ff).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return RedirectToAction("kargoyaverilensiparis");
            }
            return RedirectToAction("siparisi");
        }
        public ActionResult Edit(int id)
        {
            var sp = db.sipariss.Find(id);
            ViewBag.urunler = new SelectList(db.uruns.ToList(), "Id", "urunadi", db.siparisurunlers.Where(a => a.siparisId == sp.Id).FirstOrDefault().urunId);
            if (User.IsInRole("Admin"))
            {
                //  ViewBag.satici = new SelectList(db.Users.ToList(), "Id", "Email", sp.UserId);
            }
            return View(sp);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, int urunler, string odemesekli, string siparisaciklama = "", string satici = "")
        {
            var sp = db.sipariss.Find(id);
            //        sp.urunId = urunler;
            sp.siparisdurumaciklama = siparisaciklama;
            sp.odemesekli = odemesekli;

            ViewBag.urunler = new SelectList(db.uruns.ToList(), "Id", "urunadi", db.siparisurunlers.Where(a => a.siparisId == sp.Id).FirstOrDefault().urunId);
            if (User.IsInRole("Admin"))
            {
                //if (!string.IsNullOrEmpty(satici))
                //{
                //    sp.UserId = satici;
                //}

                // ViewBag.satici = new SelectList(db.Users.ToList(), "Id", "Email", sp.UserId);
            }
            db.Entry(sp).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("siparisi");
        }
        public ActionResult Delete(int id)
        {
            var spu = db.siparisurunlers.Where(a => a.siparisId == id);
            //foreach (var item in spu)
            //{
            //    db.siparisurunlers.Remove(item);
            //    db.SaveChanges();
            //}
           var sp = db.sipariss.Find(id);
        

            db.sipariss.Remove(sp);
            db.SaveChanges();
            return RedirectToAction("siparisi");
        }
        public ActionResult yenisiparis()
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Include(a => a.User).Where(a => a.onaylanditarih == null && a.siparisdurum == "Yeni Sipariş" && a.iptalarih == null).OrderByDescending(a => a.yenisiparistarih).ToList();
            return View(siparis);

        }
        public ActionResult ulasilamayansiparisler()
        {
            if (User.IsInRole("Admin"))
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.ulasildimi == false && a.iptalarih == null).OrderByDescending(a => a.yenisiparistarih).ToList();
                return View(siparis);
            }
            else
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.UserId == usrid && a.ulasildimi == false && a.iptalarih == null).OrderByDescending(a => a.yenisiparistarih).ToList();
                return View(siparis);
            }
        }
        public ActionResult onaylanansiparis()
        {
            if (User.IsInRole("Admin"))
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.faturatarih == null && a.siparisdurum == "Onaylandı" && a.iptalarih == null).OrderByDescending(a => a.onaylanditarih).ToList();
                return View(siparis);
            }
            else
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.UserId == usrid && a.siparisdurum == "Onaylandı" && a.faturatarih == null && a.iptalarih == null).OrderByDescending(a => a.onaylanditarih).ToList();
                return View(siparis);
            }
        }
        public ActionResult faturakesilensiparis()
        {
            if (User.IsInRole("Admin"))
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.kargotarih == null && a.siparisdurum == "Fatura Kesildi" && a.iptalarih == null).OrderByDescending(a => a.faturatarih).ToList();
                return View(siparis);
            }
            else
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.UserId == usrid && a.siparisdurum == "Fatura Kesildi" && a.kargotarih == null && a.iptalarih == null).OrderByDescending(a => a.faturatarih).ToList();
                return View(siparis);
            }

        }
        public ActionResult kargoyaverilensiparis()
        {
            if (User.IsInRole("Admin"))
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.iptalarih == null && a.siparisdurum == "Kargoya Verildi").OrderByDescending(a => a.kargotarih).ToList();
                return View(siparis);
            }
            else
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.UserId == usrid && a.siparisdurum == "Kargoya Verildi" && a.iptalarih == null).OrderByDescending(a => a.kargotarih).ToList();
                return View(siparis);
            }

        }
        public ActionResult iptalsiparis()
        {
            if (User.IsInRole("Admin"))
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.iptalarih != null).OrderByDescending(a => a.iptalarih).ToList();
                return View(siparis);
            }
            else
            {
                string usrid = User.Identity.GetUserId();
                var siparis = db.sipariss.Include(a => a.User).Where(a => a.UserId == usrid && a.iptalarih != null).OrderByDescending(a => a.iptalarih).ToList();
                return View(siparis);
            }

        }
        public ActionResult iptalgerial(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.siparisdurum = "Yeni Sipariş";
            siparis.siparisdurumaciklama = "";
            siparis.yenisiparistarih = DateTime.Now;
            siparis.ulasildimi = false;
            siparis.onaylanditarih = null;
            siparis.faturatarih = null;
            siparis.kargotarih = null;
            //if (siparis.ulasildimi != false)
            //{
            //    siparis.siparisdurum = "Ulaşılamadı";
            //}
            //if (siparis.onaylanditarih != null)
            //{
            //    siparis.siparisdurum = "Onaylandı";
            //}

            //if (siparis.faturatarih != null)
            //{
            //    siparis.siparisdurum = "Fatura Kesildi";
            //}

            //if (siparis.kargotarih!=null)
            //{
            //    siparis.siparisdurum = "Kargoya Verildi";
            //}
            siparis.siparisdurumaciklama = "";
            siparis.iptalarih = null;
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("yenisiparis");
        }
        public ActionResult iptaletyenisiparis(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.iptalarih = null;
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("siparisi");
        }
        public ActionResult onaylayenisiparis(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.onaylanditarih = DateTime.Now;
            siparis.siparisdurum = "Onaylandı";
            siparis.ulasildimi = true;
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("onaylanansiparis");
        }
        public ActionResult iptalyenisiparis(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.onaylanditarih = null;
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("siparisi");
        }
        public ActionResult onaylafaturakesilensiparis(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.faturatarih = DateTime.Now;
            siparis.siparisdurum = "Fatura Kesildi";
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("faturakesilensiparis");
        }
        public ActionResult iptalfaturakesilensiparis(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.faturatarih = null;

            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("faturakesilensiparis");
        }
        public ActionResult onaylakargoyaverilensiparis(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.kargotarih = DateTime.Now;
            siparis.siparisdurum = "Kargoya Verildi";
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("kargoyaverilensiparis");
        }
        public ActionResult ulasilmadi(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.ulasildimi = false;
            siparis.siparisdurum = "Ulaşılamadı";
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("yenisiparis");
        }
        public ActionResult iptalkargoyaverilensiparis(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.kargotarih = null;
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("kargoyaverilensiparis");
        }
        public ActionResult iptalolansiparishepsi(int id, string aciklama = "")
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.iptalarih = DateTime.Now;
            siparis.siparisdurum = "İptal oldu";
            if (string.IsNullOrEmpty("aciklama"))
            {

            }
            else
            {
                siparis.siparisdurumaciklama = aciklama.Trim();
            }
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("siparisi");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult iptalolansiparis(int id, string aciklama = "")
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.iptalarih = DateTime.Now;
            siparis.siparisdurum = "İptal oldu";
            if (string.IsNullOrEmpty("aciklama"))
            {

            }
            else
            {
                siparis.siparisdurumaciklama = aciklama.Trim();
            }
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("yenisiparis");
        }
        public ActionResult iptaliptalolansiparis(int id)
        {
            string usrid = User.Identity.GetUserId();
            var siparis = db.sipariss.Find(id);
            siparis.iptalarih = null;
            db.Entry(siparis).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("iptalsiparis");
        }
    }
}