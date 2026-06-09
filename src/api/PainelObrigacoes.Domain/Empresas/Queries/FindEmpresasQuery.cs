using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Shared.Queries;

namespace PainelObrigacoes.Domain.Empresas.Queries;

public sealed class FindEmpresasQuery : Query<IList<EmpresaModel>>
{
    public int Skip { get; set; }
    public int Take { get; set; } = 50;
}
