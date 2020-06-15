using System;

namespace DatingApp_API.Models
{
    public class Photo
    {
        public int ID { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool isMain { get; set; }

        // define EF relationship below
        public User User { get; set; }
        public int UserID { get; set; }
    }
}