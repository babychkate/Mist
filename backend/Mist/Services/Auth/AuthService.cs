using Mist.Models;
using System.Text;
using Mist.DTOs.Auth;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Mist.Services.Auth;

public class AuthService(UserManager<ApplicationUser> userManager, IConfiguration configuration) : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IConfigurationSection _jwtSettings = configuration.GetSection("JwtSettings");

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existing = await _userManager.FindByEmailAsync(dto.Email);
        if (existing != null)
            throw new InvalidOperationException("Користувач з таким email вже існує");

        var user = new ApplicationUser
        {
            UserName = dto.UserName,
            Email = dto.Email
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));

        return new AuthResponseDto
        {
            Token = GenerateJwtToken(user),
            UserId = user.Id,
            UserName = user.UserName!,
            Email = user.Email!
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email)
            ?? throw new UnauthorizedAccessException("Невірний email або пароль");

        if (user.IsDeleted)
            throw new UnauthorizedAccessException("Акаунт видалено");

        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
            throw new UnauthorizedAccessException("Невірний email або пароль");

        return new AuthResponseDto
        {
            Token = GenerateJwtToken(user),
            UserId = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            AvatarUrl = user.AvatarUrl
        };
    }

    public async Task<UserInfoDto> GetMeAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new UnauthorizedAccessException("Користувача не знайдено");

        return new UserInfoDto
        {
            UserId = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            AvatarUrl = user.AvatarUrl
        };
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings["SecretKey"]!));

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("userName", user.UserName!)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings["Issuer"],
            audience: _jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(double.Parse(_jwtSettings["ExpirationHours"]!)),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}