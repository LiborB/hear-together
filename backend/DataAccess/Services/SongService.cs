using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Hubs;
using DataAccess.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Shared.DTO.Song;
using YoutubeExplode;
using YoutubeExplode.Videos.Streams;

namespace DataAccess.Services
{
    public class SongService : ISongService
    {
        private readonly HTContext _context;
        private readonly IHubContext<StationHub> _hub;

        public SongService(HTContext context, IHubContext<StationHub> stationHub)
        {
            _context = context;
            _hub = stationHub;
        }

        public async Task AddSongByUrl(AddUrlSongDTO addSong, int addedByUserId)
        {
            var dataPath = Path.Combine(Directory.GetParent(Environment.CurrentDirectory).FullName, "Data");
            var existingSong =
                _context.Songs.FirstOrDefault(x => x.YoutubeUrl.ToUpper() == addSong.YoutubeUrl.ToUpper());
            var user = _context.Users.First(x => x.Id == addedByUserId);
            var anySongPlaying =
                _context.StationSongs.Any(x => x.StationId == addSong.StationId && x.IsPlaying);
            if (existingSong != null)
            {
                var stationSong = new StationSong()
                {
                    IsPlaying = !anySongPlaying,
                    StationId = addSong.StationId,
                    AddedByUserId = addedByUserId,
                    Created = DateTime.UtcNow,
                    SongId = existingSong.Id
                };
                _context.StationSongs.Add(stationSong);
                await _context.SaveChangesAsync();

                if (!anySongPlaying)
                {
                    var playSong = new PlayingSongDTO
                    {
                        Duration = existingSong.Duration,
                        Id = stationSong.Id,
                        Title = existingSong.Title,
                        SongBase64 = await GetSongBase64(existingSong.Filename)
                    };

                    await _hub.Clients.Group(addSong.StationId.ToString()).SendAsync("PlaySong", playSong);
                }
                else
                {
                    var queuedSong = new QueuedSongDTO
                    {
                        Duration = existingSong.Duration,
                        Id = stationSong.Id,
                        Title = existingSong.Title
                    };
                    await _hub.Clients.Group(addSong.StationId.ToString()).SendAsync("SongAddedToQueue", queuedSong);
                }
            }
            else
            {
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
                    var stationSong = new StationSong()
                    {
                        IsPlaying = !anySongPlaying,
                        StationId = addSong.StationId,
                        AddedByUserId = addedByUserId,
                        Created = DateTime.UtcNow,
                        SongId = newSong.Id
                    };
                    _context.StationSongs.Add(stationSong);
                    var saveChangesTask = _context.SaveChangesAsync();
                    await using var memoryStream = new MemoryStream();
                    await stream.CopyToAsync(memoryStream);
                    var audioBytes = memoryStream.ToArray();
                    var base64 = $"data:audio/{Path.GetExtension(filename).TrimStart('.')};base64,{Convert.ToBase64String(audioBytes)}";
                    await saveChangesTask;
                    if (!anySongPlaying)
                    {
                        var playSong = new PlayingSongDTO
                        {
                            Duration = newSong.Duration,
                            Id = stationSong.Id,
                            Title = newSong.Title,
                            SongBase64 = base64
                        };

                        await _hub.Clients.Group(addSong.StationId.ToString()).SendAsync("PlaySong", playSong);
                    }
                    else
                    {
                        var queuedSong = new QueuedSongDTO
                        {
                            Duration = newSong.Duration,
                            Id = stationSong.Id,
                            Title = newSong.Title
                        };
                        await _hub.Clients.Group(addSong.StationId.ToString()).SendAsync("SongAddedToQueue", queuedSong);
                    }
                }
            }
        }

        public async Task<List<QueuedSongDTO>> GetQueuedSongs(int stationId)
        {
            var songs = _context.StationSongs.Include(x => x.Song)
                .Where(x => x.StationId == stationId && !x.FinishedPlaying && !x.IsPlaying);
            return await songs.Select(x => new QueuedSongDTO()
            {
                Duration = x.Song.Duration,
                Id = x.Id,
                Title = x.Song.Title
            }).ToListAsync();
        }

        public async Task<PlayingSongDTO> FinishPlayingSong(int stationSongId, int stationId)
        {
            var stationSong = _context.StationSongs.First(x => x.Id == stationSongId);
            stationSong.IsPlaying = false;
            stationSong.FinishedPlaying = true;
            await _context.SaveChangesAsync();
            var nextInQueue = _context.StationSongs.Include(x => x.Song).Where(x =>
                x.StationId == stationId && x.Id != stationSongId && !x.FinishedPlaying).OrderByDescending(x => x.Created).FirstOrDefault();
            if (nextInQueue != null)
            {
                var playingSong = new PlayingSongDTO
                {
                    Duration = nextInQueue.Song.Duration,
                    Id = nextInQueue.Id,
                    Title = nextInQueue.Song.Title,
                    SongBase64 = await GetSongBase64(nextInQueue.Song.Filename)
                };
                return playingSong;
            }
            return null;
        }

        private async Task<string> GetSongBase64(string filename)
        {
            var dataPath = Path.Combine(Directory.GetParent(Environment.CurrentDirectory).FullName, "Data");
            var extension = Path.GetExtension(filename);
            var fileBytes = await File.ReadAllBytesAsync(Path.Combine(dataPath, filename));
            var base64 = Convert.ToBase64String(fileBytes);
            return $"data:audio/{extension.TrimStart('.')};base64,{base64}";
        }

        public async Task<PlayingSongDTO> GetCurrentPlayingSong(int stationId)
        {
            var stationSongs = _context.StationSongs.Include(x => x.Song)
                .Where(x => x.StationId == stationId && !x.FinishedPlaying);
            if (stationSongs.Any())
            {
                var currentPlayingSong = stationSongs.FirstOrDefault(x => x.IsPlaying);
                PlayingSongDTO playingSong;
                if (currentPlayingSong == null)
                {
                    var newPlayingSong = stationSongs.OrderByDescending(x => x.Created).First();
                    newPlayingSong.IsPlaying = true;
                    playingSong = new PlayingSongDTO()
                    {
                        Duration = newPlayingSong.Song.Duration,
                        Id = newPlayingSong.Id,
                        Title = newPlayingSong.Song.Title,
                        SongBase64 = await GetSongBase64(newPlayingSong.Song.Filename)
                    };
                    await _context.SaveChangesAsync();
                }
                else
                {
                    playingSong = new PlayingSongDTO()
                    {
                        Duration = currentPlayingSong.Song.Duration,
                        Id = currentPlayingSong.Id,
                        Title = currentPlayingSong.Song.Title,
                        CurrentSongPosition = currentPlayingSong.CurrentSongPosition,
                        SongBase64 = await GetSongBase64(currentPlayingSong.Song.Filename)
                    };
                }

                return playingSong;
            }

            return null;
        }
    }
}