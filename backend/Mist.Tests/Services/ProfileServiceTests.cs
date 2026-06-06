using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;
using Mist.Models;
using Mist.Services.Profile;
using Mist.DTOs.Profile;
using Mist.Data;
using Microsoft.EntityFrameworkCore;

namespace Mist.Tests.Services;

public class ProfileServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly AppDbContext _context;
    private readonly ProfileService _sut;

    public ProfileServiceTests()
    {
        // UserManager вимагає купу залежностей — мокаємо через хелпер
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(),
            null, null, null, null, null, null, null, null
        );

        // InMemory DB — окрема база для кожного тесту через унікальне ім'я
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);

        _sut = new ProfileService(_userManagerMock.Object, _context);
    }

    // ——— GetProfileAsync ———

    [Fact]
    public async Task GetProfileAsync_WhenUserNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        _userManagerMock
            .Setup(m => m.FindByIdAsync("nonexistent-id"))
            .ReturnsAsync((ApplicationUser?)null);

        // Act
        var act = () => _sut.GetProfileAsync("nonexistent-id");

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("Користувача не знайдено");
    }

    [Fact]
    public async Task GetProfileAsync_WhenUserExists_ReturnsProfileWithCorrectData()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "user-1",
            UserName = "kateryna",
            Email = "kate@test.com",
            RegisterDate = new DateTime(2024, 1, 1),
        };

        _userManagerMock
            .Setup(m => m.FindByIdAsync("user-1"))
            .ReturnsAsync(user);

        // Act
        var result = await _sut.GetProfileAsync("user-1");

        // Assert
        result.Should().NotBeNull();
        result.UserName.Should().Be("kateryna");
        result.Email.Should().Be("kate@test.com");
        result.GenerationsCount.Should().Be(0);
    }

    // ——— UpdateProfileAsync ———

    [Fact]
    public async Task UpdateProfileAsync_WhenUserNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        _userManagerMock
            .Setup(m => m.FindByIdAsync("nonexistent-id"))
            .ReturnsAsync((ApplicationUser?)null);

        var dto = new UpdateProfileDto { Email = "new@test.com", UserName = "newname" };

        // Act
        var act = () => _sut.UpdateProfileAsync("nonexistent-id", dto);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("Користувача не знайдено");
    }

    [Fact]
    public async Task UpdateProfileAsync_WhenEmailTakenByAnotherUser_ThrowsInvalidOperationException()
    {
        // Arrange
        var currentUser = new ApplicationUser { Id = "user-1", Email = "old@test.com", UserName = "kate" };
        var anotherUser = new ApplicationUser { Id = "user-2", Email = "taken@test.com", UserName = "other" };

        _userManagerMock.Setup(m => m.FindByIdAsync("user-1")).ReturnsAsync(currentUser);
        _userManagerMock.Setup(m => m.FindByEmailAsync("taken@test.com")).ReturnsAsync(anotherUser);

        var dto = new UpdateProfileDto { Email = "taken@test.com", UserName = "kate" };

        // Act
        var act = () => _sut.UpdateProfileAsync("user-1", dto);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Користувач з таким email вже існує");
    }

    [Fact]
    public async Task UpdateProfileAsync_WhenEmailIsOwnEmail_UpdatesSuccessfully()
    {
        // Arrange — юзер оновлює свій же email (не чужий)
        var user = new ApplicationUser { Id = "user-1", Email = "kate@test.com", UserName = "kate" };

        _userManagerMock.Setup(m => m.FindByIdAsync("user-1")).ReturnsAsync(user);
        _userManagerMock.Setup(m => m.FindByEmailAsync("kate@test.com")).ReturnsAsync(user);
        _userManagerMock.Setup(m => m.UpdateAsync(It.IsAny<ApplicationUser>()))
            .ReturnsAsync(IdentityResult.Success);

        var dto = new UpdateProfileDto { Email = "kate@test.com", UserName = "kateryna" };

        // Act
        var act = () => _sut.UpdateProfileAsync("user-1", dto);

        // Assert — не кидає exception
        await act.Should().NotThrowAsync();
    }

    // ——— ChangePasswordAsync ———

    [Fact]
    public async Task ChangePasswordAsync_WhenUserNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        _userManagerMock
            .Setup(m => m.FindByIdAsync("nonexistent-id"))
            .ReturnsAsync((ApplicationUser?)null);

        var dto = new ChangePasswordDto { CurrentPassword = "old", NewPassword = "new" };

        // Act
        var act = () => _sut.ChangePasswordAsync("nonexistent-id", dto);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task ChangePasswordAsync_WhenCurrentPasswordIsWrong_ThrowsInvalidOperationException()
    {
        // Arrange
        var user = new ApplicationUser { Id = "user-1" };
        _userManagerMock.Setup(m => m.FindByIdAsync("user-1")).ReturnsAsync(user);
        _userManagerMock
            .Setup(m => m.ChangePasswordAsync(user, "wrong-password", "new-password"))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Невірний пароль" }));

        var dto = new ChangePasswordDto { CurrentPassword = "wrong-password", NewPassword = "new-password" };

        // Act
        var act = () => _sut.ChangePasswordAsync("user-1", dto);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Невірний пароль");
    }

    [Fact]
    public async Task ChangePasswordAsync_WhenPasswordIsCorrect_CompletesSuccessfully()
    {
        // Arrange
        var user = new ApplicationUser { Id = "user-1" };
        _userManagerMock.Setup(m => m.FindByIdAsync("user-1")).ReturnsAsync(user);
        _userManagerMock
            .Setup(m => m.ChangePasswordAsync(user, "correct-password", "new-password"))
            .ReturnsAsync(IdentityResult.Success);

        var dto = new ChangePasswordDto { CurrentPassword = "correct-password", NewPassword = "new-password" };

        // Act
        var act = () => _sut.ChangePasswordAsync("user-1", dto);

        // Assert
        await act.Should().NotThrowAsync();
    }

    // ——— DeleteAccountAsync ———

    [Fact]
    public async Task DeleteAccountAsync_WhenUserNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        _userManagerMock
            .Setup(m => m.FindByIdAsync("nonexistent-id"))
            .ReturnsAsync((ApplicationUser?)null);

        // Act
        var act = () => _sut.DeleteAccountAsync("nonexistent-id");

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task DeleteAccountAsync_WhenUserExists_SetsIsDeletedTrue()
    {
        // Arrange
        var user = new ApplicationUser { Id = "user-1", IsDeleted = false };
        _userManagerMock.Setup(m => m.FindByIdAsync("user-1")).ReturnsAsync(user);
        _userManagerMock.Setup(m => m.UpdateAsync(It.IsAny<ApplicationUser>()))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        await _sut.DeleteAccountAsync("user-1");

        // Assert — перевіряємо що IsDeleted стало true
        user.IsDeleted.Should().BeTrue();
    }
}