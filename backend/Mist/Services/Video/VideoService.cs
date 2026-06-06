using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Mist.Data;
using Mist.DTOs.Video;

namespace Mist.Services.Video;

public class VideoService(AppDbContext context, IConfiguration config, HttpClient http) : IVideoService
{
    private readonly AppDbContext _context = context;
    private readonly HttpClient _http = http;
    private readonly string _youtubeApiKey = config["YouTube:ApiKey"]!;


    public static string? ExtractYoutubeId(string url)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;

        if (url.Contains("youtu.be/"))
        {
            var part = url.Split("youtu.be/")[1];
            return part.Split('?')[0].Split('&')[0].Trim();
        }

        if (url.Contains("youtube.com/watch"))
        {
            var uri = new Uri(url);
            var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
            return query["v"];
        }

        if (url.Contains("youtube.com/shorts/"))
        {
            var part = url.Split("youtube.com/shorts/")[1];
            return part.Split('?')[0];
        }

        return null;
    }

    public async Task<VideoPreviewDto?> FetchAndSaveAsync(string url)
    {
        var youtubeId = ExtractYoutubeId(url);
        if (youtubeId == null) return null;

        var existing = await _context.Videos.FirstOrDefaultAsync(v => v.VideoYoutubeId == youtubeId);
        if (existing != null)
            return BuildFromExisting(existing, youtubeId);

        var apiUrl = $"https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id={youtubeId}&key={_youtubeApiKey}";

        var response = await _http.GetAsync(apiUrl);
        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var items = doc.RootElement.GetProperty("items");
        if (items.GetArrayLength() == 0) return null;

        var item = items[0];
        var snippet = item.GetProperty("snippet");
        var statistics = item.GetProperty("statistics");
        var contentDetails = item.GetProperty("contentDetails");

        var title = snippet.GetProperty("title").GetString() ?? "";
        var channelName = snippet.GetProperty("channelTitle").GetString();
        var description = snippet.TryGetProperty("description", out var desc) ? desc.GetString() : null;
        var duration = ParseDuration(contentDetails.GetProperty("duration").GetString());

        var viewCount = statistics.TryGetProperty("viewCount", out var vc)
            ? long.TryParse(vc.GetString(), out var v) ? v : (long?)null
            : null;

        var tags = new List<string>();
        if (snippet.TryGetProperty("tags", out var tagsEl))
            tags = tagsEl.EnumerateArray().Select(t => t.GetString() ?? "").Take(5).ToList();

        var thumbUrl = "";
        if (snippet.TryGetProperty("thumbnails", out var thumbs))
            foreach (var quality in new[] { "maxres", "high", "medium", "default" })
                if (thumbs.TryGetProperty(quality, out var t))
                { thumbUrl = t.GetProperty("url").GetString() ?? ""; break; }

        var video = new Mist.Models.Generated.Video
        {
            VideoYoutubeId = youtubeId,
            VideoTitle = title[..Math.Min(title.Length, 100)],
            VideoDescription = description,
            VideoChannelName = channelName?[..Math.Min(channelName.Length, 50)],
            VideoTags = tags.Count > 0 ? string.Join(",", tags) : null
        };

        _context.Videos.Add(video);
        await _context.SaveChangesAsync();

        return new VideoPreviewDto
        {
            VideoId = video.VideoId,
            YoutubeId = youtubeId,
            Title = title,
            ChannelName = channelName,
            Description = description,
            ThumbnailUrl = thumbUrl,
            Duration = duration,
            ViewCount = viewCount,
            Tags = tags
        };
    }

    private static VideoPreviewDto BuildFromExisting(Mist.Models.Generated.Video v, string youtubeId)
    {
        return new VideoPreviewDto
        {
            VideoId = v.VideoId,
            YoutubeId = youtubeId,
            Title = v.VideoTitle ?? "",
            ChannelName = v.VideoChannelName,
            Description = v.VideoDescription,
            ThumbnailUrl = $"https://img.youtube.com/vi/{youtubeId}/hqdefault.jpg",
            Tags = v.VideoTags != null ? v.VideoTags.Split(',').ToList() : []
        };
    }

    private static string? ParseDuration(string? iso)
    {
        if (string.IsNullOrEmpty(iso)) return null;
        var duration = System.Xml.XmlConvert.ToTimeSpan(iso);
        return duration.Hours > 0
            ? $"{duration.Hours}:{duration.Minutes:D2}:{duration.Seconds:D2}"
            : $"{duration.Minutes}:{duration.Seconds:D2}";
    }
}