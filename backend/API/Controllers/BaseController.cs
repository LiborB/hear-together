using System;
using DataAccess.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Shared.DTO.User;
using Shared.Exceptions;

namespace API.Controllers
{
    public class BaseController : ControllerBase
    {
        protected readonly IUserService _userService;
        public BaseController(IUserService userService)
        {
            _userService = userService;
        }

        protected UserDTO HandleAuthGetUser()
        {
            StringValues token;
            HttpContext.Request.Headers.TryGetValue("user_token", out token);
            if (String.IsNullOrEmpty(token))
            {
                throw new InvalidLoginException();
            }

            var user = _userService.Auth(token);
            return user;
        }
    }
}