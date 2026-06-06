using System.ComponentModel.DataAnnotations;

public class GenerateImageRequestDto
{
    [Required(ErrorMessage = "Промпт не може бути порожнім")]
    public string Prompt { get; set; } = "";
}