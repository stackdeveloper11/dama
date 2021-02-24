namespace akset.data.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    public sealed class Configuration : DbMigrationsConfiguration<akset.data.aksetDB>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(akset.data.aksetDB context)
        {
            RoleStore<Role> roleStore = new RoleStore<Role>(context);
            RoleManager<Role> roleManager = new RoleManager<Role>(roleStore);
            if (!roleManager.RoleExists("Admin"))
            {
                Role adminRole = new Role("Admin", "Y�netici");
                roleManager.Create(adminRole);
            }
            if (!roleManager.RoleExists("Uye"))
            {
                Role uyeRole = new Role("Uye", "Kullan�c�");
                roleManager.Create(uyeRole);
            }
            if (!roleManager.RoleExists("Musteri"))
            {
                Role musteriRole = new Role("Musteri", "Kullan�c�");
                roleManager.Create(musteriRole);
            }
            if (!roleManager.RoleExists("Satici"))
            {
                Role saticiRole = new Role("Satici", "Kullan�c�");
                roleManager.Create(saticiRole);
            }
        }
    }
}
