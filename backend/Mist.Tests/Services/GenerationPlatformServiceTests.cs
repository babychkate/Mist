using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Mist.Data;
using Mist.Services.GenerationPlatform;
using Mist.DTOs.GenerationPlatform;

namespace Mist.Tests.Services;

public class GenerationPlatformServiceTests
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly GenerationPlatformService _sut;

    public GenerationPlatformServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);

        var configData = new Dictionary<string, string?>
        {
            ["Gemini:ApiKey"] = "fake-key",
            ["Cloudinary:CloudName"] = "fake-cloud",
            ["Cloudinary:ApiKey"] = "fake-api-key",
            ["Cloudinary:ApiSecret"] = "fake-secret",
            ["TranscriptService:BaseUrl"] = "http://localhost:8001"
        };
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configData)
            .Build();

        _sut = new GenerationPlatformService(_context, _configuration, new HttpClient());
    }

    // ——— GenerateForPlatformAsync — перевірка exception кейсів ———

    [Fact]
    public async Task GenerateForPlatformAsync_WhenPlatformNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange — БД порожня, платформи немає
        var dto = new GeneratePlatformRequestDto
        {
            PlatformId = 999,
            VideoId = 1,
            Photos = [],
            FormatIds = []
        };

        // Act
        var act = () => _sut.GenerateForPlatformAsync(dto);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("Платформу не знайдено");
    }

    [Fact]
    public async Task GenerateForPlatformAsync_WhenVideoNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange — додаємо платформу але не відео
        var platform = new Mist.Models.Generated.Platform
        {
            PlatformId = 1,
            PlatformName = "Instagram",
            PlatformMaxCharacters = 2200
        };
        _context.Platforms.Add(platform);
        await _context.SaveChangesAsync();

        var dto = new GeneratePlatformRequestDto
        {
            PlatformId = 1,
            VideoId = 999,
            Photos = [],
            FormatIds = []
        };

        // Act
        var act = () => _sut.GenerateForPlatformAsync(dto);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("Відео не знайдено");
    }

    // ——— GenerateFallbackText — через рефлексію ———

    [Theory]
    [InlineData("TikTok", "#тікток")]
    [InlineData("Instagram", "#reels")]
    [InlineData("LinkedIn", "#linkedin")]
    [InlineData("Threads", "#threads")]
    [InlineData("X (Twitter)", "#Ukraine")]
    public void GenerateFallbackText_ForEachPlatform_ReturnsCorrectHashtags(
        string platformName, string expectedHashtagPart)
    {
        // Arrange
        var method = typeof(GenerationPlatformService)
            .GetMethod("GenerateFallbackText",
                System.Reflection.BindingFlags.NonPublic |
                System.Reflection.BindingFlags.Static);

        // Act
        var result = method!.Invoke(null, [platformName, "Тестове відео"]);
        var (text, hashtags) = ((string, string))result!;

        // Assert
        hashtags.Should().Contain(expectedHashtagPart);
        text.Should().NotBeNullOrEmpty();
        text.Should().Contain("Тестове відео");
    }

    [Fact]
    public void GenerateFallbackText_ForUnknownPlatform_ReturnsDefaultText()
    {
        // Arrange
        var method = typeof(GenerationPlatformService)
            .GetMethod("GenerateFallbackText",
                System.Reflection.BindingFlags.NonPublic |
                System.Reflection.BindingFlags.Static);

        // Act
        var result = method!.Invoke(null, ["UnknownPlatform", "Тест"]);
        var (text, hashtags) = ((string, string))result!;

        // Assert
        text.Should().Contain("Тест");
        hashtags.Should().Contain("#відео");
    }
}