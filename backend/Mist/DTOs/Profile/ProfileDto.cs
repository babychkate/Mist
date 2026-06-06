namespace Mist.DTOs.Profile;

public class ProfileDto
{
    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
    public string? AvatarUrl { get; set; }
    public DateTime RegisterDate { get; set; }
    public int GenerationsCount { get; set; }
    public int VideosCount { get; set; }
    public DateTime? LastGenerationDate { get; set; }
    public string? FavoritePlatform { get; set; }
}