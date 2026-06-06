using Mist.DTOs.Platform;

namespace Mist.Services.Platform;

public interface IPlatformService
{
    Task<List<PlatformDto>> GetAllAsync();
    Task<List<PlatformPhotoFormatDto>> GetFormatsAsync(int platformId);
}