using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.Services.History;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HistoryController(IHistoryService historyService) : ControllerBase
{
    private readonly IHistoryService _historyService = historyService;

    [HttpGet]
    public async Task<IActionResult> GetHistory(
    [FromQuery] int? platformId,
    [FromQuery] string? search,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();
        var result = await _historyService.GetHistoryAsync(userId, platformId, search, page, pageSize);
        return Ok(result);
    }
}