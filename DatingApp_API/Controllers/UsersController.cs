using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using DatingApp_API.Data;
using DatingApp_API.DTOs;
using System.Collections.Generic;
using DatingApp_API.Models;

namespace DatingApp_API.Controllers
{
    [Authorize] // all endpoints require auth
    [Route("api/v1/[controller]")] // api/v1/users
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpPost("{id}/like/{recipientID}")]
        public async Task<IActionResult> LikeUser(int id, int recipientID)
        {
            var like = await _repo.GetLike(id, recipientID);

            if(like != null)
                return BadRequest("You already liked this user.");
            if(await _repo.GetUser(recipientID) == null)
                return NotFound("User doesn't exist.");

            like = new Like { LikerID = id, LikeeID = recipientID };
            _repo.Add<Like>(like);

            if(await _repo.SaveAll())
                return Ok("Liked successfully.");
            else 
                return BadRequest("Failed to like user.");
        }
    }
}