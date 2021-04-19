using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using DatingApp_API.Data;
using DatingApp_API.DTOs;
using DatingApp_API.Models;
using DatingApp_API.Helpers;
using DatingApp_API.QueryParams;
using Newtonsoft.Json;

namespace DatingApp_API.Controllers
{
    [Authorize(Policy = "IsDataOwner")] // all endpoints require auth and {userID}
    [Route("api/v1/users/{userID}/[controller]")] // [messages]
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

        [HttpGet("{id}", Name = "GetMessage")] // api/v1/users/{userID}/messages/{id}
        public async Task<IActionResult> GetMessage(int userID, int id)
        {
            var message = await _repo.GetMessage(id);
            
            if(message == null)
                return NotFound();
            
            return Ok(message);
        }

        [HttpGet] // api/v1/users/{userID}/messages
        public async Task<IActionResult> GetMessagesForUser(int userID, [FromQuery]GetMessagesParams getMessagesParams)
        {
            getMessagesParams.UserID = userID;
            
            var messagesFromRepo = await _repo.GetMessagesForUser(getMessagesParams);

            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            Response.AddPagination(
                messagesFromRepo.CurrentPage,
                messagesFromRepo.ItemsPerPage,
                messagesFromRepo.TotalItems,
                messagesFromRepo.TotalPages
            );

            return Ok(messages);
        }

        [HttpGet("thread/{oppositeUserID}")] // api/v1/users/{userID}/messages/thread/{oppositeUserID}
        public async Task<IActionResult> GetMessagesThread(int userID, int oppositeUserID)
        {
            var messagesFromRepo = await _repo.GetMessagesThread(userID, oppositeUserID);

            foreach(var msg in messagesFromRepo) {
                if(msg.RecipientID == userID)
                {
                    msg.IsRead = true;
                    msg.DateRead = DateTime.Now;
                }
            }

            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            await _repo.SaveAll();
            
            return Ok(messageThread);
        }

        [HttpPost] // api/v1/users/{userID}/messages
        public async Task<IActionResult> CreateMessage(int userID, MessageForCreationDto msgDto)
        {
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

        [HttpDelete("{id}")] // api/v1/users/{userID}/messages/{id}
        public async Task<IActionResult> DeleteMessage(int id, int userID)
        {
            var messageFromRepo = await _repo.GetMessage(id);

            _repo.Delete(messageFromRepo);

            if(await _repo.SaveAll())
                return NoContent();

            return BadRequest("Error deleting the message. Message probably doesn't exist.");
        }

        [HttpDelete] // api/v1/users/{userID}/messages
        public async Task<IActionResult> DeleteMultipleMessages([FromQuery]DeleteMessagesParams deleteMessagesParams, int userID)
        {
            List<int> msgIDs = JsonConvert.DeserializeObject<List<int>>(deleteMessagesParams.MsgIDs);

            for(int i = 0; i < msgIDs.Count; i++)
            {
                var messageFromRepo = await _repo.GetMessage(msgIDs[i]);
                if(messageFromRepo == null) continue;
                _repo.Delete(messageFromRepo);
            }

            if(await _repo.SaveAll())
                return NoContent();

            return BadRequest("Error deleting messages. Messages probably dont exist.");
        }

        [HttpPost("{id}/read")] // api/v1/users/{userID}/messages/{id}/read
        public async Task<IActionResult> MarkMessageAsRead(int userID, int id)
        {
            var message = await _repo.GetMessage(id);

            if(message.RecipientID != userID)
                return Unauthorized();

            message.IsRead = true;
            message.DateRead = DateTime.Now;

            await _repo.SaveAll();

            return NoContent();
        }
    }
}