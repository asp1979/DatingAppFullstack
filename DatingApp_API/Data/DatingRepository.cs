using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DatingApp_API.Models;
using DatingApp_API.Helpers;

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
            var users = _context.Users.Include(x => x.Photos);
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

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}