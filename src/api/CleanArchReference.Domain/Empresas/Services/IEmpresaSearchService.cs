using CleanArchReference.Domain.Empresas.Models;

namespace CleanArchReference.Domain.Empresas.Services;

public interface IEmpresaSearchService
{
    Task IndexAsync(EmpresaModel empresa, CancellationToken ct = default);
    Task DeleteFromIndexAsync(Guid id, CancellationToken ct = default);
    Task<IList<EmpresaModel>> SearchAsync(string query, CancellationToken ct = default);
}
