using System;

namespace Shared.DTO.Song
{
    public class SongDetailDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string SongBase64 { get; set; }
        public int AddedByUserId { get; set; }
        public string AddedByUsername { get; set; }
        public bool IsPlaying { get; set; }
        public DateTime Created { get; set; }
        public int CurrentSongPosition { get; set; }
        public bool FinishedPlaying { get; set; }
    }
}