using Microsoft.EntityFrameworkCore;
using Mist.Data;
using Mist.DTOs.Tone;

namespace Mist.Services.Tone;

public class ToneService(AppDbContext context) : IToneService
{
    private readonly AppDbContext _context = context;

    public async Task<List<ToneDto>> GetAllAsync()
    {
        return await _context.Tones
            .OrderBy(t => t.ToneId)
            .Select(t => new ToneDto
            {
                ToneId = t.ToneId,
                ToneName = t.ToneName ?? "",
                ToneDescription = t.ToneDescription
            })
            .ToListAsync();
    }
}