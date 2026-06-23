using CleanArchReference.Domain.Obrigacoes.Models;
using CleanArchReference.Domain.Shared.Commands;

namespace CleanArchReference.Domain.Tags.Commands;

public sealed class VincularTagsCommand : Command<ObrigacaoModel>
{
    public Guid ObrigacaoId { get; set; }
    public List<Guid> TagIds { get; set; } = [];
}
