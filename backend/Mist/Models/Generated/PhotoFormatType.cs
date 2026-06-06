using System;
using System.Collections.Generic;

namespace Mist.Models.Generated;

public partial class PhotoFormatType
{
    public int PhotoFormatTypeId { get; set; }

    public string? PhotoFormatTypeName { get; set; }

    public virtual ICollection<PlatformPhotoFormat> PlatformPhotoFormats { get; set; } = new List<PlatformPhotoFormat>();
}
