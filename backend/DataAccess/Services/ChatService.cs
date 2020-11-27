using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Hubs;
using DataAccess.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Shared.DTO.Chat;

namespace DataAccess.Services
{
    public class ChatService : IChatService
    {
        private readonly IHubContext<StationHub> _hub;

        private readonly HTContext _context;

        public ChatService(HTContext context, IHubContext<StationHub> stationHub)
        {
            _context = context;
            _hub = stationHub;
        }

        public IEnumerable<StationMessageDTO> GetStationMessages(int stationId, int userid)
        {
            var messages = _context.StationMessages.Include(x => x.User).Where(x => x.StationId == stationId);
            var stationMessages = messages.Select(x => new StationMessageDTO
            {
                Id = x.Id,
                Created = x.Created,
                Username = x.User.Username,
                UserId = x.UserId,
                Message = x.Message
            }).ToList();
            return stationMessages;
        }

        public async Task AddStationMessage(int stationId, int userId, string message)
        {
            var stationMessage = new StationMessage()
            {
                Created = DateTime.UtcNow,
                Message = message,
                StationId = stationId,
                UserId = userId
            };
            await _context.StationMessages.AddAsync(stationMessage);
            await _context.SaveChangesAsync();
            await _hub.Clients.Group(stationId.ToString()).SendAsync("StationMessageReceived", new StationMessageDTO()
            {
                Created = stationMessage.Created,
                Id = stationMessage.Id,
                Username = stationMessage.User.Username,
                UserId = userId,
                Message = stationMessage.Message
            });
        }
    }
}