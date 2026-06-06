using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class MusicAuthor
{
    public int MusicAuthorId { get; set; }

    public int? MusicAuthorApiId { get; set; }

    public string? MusicAuthorName { get; set; }

    public virtual ICollection<Music> Musics { get; set; } = new List<Music>();
}
