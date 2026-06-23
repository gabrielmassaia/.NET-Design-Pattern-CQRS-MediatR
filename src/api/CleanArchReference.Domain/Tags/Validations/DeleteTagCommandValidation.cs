using FluentValidation;
using CleanArchReference.Domain.Tags.Commands;

namespace CleanArchReference.Domain.Tags.Validations;

public sealed class DeleteTagCommandValidation : AbstractValidator<DeleteTagCommand>
{
    public DeleteTagCommandValidation()
    {
        RuleFor(c => c.Id)
            .NotEmpty().WithMessage("Id da tag é obrigatório.");
    }
}
