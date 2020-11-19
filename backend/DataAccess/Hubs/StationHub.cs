using System;
using System.Threading.Tasks;
using DataAccess.Services;
using Microsoft.AspNetCore.SignalR;
using Shared.DTO.Station;

namespace DataAccess.Hubs
{
    public class StationHub : Hub
    {
        private readonly IStationService _stationService;

        public StationHub(IStationService stationService)
        {
            _stationService = stationService;
        }

        public async Task<string> JoinStationRoom(ListenerDetailDTO listenerDetail, int stationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, stationId.ToString());
            await Clients.OthersInGroup(stationId.ToString()).SendAsync("UserJoinStation", listenerDetail);
            await _stationService.AddStationListenerAsync(stationId, listenerDetail.UserId);
            return stationId.ToString();
        }

        public async Task LeaveStationRoom(ListenerDetailDTO listenerDetail, int stationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, stationId.ToString());
            await Clients.OthersInGroup(stationId.ToString()).SendAsync("UserLeaveStation", listenerDetail);
            await _stationService.RemoveStationListenerAsync(stationId, listenerDetail.UserId);
        }
    }
}