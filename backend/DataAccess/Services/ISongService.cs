using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.DTO.Song;

namespace DataAccess.Services
{
    public interface ISongService
    {
        Task AddSongByUrl(AddUrlSongDTO addSong, int addedByUserId);
        Task<PlayingSongDTO> GetCurrentPlayingSong(int stationId);
        IEnumerable<QueuedSongDTO> GetQueuedSongs(int stationId);
        Task<PlayingSongDTO> FinishPlayingSong(int stationSongId, int stationId);
        IEnumerable<SongSearchItemDTO> SearchSongs(string query);
        Task AddToQueue(int songId, int stationId, int userId);
    }
}