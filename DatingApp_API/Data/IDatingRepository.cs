using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp_API.Models;
using DatingApp_API.Helpers;
using DatingApp_API.QueryParams;

namespace DatingApp_API.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        Task<bool> SaveAll();
        Task<PagedList<User>> GetUsers(GetUsersParams getUsersParams);
        Task<User> GetUser(int id);
        Task<Like> GetLike(int userID, int recipientID);
        Task<Message> GetMessage(int id);
        Task<PagedList<Message>> GetMessagesForUser(GetMessagesParams getMessagesParams);
        Task<List<Message>> GetMessagesThread(int userID, int recipientID);
    }
}