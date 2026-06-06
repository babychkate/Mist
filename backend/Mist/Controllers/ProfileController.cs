using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.DTOs.Profile;
using Mist.Services.Cloudinary;
using Mist.Services.Profile;
using System.Security.Claims;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController(IProfileService profileService, ICloudinaryService cloudinaryService) : ControllerBase
{
    private readonly IProfileService _profileService = profileService;
    private readonly ICloudinaryService _cloudinaryService = cloudinaryService;

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var result = await _profileService.GetProfileAsync(userId!);
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        await _profileService.UpdateProfileAsync(userId!, dto);
        return Ok(new { message = "Профіль оновлено" });
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        await _profileService.ChangePasswordAsync(userId!, dto);
        return Ok(new { message = "Пароль змінено" });
    }

    [HttpPut("avatar")]
    public async Task<IActionResult> UpdateAvatar(IFormFile file)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var avatarUrl = await _cloudinaryService.UploadAvatarAsync(file, userId!);
        await _profileService.UpdateAvatarAsync(userId!, avatarUrl);
        return Ok(new { avatarUrl });
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        await _profileService.DeleteAccountAsync(userId!);
        return Ok(new { message = "Акаунт видалено" });
    }
}