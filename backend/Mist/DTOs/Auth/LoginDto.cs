using System.ComponentModel.DataAnnotations;

namespace Mist.DTOs.Auth;

public class LoginDto
{
    [Required(ErrorMessage = "Email обов'язковий")]
    [RegularExpression(
    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
    ErrorMessage = "Невірний формат email")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Пароль обов'язковий")]
    public string Password { get; set; } = "";
}