using System.Text.Json;

namespace Mist.Services.Image;

public class ImageService(HttpClient http, IConfiguration config) : IImageService
{
    private readonly HttpClient _http = http;
    private readonly string _huggingFaceToken = config["HuggingFace:ApiToken"]!;
    private readonly string _geminiApiKey = config["Gemini:ApiKey"]!;
    private const string ImageModel = "black-forest-labs/FLUX.1-schnell";

    public async Task<string?> GenerateAsync(string prompt)
    {
        var translatedPrompt = await TranslateToEnglishAsync(prompt);
        var finalPrompt = translatedPrompt ?? prompt;

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"https://router.huggingface.co/hf-inference/models/{ImageModel}"
        );

        request.Headers.Add("Authorization", $"Bearer {_huggingFaceToken}");
        request.Content = JsonContent.Create(new { inputs = finalPrompt });

        var response = await _http.SendAsync(request);
        var content = await response.Content.ReadAsByteArrayAsync();

        if (!response.IsSuccessStatusCode) return null;

        var contentType = response.Content.Headers.ContentType?.MediaType ?? "image/jpeg";
        if (!contentType.StartsWith("image/")) return null;

        var base64 = Convert.ToBase64String(content);
        return $"data:{contentType};base64,{base64}";
    }

    private async Task<string?> TranslateToEnglishAsync(string text)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_geminiApiKey}";

        var body = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = $"Translate this image generation prompt to English. Consider it will be used to ask Hugging Face AI for image generation. Return only the translated text, nothing else: {text}" }
                    }
                }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Content = JsonContent.Create(body);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        return doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString()?.Trim();
    }
}