using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using DatingApp_API.Data;
using DatingApp_API.DTOs;
using System.Collections.Generic;
using DatingApp_API.Models;
using DatingApp_API.Helpers;
using System.Security.Claims;
using System;

namespace DatingApp_API.Controllers
{
    [Authorize] // all endpoints require auth
    [Route("api/v1/users/{userID}/[controller]")] // api/v1/users/5/messages
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userID, int id)
        {
            if(userID != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var message = await _repo.GetMessage(id);
            
            if(message == null)
                return NotFound();
            
            return Ok(message);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userID, [FromQuery] GetMessagesParams getMessagesParams)
        {
            if(userID != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            getMessagesParams.UserID = userID;
            
            var messagesFromRepo = await _repo.GetMessagesForUser(getMessagesParams);

            if(messagesFromRepo.Count == 0)
                return NotFound("There are no messages for this user.");

            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            Response.AddPagination(
                messagesFromRepo.CurrentPage,
                messagesFromRepo.PageSize,
                messagesFromRepo.TotalCount,
                messagesFromRepo.TotalPages
            );

            return Ok(messages);
            
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userID, MessageForCreationDto msgDto)
        {
            if(userID != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            msgDto.SenderID = userID;

            var recipient = await _repo.GetUser(msgDto.RecipientID);

            if(recipient == null)
                return BadRequest("Couldn't find user.");

            var message = _mapper.Map<Message>(msgDto);

            _repo.Add(message);

            var messageToReturn = _mapper.Map<MessageForCreationDto>(message);

            if(await _repo.SaveAll())
            {
                return CreatedAtRoute("GetMessage", new { userID = userID, id = message.ID }, messageToReturn);
            }

            throw new Exception("Creating message failed.");
        }
        
    }
}