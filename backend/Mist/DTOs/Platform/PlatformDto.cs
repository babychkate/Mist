namespace Mist.DTOs.Platform;

public class PlatformDto
{
    public int PlatformId { get; set; }
    public string PlatformName { get; set; } = "";
    public string? PlatformDescription { get; set; }
    public int? PlatformMaxCharacters { get; set; }
    public string? PlatformPostingTimeSuggestion { get; set; }
}