using System;
using System.Collections.Generic;
using System.Linq;
using DataAccess.Models;
using Shared.DTO.Station;
using Shared.Exceptions;

namespace DataAccess.Services
{
    public class StationService : IStationService
    {
        private readonly HTContext _context;
        public StationService(HTContext context)
        {
            _context = context;
        }
        public int CreateStation(int userId)
        {
            var user = _context.Users.First(x => x.Id == userId);
            var newStation = new Station()
            {
                Created = DateTime.UtcNow,
                OwnerId = userId,
                Private = false,
                Name = user.Username + "'s station"
            };
            _context.Stations.Add(newStation);
            _context.SaveChanges();
            return newStation.Id;
        }

        public void UpdateStation(UpdateStationDTO updateStation)
        {
            var station = _context.Stations.FirstOrDefault(x => x.Id == updateStation.Id);
            if (station == null)
            {
                throw new StationNotFoundException();
            }

            station.Description = updateStation.Description;
            station.Name = updateStation.Name;
            station.Private = updateStation.Private;
            _context.SaveChanges();
        }

        public StationDetailDTO GetStationDetail(int stationId)
        {
            var station = _context.Stations.FirstOrDefault(x => x.Id == stationId);
            if (station == null)
            {
                throw new StationNotFoundException();
            }
            
            var stationDetail = new StationDetailDTO();
            stationDetail.Name = station.Name;
            stationDetail.Description = station.Description;
            stationDetail.Id = station.Id;
            stationDetail.Private = station.Private;
            stationDetail.OwnerId = station.OwnerId;
            stationDetail.OwnerUsername = station.Owner.Username;
            return stationDetail;
        }

        public List<StationSimpleDTO> GetAllStations(int skip, int take)
        {
            var stations = _context.Stations.Skip(skip);
            if (take > 0)
            {
                stations = stations.Take(take);
            }

            var stationSimples = stations.Select(x => new StationSimpleDTO()
            {
                Id = x.Id,
                Description = x.Description,
                Name = x.Name,
                OwnerId = x.OwnerId,
                OwnerUsername = x.Owner.Username,
                NumberOfListeners = _context.StationListeners.Count(listener => listener.StationId == x.Id)
            });
            return stationSimples.ToList();
        }
    }
}