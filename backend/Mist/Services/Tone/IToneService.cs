using Mist.DTOs.Tone;

namespace Mist.Services.Tone;

public interface IToneService
{
    Task<List<ToneDto>> GetAllAsync();
}