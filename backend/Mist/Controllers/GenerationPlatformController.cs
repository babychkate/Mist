using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.DTOs.GenerationPlatform;
using Mist.Services.GenerationPlatform;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GenerationPlatformController(IGenerationPlatformService generationPlatformService) : ControllerBase
{
    private readonly IGenerationPlatformService _generationPlatformService = generationPlatformService;

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GeneratePlatformRequestDto dto)
    {
        var result = await _generationPlatformService.GenerateForPlatformAsync(dto);
        return Ok(result);
    }
}