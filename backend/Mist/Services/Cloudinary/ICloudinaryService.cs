namespace Mist.Services.Cloudinary
{
    public interface ICloudinaryService
    {
        Task<string> UploadAvatarAsync(IFormFile file, string userId);
        Task DeleteAvatarAsync(string publicId);
    }
}