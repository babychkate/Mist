using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class PhotoType
{
    public int PhotoTypeId { get; set; }

    public string? PhotoTypeName { get; set; }

    public virtual ICollection<Photo> Photos { get; set; } = new List<Photo>();
}
