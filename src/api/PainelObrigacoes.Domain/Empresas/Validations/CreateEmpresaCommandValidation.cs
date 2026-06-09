using FluentValidation;
using PainelObrigacoes.Domain.Empresas.Commands;

namespace PainelObrigacoes.Domain.Empresas.Validations;

public sealed class CreateEmpresaCommandValidation : AbstractValidator<CreateEmpresaCommand>
{
    public CreateEmpresaCommandValidation()
    {
        RuleFor(c => c.CNPJ)
            .NotEmpty().WithMessage("CNPJ é obrigatório.")
            .Matches(@"^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$")
            .WithMessage("CNPJ inválido.");

        RuleFor(c => c.RazaoSocial)
            .NotEmpty().WithMessage("Razão Social é obrigatória.")
            .MaximumLength(300);

        RuleFor(c => c.Regime)
            .IsInEnum().WithMessage("Regime tributário inválido.");
    }
}
