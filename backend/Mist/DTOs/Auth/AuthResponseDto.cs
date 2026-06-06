namespace Mist.DTOs.Auth;

public class AuthResponseDto
{
    public string Token { get; set; } = "";
    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
    public string? AvatarUrl { get; set; }
}