using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models
{
    public class HTContext : DbContext
    {
        public HTContext(DbContextOptions<HTContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Station> Stations { get; set; }
    }
}