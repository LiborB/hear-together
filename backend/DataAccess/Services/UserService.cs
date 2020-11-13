using System;
using System.Linq;
using DataAccess.Models;
using DataAccess.Utility;
using Shared.DTO.User;
using Shared.Exceptions;

namespace DataAccess.Services
{
    public class UserService : IUserService
    {
        private readonly HTContext _context;

        public UserService(HTContext context)
        {
            _context = context;
        }

        public UserDTO CreateAccount(CreateUserDTO loginModel)
        {
            var usernameTaken = _context.Users.Any(x => x.Username == loginModel.Username);
            if (usernameTaken)
            {
                throw new UsernameTakenException();
            }

            var passwordHash = PasswordUtility.GenerateHashedPassword(loginModel.Password);
            var newUser = new User()
            {
                Username = loginModel.Username,
                Created = DateTime.UtcNow,
                Token = Guid.NewGuid().ToString(),
                PasswordHash = passwordHash
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();
            return new UserDTO()
            {
                Id = newUser.Id,
                Username = newUser.Username,
                Token = newUser.Token
            };
        }

        public UserDTO Auth(string token)
        {
            var user = _context.Users.FirstOrDefault(x => x.Token == token);
            if (user == null)
            {
                throw new TokenInvalidException();
            }

            return new UserDTO()
            {
                Id = user.Id,
                Token = user.Token,
                Username = user.Username
            };
        }

        public UserDTO Login(LoginDTO login)
        {
            var user = _context.Users.FirstOrDefault(x => x.Username == login.Username);
            if (user == null)
            {
                throw new InvalidLoginException();
            }

            var isPasswordCorrect = PasswordUtility.IsPasswordCorrect(login.Password, user.PasswordHash);
            if (!isPasswordCorrect)
            {
                throw new InvalidLoginException();
            }

            user.Token = Guid.NewGuid().ToString();
            _context.SaveChanges();
            return new UserDTO()
            {
                Id = user.Id,
                Token = user.Token,
                Username = user.Username
            };
        }

        public void Logout(string token)
        {
            var user = _context.Users.FirstOrDefault(x => x.Token == token);
            if (user != null)
            {
                user.Token = null;
                _context.SaveChanges();
            }
        }
    }
}