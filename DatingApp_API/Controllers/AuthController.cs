using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DatingApp_API.Data;
using DatingApp_API.Models;

namespace DatingApp_API.Controllers
{
    [Route("api/v1/[controller]")] // api/v1/values
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;

        public AuthController(IAuthRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(string username, string password)
        {
            username = username.ToLower();
            if(await _repo.UserExists(username)) 
            {
                return BadRequest("Username already exists");
            }
            var userToCreate = new User { Username = username };
            var createdUser = await _repo.Register(userToCreate, password);

            return StatusCode(201);
        }
    }
}