using System.ComponentModel.DataAnnotations;
namespace Mist.DTOs.Profile;
public class ChangePasswordDto
{
    [Required(ErrorMessage = "Поточний пароль обов'язковий")]
    public string CurrentPassword { get; set; } = "";

    [Required(ErrorMessage = "Новий пароль обов'язковий")]
    [MinLength(6, ErrorMessage = "Пароль має містити щонайменше 6 символів")]
    public string NewPassword { get; set; } = "";

    [Required(ErrorMessage = "Підтвердження пароля обов'язкове")]
    [Compare("NewPassword", ErrorMessage = "Паролі не співпадають")]
    public string ConfirmPassword { get; set; } = "";
}