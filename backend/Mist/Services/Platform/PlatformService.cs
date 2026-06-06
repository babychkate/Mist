using Microsoft.EntityFrameworkCore;
using Mist.Data;
using Mist.DTOs.Platform;

namespace Mist.Services.Platform;

public class PlatformService(AppDbContext context) : IPlatformService
{
    private readonly AppDbContext _context = context;

    public async Task<List<PlatformDto>> GetAllAsync()
    {
        return await _context.Platforms
            .OrderBy(p => p.PlatformId)
            .Select(p => new PlatformDto
            {
                PlatformId = p.PlatformId,
                PlatformName = p.PlatformName ?? "",
                PlatformDescription = p.PlatformDescription,
                PlatformMaxCharacters = p.PlatformMaxCharacters,
                PlatformPostingTimeSuggestion = p.PlatformPostingTimeSuggestion
            })
            .ToListAsync();
    }

    public async Task<List<PlatformPhotoFormatDto>> GetFormatsAsync(int platformId)
    {
        return await _context.PlatformPhotoFormats
            .Where(f => f.PlatformPhotoFormatPlatformId == platformId)
            .Select(f => new PlatformPhotoFormatDto
            {
                PlatformPhotoFormatId = f.PlatformPhotoFormatId,
                FormatTypeName = f.PlatformPhotoFormatType!.PhotoFormatTypeName ?? "",
                Width = f.PlatformPhotoFormatWidth ?? 0,
                Height = f.PlatformPhotoFormatHeight ?? 0,
            })
            .ToListAsync();
    }
}