using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DatingApp_API.Data;
using DatingApp_API.Models;
using DatingApp_API.DTOs;

namespace DatingApp_API.Controllers
{
    [Route("api/v1/[controller]")] // api/v1/auth
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;

        public AuthController(IAuthRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("register")] // api/v1/auth/register
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            if(await _repo.UserExists(userForRegisterDto.Username)) 
            {
                return BadRequest("Username already exists");
            }
            var userToCreate = new User { Username = userForRegisterDto.Username };
            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            return StatusCode(201);
        }
    }
}