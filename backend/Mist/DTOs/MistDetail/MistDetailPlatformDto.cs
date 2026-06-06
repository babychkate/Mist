namespace Mist.DTOs.MistDetail;

public class MistDetailPlatformDto
{
    public int GenerationPlatformId { get; set; }
    public int PlatformId { get; set; }
    public string PlatformName { get; set; } = "";
    public string? GeneratedText { get; set; }
    public string? GeneratedHashtags { get; set; }
    public string? CustomPrompt { get; set; }
    public string? ToneName { get; set; }
    public MistDetailTrackDto? Track { get; set; }
    public List<MistDetailPhotoDto> Photos { get; set; } = [];
}
