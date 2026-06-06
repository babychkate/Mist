using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class Video
{
    public int VideoId { get; set; }

    public string? VideoYoutubeId { get; set; }

    public string? VideoTitle { get; set; }

    public string? VideoDescription { get; set; }

    public string? VideoChannelName { get; set; }

    public virtual ICollection<Generation> Generations { get; set; } = new List<Generation>();
    public string? VideoTags { get; set; }
}
