using CleanArchReference.Domain.Empresas.Models;
using CleanArchReference.Domain.Shared.Queries;

namespace CleanArchReference.Domain.Empresas.Queries;

public sealed class SearchEmpresasQuery : Query<IList<EmpresaModel>>
{
    public string Query { get; set; } = string.Empty;
}
