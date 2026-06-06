using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class Photo
{
    public int PhotoId { get; set; }

    public int? PhotoTypeId { get; set; }

    public string? PhotoUrl { get; set; }

    public virtual ICollection<GenerationPlatformPhoto> GenerationPlatformPhotos { get; set; } = new List<GenerationPlatformPhoto>();

    public virtual PhotoType? PhotoType { get; set; }
}
