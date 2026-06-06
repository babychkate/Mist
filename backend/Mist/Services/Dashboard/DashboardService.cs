using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Mist.Data;
using Mist.DTOs.Dashboard;
using Mist.Models;

namespace Mist.Services.Dashboard;

public class DashboardService(AppDbContext context, UserManager<ApplicationUser> userManager) : IDashboardService
{
    private readonly AppDbContext _context = context;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    public async Task<DashboardDto> GetDashboardAsync(string userId, int month, int year)
    {
        var allGenerations = await context.Generations
            .Where(g => g.GenerationUserId == userId)
            .Include(g => g.GenerationVideo)
            .Include(g => g.GenerationPlatforms)
                .ThenInclude(gp => gp.GenerationPlatformPlatform)
            .Include(g => g.GenerationPlatforms)
                .ThenInclude(gp => gp.GenerationPlatformMusicTrack)
                    .ThenInclude(t => t!.GenerationPlatformMusicTrackMusic)
            .OrderByDescending(g => g.GenerationCreatedAt)
            .ToListAsync();

        // Статистика
        var totalGenerations = allGenerations.Count;
        var totalVideos = allGenerations.Select(g => g.GenerationVideoId).Distinct().Count();
        var user = await userManager.FindByIdAsync(userId);

        var activeDays = user != null
            ? Math.Max(1, (int)(DateTime.Today - user.RegisterDate.Date).TotalDays)
            : 0;


        // Останні 3
        var recentMists = allGenerations.Take(3).Select(g => new MistCardDto
        {
            GenerationId = g.GenerationId,
            VideoTitle = g.GenerationVideo?.VideoTitle ?? "",
            VideoThumbnailUrl = g.GenerationVideo?.VideoYoutubeId != null
    ? $"https://img.youtube.com/vi/{g.GenerationVideo.VideoYoutubeId}/hqdefault.jpg"
    : null,
            CreatedAt = g.GenerationCreatedAt?.ToString("dd MMM yyyy") ?? "",
            Platforms = g.GenerationPlatforms
                .Select(gp => new PlatformBadgeDto
                {
                    PlatformId = gp.GenerationPlatformPlatformId ?? 0,
                    PlatformName = gp.GenerationPlatformPlatform?.PlatformName ?? "",
                })
                .ToList(),
            Tracks = g.GenerationPlatforms
    .Select(gp => gp.GenerationPlatformMusicTrack?.GenerationPlatformMusicTrackMusic?.MusicTitle)
    .Where(t => !string.IsNullOrEmpty(t))
    .Distinct()
    .Select(t => t!)
    .ToList(),
        }).ToList();

        // Дні активності для поточного місяця (для календаря)
        var activeCalendarDays = allGenerations
            .Where(g => g.GenerationCreatedAt?.Month == month
                     && g.GenerationCreatedAt?.Year == year)
            .Select(g => g.GenerationCreatedAt!.Value.Day)
            .Distinct()
            .OrderBy(d => d)
            .ToList();

        return new DashboardDto
        {
            TotalGenerations = totalGenerations,
            TotalVideos = totalVideos,
            ActiveDays = activeDays,
            RecentMists = recentMists,
            ActiveCalendarDays = activeCalendarDays,
            CalendarMonth = month,
            CalendarYear = year,
        };
    }
}