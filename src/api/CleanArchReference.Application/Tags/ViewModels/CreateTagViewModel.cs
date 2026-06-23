using System.ComponentModel.DataAnnotations;

namespace CleanArchReference.Application.Tags.ViewModels;

public sealed class CreateTagViewModel
{
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(50, ErrorMessage = "Nome deve ter no máximo 50 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "Cor é obrigatório.")]
    [RegularExpression("^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$", ErrorMessage = "Cor deve ser um hexadecimal válido (ex: #FF0000).")]
    public string Cor { get; set; } = string.Empty;
}
