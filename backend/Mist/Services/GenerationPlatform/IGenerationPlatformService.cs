using Mist.DTOs.GenerationPlatform;

namespace Mist.Services.GenerationPlatform;

public interface IGenerationPlatformService
{
    Task<GeneratePlatformResponseDto> GenerateForPlatformAsync(GeneratePlatformRequestDto dto);
}
