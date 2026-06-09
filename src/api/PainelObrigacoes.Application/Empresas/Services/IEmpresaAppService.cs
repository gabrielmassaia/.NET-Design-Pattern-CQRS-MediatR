using PainelObrigacoes.Application.Empresas.ViewModels;

namespace PainelObrigacoes.Application.Empresas.Services;

public interface IEmpresaAppService
{
    Task<IList<EmpresaResultViewModel>> FindAllAsync(int skip = 0, int take = 50, CancellationToken ct = default);
    Task<EmpresaResultViewModel> CreateAsync(CreateEmpresaViewModel viewModel, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
    Task<IList<EmpresaResultViewModel>> SearchAsync(string query, CancellationToken ct = default);
}
