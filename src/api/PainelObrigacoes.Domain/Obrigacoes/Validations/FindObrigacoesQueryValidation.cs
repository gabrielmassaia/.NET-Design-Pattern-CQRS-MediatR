using FluentValidation;
using PainelObrigacoes.Domain.Obrigacoes.Queries;

namespace PainelObrigacoes.Domain.Obrigacoes.Validations;

public sealed class FindObrigacoesQueryValidation : AbstractValidator<FindObrigacoesQuery>
{
    public FindObrigacoesQueryValidation()
    {
        RuleFor(q => q.EmpresaId)
            .NotEmpty().WithMessage("EmpresaId é obrigatório.");

        RuleFor(q => q.Ano)
            .InclusiveBetween(2020, 2100).WithMessage("Ano inválido.");

        RuleFor(q => q.Mes)
            .InclusiveBetween(1, 12).WithMessage("Mês deve estar entre 1 e 12.");
    }
}
