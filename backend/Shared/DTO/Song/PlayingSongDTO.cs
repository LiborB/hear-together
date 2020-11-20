namespace Shared.DTO.Song
{
    public class PlayingSongDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public double Duration { get; set; }
        public int CurrentSongPosition { get; set; }
        public string SongBase64 { get; set; }
    }
}