using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class GenerationPlatformMusicTrack
{
    public int GenerationPlatformMusicTrackId { get; set; }

    public int? GenerationPlatformMusicTrackGenerationPlatformId { get; set; }

    public int? GenerationPlatformMusicTrackMusicId { get; set; }

    public virtual GenerationPlatform? GenerationPlatformMusicTrackGenerationPlatform { get; set; }

    public virtual Music? GenerationPlatformMusicTrackMusic { get; set; }
}
