using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class Generation
{
    public int GenerationId { get; set; }

    public string? GenerationUserId { get; set; }

    public int? GenerationVideoId { get; set; }

    public DateTime? GenerationCreatedAt { get; set; }

    public virtual ICollection<GenerationPlatform> GenerationPlatforms { get; set; } = new List<GenerationPlatform>();

    public virtual Video? GenerationVideo { get; set; }
}
