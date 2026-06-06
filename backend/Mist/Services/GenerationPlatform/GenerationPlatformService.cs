using Mist.Data;
using System.Text;
using System.Text.Json;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Mist.DTOs.GenerationPlatform;
using Microsoft.EntityFrameworkCore;

namespace Mist.Services.GenerationPlatform;

public class GenerationPlatformService(AppDbContext context, IConfiguration config, HttpClient http) : IGenerationPlatformService
{
    private readonly AppDbContext _context = context;
    private readonly HttpClient _http = http;
    private readonly string _geminiApiKey = config["Gemini:ApiKey"]!;
    private readonly string _cloudinaryCloudName = config["Cloudinary:CloudName"]!;
    private readonly string _transcriptBaseUrl = config["TranscriptService:BaseUrl"] ?? "http://127.0.0.1:8001";
    private readonly CloudinaryDotNet.Cloudinary _cloudinary = new(new Account(
        config["Cloudinary:CloudName"]!,
        config["Cloudinary:ApiKey"]!,
        config["Cloudinary:ApiSecret"]!));
    private static readonly string[] _geminiModels = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

    public async Task<GeneratePlatformResponseDto> GenerateForPlatformAsync(GeneratePlatformRequestDto dto)
    {
        var platform = await _context.Platforms.FindAsync(dto.PlatformId)
            ?? throw new KeyNotFoundException("Платформу не знайдено");

        var video = await _context.Videos.FindAsync(dto.VideoId)
            ?? throw new KeyNotFoundException("Відео не знайдено");

        string? toneDescription = null;
        if (dto.ToneId.HasValue)
        {
            var tone = await _context.Tones.FindAsync(dto.ToneId.Value);
            toneDescription = tone?.ToneDescription;
        }

        var formats = await _context.PlatformPhotoFormats
            .Where(f => f.PlatformPhotoFormatPlatformId == dto.PlatformId
                     && dto.FormatIds.Contains(f.PlatformPhotoFormatId))
            .ToListAsync();

        var formatTypeIds = formats
            .Where(f => f.PlatformPhotoFormatTypeId.HasValue)
            .Select(f => f.PlatformPhotoFormatTypeId!.Value)
            .Distinct()
            .ToList();

        var formatTypes = await _context.PhotoFormatTypes
            .Where(t => formatTypeIds.Contains(t.PhotoFormatTypeId))
            .ToDictionaryAsync(t => t.PhotoFormatTypeId, t => t.PhotoFormatTypeName);

        var transcript = await FetchTranscriptAsync(video.VideoYoutubeId ?? "");

        var (generatedText, generatedHashtags) = await GenerateTextAsync(
            platform.PlatformName ?? "",
            platform.PlatformMaxCharacters,
            video.VideoTitle ?? "",
            video.VideoTags,
            transcript,
            toneDescription,
            dto.CustomPrompt
        );

        // Паралельне завантаження фото на Cloudinary
        var uploadTasks = dto.Photos.Select(UploadToCloudinaryAsync).ToList();
        var publicIds = await Task.WhenAll(uploadTasks);

        var generatedPhotos = new List<GeneratedPhotoDto>();

        foreach (var publicId in publicIds.Where(id => id != null))
        {
            foreach (var format in formats)
            {
                var w = format.PlatformPhotoFormatWidth ?? 1080;
                var h = format.PlatformPhotoFormatHeight ?? 1080;
                var formatName = format.PlatformPhotoFormatTypeId.HasValue
                    ? formatTypes.GetValueOrDefault(format.PlatformPhotoFormatTypeId.Value) ?? ""
                    : "";

                var transformedUrl = $"https://res.cloudinary.com/{_cloudinaryCloudName}/image/upload" +
                                     $"/w_{w},h_{h},c_fill,g_auto,f_auto,q_auto" +
                                     $"/{publicId}.jpg";

                generatedPhotos.Add(new GeneratedPhotoDto
                {
                    FormatId = format.PlatformPhotoFormatId,
                    Width = w,
                    Height = h,
                    FormatName = formatName,
                    Url = transformedUrl,
                });
            }
        }

        return new GeneratePlatformResponseDto
        {
            GeneratedText = generatedText,
            GeneratedHashtags = generatedHashtags,
            Photos = generatedPhotos,
        };
    }

    // ——— YouTube субтитри ———
    private async Task<string?> FetchTranscriptAsync(string youtubeId)
    {
        if (string.IsNullOrEmpty(youtubeId)) return null;

        try
        {
            var response = await _http.GetAsync($"{_transcriptBaseUrl}/transcript/{youtubeId}");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            if (doc.RootElement.TryGetProperty("transcript", out var t) &&
                t.ValueKind != JsonValueKind.Null)
            {
                var transcript = t.GetString();
                return string.IsNullOrWhiteSpace(transcript) ? null : transcript;
            }

            return null;
        }
        catch
        {
            return null;
        }
    }

#if DEBUG
    // Gemini Заглушка для тестування
    //private Task<(string text, string hashtags)> GenerateTextAsync(
    //    string platformName, int? maxChars, string videoTitle,
    //    string? videoTags, string? transcript, string? toneDescription, string? customPrompt)
    //{
    //    return Task.FromResult((
    //        $"Тестовий текст поста для {platformName}. 🚀 Тема: {videoTitle}",
    //        "#test #testing #dev #Ukraine #мист"
    //    ));
    //}
#endif

    // ——— Gemini з chain of models ———
    private async Task<(string text, string hashtags)> GenerateTextAsync(
        string platformName,
        int? maxChars,
        string videoTitle,
        string? videoTags,
        string? transcript,
        string? toneDescription,
        string? customPrompt)
    {
        var styleInstruction = !string.IsNullOrWhiteSpace(customPrompt)
            ? $"Style instructions: {customPrompt}"
            : !string.IsNullOrWhiteSpace(toneDescription)
                ? $"Tone: {toneDescription}"
                : "Tone: informative and engaging";

        var charLimit = maxChars.HasValue ? $"Maximum {maxChars} characters for the post text." : "";
        var tagsLine = !string.IsNullOrWhiteSpace(videoTags) ? $"Video tags: {videoTags}" : "";
        var transcriptLine = !string.IsNullOrWhiteSpace(transcript)
            ? $"Video transcript (use this as main context for the post):\n{transcript}"
            : "";

        var prompt = $$"""
            You are a social media content creator. Create a post for {{platformName}}.

            Video title: {{videoTitle}}
            {{tagsLine}}
            {{transcriptLine}}
            {{styleInstruction}}
            {{charLimit}}

            Requirements:
            - Write the post text in Ukrainian
            - Generate 5-7 relevant hashtags: mix of English and Ukrainian (e.g. #BookReview #читання #книги)
            - Hashtags must start with #
            - Return ONLY valid JSON, no markdown, no explanation

            Return this exact JSON structure:
            {"text": "post text here", "hashtags": "#tag1 #tag2 #tag3"}
            """;

        // responseMimeType гарантує що Gemini поверне чистий JSON без markdown
        var body = new
        {
            contents = new[] { new { parts = new[] { new { text = prompt } } } },
            generationConfig = new { responseMimeType = "application/json" }
        };
        var bodyJson = JsonSerializer.Serialize(body);

        foreach (var model in _geminiModels)
        {
            var result = await TryGenerateWithModelAsync(_geminiApiKey, model, bodyJson);
            if (result.HasValue)
                return result.Value;
        }

        return GenerateFallbackText(platformName, videoTitle);
    }

    private async Task<(string text, string hashtags)?> TryGenerateWithModelAsync(
        string apiKey, string model, string bodyJson)
    {
        try
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            using var request = new HttpRequestMessage(System.Net.Http.HttpMethod.Post, url);
            request.Content = new StringContent(bodyJson, Encoding.UTF8, "application/json");
            using var response = await _http.SendAsync(request);

            if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests) return null;
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            // responseMimeType гарантує чистий JSON — очищення від ```json більше не потрібне
            var content = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? "{}";

            using var resultDoc = JsonDocument.Parse(content);
            var text = resultDoc.RootElement.TryGetProperty("text", out var t) ? t.GetString() ?? "" : "";
            var hashtags = resultDoc.RootElement.TryGetProperty("hashtags", out var h) ? h.GetString() ?? "" : "";

            if (string.IsNullOrWhiteSpace(text)) return null;

            return (text, hashtags);
        }
        catch
        {
            return null;
        }
    }

    // ——— Шаблонний fallback ———
    private static (string text, string hashtags) GenerateFallbackText(string platformName, string videoTitle)
    {
        var text = platformName switch
        {
            "TikTok" => $"Це відео змінить твій погляд на все! 🔥 {videoTitle} — дивись просто зараз і ділись з друзями! 👇",
            "Instagram" => $"✨ Новий контент вже тут! {videoTitle} — саме те, що ти шукав. Зберігай і не губи! 📌",
            "LinkedIn" => $"Ділюся корисним матеріалом: {videoTitle}. Буду радий почути вашу думку в коментарях. 💼",
            "Threads" => $"Поговорімо про це 👉 {videoTitle}. Що думаєте? Пишіть в коментарях!",
            "X (Twitter)" => $"{videoTitle} — обов'язково до перегляду! 🎯",
            _ => $"Новий відеоматеріал: {videoTitle}. Дивіться та діліться! 🎬"
        };

        var hashtags = platformName switch
        {
            "TikTok" => "#тікток #відео #тренд #контент #Ukraine #fyp #viral",
            "Instagram" => "#reels #instagram #контент #відео #Ukraine #explore",
            "LinkedIn" => "#linkedin #professional #content #Ukraine #career",
            "Threads" => "#threads #контент #Ukraine #відео",
            "X (Twitter)" => "#Ukraine #відео #контент #trending",
            _ => "#відео #контент #Ukraine"
        };

        return (text, hashtags);
    }

    // ——— Cloudinary upload ———
    private async Task<string?> UploadToCloudinaryAsync(string base64Image)
    {
        try
        {
            var base64Data = base64Image.Contains(",")
                ? base64Image.Split(",")[1]
                : base64Image;

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription("photo", new MemoryStream(Convert.FromBase64String(base64Data))),
                Folder = "mist_generations",
            };

            var result = await _cloudinary.UploadAsync(uploadParams);
            return result?.Error != null ? null : result?.PublicId;
        }
        catch
        {
            return null;
        }
    }
}
