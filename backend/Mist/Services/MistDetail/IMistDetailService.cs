using Mist.DTOs.MistDetail;

namespace Mist.Services.MistDetail;

public interface IMistDetailService
{
    Task<MistDetailDto?> GetByIdAsync(int generationId, string userId);
}