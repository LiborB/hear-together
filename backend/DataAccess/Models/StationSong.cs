using System;

namespace DataAccess.Models
{
    public class StationSong
    {
        public int Id { get; set; }
        public Song Song { get; set; }
        public Station Station { get; set; }
        public int SongId { get; set; }
        public int StationId { get; set; }
        public int AddedByUserId { get; set; }
        public User AddedByUser { get; set; }
        public bool IsPlaying { get; set; }
        public int CurrentSongPosition { get; set; }
        public DateTime Created { get; set; }
        public bool FinishedPlaying { get; set; }
    }
}