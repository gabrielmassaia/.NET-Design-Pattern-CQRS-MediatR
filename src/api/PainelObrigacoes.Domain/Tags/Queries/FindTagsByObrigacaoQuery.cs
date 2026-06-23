using PainelObrigacoes.Domain.Shared.Queries;
using PainelObrigacoes.Domain.Tags.Models;

namespace PainelObrigacoes.Domain.Tags.Queries;

public sealed class FindTagsByObrigacaoQuery : Query<IList<TagModel>>
{
    public Guid ObrigacaoId { get; set; }
}
