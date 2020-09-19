namespace DatingApp_API.Helpers
{
    public class UserParams
    {
        public int PageNumber { get; set; } = 1;
        public int MaxPageSize = 50;
        private int _pageSize = 10;

        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value > MaxPageSize ? MaxPageSize : value; }
        }
    }
}