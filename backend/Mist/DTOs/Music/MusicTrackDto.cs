namespace Mist.DTOs.Music;

public class MusicTrackDto
{
    public int ApiId { get; set; }
    public string Title { get; set; } = "";
    public int? AuthorApiId { get; set; }
    public string AuthorName { get; set; } = "";
    public string? Genre { get; set; }
    public string Duration { get; set; } = "";
    public string PreviewUrl { get; set; } = "";
}
