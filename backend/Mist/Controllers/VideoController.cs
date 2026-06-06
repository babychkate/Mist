using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.DTOs.Video;
using Mist.Services.Video;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VideoController(IVideoService videoService) : ControllerBase
{
    private readonly IVideoService _videoService = videoService;

    [HttpPost("fetch")]
    public async Task<IActionResult> Fetch([FromBody] FetchVideoRequestDto dto)
    {
        var youtubeId = VideoService.ExtractYoutubeId(dto.Url);
        if (youtubeId == null)
            return BadRequest(new { message = "Некоректне YouTube посилання" });

        var result = await _videoService.FetchAndSaveAsync(dto.Url);
        if (result == null)
            return BadRequest(new { message = "Відео не знайдено" });

        return Ok(result);
    }
}