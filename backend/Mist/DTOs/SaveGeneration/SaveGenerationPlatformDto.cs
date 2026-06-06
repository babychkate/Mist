using System.ComponentModel.DataAnnotations;

namespace Mist.DTOs.SaveGeneration;
public class SaveGenerationPlatformDto
{
    [Required]
    public int PlatformId { get; set; }
    public string? GeneratedText { get; set; }
    public string? GeneratedHashtags { get; set; }
    public string? CustomPrompt { get; set; }
    public int? ToneId { get; set; }
    public SaveGenerationTrackDto? Track { get; set; }
    [MinLength(1, ErrorMessage = "Оберіть хоча б одне фото")]
    public List<SaveGenerationPhotoDto> Photos { get; set; } = [];
}