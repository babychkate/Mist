using Microsoft.EntityFrameworkCore;
using Mist.Data;
using Mist.DTOs.SaveGeneration;
using Mist.Models.Generated;

namespace Mist.Services.SaveGeneration;

public class SaveGenerationService(AppDbContext context) : ISaveGenerationService
{
    private readonly AppDbContext _context = context;

    public async Task<int> SaveAsync(SaveGenerationRequestDto dto, string userId)
    {
        // 1. Завантажуємо типи фото (один запит)
        var photoTypes = await _context.PhotoTypes.ToListAsync();

        // 2. Збираємо унікальні ключі для попереднього завантаження, щоб уникнути запитів у циклі
        var trackApiIds = dto.Platforms.Where(p => p.Track != null).Select(p => p.Track!.ApiId).Distinct().ToList();
        var authorApiIds = dto.Platforms.Where(p => p.Track != null).Select(p => p.Track!.AuthorApiId).Distinct().ToList();
        var photoUrls = dto.Platforms.SelectMany(p => p.Photos).Select(p => p.Url).Distinct().ToList();

        // Завантажуємо все існуюче одним запитом для кожної сутності і перетворюємо в Dictionary
        var existingAuthors = await _context.MusicAuthors.Where(a => authorApiIds.Contains(a.MusicAuthorApiId)).ToDictionaryAsync(a => a.MusicAuthorApiId);
        var existingMusic = await _context.Musics.Where(m => trackApiIds.Contains((int)m.MusicApiId)).ToDictionaryAsync(m => m.MusicApiId);
        var existingPhotos = await _context.Photos.Where(p => photoUrls.Contains(p.PhotoUrl)).ToDictionaryAsync(p => p.PhotoUrl);

        // 3. Створюємо головний Generation
        var generation = new Generation
        {
            GenerationUserId = userId,
            GenerationVideoId = dto.VideoId,
            GenerationCreatedAt = DateTime.Now,
            GenerationPlatforms = new List<Models.Generated.GenerationPlatform>()
        };

        // 4. Будуємо граф об'єктів повністю в пам'яті
        foreach (var platformDto in dto.Platforms)
        {
            var genPlatform = new Models.Generated.GenerationPlatform
            {
                GenerationPlatformGeneration = generation,
                GenerationPlatformPlatformId = platformDto.PlatformId,
                GenerationPlatformGeneratedText = platformDto.GeneratedText,
                GenerationPlatformGeneratedHashtags = platformDto.GeneratedHashtags,
                GenerationPlatformCustomPrompt = platformDto.CustomPrompt,
                GenerationPlatformPhotos = new List<GenerationPlatformPhoto>()
            };

            // 4a. Тон
            if (platformDto.ToneId.HasValue)
            {
                genPlatform.GenerationPlatformTone = new GenerationPlatformTone
                {
                    GenerationPlatformToneGenerationPlatform = genPlatform,
                    GenerationPlatformToneToneId = platformDto.ToneId.Value,
                };
            }

            // 4b. Трек (без жодного запиту до БД всередині циклу)
            if (platformDto.Track != null)
            {
                var track = platformDto.Track;

                // Перевіряємо локальний словник
                if (!existingAuthors.TryGetValue(track.AuthorApiId, out var author))
                {
                    author = new MusicAuthor
                    {
                        MusicAuthorApiId = track.AuthorApiId,
                        MusicAuthorName = track.AuthorName,
                    };
                    existingAuthors.Add(track.AuthorApiId, author); // Кешуємо для наступних ітерацій
                }

                if (!existingMusic.TryGetValue(track.ApiId, out var music))
                {
                    music = new Models.Generated.Music
                    {
                        MusicApiId = track.ApiId,
                        MusicAuthor = author, // Зв'язуємо об'єкти в пам'яті
                        MusicTitle = track.Title,
                        MusicGenre = track.Genre,
                        MusicDuration = track.DurationSeconds,
                        MusicPreviewUrl = track.PreviewUrl,
                    };
                    existingMusic.Add(track.ApiId, music); // Кешуємо
                }

                genPlatform.GenerationPlatformMusicTrack = new GenerationPlatformMusicTrack
                {
                    GenerationPlatformMusicTrackGenerationPlatform = genPlatform,
                    GenerationPlatformMusicTrackMusic = music,
                };
            }

            // 4c. Фото (так само без запитів до БД)
            foreach (var photoDto in platformDto.Photos)
            {
                var photoType = photoTypes.FirstOrDefault(t => t.PhotoTypeName == photoDto.PhotoType);

                if (!existingPhotos.TryGetValue(photoDto.Url, out var photo))
                {
                    photo = new Photo
                    {
                        PhotoTypeId = photoType?.PhotoTypeId,
                        PhotoUrl = photoDto.Url,
                    };
                    existingPhotos.Add(photoDto.Url, photo); // Кешуємо
                }

                genPlatform.GenerationPlatformPhotos.Add(new GenerationPlatformPhoto
                {
                    GenerationPlatformPhotoGenerationPlatform = genPlatform,
                    GenerationPlatformPhotoPhoto = photo,
                    GenerationPlatformPhotoPlatformPhotoFormatId = photoDto.FormatId,
                });
            }

            generation.GenerationPlatforms.Add(genPlatform);
        }

        _context.Generations.Add(generation);
        await _context.SaveChangesAsync();

        return generation.GenerationId;
    }
}