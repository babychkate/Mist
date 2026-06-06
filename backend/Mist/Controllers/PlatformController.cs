using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.Services.Platform;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlatformController(IPlatformService platformService) : ControllerBase
{
    private readonly IPlatformService _platformService = platformService;

    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        var platforms = await _platformService.GetAllAsync();
        return Ok(platforms);
    }

    [HttpGet("{platformId}/formats")]
    public async Task<IActionResult> GetFormats(int platformId)
    {
        var formats = await _platformService.GetFormatsAsync(platformId);
        return Ok(formats);
    }
}