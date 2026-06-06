using System.ComponentModel.DataAnnotations;

namespace Mist.DTOs.SaveGeneration;
public class SaveGenerationRequestDto
{
    [Required]
    public int VideoId { get; set; }
    [MinLength(1, ErrorMessage = "Оберіть хоча б одну платформу")]
    public List<SaveGenerationPlatformDto> Platforms { get; set; } = [];
}