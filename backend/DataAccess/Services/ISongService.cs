using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.DTO.Song;

namespace DataAccess.Services
{
    public interface ISongService
    {
        Task AddSongByUrl(AddUrlSongDTO addSong, int addedByUserId);
        Task<PlayingSongDTO> GetCurrentPlayingSong(int stationId);
        Task<List<QueuedSongDTO>> GetQueuedSongs(int stationId);
        Task<PlayingSongDTO> FinishPlayingSong(int stationSongId, int stationId);
    }
}