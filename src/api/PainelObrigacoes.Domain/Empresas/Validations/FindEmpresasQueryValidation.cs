using FluentValidation;
using PainelObrigacoes.Domain.Empresas.Queries;

namespace PainelObrigacoes.Domain.Empresas.Validations;

public sealed class FindEmpresasQueryValidation : AbstractValidator<FindEmpresasQuery>
{
    public FindEmpresasQueryValidation()
    {
        RuleFor(q => q.Skip)
            .GreaterThanOrEqualTo(0).WithMessage("skip deve ser maior ou igual a 0")
            .LessThanOrEqualTo(10_000).WithMessage("skip deve ser menor ou igual a 10000");

        RuleFor(q => q.Take)
            .GreaterThanOrEqualTo(1).WithMessage("take deve ser maior ou igual a 1")
            .LessThanOrEqualTo(500).WithMessage("take deve ser menor ou igual a 500");
    }
}
