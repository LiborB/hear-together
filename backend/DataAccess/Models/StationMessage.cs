using System;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public class StationMessage
    {
        public int Id { get; set; }
        [Required] [MaxLength(500)] public string Message { get; set; }
        public DateTime Created { get; set; }
        public virtual Station Station { get; set; }
        public int StationId { get; set; }
        public virtual User User { get; set; }
        public int UserId { get; set; }
    }
}