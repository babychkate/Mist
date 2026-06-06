using Mist.DTOs.Music;

namespace Mist.Services.Music;
public interface IMusicService
{
    Task<List<MusicTrackDto>> SearchAsync(string? query);
}