using System;

namespace DatingApp_API.DTOs
{
    public class MessageForCreationDto
    {
        public int SenderID { get; set; }
        public int RecipientID { get; set; }
        public DateTime MessageSent { get; set; }
        public string Content { get; set; }
        public MessageForCreationDto()
        {
            MessageSent = DateTime.Now;
        }
    }
}