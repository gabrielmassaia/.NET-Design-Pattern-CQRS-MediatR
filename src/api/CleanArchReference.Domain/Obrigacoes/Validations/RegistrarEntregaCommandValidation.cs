using FluentValidation;
using CleanArchReference.Domain.Obrigacoes.Commands;

namespace CleanArchReference.Domain.Obrigacoes.Validations;

public sealed class RegistrarEntregaCommandValidation : AbstractValidator<RegistrarEntregaCommand>
{
    public RegistrarEntregaCommandValidation()
    {
        RuleFor(c => c.Id)
            .NotEmpty().WithMessage("Id da obrigação é obrigatório.");

        RuleFor(c => c.DataEntrega)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .When(c => c.DataEntrega.HasValue)
            .WithMessage("Data de entrega não pode ser futura.");
    }
}
