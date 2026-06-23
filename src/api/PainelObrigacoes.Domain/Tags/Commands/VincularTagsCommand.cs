using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Shared.Commands;

namespace PainelObrigacoes.Domain.Tags.Commands;

public sealed class VincularTagsCommand : Command<ObrigacaoModel>
{
    public Guid ObrigacaoId { get; set; }
    public List<Guid> TagIds { get; set; } = [];
}
