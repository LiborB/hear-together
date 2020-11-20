using System.Collections.Generic;
using System.Threading.Tasks;
using DataAccess.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.DTO.Song;

namespace API.Controllers
{
    [Route("api/song")]
    public class SongController : BaseController
    {
        private readonly ISongService _songService;
        public SongController(IUserService userService, ISongService songService) : base(userService)
        {
            _songService = songService;
        }

        [Route("addbyurl")]
        [HttpPost]
        public async Task<ActionResult> AddSongByUrl([FromBody] AddUrlSongDTO addSong)
        {
            var user = HandleAuthGetUser();
            await _songService.AddSongByUrl(addSong, user.Id);
            return Ok();
        }
        
        [Route("getqueuedsongs/{stationId}")]
        [HttpGet]
        public async Task<ActionResult<List<QueuedSongDTO>>> GetQueuedSongs(int stationId)
        {
            HandleAuthGetUser();
            var songs = await _songService.GetQueuedSongs(stationId);
            return Ok(songs);
        }

        
        [Route("getplayingsong/{stationId}")]
        [HttpGet]
        public async Task<ActionResult<PlayingSongDTO>> GetPlayingSong(int stationId)
        {
            HandleAuthGetUser();
            var song = await _songService.GetCurrentPlayingSong(stationId);
            return Ok(song);
        }
        
    }
}