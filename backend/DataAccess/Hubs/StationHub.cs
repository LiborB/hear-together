using System;
using System.Threading.Tasks;
using DataAccess.Services;
using Microsoft.AspNetCore.SignalR;
using Shared.DTO.Song;
using Shared.DTO.Station;

namespace DataAccess.Hubs
{
    public class StationHub : Hub
    {
        private readonly IStationService _stationService;
        private readonly ISongService _songService;

        public StationHub(IStationService stationService, ISongService songService)
        {
            _stationService = stationService;
            _songService = songService;
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

        public async Task AddSongToQueue(QueuedSongDTO song, int stationId)
        {
            await Clients.Group(stationId.ToString()).SendAsync("SongAddedToQueue", song);
        }
        
        public async Task PlaySong(PlayingSongDTO songDetail, int stationId)
        {
            await Clients.Group(stationId.ToString()).SendAsync("PlaySong", songDetail);
        }
        
        public async Task FinishSong(int stationSongId, int stationId)
        {
            var playingSong = await _songService.FinishPlayingSong(stationSongId, stationId);
            await Clients.Group(stationId.ToString()).SendAsync("PlaySong", playingSong);
            await Clients.Group(stationId.ToString()).SendAsync("SongRemovedFromQueue", playingSong.Id);
        }
    }
}