using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class GenerationPlatformPhoto
{
    public int GenerationPlatformPhotoId { get; set; }

    public int? GenerationPlatformPhotoGenerationPlatformId { get; set; }

    public int? GenerationPlatformPhotoPhotoId { get; set; }

    public int? GenerationPlatformPhotoPlatformPhotoFormatId { get; set; }

    public virtual GenerationPlatform? GenerationPlatformPhotoGenerationPlatform { get; set; }

    public virtual Photo? GenerationPlatformPhotoPhoto { get; set; }

    public virtual PlatformPhotoFormat? GenerationPlatformPhotoPlatformPhotoFormat { get; set; }
}
