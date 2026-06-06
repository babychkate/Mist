using System.ComponentModel.DataAnnotations;

public class GeneratePlatformRequestDto
{
    [Required]
    public int PlatformId { get; set; }
    [Required]
    public int VideoId { get; set; }
    public int? ToneId { get; set; }
    public string? CustomPrompt { get; set; }
    [MinLength(1, ErrorMessage = "Оберіть хоча б одне фото")]
    public List<string> Photos { get; set; } = [];
    public List<int> FormatIds { get; set; } = [];
}