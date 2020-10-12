using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DatingApp_API.Models;
using DatingApp_API.Helpers;
using System.Linq;
using System;
using System.Collections.Generic;

namespace DatingApp_API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;


        public DatingRepository(DataContext context)
        {
            _context = context;
        }


        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }


        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }


        public async Task<PagedList<User>> GetUsers(GetUsersParams getUsersParams)
        {
            var users = _context.Users.Include(u => u.Photos).AsQueryable();
            users = users.Where(u => u.ID != getUsersParams.UserID);

            if(getUsersParams.MinAge != 18 || getUsersParams.MaxAge != 200)
            {
                var minDob = DateTime.Today.AddYears(-getUsersParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-getUsersParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            return await PagedList<User>.CreateAsync(users, getUsersParams.CurrentPage, getUsersParams.ItemsPerPage);
        }


        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.ID == id);
            return user;
        }


        public async Task<Like> GetLike(int userID, int recipientID)
        {
            return await _context.Likes.FirstOrDefaultAsync(l => l.LikerID == userID && l.LikeeID == recipientID);
        }


        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.ID == id);
        }


        public async Task<PagedList<Message>> GetMessagesForUser(GetMessagesParams getMessagesParams)
        {
            var messages = _context.Messages
                .Include(m => m.Sender).ThenInclude(m => m.Photos)
                .Include(m => m.Recipient).ThenInclude(m => m.Photos)
                .AsQueryable();

            switch(getMessagesParams.MessageContainer)
            {
                case "inbox":
                    messages = messages.Where(m => m.RecipientID == getMessagesParams.UserID && m.RecipientDeleted == false);
                    break;
                case "outbox":
                    messages = messages.Where(m => m.SenderID == getMessagesParams.UserID && m.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(
                        m => (m.RecipientID == getMessagesParams.UserID || m.SenderID == getMessagesParams.UserID) && m.RecipientDeleted == false
                    );
                    break;
            }

            messages = messages.OrderByDescending(m => m.MessageSent);

            return await PagedList<Message>
                .CreateAsync(messages, getMessagesParams.CurrentPage, getMessagesParams.ItemsPerPage);
        }


        public async Task<List<Message>> GetMessagesThread(int userID, int recipientID)
        {
            var messages = await _context.Messages
                .Include(m => m.Sender).ThenInclude(m => m.Photos)
                .Include(m => m.Recipient).ThenInclude(m => m.Photos)
                .Where(m => (userID == m.RecipientID && recipientID == m.SenderID && m.RecipientDeleted == false)
                        || (userID == m.SenderID && recipientID == m.RecipientID && m.SenderDeleted == false))
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();
            
            return messages;
        }


        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

    }
}