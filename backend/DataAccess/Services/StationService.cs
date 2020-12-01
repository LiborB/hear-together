using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
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
            var station = _context.Stations.Include(x => x.Owner).FirstOrDefault(x => x.Id == stationId);
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
            stationDetail.NumberOfListeners = _context.StationListeners.Count(x => x.StationId == stationId);
            return stationDetail;
        }

        public List<StationSimpleDTO> GetAllStations(int userId, int skip, int take)
        {
            var stations = _context.Stations.Where(x => x.OwnerId == userId || !x.Private).Skip(skip);
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

        public async Task<List<ListenerDetailDTO>> GetStationListenersAsync(int stationId)
        {
            var listeners = _context.StationListeners
                .Include(x => x.User)
                .Where(x => x.StationId == stationId)
                .Select(x => new ListenerDetailDTO()
                {
                     UserId = x.UserId,
                     Username = x.User.Username
                });
            return await listeners.ToListAsync();
        }

        public async Task AddStationListenerAsync(int stationId, int userId, string connectionId)
        {
            if (_context.StationListeners.Any(x => x.UserId == userId && x.StationId == stationId))
            {
                return;
            }

            var listener = new StationListener()
            {
                Created = DateTime.UtcNow,
                StationId = stationId,
                UserId = userId,
                ConnectionId = connectionId
            };
            _context.StationListeners.Add(listener);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveStationListenerAsync(int stationId, int userId)
        {
            var listener =
                _context.StationListeners.FirstOrDefault(x => x.UserId == userId && x.StationId == stationId);
            if (listener != null)
            {
                _context.StationListeners.Remove(listener);
               await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveStationListenerFromConnectionAsync(string contextConnectionId)
        {
            var stationListener = _context.StationListeners.FirstOrDefault(x => x.ConnectionId == contextConnectionId);
            if (stationListener != null)
            {
                _context.StationListeners.Remove(stationListener);
                await _context.SaveChangesAsync();
            }
        }
    }
}