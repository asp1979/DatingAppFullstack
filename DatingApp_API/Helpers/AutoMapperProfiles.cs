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

            CreateMap<User, UserForDetailedDto>()
                .ForMember(x => x.PhotoUrl, y => y.MapFrom( z => z.Photos.FirstOrDefault(q => q.IsMain).Url ))
                .ForMember(x => x.Age, y => y.MapFrom( z => z.DateOfBirth.CalculateAge() ));

            CreateMap<Photo, PhotosForDetailedDto>();
        }
    }
}