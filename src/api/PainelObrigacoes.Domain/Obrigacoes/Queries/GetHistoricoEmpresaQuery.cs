using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Shared.Queries;

namespace PainelObrigacoes.Domain.Obrigacoes.Queries;

public sealed class GetHistoricoEmpresaQuery : Query<IList<ObrigacaoReadModel>>
{
    public Guid EmpresaId { get; set; }
}
