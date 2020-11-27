using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.DTO.Chat;

namespace DataAccess.Services
{
    public interface IChatService
    {
        IEnumerable<StationMessageDTO> GetStationMessages(int stationId, int userId);
        Task AddStationMessage(int stationId, int userId, string message);
    }
}