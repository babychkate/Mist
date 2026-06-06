using Microsoft.AspNetCore.Identity;
using Mist.Models;
using System.Security.Claims;

namespace Mist.Middleware;

public class DeletedUserMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context, UserManager<ApplicationUser> userManager)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                var user = await userManager.FindByIdAsync(userId);
                if (user == null || user.IsDeleted)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsJsonAsync(new { message = "Акаунт видалено" });
                    return;
                }
            }
        }

        await _next(context);
    }
}