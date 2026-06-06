namespace Mist.Services.Image;

public interface IImageService
{
    Task<string?> GenerateAsync(string prompt);
}