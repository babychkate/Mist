using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.DTOs.SaveGeneration;
using Mist.Services.SaveGeneration;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SaveGenerationController(ISaveGenerationService saveGenerationService) : ControllerBase
{
    private readonly ISaveGenerationService _saveGenerationService = saveGenerationService;

    [HttpPost("save")]
    public async Task<IActionResult> Save([FromBody] SaveGenerationRequestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();
        var generationId = await _saveGenerationService.SaveAsync(dto, userId);
        return Ok(new { generationId });
    }
}
