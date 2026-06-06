using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mist.Services.Dashboard;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    private readonly IDashboardService _dashboardService = dashboardService;
    [HttpGet]
    public async Task<IActionResult> GetDashboard(
        [FromQuery] int? month,
        [FromQuery] int? year)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        var now = DateTime.Now;
        var result = await _dashboardService.GetDashboardAsync(
            userId,
            month ?? now.Month,
            year ?? now.Year);

        return Ok(result);
    }
}