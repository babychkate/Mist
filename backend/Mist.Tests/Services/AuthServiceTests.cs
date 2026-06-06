using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using Mist.Models;
using Mist.Services.Auth;
using Mist.DTOs.Auth;

namespace Mist.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly IConfiguration _configuration;
    private readonly AuthService _sut;

    public AuthServiceTests()
    {
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(),
            null, null, null, null, null, null, null, null
        );

        // Реальна конфігурація з тестовими значеннями
        var configData = new Dictionary<string, string?>
        {
            ["JwtSettings:SecretKey"] = "super-secret-test-key-that-is-long-enough",
            ["JwtSettings:Issuer"] = "mist-test",
            ["JwtSettings:Audience"] = "mist-test",
            ["JwtSettings:ExpirationHours"] = "1"
        };
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configData)
            .Build();

        _sut = new AuthService(_userManagerMock.Object, _configuration);
    }

    // ——— RegisterAsync ———

    [Fact]
    public async Task RegisterAsync_WhenEmailAlreadyExists_ThrowsInvalidOperationException()
    {
        // Arrange
        var existingUser = new ApplicationUser { Email = "kate@test.com" };
        _userManagerMock
            .Setup(m => m.FindByEmailAsync("kate@test.com"))
            .ReturnsAsync(existingUser);

        var dto = new RegisterDto { Email = "kate@test.com", UserName = "kate", Password = "Pass123!" };

        // Act
        var act = () => _sut.RegisterAsync(dto);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Користувач з таким email вже існує");
    }

    [Fact]
    public async Task RegisterAsync_WhenDataIsValid_ReturnsAuthResponseWithToken()
    {
        // Arrange
        _userManagerMock
            .Setup(m => m.FindByEmailAsync("new@test.com"))
            .ReturnsAsync((ApplicationUser?)null);

        _userManagerMock
            .Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), "Pass123!"))
            .ReturnsAsync(IdentityResult.Success)
            .Callback<ApplicationUser, string>((user, _) =>
            {
                // Симулюємо що Identity присвоїло Id після створення
                user.Id = "new-user-id";
                user.UserName = "kate";
                user.Email = "new@test.com";
            });

        var dto = new RegisterDto { Email = "new@test.com", UserName = "kate", Password = "Pass123!" };

        // Act
        var result = await _sut.RegisterAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be("new@test.com");
        result.UserName.Should().Be("kate");
        result.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RegisterAsync_WhenIdentityFails_ThrowsInvalidOperationException()
    {
        // Arrange
        _userManagerMock
            .Setup(m => m.FindByEmailAsync("new@test.com"))
            .ReturnsAsync((ApplicationUser?)null);

        _userManagerMock
            .Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Пароль занадто слабкий" }));

        var dto = new RegisterDto { Email = "new@test.com", UserName = "kate", Password = "weak" };

        // Act
        var act = () => _sut.RegisterAsync(dto);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Пароль занадто слабкий");
    }

    // ——— LoginAsync ———

    [Fact]
    public async Task LoginAsync_WhenUserNotFound_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        _userManagerMock
            .Setup(m => m.FindByEmailAsync("nobody@test.com"))
            .ReturnsAsync((ApplicationUser?)null);

        var dto = new LoginDto { Email = "nobody@test.com", Password = "Pass123!" };

        // Act
        var act = () => _sut.LoginAsync(dto);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Невірний email або пароль");
    }

    [Fact]
    public async Task LoginAsync_WhenAccountIsDeleted_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var deletedUser = new ApplicationUser
        {
            Id = "user-1",
            Email = "kate@test.com",
            IsDeleted = true
        };
        _userManagerMock
            .Setup(m => m.FindByEmailAsync("kate@test.com"))
            .ReturnsAsync(deletedUser);

        var dto = new LoginDto { Email = "kate@test.com", Password = "Pass123!" };

        // Act
        var act = () => _sut.LoginAsync(dto);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Акаунт видалено");
    }

    [Fact]
    public async Task LoginAsync_WhenPasswordIsWrong_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var user = new ApplicationUser { Id = "user-1", Email = "kate@test.com", IsDeleted = false };
        _userManagerMock.Setup(m => m.FindByEmailAsync("kate@test.com")).ReturnsAsync(user);
        _userManagerMock.Setup(m => m.CheckPasswordAsync(user, "wrong")).ReturnsAsync(false);

        var dto = new LoginDto { Email = "kate@test.com", Password = "wrong" };

        // Act
        var act = () => _sut.LoginAsync(dto);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Невірний email або пароль");
    }

    [Fact]
    public async Task LoginAsync_WhenCredentialsAreValid_ReturnsAuthResponseWithToken()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "user-1",
            UserName = "kate",
            Email = "kate@test.com",
            IsDeleted = false
        };
        _userManagerMock.Setup(m => m.FindByEmailAsync("kate@test.com")).ReturnsAsync(user);
        _userManagerMock.Setup(m => m.CheckPasswordAsync(user, "Pass123!")).ReturnsAsync(true);

        var dto = new LoginDto { Email = "kate@test.com", Password = "Pass123!" };

        // Act
        var result = await _sut.LoginAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be("kate@test.com");
        result.UserName.Should().Be("kate");
        result.Token.Should().NotBeNullOrEmpty();
    }

    // ——— GetMeAsync ———

    [Fact]
    public async Task GetMeAsync_WhenUserNotFound_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        _userManagerMock
            .Setup(m => m.FindByIdAsync("nonexistent-id"))
            .ReturnsAsync((ApplicationUser?)null);

        // Act
        var act = () => _sut.GetMeAsync("nonexistent-id");

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Користувача не знайдено");
    }

    [Fact]
    public async Task GetMeAsync_WhenUserExists_ReturnsCorrectUserInfo()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "user-1",
            UserName = "kate",
            Email = "kate@test.com",
            AvatarUrl = "https://example.com/avatar.jpg"
        };
        _userManagerMock.Setup(m => m.FindByIdAsync("user-1")).ReturnsAsync(user);

        // Act
        var result = await _sut.GetMeAsync("user-1");

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().Be("user-1");
        result.UserName.Should().Be("kate");
        result.Email.Should().Be("kate@test.com");
        result.AvatarUrl.Should().Be("https://example.com/avatar.jpg");
    }
}