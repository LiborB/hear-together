using System;
using DataAccess.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Shared.DTO.User;
using Shared.Exceptions;

namespace API.Controllers
{
    [Route("api/user")]
    public class UserController : BaseController
    {
        public UserController(IUserService userService) : base(userService)
        {
        }
        [Route("create")]
        [HttpPost]
        public ActionResult<UserDTO> Create([FromBody] CreateUserDTO createUserModel)
        {
            try
            {
                var createdUser =_userService.CreateAccount(createUserModel);
                return Ok(createdUser);
            }
            catch (UsernameTakenException exception)
            {
                return BadRequest("Username is already taken");
            }
            
            
        }

        [Route("login")]
        [HttpPost]
        public ActionResult<UserDTO> Login([FromBody] LoginDTO loginModel)
        {
            try
            {
                var user = _userService.Login(loginModel);
                return Ok(user);
            }
            catch (InvalidLoginException e)
            {
                return Unauthorized("Username/password incorrect");
            }
        }

        [Route("auth")]
        [HttpPost]
        public ActionResult<UserDTO> Auth()
        {
            StringValues token;
            HttpContext.Request.Headers.TryGetValue("user_token", out token);
            if (String.IsNullOrEmpty(token))
            {
                return Unauthorized();
            }
            try
            {
                var user = _userService.Auth(token);
                return Ok(user);
            }
            catch (TokenInvalidException exception)
            {
                return Unauthorized();
            }
        }

        [Route("logout")]
        [HttpPost]
        public IActionResult Logout()
        {
            StringValues token;
            HttpContext.Request.Headers.TryGetValue("user_token", out token);
            if (String.IsNullOrEmpty(token))
            {
                _userService.Logout(token);
            }

            return Ok();
        }
    }
}