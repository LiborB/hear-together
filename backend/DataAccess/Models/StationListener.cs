using System;

namespace DataAccess.Models
{
    public class StationListener
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public Station Station { get; set; }
        public int StationId { get; set; }
        public DateTime Created { get; set; }
    }
}