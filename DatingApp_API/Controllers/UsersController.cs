using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using DatingApp_API.Data;
using DatingApp_API.DTOs;
using DatingApp_API.Models;
using DatingApp_API.Helpers;
using DatingApp_API.QueryParams;

namespace DatingApp_API.Controllers
{
    [Authorize] // all endpoints require auth
    [Route("api/v1/[controller]")] // [users]
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

        [HttpGet] // api/v1/users
        public async Task<IActionResult> GetUsers([FromQuery]GetUsersParams getUsersParams)
        {
            var currentUserID = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user = await _repo.GetUser(currentUserID);
            getUsersParams.UserID = currentUserID;

            var users = await _repo.GetUsers(getUsersParams);
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(
                users.CurrentPage,
                users.ItemsPerPage,
                users.TotalItems,
                users.TotalPages
            );

            return Ok(usersToReturn);
        }

        [HttpGet("{id}")] // api/v1/users/{id}
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);

            if(user == null)
            {
                return BadRequest(new { error = "User doesn't exist." });
            }

            var userToReturn = _mapper.Map<UserForListDto>(user);
            return Ok(userToReturn);
        }

        [HttpPost("{id}/like/{recipientID}")] // api/v1/users/{id}/like/{recipientID}
        public async Task<IActionResult> LikeUser(int id, int recipientID)
        {
            var like = await _repo.GetLike(id, recipientID);

            if(like != null)
                return BadRequest(new { error = "You already liked this user." });

            if(await _repo.GetUser(recipientID) == null)
                return NotFound(new { error = "User doesn't exist." });

            like = new Like { LikerID = id, LikeeID = recipientID };
            _repo.Add<Like>(like);

            // demo code below: auto like user back
            var likeBack = await _repo.GetLike(recipientID, id);

            if(likeBack != null)
                return BadRequest(new { error = "You already liked this user." });

            if(await _repo.GetUser(id) == null)
                return NotFound(new { error = "User doesn't exist." });

            likeBack = new Like { LikerID = recipientID, LikeeID = id};
            _repo.Add<Like>(likeBack);
            // delete block above if u want to remove demo feature

            if(await _repo.SaveAll())
                return Ok();
            else 
                return BadRequest(new { error = "Failed to like user." });
        }

        [HttpDelete("{id}/like/{recipientID}")] // api/v1/users/{id}/like/{recipientID}
        public async Task<IActionResult> UnlikeUser(int id, int recipientID)
        {
            var like = await _repo.GetLike(id, recipientID);

            if(like == null)
                return BadRequest(new { error = "You already unliked this user." });

            _repo.Delete<Like>(like);

            // demo code below: auto unlike both users
            var like2 = await _repo.GetLike(recipientID, id);

            if(like2 == null)
                return BadRequest(new { error = "You already unliked this user." });

            _repo.Delete<Like>(like2);
            // delete block above if u want to remove demo feature

            if(await _repo.SaveAll())
                return Ok();
            else 
                return BadRequest(new { error = "Failed to unlike user." });
        }

        [Authorize(Policy = "IsDataOwner")] // requires {userID} instead of {id}
        [HttpPut("{userID}/introduction")] // api/v1/users/{userID}/introduction
        public async Task<IActionResult> EditUserIntroduction(int userID, [FromQuery]string introduction)
        {
            var user = await _repo.GetUser(userID);
            user.Introduction = introduction;

            if(await _repo.SaveAll())
                return Ok();
            else 
                return BadRequest(new { error = "Failed to update." });
        }
    }
}