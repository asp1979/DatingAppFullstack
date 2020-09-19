using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp_API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Application-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var header = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            var format = new JsonSerializerSettings();
            format.ContractResolver = new CamelCasePropertyNamesContractResolver(); // turn JSON into camelCase
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(header, format));
            response.Headers.Add("Application-Control-Expose-Headers", "Pagination");
        }

        public static int CalculateAge(this DateTime date)
        {
            var age = DateTime.Today.Year - date.Year;
            if(date.AddYears(age) > DateTime.Today)
            {
                age--;
            }
            return age;
        }
    }
}