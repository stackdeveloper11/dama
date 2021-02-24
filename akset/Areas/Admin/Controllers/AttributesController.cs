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
    public class AttributesController : Controller
    {
        private aksetDB db = new aksetDB();

        // GET: Admin/Attributes
        public ActionResult Index()
        {
            return View(db.Attributes.Include(a=>a.AttributeValues).ToList());
        }

        // GET: Admin/Attributes/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            data.Attribute attribute = db.Attributes.Find(id);
            if (attribute == null)
            {
                return HttpNotFound();
            }
            return View(attribute);
        }

        // GET: Admin/Attributes/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Admin/Attributes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,Insertable")] data.Attribute attribute,string tagler)
        {
            if (string.IsNullOrEmpty(tagler))
            {
                ModelState.AddModelError("","Değer Eklemediniz!");
                return View(attribute);
            }
            if (ModelState.IsValid)
            {
                db.Attributes.Add(attribute);
                db.SaveChanges();
                if (!tagler.Contains(","))
                {
                    AttributeValue AV = new AttributeValue();
                    AV.AttributeId = attribute.Id;
                    AV.Value = tagler.Trim().Replace(" ","-").Replace(" ", "-").Replace(" ", "-");
                    db.AttributeValues.Add(AV);
                    db.SaveChanges();
                }
                else
                {
                    foreach (var item in tagler.Split(','))
                    {
                        AttributeValue AV = new AttributeValue();
                        AV.AttributeId = attribute.Id;
                        AV.Value = item.Trim().Replace(" ", "-").Replace(" ", "-").Replace(" ", "-");
                        db.AttributeValues.Add(AV);
                        db.SaveChanges();
                    }
                }
                return RedirectToAction("Index");
            }

            return View(attribute);
        }

        // GET: Admin/Attributes/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            data.Attribute attribute = db.Attributes.Include(a=>a.AttributeValues).Where(a=>a.Id==id).FirstOrDefault();
            if (attribute == null)
            {
                return HttpNotFound();
            }
            return View(attribute);
        }

        // POST: Admin/Attributes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,Insertable")] data.Attribute attribute,string tagler)
        {
            if (string.IsNullOrEmpty(tagler))
            {
                ModelState.AddModelError("", "Değer Eklemediniz!");
                return View(attribute);
            }
            string ff = "";
            if (ModelState.IsValid)
            {
                db.Entry(attribute).State = EntityState.Modified;
                db.SaveChanges();
                foreach (var item in db.AttributeValues.Where(a=>a.AttributeId==attribute.Id).ToList())
                {
                    db.AttributeValues.Remove(item);
                    db.SaveChanges();
                }
                string sontagler = tagler;
                if (!sontagler.Contains(","))
                {
                    AttributeValue AV = new AttributeValue();
                    AV.AttributeId = attribute.Id;
                    AV.Value = sontagler;
                    db.AttributeValues.Add(AV);
                    db.SaveChanges();
                }
                else
                {
                    foreach (var item in tagler.Split(','))
                    {
                        AttributeValue AV = new AttributeValue();
                        AV.AttributeId = attribute.Id;
                        AV.Value = item;
                        db.AttributeValues.Add(AV);
                        db.SaveChanges();
                    }
                }




                return RedirectToAction("Index");
            }
            else
            {
                foreach (ModelState modelState in ViewData.ModelState.Values)
                {
                    foreach (ModelError error in modelState.Errors)
                    {
                       ff+=(error.ErrorMessage);
                    }
                }
            }
            ViewBag.err = ff;
            return View(attribute);
        }

        // GET: Admin/Attributes/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            data.Attribute attribute = db.Attributes.Find(id);
            if (attribute == null)
            {
                return HttpNotFound();
            }
            return View(attribute);
        }

        // POST: Admin/Attributes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            data.Attribute attribute = db.Attributes.Find(id);
            db.Attributes.Remove(attribute);
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
