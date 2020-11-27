using System;

namespace Shared.DTO.Chat
{
    public class StationMessageDTO
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Message { get; set; }
    }
}