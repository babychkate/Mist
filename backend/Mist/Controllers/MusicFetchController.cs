using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Mist.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MusicFetchController(IHttpClientFactory httpClientFactory, IConfiguration config) : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
    private readonly string _clientId = config["Jamendo:ClientId"]!;

    [HttpGet("audio")]
    public async Task<IActionResult> GetAudio([FromQuery] string url)
    {
        var client = _httpClientFactory.CreateClient("audio");

        using var request = CreateAuthorizedAudioRequest(url);
        var response = await client.SendAsync(request);

        if (!response.IsSuccessStatusCode)
            return BadRequest($"Upstream error: {response.StatusCode}");

        var bytes = await response.Content.ReadAsByteArrayAsync();
        var contentType = response.Content.Headers.ContentType?.MediaType ?? "audio/mpeg";

        return File(bytes, contentType, "track.mp3");
    }

    [HttpGet("fresh-url")]
    public async Task<IActionResult> GetFreshUrl([FromQuery] int trackId)
    {
        var http = _httpClientFactory.CreateClient("audio");
        var jamendoApiUrl = $"https://api.jamendo.com/v3.0/tracks/?client_id={_clientId}&id={trackId}&audioformat=mp32";

        var response = await http.GetAsync(jamendoApiUrl);
        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode, "Не вдалося отримати дані треку з Jamendo API");

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        if (!doc.RootElement.TryGetProperty("results", out var results) || results.GetArrayLength() == 0)
            return NotFound("Трек не знайдено в базі Jamendo");

        var firstResult = results[0];
        string? audioUrl = null;

        if (firstResult.TryGetProperty("audiodownload", out var downloadProp))
            audioUrl = downloadProp.GetString();

        if (string.IsNullOrEmpty(audioUrl) && firstResult.TryGetProperty("audio", out var audioProp))
            audioUrl = audioProp.GetString();

        if (string.IsNullOrEmpty(audioUrl))
            return NotFound("Для цього треку немає доступного посилання на аудіофайл");

        using var audioRequest = CreateAuthorizedAudioRequest(audioUrl);
        var audioResponse = await http.SendAsync(audioRequest);

        if (!audioResponse.IsSuccessStatusCode)
            return StatusCode((int)audioResponse.StatusCode, $"Jamendo заблокував скачування файлу: {audioResponse.StatusCode}");

        var bytes = await audioResponse.Content.ReadAsByteArrayAsync();
        return File(bytes, "audio/mpeg", "track.mp3");
    }

    private static HttpRequestMessage CreateAuthorizedAudioRequest(string url)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        request.Headers.Add("Referer", "https://www.jamendo.com/");
        return request;
    }
}