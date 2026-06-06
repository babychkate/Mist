namespace Mist.DTOs.Platform;

public class PlatformPhotoFormatDto
{
    public int PlatformPhotoFormatId { get; set; }
    public string FormatTypeName { get; set; } = "";
    public int Width { get; set; }
    public int Height { get; set; }
}