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
        public async Task<ActionResult<SongDetailDTO>> AddSongByUrl([FromBody] AddUrlSongDTO addSong)
        {
            var user = HandleAuthGetUser();
            var songDetail = await _songService.AddSongByUrl(addSong, user.Id);
            return Ok(songDetail);
        }
    }
}