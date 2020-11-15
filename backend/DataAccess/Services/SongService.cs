using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Models;
using Shared.DTO.Song;
using YoutubeExplode;
using YoutubeExplode.Videos.Streams;

namespace DataAccess.Services
{
    public class SongService : ISongService
    {
        private readonly HTContext _context;

        public SongService(HTContext context)
        {
            _context = context;
        }
        public async Task<SongDetailDTO> AddSongByUrl(AddUrlSongDTO addSong, int addedByUserId)
        {
            var existingSong = _context.Songs.FirstOrDefault(x => x.YoutubeUrl.ToUpper() == addSong.YoutubeUrl.ToUpper());
            if (existingSong != null)
            {
                var fileBytes = File.ReadAllBytes($"Data/{existingSong.Filename}");
                var songDetail = new SongDetailDTO()
                {
                    Id = existingSong.Id,
                    Title = existingSong.Title,
                    SongBase64 = Convert.ToBase64String(fileBytes)
                };
                return songDetail;
            }
            var youtube = new YoutubeClient();
            var video = await youtube.Videos.GetAsync(addSong.YoutubeUrl);
            var manifest = await youtube.Videos.Streams.GetManifestAsync(video.Id);
            var streamInfo = manifest.GetAudioOnly().WithHighestBitrate();
            if (streamInfo != null)
            {
                var stream = await youtube.Videos.Streams.GetAsync(streamInfo);
                var filename = $"{DateTime.UtcNow.Ticks}.{streamInfo.Container}";
                youtube.Videos.Streams.DownloadAsync(streamInfo, $"Data/{filename}");
                var newSong = new Song()
                {
                    Duration = video.Duration.TotalSeconds,
                    Filename = filename,
                    Title = video.Title,
                    YoutubeUrl = addSong.YoutubeUrl.ToUpper(),
                    AddedByUserId = addedByUserId
                };
                await _context.Songs.AddAsync(newSong);
                await _context.SaveChangesAsync();
                using (var memoryStream = new MemoryStream())
                {
                    stream.CopyTo(memoryStream);
                    var audioBytes = memoryStream.ToArray();
                    var songDetail = new SongDetailDTO()
                    {
                        Id = newSong.Id,
                        Title = video.Title,
                        SongBase64 = Convert.ToBase64String(audioBytes)
                    };
                    return songDetail;
                }
            }
            throw new Exception("Couldn't load youtube video");
        }
    }
}