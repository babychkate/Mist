using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.Services.Tone;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ToneController(IToneService toneService) : ControllerBase
{
    private readonly IToneService _toneService = toneService;

    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        var tones = await _toneService.GetAllAsync();
        return Ok(tones);
    }
}