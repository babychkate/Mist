using Microsoft.AspNetCore.Identity;

namespace Mist.Models;

public class ApplicationUser : IdentityUser
{
    public string? AvatarUrl { get; set; }
    public DateTime RegisterDate { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; } = false;
}