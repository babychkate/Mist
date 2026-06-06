using Mist.DTOs.Auth;

namespace Mist.Services.Auth;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserInfoDto> GetMeAsync(string userId);
}