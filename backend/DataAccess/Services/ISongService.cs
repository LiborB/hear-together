using System.Threading.Tasks;
using Shared.DTO.Song;

namespace DataAccess.Services
{
    public interface ISongService
    {
        Task<SongDetailDTO> AddSongByUrl(AddUrlSongDTO addSong, int addedByUserId);
    }
}