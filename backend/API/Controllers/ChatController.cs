using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using DataAccess.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.DTO.Chat;

namespace API.Controllers
{
    [Route("api/chat")]
    public class ChatController : BaseController
    {
        private readonly IChatService _chatService;
        public ChatController(IUserService userService, IChatService chatService) : base(userService)
        {
            _chatService = chatService;
        }

        [Route("stationmessages/{stationId}")]
        [HttpGet]
        public ActionResult<IEnumerable<StationMessageDTO>> GetStationMessages(int stationId)
        {
            var user = HandleAuthGetUser();
            var messages = _chatService.GetStationMessages(stationId, user.Id);
            return Ok(messages);
        }

        [Route("addmessage/{stationId}")]
        [HttpPost]
        public async Task<ActionResult> AddStationMessage(int stationId, [FromBody] AddMessageDTO addMessage)
        {
            var user = HandleAuthGetUser();
            await _chatService.AddStationMessage(stationId, user.Id, addMessage.Message);
            return Ok();
        }
    }
}