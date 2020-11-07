using Shared.DTO.User;

namespace DataAccess.Services
{
    public interface IUserService
    {
        UserDTO CreateAccount(CreateUserDTO loginModel);
        UserDTO Auth(string token);
        UserDTO Login(LoginDTO login);
        void Logout(string token);
    }
}