using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Shared.Queries;

namespace CleanArchReference.Domain.Empresas.Queries;

public sealed class FindEmpresasQuery : Query<IList<EmpresaModel>>
{
    public int Skip { get; set; }
    public int Take { get; set; } = 50;
}
