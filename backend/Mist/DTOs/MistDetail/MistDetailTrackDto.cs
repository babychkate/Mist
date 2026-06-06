namespace Mist.DTOs.MistDetail;

public class MistDetailTrackDto
{
    public int? ApiId { get; set; }
    public string Title { get; set; } = "";
    public string? Genre { get; set; }
    public int? DurationSeconds { get; set; }
    public string? PreviewUrl { get; set; }
    public string? AuthorName { get; set; }
}
