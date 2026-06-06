using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class GenerationPlatformTone
{
    public int GenerationPlatformToneId { get; set; }

    public int? GenerationPlatformToneGenerationPlatformId { get; set; }

    public int? GenerationPlatformToneToneId { get; set; }

    public virtual GenerationPlatform? GenerationPlatformToneGenerationPlatform { get; set; }

    public virtual Tone? GenerationPlatformToneTone { get; set; }
}
