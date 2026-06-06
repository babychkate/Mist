using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Mist.Data;
using Mist.DTOs.MistDetail;

namespace Mist.Services.MistDetail;

public class MistDetailService(AppDbContext context) : IMistDetailService
{
    private readonly AppDbContext _context = context;

    public async Task<MistDetailDto?> GetByIdAsync(int generationId, string userId)
    {
        var generation = await _context.Generations
            .Where(g => g.GenerationId == generationId && g.GenerationUserId == userId)
            .AsSplitQuery()
            .Include(g => g.GenerationVideo)
            .Include(g => g.GenerationPlatforms)
                .ThenInclude(gp => gp.GenerationPlatformPlatform)
            .Include(g => g.GenerationPlatforms)
                .ThenInclude(gp => gp.GenerationPlatformTone)
                    .ThenInclude(t => t!.GenerationPlatformToneTone)
            .Include(g => g.GenerationPlatforms)
                .ThenInclude(gp => gp.GenerationPlatformMusicTrack)
                    .ThenInclude(t => t!.GenerationPlatformMusicTrackMusic)
                        .ThenInclude(m => m!.MusicAuthor)
            .Include(g => g.GenerationPlatforms)
                .ThenInclude(gp => gp.GenerationPlatformPhotos)
                    .ThenInclude(pp => pp.GenerationPlatformPhotoPlatformPhotoFormat)
                        .ThenInclude(f => f!.PlatformPhotoFormatType)
            .Include(g => g.GenerationPlatforms)
                .ThenInclude(gp => gp.GenerationPlatformPhotos)
                    .ThenInclude(pp => pp.GenerationPlatformPhotoPhoto)
            .FirstOrDefaultAsync();

        if (generation == null) return null;

        var culture = new CultureInfo("uk-UA");

        return new MistDetailDto
        {
            GenerationId = generation.GenerationId,
            VideoTitle = generation.GenerationVideo?.VideoTitle ?? "",
            VideoYoutubeId = generation.GenerationVideo?.VideoYoutubeId,
            VideoThumbnailUrl = generation.GenerationVideo?.VideoYoutubeId != null
                ? $"https://img.youtube.com/vi/{generation.GenerationVideo.VideoYoutubeId}/hqdefault.jpg"
                : null,
            CreatedAt = generation.GenerationCreatedAt?.ToString("d MMMM yyyy", culture) ?? "",

            Platforms = generation.GenerationPlatforms.Select(gp => new MistDetailPlatformDto
            {
                GenerationPlatformId = gp.GenerationPlatformId,
                PlatformId = gp.GenerationPlatformPlatformId ?? 0,
                PlatformName = gp.GenerationPlatformPlatform?.PlatformName ?? "",
                GeneratedText = gp.GenerationPlatformGeneratedText,
                GeneratedHashtags = gp.GenerationPlatformGeneratedHashtags,
                CustomPrompt = gp.GenerationPlatformCustomPrompt,
                ToneName = gp.GenerationPlatformTone?.GenerationPlatformToneTone?.ToneName,

                Track = gp.GenerationPlatformMusicTrack?.GenerationPlatformMusicTrackMusic == null ? null
                    : new MistDetailTrackDto
                    {
                        ApiId = gp.GenerationPlatformMusicTrack.GenerationPlatformMusicTrackMusic.MusicApiId,
                        Title = gp.GenerationPlatformMusicTrack.GenerationPlatformMusicTrackMusic.MusicTitle ?? "",
                        Genre = gp.GenerationPlatformMusicTrack.GenerationPlatformMusicTrackMusic.MusicGenre,
                        DurationSeconds = gp.GenerationPlatformMusicTrack.GenerationPlatformMusicTrackMusic.MusicDuration,
                        PreviewUrl = gp.GenerationPlatformMusicTrack.GenerationPlatformMusicTrackMusic.MusicPreviewUrl,
                        AuthorName = gp.GenerationPlatformMusicTrack.GenerationPlatformMusicTrackMusic.MusicAuthor?.MusicAuthorName,
                    },

                Photos = gp.GenerationPlatformPhotos.Select(pp => new MistDetailPhotoDto
                {
                    Url = pp.GenerationPlatformPhotoPhoto?.PhotoUrl ?? "",
                    Width = pp.GenerationPlatformPhotoPlatformPhotoFormat?.PlatformPhotoFormatWidth,
                    Height = pp.GenerationPlatformPhotoPlatformPhotoFormat?.PlatformPhotoFormatHeight,
                    FormatName = pp.GenerationPlatformPhotoPlatformPhotoFormat?.PlatformPhotoFormatType?.PhotoFormatTypeName
                }).ToList(),
            }).ToList(),
        };
    }
}