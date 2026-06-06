namespace Mist.DTOs.History;

public class HistoryItemDto
{
    public int GenerationId { get; set; }
    public string VideoTitle { get; set; } = "";
    public string? VideoThumbnailUrl { get; set; }
    public string Date { get; set; } = "";
    public string Month { get; set; } = "";
    public List<HistoryPlatformDto> Platforms { get; set; } = [];
    public List<string> Tracks { get; set; } = [];
}