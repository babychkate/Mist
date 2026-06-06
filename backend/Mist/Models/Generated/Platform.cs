using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class Platform
{
    public int PlatformId { get; set; }

    public string? PlatformName { get; set; }

    public string? PlatformDescription { get; set; }

    public int? PlatformMaxCharacters { get; set; }

    public string? PlatformPostingTimeSuggestion { get; set; }

    public virtual ICollection<GenerationPlatform> GenerationPlatforms { get; set; } = new List<GenerationPlatform>();

    public virtual ICollection<PlatformPhotoFormat> PlatformPhotoFormats { get; set; } = new List<PlatformPhotoFormat>();
}
