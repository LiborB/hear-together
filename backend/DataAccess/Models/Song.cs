using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models
{
    public class Song
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Filename { get; set; }
        public double Duration { get; set; }
        public string YoutubeUrl { get; set; }
        public User AddedByUser { get; set; }
        public int AddedByUserId { get; set; }
        
        public ICollection<StationSong> StationSongs { get; set; }
    }
}