using System;
using System.Threading.Tasks;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using DatingApp_API.Data;
using DatingApp_API.Models;
using DatingApp_API.DTOs;

namespace DatingApp_API.Controllers
{
    [Route("api/v1/[controller]")] // [auth]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuthRepository _repo;

        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _config = config;
            _repo = repo;
        }

        /*
        [HttpPost("register")] // api/v1/auth/register
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            if(await _repo.UserExists(userForRegisterDto.Username.ToLower())) 
            {
                return BadRequest("Username already exists");
            }
            var userToCreate = new User { Username = userForRegisterDto.Username };
            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            return StatusCode(201);
        }
        */

        [HttpPost("login")] // api/v1/auth/login
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var userFromRepo = await _repo.Login(userForLoginDto.Username, userForLoginDto.Password);

            if(userFromRepo == null) 
            {
                return Unauthorized();
            }

            var claims = new[] 
            { 
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.ID.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            
            var tokenDescriptor = new SecurityTokenDescriptor 
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok( new { token = tokenHandler.WriteToken(token) } );

        }
    }
}