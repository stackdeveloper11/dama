using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using akset.data;

namespace akset.Areas.Satici.Controllers
{
    public class ProductsController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Satici/Products
        public ActionResult Index()
        {
            var products = db.Products.Include(p => p.Brand).Include(p => p.User);
            return View(products.ToList());
        }

        // GET: Satici/Products/Details/5
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

        // GET: Satici/Products/Create
        public ActionResult Create()
        {
            ViewBag.BrandId = new SelectList(db.Brands, "Id", "BrandName");
            ViewBag.UserId = new SelectList(db.Users, "Id", "Ad");
            return View();
        }

        // POST: Satici/Products/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Cache,Barkod,ProductName,Added_By,Created_At,Updated_At,Thumbnail_img,Gallery,Description,UnitPrice,Quantity,Unit,Featured,Refundable,Rating,Slug,MetaTitle,MetaDescription,ShippingType,ShippingCost,Discount,DiscountType,TodaysDeal,Published,VideoLink,VideoType,UserId,BrandId,SoldCount,Delete,Photo1,Photo2,Photo3,Photo4,Photo5,Photo6")] Product product)
        {
            if (ModelState.IsValid)
            {
                db.Products.Add(product);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.BrandId = new SelectList(db.Brands, "Id", "BrandName", product.BrandId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "Ad", product.UserId);
            return View(product);
        }

        // GET: Satici/Products/Edit/5
        public ActionResult Edit(int? id)
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
            ViewBag.BrandId = new SelectList(db.Brands, "Id", "BrandName", product.BrandId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "Ad", product.UserId);
            return View(product);
        }

        // POST: Satici/Products/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Cache,Barkod,ProductName,Added_By,Created_At,Updated_At,Thumbnail_img,Gallery,Description,UnitPrice,Quantity,Unit,Featured,Refundable,Rating,Slug,MetaTitle,MetaDescription,ShippingType,ShippingCost,Discount,DiscountType,TodaysDeal,Published,VideoLink,VideoType,UserId,BrandId,SoldCount,Delete,Photo1,Photo2,Photo3,Photo4,Photo5,Photo6")] Product product)
        {
            if (ModelState.IsValid)
            {
                db.Entry(product).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.BrandId = new SelectList(db.Brands, "Id", "BrandName", product.BrandId);
            ViewBag.UserId = new SelectList(db.Users, "Id", "Ad", product.UserId);
            return View(product);
        }

        // GET: Satici/Products/Delete/5
        public ActionResult Delete(int? id)
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

        // POST: Satici/Products/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Product product = db.Products.Find(id);
            db.Products.Remove(product);
            db.SaveChanges();
            return RedirectToAction("Index");
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
