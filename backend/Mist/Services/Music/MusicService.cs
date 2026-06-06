using System.Text.Json;
using Mist.DTOs.Music;

namespace Mist.Services.Music;

public class MusicService(IConfiguration config, HttpClient http) : IMusicService
{
    private readonly HttpClient _http = http;
    private readonly string _clientId = config["Jamendo:ClientId"]!;

    public async Task<List<MusicTrackDto>> SearchAsync(string? query)
    {
        var q = string.IsNullOrWhiteSpace(query) ? "" : Uri.EscapeDataString(query.Trim());

        var url = $"https://api.jamendo.com/v3.0/tracks/?client_id={_clientId}" +
                  $"&format=json&limit=20&audioformat=mp32&include=musicinfo" +
                  $"&search={q}&boost=popularity_total&order=popularity_total";

        var response = await _http.GetAsync(url);
        if (!response.IsSuccessStatusCode) return [];

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        if (!doc.RootElement.TryGetProperty("results", out var results)) return [];

        var tracks = new List<MusicTrackDto>();

        foreach (var item in results.EnumerateArray())
        {
            var audioUrl = item.TryGetProperty("audio", out var audio) ? audio.GetString() : null;
            if (string.IsNullOrEmpty(audioUrl)) continue;

            var id = item.TryGetProperty("id", out var idEl) ? int.Parse(idEl.GetString() ?? "0") : 0;
            var name = item.TryGetProperty("name", out var nameEl) ? nameEl.GetString() ?? "" : "";
            var artistId = item.TryGetProperty("artist_id", out var aid)
            ? (int.TryParse(aid.GetString(), out var parsedId) ? parsedId : (int?)null)
            : null;
            var artist = item.TryGetProperty("artist_name", out var artistEl) ? artistEl.GetString() ?? "" : "";

            var durationSec = item.TryGetProperty("duration", out var durEl) ? durEl.GetInt32() : 0;
            var durationStr = $"{durationSec / 60}:{durationSec % 60:D2}";

            string? genre = null;
            if (item.TryGetProperty("musicinfo", out var musicInfo) &&
                musicInfo.TryGetProperty("tags", out var tagsObj) &&
                tagsObj.TryGetProperty("genres", out var genres) &&
                genres.GetArrayLength() > 0)
            {
                genre = genres[0].GetString();
            }

            tracks.Add(new MusicTrackDto
            {
                ApiId = id,
                Title = name,
                AuthorApiId = artistId,
                AuthorName = artist,
                Genre = genre,
                Duration = durationStr,
                PreviewUrl = audioUrl,
            });
        }

        tracks = [.. tracks
            .Where(t => !t.Title.Any(c => c >= '\u0400' && c <= '\u04FF') &&
                        !t.AuthorName.Any(c => c >= '\u0400' && c <= '\u04FF'))];

        if (!string.IsNullOrWhiteSpace(query))
        {
            var qLower = query.Trim().ToLower();
            tracks = [.. tracks
                .Where(t => t.Title.Contains(qLower, StringComparison.CurrentCultureIgnoreCase) ||
                            t.AuthorName.Contains(qLower, StringComparison.CurrentCultureIgnoreCase))];
        }

        return tracks;
    }
}