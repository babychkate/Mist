using Mist.DTOs.Profile;

namespace Mist.Services.Profile
{
    public interface IProfileService
    {
        Task<ProfileDto> GetProfileAsync(string userId);
        Task UpdateProfileAsync(string userId, UpdateProfileDto dto);
        Task ChangePasswordAsync(string userId, ChangePasswordDto dto);
        Task UpdateAvatarAsync(string userId, string avatarUrl);
        Task DeleteAccountAsync(string userId);
    }
}