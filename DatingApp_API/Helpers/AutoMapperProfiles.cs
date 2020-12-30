using System.Linq;
using AutoMapper;
using DatingApp_API.DTOs;
using DatingApp_API.Models;

namespace DatingApp_API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(x => x.PhotoUrl, y => y.MapFrom( z => z.Photos.FirstOrDefault(q => q.IsMain).Url ))
                .ForMember(x => x.Age, y => y.MapFrom( z => z.DateOfBirth.CalculateAge() ));

            CreateMap<MessageForCreationDto, Message>().ReverseMap();

            CreateMap<Message, MessageToReturnDto>()
                .ForMember(x => x.SenderPhotoUrl, y => y.MapFrom( z => z.Sender.Photos.FirstOrDefault(q => q.IsMain).Url ))
                .ForMember(x => x.RecipientPhotoUrl, y => y.MapFrom( z => z.Recipient.Photos.FirstOrDefault(q => q.IsMain).Url ));
        }
    }
}