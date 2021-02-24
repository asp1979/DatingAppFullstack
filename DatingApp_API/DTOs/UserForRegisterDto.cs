using System.ComponentModel.DataAnnotations;

namespace DatingApp_API.DTOs
{
    public class UserForRegisterDto
    {
        [Required]
        [StringLength(16, MinimumLength = 2, ErrorMessage = "Please specify username between 2 and 16 characters")]
        public string Username { get; set; }

        [Required]
        [StringLength(32, MinimumLength = 4, ErrorMessage = "Please specify password between 4 and 32 characters")]
        public string Password { get; set; }
    }
}