using Microsoft.EntityFrameworkCore;
using Mist.Data;
using Mist.DTOs.History;

namespace Mist.Services.History;

public class HistoryService(AppDbContext context) : IHistoryService
{
    private readonly AppDbContext _context = context;

    public async Task<List<HistoryItemDto>> GetHistoryAsync(string userId, int? platformId, string? search, int page = 1, int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (string.IsNullOrWhiteSpace(search)) search = null;
        if (platformId == 0) platformId = null;

        var query = _context.Generations
            .Where(g => g.GenerationUserId == userId);

        if (platformId.HasValue)
        {
            query = query.Where(g => g.GenerationPlatforms.Any(gp => gp.GenerationPlatformPlatformId == platformId));
        }

        if (search != null)
        {
            query = query.Where(g => g.GenerationVideo != null
                                  && g.GenerationVideo.VideoTitle != null
                                  && EF.Functions.Like(g.GenerationVideo.VideoTitle, $"%{search}%"));
        }

        var rawItems = await query
            .OrderByDescending(g => g.GenerationCreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => new
            {
                g.GenerationId,
                VideoTitle = g.GenerationVideo != null ? g.GenerationVideo.VideoTitle : null,
                VideoYoutubeId = g.GenerationVideo != null ? g.GenerationVideo.VideoYoutubeId : null,
                g.GenerationCreatedAt,
                Platforms = g.GenerationPlatforms.Select(gp => new
                {
                    PlatformId = gp.GenerationPlatformPlatformId,
                    PlatformName = gp.GenerationPlatformPlatform != null ? gp.GenerationPlatformPlatform.PlatformName : null
                }).ToList(),
                Tracks = g.GenerationPlatforms
                    .Select(gp => gp.GenerationPlatformMusicTrack != null && gp.GenerationPlatformMusicTrack.GenerationPlatformMusicTrackMusic != null
                        ? gp.GenerationPlatformMusicTrack.GenerationPlatformMusicTrackMusic.MusicTitle
                        : null)
                    .ToList()
            })
            .ToListAsync();

        var culture = new System.Globalization.CultureInfo("uk-UA");

        return [.. rawItems.Select(g => new HistoryItemDto
        {
            GenerationId = g.GenerationId,
            VideoTitle = g.VideoTitle ?? "",
            VideoThumbnailUrl = g.VideoYoutubeId != null
                ? $"https://img.youtube.com/vi/{g.VideoYoutubeId}/hqdefault.jpg"
                : null,
            Date = g.GenerationCreatedAt?.ToString("d MMM", culture) ?? "",
            Month = g.GenerationCreatedAt?.ToString("MMMM yyyy", culture) ?? "",

            Platforms = [.. g.Platforms.Select(p => new HistoryPlatformDto
            {
                PlatformId = p.PlatformId ?? 0,
                PlatformName = p.PlatformName ?? ""
            })],

            Tracks = [.. g.Tracks
                .Where(t => !string.IsNullOrEmpty(t))
                .Distinct()
                .Select(t => t!)]
        })];
    }
}