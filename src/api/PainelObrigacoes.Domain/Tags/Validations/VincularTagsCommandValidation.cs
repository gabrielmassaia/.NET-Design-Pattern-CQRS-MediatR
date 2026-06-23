using FluentValidation;
using PainelObrigacoes.Domain.Tags.Commands;

namespace PainelObrigacoes.Domain.Tags.Validations;

public sealed class VincularTagsCommandValidation : AbstractValidator<VincularTagsCommand>
{
    public VincularTagsCommandValidation()
    {
        RuleFor(c => c.ObrigacaoId)
            .NotEmpty().WithMessage("Id da obrigação é obrigatório.");

        RuleFor(c => c.TagIds)
            .NotNull().WithMessage("Lista de tags é obrigatória.");
    }
}
