using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class PlatformPhotoFormat
{
    public int PlatformPhotoFormatId { get; set; }

    public int? PlatformPhotoFormatPlatformId { get; set; }

    public int? PlatformPhotoFormatTypeId { get; set; }

    public int? PlatformPhotoFormatWidth { get; set; }

    public int? PlatformPhotoFormatHeight { get; set; }

    public virtual ICollection<GenerationPlatformPhoto> GenerationPlatformPhotos { get; set; } = new List<GenerationPlatformPhoto>();

    public virtual Platform? PlatformPhotoFormatPlatform { get; set; }

    public virtual PhotoFormatType? PlatformPhotoFormatType { get; set; }
}
