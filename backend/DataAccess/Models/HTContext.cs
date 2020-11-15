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
        public DbSet<StationListener> StationListeners { get; set; }
        public DbSet<StationMessage> StationMessages { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<StationSong> StationSongs { get; set; }
    }
}