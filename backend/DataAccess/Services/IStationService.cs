using System.Collections.Generic;
using Shared.DTO.Station;

namespace DataAccess.Services
{
    public interface IStationService
    {
        int CreateStation(int userId);
        void UpdateStation(UpdateStationDTO updateStation);
        StationDetailDTO GetStationDetail(int stationId);

        List<StationSimpleDTO> GetAllStations(int skip, int take);
    }
}