using Mist.Data;
using Mist.Models;
using Mist.DTOs.Profile;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Mist.Services.Profile;

public class ProfileService(UserManager<ApplicationUser> userManager, AppDbContext context) : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly AppDbContext _context = context;

    public async Task<ProfileDto> GetProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("Користувача не знайдено");

        var generations = await _context.Generations
            .Where(g => g.GenerationUserId == userId)
            .ToListAsync();

        var videosCount = generations
            .Where(g => g.GenerationVideoId != null)
            .Select(g => g.GenerationVideoId)
            .Distinct()
            .Count();

        var lastGenerationDate = generations.Any()
        ? generations.Max(g => g.GenerationCreatedAt)
        : (DateTime?)null;

        var favoritePlatformName = await _context.GenerationPlatforms
            .Where(gp => _context.Generations
                .Where(g => g.GenerationUserId == userId)
                .Select(g => g.GenerationId)
                .Contains(gp.GenerationPlatformGenerationId!.Value))
            .GroupBy(gp => gp.GenerationPlatformPlatformId)
            .OrderByDescending(g => g.Count())
            .Select(g => g.FirstOrDefault()!.GenerationPlatformPlatform!.PlatformName)
            .FirstOrDefaultAsync();

        return new ProfileDto
        {
            UserId = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            AvatarUrl = user.AvatarUrl,
            RegisterDate = user.RegisterDate,
            GenerationsCount = generations.Count,
            VideosCount = videosCount,
            LastGenerationDate = lastGenerationDate,
            FavoritePlatform = favoritePlatformName
        };
    }

    public async Task UpdateProfileAsync(string userId, UpdateProfileDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("Користувача не знайдено");

        var existingWithEmail = await _userManager.FindByEmailAsync(dto.Email);
        if (existingWithEmail != null && existingWithEmail.Id != userId)
            throw new InvalidOperationException("Користувач з таким email вже існує");

        user.Email = dto.Email;
        user.UserName = dto.UserName;
        user.NormalizedEmail = _userManager.NormalizeEmail(dto.Email);
        user.NormalizedUserName = _userManager.NormalizeName(dto.UserName);

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
    }

    public async Task ChangePasswordAsync(string userId, ChangePasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("Користувача не знайдено");

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
    }

    public async Task UpdateAvatarAsync(string userId, string avatarUrl)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("Користувача не знайдено");

        user.AvatarUrl = avatarUrl;
        await _userManager.UpdateAsync(user);
    }

    public async Task DeleteAccountAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("Користувача не знайдено");

        user.IsDeleted = true;
        await _userManager.UpdateAsync(user);
    }
}