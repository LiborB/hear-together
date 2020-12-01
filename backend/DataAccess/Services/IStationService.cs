using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.DTO.Station;

namespace DataAccess.Services
{
    public interface IStationService
    {
        int CreateStation(int userId);
        void UpdateStation(UpdateStationDTO updateStation);
        StationDetailDTO GetStationDetail(int stationId);
        List<StationSimpleDTO> GetAllStations(int userId, int skip, int take);
        Task<List<ListenerDetailDTO>> GetStationListenersAsync(int stationId);
        Task AddStationListenerAsync(int stationId, int userId, string connectionId);
        Task RemoveStationListenerAsync(int stationId, int userId);
        Task RemoveStationListenerFromConnectionAsync(string contextConnectionId);
    }
}