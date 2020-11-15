using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models
{
    public class Station
    {
        public int Id { get; set; }
        [MaxLength(50)] [Required] public string Name { get; set; }
        [MaxLength(500)] public string Description { get; set; }
        public User Owner { get; set; }
        [ForeignKey("Owner")] [Required] public int OwnerId { get; set; }
        public bool Private { get; set; }
        public DateTime Created { get; set; }
        
        public ICollection<StationMessage> StationMessages { get; set; }
        public ICollection<StationListener> StationListeners { get; set; }
        public ICollection<StationSong> StationSongs { get; set; }
    }
}