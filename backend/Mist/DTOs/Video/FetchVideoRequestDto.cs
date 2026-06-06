using System.ComponentModel.DataAnnotations;

namespace Mist.DTOs.Video;

public class FetchVideoRequestDto
{
    [Required(ErrorMessage = "URL не може бути порожнім")]
    public string Url { get; set; } = "";
}