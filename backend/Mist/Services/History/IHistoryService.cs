using Mist.DTOs.History;

namespace Mist.Services.History;

public interface IHistoryService
{
    Task<List<HistoryItemDto>> GetHistoryAsync(string userId, int? platformId, string? search, int page = 1, int pageSize = 20);
}