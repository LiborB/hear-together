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
            var dataPath = Path.Combine(Directory.GetParent(Environment.CurrentDirectory).FullName, "Data");
            var existingSong = _context.Songs.FirstOrDefault(x => x.YoutubeUrl.ToUpper() == addSong.YoutubeUrl.ToUpper());
            var anySongPlaying =
                _context.StationSongs.Any(x => x.StationId == addSong.StationId && !x.FinishedPlaying);
            if (existingSong != null)
            {
                _context.StationSongs.Add(new StationSong()
                {
                    IsPlaying = !anySongPlaying,
                    StationId = addSong.StationId,
                    AddedByUserId = addedByUserId,
                    Created = DateTime.UtcNow,
                    SongId = existingSong.Id
                });
                var saveChangesTask = _context.SaveChangesAsync();
                var fileBytes = await File.ReadAllBytesAsync(Path.Combine(dataPath, existingSong.Filename));
                var songDetail = new SongDetailDTO()
                {
                    Id = existingSong.Id,
                    Title = existingSong.Title,
                    SongBase64 = Convert.ToBase64String(fileBytes)
                };
                await saveChangesTask;
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
                await youtube.Videos.Streams.DownloadAsync(streamInfo, Path.Combine(dataPath, filename));
                var newSong = new Song()
                {
                    Duration = video.Duration.TotalSeconds,
                    Filename = filename,
                    Title = video.Title,
                    YoutubeUrl = addSong.YoutubeUrl.ToUpper(),
                    AddedByUserId = addedByUserId
                };
                _context.Songs.Add(newSong);
                await _context.SaveChangesAsync();
                _context.StationSongs.Add(new StationSong()
                {
                    IsPlaying = !anySongPlaying,
                    StationId = addSong.StationId,
                    AddedByUserId = addedByUserId,
                    Created = DateTime.UtcNow,
                    SongId = newSong.Id
                });
                var saveChangesTask = _context.SaveChangesAsync();
                await using var memoryStream = new MemoryStream();
                await stream.CopyToAsync(memoryStream);
                var audioBytes = memoryStream.ToArray();
                var songDetail = new SongDetailDTO()
                {
                    Id = newSong.Id,
                    Title = video.Title,
                    SongBase64 = Convert.ToBase64String(audioBytes)
                };
                await saveChangesTask;
                return songDetail;
            }
            throw new Exception("Couldn't load youtube video");
        }
    }
}