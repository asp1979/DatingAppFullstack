using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DatingApp_API.Models;
using DatingApp_API.Helpers;
using System.Linq;
using System;

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
            var users = _context.Users.Include(x => x.Photos).AsQueryable();
            users = users.Where(x => x.ID != getUsersParams.UserID);

            if(getUsersParams.MinAge != 18 || getUsersParams.MaxAge != 200)
            {
                var minDob = DateTime.Today.AddYears(-getUsersParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-getUsersParams.MinAge);
                users = users.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);
            }

            return await PagedList<User>.CreateAsync(users, getUsersParams.PageNumber, getUsersParams.PageSize);
        }


        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(x => x.Photos).FirstOrDefaultAsync(y => y.ID == id);
            return user;
        }


        public async Task<Like> GetLike(int userID, int recipientID)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerID == userID && u.LikeeID == recipientID);
        }


        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.ID == id);
        }


        public async Task<PagedList<Message>> GetMessagesForUser(GetMessagesParams getMessagesParams)
        {
            var messages = _context.Messages
                .Include(u => u.Sender).ThenInclude(u => u.Photos)
                .Include(u => u.Recipient).ThenInclude(u => u.Photos)
                .AsQueryable();

            switch(getMessagesParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientID == getMessagesParams.UserID);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderID == getMessagesParams.UserID);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientID == getMessagesParams.UserID && u.IsRead == false);
                    break;
            }

            messages = messages.OrderByDescending(m => m.MessageSent);

            return await PagedList<Message>
                .CreateAsync(messages, getMessagesParams.PageNumber, getMessagesParams.PageNumber);
        }


        public Task<Message> GetMessageThread(int userID, int recipientID)
        {
            throw new NotImplementedException();
        }


        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}