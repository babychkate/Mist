using Mist.DTOs.Video;

namespace Mist.Services.Video;

public interface IVideoService
{
    Task<VideoPreviewDto?> FetchAndSaveAsync(string url);
}