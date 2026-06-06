using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.Services.Music;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MusicController(IMusicService musicService) : ControllerBase
{
    private readonly IMusicService _musicService = musicService;

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? q)
    {
        var tracks = await _musicService.SearchAsync(q);
        return Ok(tracks);
    }
}
