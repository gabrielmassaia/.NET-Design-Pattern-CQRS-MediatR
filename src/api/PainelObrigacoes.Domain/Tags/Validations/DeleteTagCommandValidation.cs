using FluentValidation;
using PainelObrigacoes.Domain.Tags.Commands;

namespace PainelObrigacoes.Domain.Tags.Validations;

public sealed class DeleteTagCommandValidation : AbstractValidator<DeleteTagCommand>
{
    public DeleteTagCommandValidation()
    {
        RuleFor(c => c.Id)
            .NotEmpty().WithMessage("Id da tag é obrigatório.");
    }
}
