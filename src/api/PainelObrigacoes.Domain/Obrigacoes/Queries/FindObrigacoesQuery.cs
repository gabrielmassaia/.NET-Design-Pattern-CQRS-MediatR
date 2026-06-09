using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Shared.Queries;

namespace PainelObrigacoes.Domain.Obrigacoes.Queries;

public sealed class FindObrigacoesQuery : Query<IList<ObrigacaoReadModel>>
{
    public Guid EmpresaId { get; set; }
    public int Ano { get; set; }
    public int Mes { get; set; }
    public int Skip { get; set; }
    public int Take { get; set; } = 100;
}
