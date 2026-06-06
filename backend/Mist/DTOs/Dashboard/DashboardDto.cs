namespace Mist.DTOs.Dashboard;

public class DashboardDto
{
    public int TotalGenerations { get; set; }
    public int TotalVideos { get; set; }
    public int ActiveDays { get; set; }
    public List<MistCardDto> RecentMists { get; set; } = [];
    public List<int> ActiveCalendarDays { get; set; } = [];
    public int CalendarMonth { get; set; }
    public int CalendarYear { get; set; }
}