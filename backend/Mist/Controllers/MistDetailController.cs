using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.Services.MistDetail;

namespace Mist.Controllers;

[ApiController]
[Route("api/mist")]
[Authorize]
public class MistDetailController(IMistDetailService mistDetailService) : ControllerBase
{
    private readonly IMistDetailService _mistDetailService = mistDetailService;

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMistDetail(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();
        var result = await _mistDetailService.GetByIdAsync(id, userId);
        if (result == null) return NotFound();
        return Ok(result);
    }
}