namespace Mist.DTOs.MistDetail;

public class MistDetailDto
{
    public int GenerationId { get; set; }
    public string VideoTitle { get; set; } = "";
    public string? VideoThumbnailUrl { get; set; }
    public string? VideoYoutubeId { get; set; }
    public string CreatedAt { get; set; } = "";
    public List<MistDetailPlatformDto> Platforms { get; set; } = [];
}