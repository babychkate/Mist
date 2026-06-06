using System.ComponentModel.DataAnnotations;

namespace Mist.DTOs.Auth;

public class RegisterDto
{
    [Required(ErrorMessage = "Ім'я обов'язкове")]
    [MinLength(2, ErrorMessage = "Ім'я має містити щонайменше 2 символи")]
    public string UserName { get; set; } = "";

    [Required(ErrorMessage = "Email обов'язковий")]
    [RegularExpression(
    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
    ErrorMessage = "Невірний формат email")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Пароль обов'язковий")]
    [MinLength(6, ErrorMessage = "Пароль має містити щонайменше 6 символів")]
    public string Password { get; set; } = "";
}