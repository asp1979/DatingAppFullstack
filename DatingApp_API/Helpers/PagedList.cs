using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp_API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; set; }
        public int TotalItems { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalPages { get; set; }

        public PagedList(List<T> items, int count, int pageNumber, int itemsPerPage)
        {
            TotalItems = count;
            CurrentPage = pageNumber;
            ItemsPerPage = itemsPerPage;
            TotalPages = (int)Math.Ceiling(count / (double)itemsPerPage);
            this.AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int itemsPerPage)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * itemsPerPage).Take(itemsPerPage).ToListAsync();
            return new PagedList<T>(items, count, pageNumber, itemsPerPage);
        }
    }
}