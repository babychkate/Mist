namespace Mist.DTOs.GenerationPlatform;

public class GeneratePlatformResponseDto
{
    public string GeneratedText { get; set; } = "";
    public string GeneratedHashtags { get; set; } = "";
    public List<GeneratedPhotoDto> Photos { get; set; } = [];
}
