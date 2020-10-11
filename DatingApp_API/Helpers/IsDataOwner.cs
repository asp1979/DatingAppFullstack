using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public class IsDataOwner : IAuthorizationRequirement
    {
    }

    public class IsDataOwnerHandler : AuthorizationHandler<IsDataOwner>
    {
        private readonly IHttpContextAccessor _context;
        public IsDataOwnerHandler(IHttpContextAccessor context)
        {
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsDataOwner requirement)
        {
            var userID = _context.
                        HttpContext
                        .User?
                        .Claims?
                        .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?
                        .Value.ToString();

            var userIdFromRoute = _context.
                        HttpContext
                        .Request
                        .RouteValues
                        .SingleOrDefault(x => x.Key == "userID")
                        .Value.ToString();

            if (userID == userIdFromRoute)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}