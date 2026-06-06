namespace Mist.DTOs.Auth;

public class UserInfoDto
{
    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
    public string? AvatarUrl { get; set; }
}