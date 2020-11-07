using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public class User
    {
        public int Id { get; set; }
        [MaxLength(25)]
        [Required]
        public string Username { get; set; }
        [Required]
        [MaxLength(256)]
        public string PasswordHash { get; set; }
        [Required]
        public DateTime Created { get; set; }
        [MaxLength(256)]
        public string Token { get; set; }
        
        public virtual ICollection<Station> Stations { get; set; }
    }
}