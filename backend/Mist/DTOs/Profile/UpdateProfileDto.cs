using System.ComponentModel.DataAnnotations;

namespace Mist.DTOs.Profile;

public class UpdateProfileDto
{
    [Required(ErrorMessage = "Ім'я обов'язкове")]
    [MinLength(2, ErrorMessage = "Ім'я має містити щонайменше 2 символи")]
    public string UserName { get; set; } = "";

    [Required(ErrorMessage = "Email обов'язковий")]
    [RegularExpression(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        ErrorMessage = "Невірний формат email")]
    public string Email { get; set; } = "";
}