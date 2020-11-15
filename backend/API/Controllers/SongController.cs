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
        public ActionResult<SongDetailDTO> AddSongByUrl([FromBody] AddUrlSongDTO addSong)
        {
            var user = HandleAuthGetUser();
            var songDetail = _songService.AddSongByUrl(addSong, user.Id);
            return Ok(songDetail);
        }
    }
}