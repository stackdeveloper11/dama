using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.data
{
    public class aksetDB : IdentityDbContext<User>
    {
        public aksetDB() : base("name=aksetDB", throwIfV1Schema: false)
        {
            Configuration.LazyLoadingEnabled = false;
        }
        public static aksetDB Create()
        {
            return new aksetDB();
        }
        //------------------------------------------------------------------------------------
       // public virtual DbSet< MyProperty { get; set; }
        public virtual DbSet<Store> Stores { get; set; }
        public virtual DbSet<Review> Reviews { get; set; }
        public virtual DbSet<Rating> Ratings { get; set; }
        public virtual DbSet<Komisyon> Komisyons { get; set; }
        public virtual DbSet<ProductVariant> ProductVariants { get; set; }
        public virtual DbSet<ProductAttribute> ProductAttributes { get; set; }
        public virtual DbSet<AttributeKategori> AttributeKategoris { get; set; }
        public virtual DbSet<AttributeValue> AttributeValues { get; set; }
        public virtual DbSet<Attribute> Attributes { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<ProductImage> ProductImage { get; set; }
        public virtual DbSet<Kategori> Kategoris { get; set; }
        public virtual DbSet<ProductCategory> ProductCategorys { get; set; }
        public virtual DbSet<ProductStock> ProductStocks { get; set; }
        public virtual DbSet<Permission> Permissions { get; set; }
        public virtual DbSet<RolePermission> RolePermissions { get; set; }
        public virtual DbSet<Address> Addressss { get; set; }
        public virtual DbSet<Group> Groups { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<OrderProduct> OrderProducts { get; set; }
        public virtual DbSet<OrderHistory> OrderHistorys { get; set; }
        public virtual DbSet<OrderMessage> OrderMessages { get; set; }
        public virtual DbSet<OrderStatus> OrderStatuss { get; set; }
        public virtual DbSet<SearchKeyword> SearchKeywords { get; set; }
        //------------------------------------------------------------------------------------
        public virtual DbSet<hesap> hesaps { get; set; }
        public virtual DbSet<ustunalti> ustunaltis { get; set; }
        public virtual DbSet<ustmenu> ustmenus { get; set; }
        public virtual DbSet<supmenu> supmenus { get; set; }
        public virtual DbSet<menu> menus { get; set; }
        public virtual DbSet<altmenu> altmenus { get; set; }
        public virtual DbSet<urunadetozellik> urunadetozelliks { get; set; }
        public virtual DbSet<Makalekategori> Makalekategoris { get; set; }
        public virtual DbSet<urun> uruns { get; set; }
        public virtual DbSet<ikonlar> ikonlars { get; set; }
        public virtual DbSet<yorum> yorums { get; set; }
        public virtual DbSet<filitre> filitres { get; set; }
        public virtual DbSet<detay> detays { get; set; }
        public virtual DbSet<siparisurunler> siparisurunlers { get; set; }
        public virtual DbSet<siparis> sipariss { get; set; }
        public virtual DbSet<alt> alts { get; set; }
        public virtual DbSet<ozellik> ozelliks { get; set; }
        public virtual DbSet<sagtaraf> sagtarafs { get; set; }
        public virtual DbSet<favori> favoris { get; set; }
        public virtual DbSet<urunfilitreozellik> urunfilitreozelliks { get; set; }
        public virtual DbSet<katedetay> katedetays { get; set; }
        public virtual DbSet<katefilo> katefilos { get; set; }
        public virtual DbSet<Vitrinler> Vitrinlers { get; set; }
        public virtual DbSet<mesaj> mesajs { get; set; }
        public virtual DbSet<Makale> Makales { get; set; }
        public virtual DbSet<Etiket> Etikets { get; set; }
        public virtual DbSet<sistemayar> sistemayars { get; set; }
        public virtual DbSet<Sayfa> Sayfas { get; set; }
        public virtual DbSet<Ayar> Ayars { get; set; }
        public virtual DbSet<Slider> Sliders { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
          
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            if (modelBuilder == null)
            {
                throw new ArgumentNullException(nameof(modelBuilder));
            }
            base.OnModelCreating(modelBuilder);
        }

        public System.Data.Entity.DbSet<akset.data.Marka> Markas { get; set; }
    }
}