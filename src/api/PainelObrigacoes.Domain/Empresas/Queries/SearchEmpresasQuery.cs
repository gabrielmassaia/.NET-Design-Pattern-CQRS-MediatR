using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Shared.Queries;

namespace PainelObrigacoes.Domain.Empresas.Queries;

public sealed class SearchEmpresasQuery : Query<IList<EmpresaModel>>
{
    public string Query { get; set; } = string.Empty;
}
