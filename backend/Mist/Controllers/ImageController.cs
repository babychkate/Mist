using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.DTOs.Image;
using Mist.Services.Image;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ImageController(IImageService imageService) : ControllerBase
{
    private readonly IImageService _imageService = imageService;

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GenerateImageRequestDto dto)
    {
        var imageUrl = await _imageService.GenerateAsync(dto.Prompt);
        if (imageUrl == null)
            return BadRequest(new { message = "Не вдалось згенерувати зображення" });

        return Ok(new GenerateImageResponseDto { ImageUrl = imageUrl });
    }
}