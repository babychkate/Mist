namespace Mist.DTOs.Video;

public class VideoPreviewDto
{
    public int VideoId { get; set; }
    public string YoutubeId { get; set; } = "";
    public string Title { get; set; } = "";
    public string? ChannelName { get; set; }
    public string? Description { get; set; }
    public string ThumbnailUrl { get; set; } = "";
    public string? Duration { get; set; }
    public long? ViewCount { get; set; }
    public List<string> Tags { get; set; } = [];
}