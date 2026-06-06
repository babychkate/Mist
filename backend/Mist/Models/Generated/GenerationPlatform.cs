using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class GenerationPlatform
{
    public int GenerationPlatformId { get; set; }

    public int? GenerationPlatformGenerationId { get; set; }

    public int? GenerationPlatformPlatformId { get; set; }

    public string? GenerationPlatformGeneratedText { get; set; }

    public string? GenerationPlatformGeneratedHashtags { get; set; }

    public string? GenerationPlatformCustomPrompt { get; set; }

    public virtual Generation? GenerationPlatformGeneration { get; set; }

    public virtual GenerationPlatformMusicTrack? GenerationPlatformMusicTrack { get; set; }

    public virtual ICollection<GenerationPlatformPhoto> GenerationPlatformPhotos { get; set; } = new List<GenerationPlatformPhoto>();

    public virtual Platform? GenerationPlatformPlatform { get; set; }

    public virtual GenerationPlatformTone? GenerationPlatformTone { get; set; }
}
