using FluentValidation;
using CleanArchReference.Domain.Tags.Commands;

namespace CleanArchReference.Domain.Tags.Validations;

public sealed class CreateTagCommandValidation : AbstractValidator<CreateTagCommand>
{
    public CreateTagCommandValidation()
    {
        RuleFor(c => c.Nome)
            .NotEmpty().WithMessage("Nome da tag é obrigatório.")
            .MaximumLength(50).WithMessage("Nome deve ter no máximo 50 caracteres.");

        RuleFor(c => c.Cor)
            .NotEmpty().WithMessage("Cor da tag é obrigatório.")
            .Matches("^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$").WithMessage("Cor deve ser um hexadecimal válido (ex: #FF0000).");
    }
}
