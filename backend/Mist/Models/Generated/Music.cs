using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class Music
{
    public int MusicId { get; set; }

    public int? MusicApiId { get; set; }

    public int? MusicAuthorId { get; set; }

    public string? MusicTitle { get; set; }

    public string? MusicGenre { get; set; }

    public int? MusicDuration { get; set; }

    public string? MusicPreviewUrl { get; set; }

    public virtual ICollection<GenerationPlatformMusicTrack> GenerationPlatformMusicTracks { get; set; } = new List<GenerationPlatformMusicTrack>();

    public virtual MusicAuthor? MusicAuthor { get; set; }
}
