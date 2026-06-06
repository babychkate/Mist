namespace Mist.DTOs.Dashboard;

public class MistCardDto
{
    public int GenerationId { get; set; }
    public string VideoTitle { get; set; } = "";
    public string? VideoThumbnailUrl { get; set; }
    public string CreatedAt { get; set; } = "";
    public List<PlatformBadgeDto> Platforms { get; set; } = [];
    public List<string> Tracks { get; set; } = [];
}
