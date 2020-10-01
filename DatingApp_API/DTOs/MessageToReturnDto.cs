using System;

namespace DatingApp_API.DTOs
{
    public class MessageToReturnDto
    {
        public int ID { get; set; }
        public int SenderID { get; set; }
        public string Sender { get; set; }
        public string SenderUsername { get; set; }
        public string SenderPhotoUrl { get; set; }
        public int RecipientID { get; set; }
        public string Recipient { get; set; }
        public string RecipientUsername { get; set; }
        public string RecipientPhotoUrl { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }
    }
}