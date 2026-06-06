using Mist.DTOs.Dashboard;

namespace Mist.Services.Dashboard;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync(string userId, int month, int year);
}