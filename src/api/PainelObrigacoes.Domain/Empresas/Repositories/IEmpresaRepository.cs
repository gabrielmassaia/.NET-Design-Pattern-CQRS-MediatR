using PainelObrigacoes.Domain.Empresas.Models;

namespace PainelObrigacoes.Domain.Empresas.Repositories;

public interface IEmpresaRepository
{
    Task<EmpresaModel?> FindByIdAsync(Guid id);
    Task<IList<EmpresaModel>> FindAllAsync(int skip = 0, int take = 50);
    Task<bool> ExistsByCnpjAsync(string cnpj);
    void Create(EmpresaModel model);
    void Delete(EmpresaModel model);
}
