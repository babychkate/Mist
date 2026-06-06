using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Microsoft.Extensions.Configuration;
using Mist.Data;
using Mist.Services.Video;

namespace Mist.Tests.Services;

public class VideoServiceTests
{
    // ——— ExtractYoutubeId ———
    // Статичний метод — не потребує моків, тестуємо напряму

    [Theory] // Theory = один тест з кількома наборами даних
    [InlineData("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ")]
    [InlineData("https://youtu.be/dQw4w9WgXcQ", "dQw4w9WgXcQ")]
    [InlineData("https://youtu.be/dQw4w9WgXcQ?si=abc123", "dQw4w9WgXcQ")]
    [InlineData("https://www.youtube.com/shorts/dQw4w9WgXcQ", "dQw4w9WgXcQ")]
    [InlineData("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s", "dQw4w9WgXcQ")]
    public void ExtractYoutubeId_WithValidUrl_ReturnsCorrectId(string url, string expectedId)
    {
        // Act
        var result = VideoService.ExtractYoutubeId(url);

        // Assert
        result.Should().Be(expectedId);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("https://vimeo.com/123456")]
    [InlineData("not-a-url-at-all")]
    public void ExtractYoutubeId_WithInvalidUrl_ReturnsNull(string url)
    {
        // Act
        var result = VideoService.ExtractYoutubeId(url);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public void ExtractYoutubeId_WithNullUrl_ReturnsNull()
    {
        // Act
        var result = VideoService.ExtractYoutubeId(null!);

        // Assert
        result.Should().BeNull();
    }

    // ——— ParseDuration (через рефлексію, бо private static) ———

    [Theory]
    [InlineData("PT3M10S", "3:10")]
    [InlineData("PT1H2M30S", "1:02:30")]
    [InlineData("PT45S", "0:45")]
    [InlineData("PT10M", "10:00")]
    public void ParseDuration_WithValidIso_ReturnsFormattedString(string iso, string expected)
    {
        // Arrange — дістаємо private static через рефлексію
        var method = typeof(VideoService)
            .GetMethod("ParseDuration", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static);

        // Act
        var result = method!.Invoke(null, [iso]) as string;

        // Assert
        result.Should().Be(expected);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public void ParseDuration_WithNullOrEmpty_ReturnsNull(string? iso)
    {
        // Arrange
        var method = typeof(VideoService)
            .GetMethod("ParseDuration", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static);

        // Act
        var result = method!.Invoke(null, [iso]) as string;

        // Assert
        result.Should().BeNull();
    }

    // ——— FetchAndSaveAsync — тестуємо кейс з невалідним URL ———

    [Fact]
    public async Task FetchAndSaveAsync_WithInvalidUrl_ReturnsNull()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new AppDbContext(options);
        var config = new Mock<IConfiguration>();
        config.Setup(c => c["YouTube:ApiKey"]).Returns("fake-key");
        var http = new HttpClient();

        var sut = new VideoService(context, config.Object, http);

        // Act
        var result = await sut.FetchAndSaveAsync("https://vimeo.com/123");

        // Assert
        result.Should().BeNull();
    }
}