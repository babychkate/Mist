using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace Mist.Services.Cloudinary;

public class CloudinaryService : ICloudinaryService
{
    private readonly CloudinaryDotNet.Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration configuration)
    {
        var config = configuration.GetSection("Cloudinary");
        var account = new Account(
            config["CloudName"],
            config["ApiKey"],
            config["ApiSecret"]
        );
        _cloudinary = new CloudinaryDotNet.Cloudinary(account);
    }

    public async Task<string> UploadAvatarAsync(IFormFile file, string userId)
    {
        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            PublicId = $"avatars/{userId}",
            Overwrite = true,
            Transformation = new Transformation()
                .Width(200).Height(200).Crop("fill").Gravity("face")
        };
        var result = await _cloudinary.UploadAsync(uploadParams);
        return result.SecureUrl.ToString();
    }

    public async Task DeleteAvatarAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }
}