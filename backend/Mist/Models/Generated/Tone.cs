using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class Tone
{
    public int ToneId { get; set; }

    public string? ToneName { get; set; }

    public string? ToneDescription { get; set; }

    public virtual ICollection<GenerationPlatformTone> GenerationPlatformTones { get; set; } = new List<GenerationPlatformTone>();
}
