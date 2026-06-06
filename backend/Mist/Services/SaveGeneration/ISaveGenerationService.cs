using Mist.DTOs.SaveGeneration;

namespace Mist.Services.SaveGeneration;

public interface ISaveGenerationService
{
    Task<int> SaveAsync(SaveGenerationRequestDto dto, string userId);
}
