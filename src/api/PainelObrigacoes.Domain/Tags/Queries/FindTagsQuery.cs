using PainelObrigacoes.Domain.Shared.Queries;
using PainelObrigacoes.Domain.Tags.Models;

namespace PainelObrigacoes.Domain.Tags.Queries;

public sealed class FindTagsQuery : Query<IList<TagModel>>
{
}
