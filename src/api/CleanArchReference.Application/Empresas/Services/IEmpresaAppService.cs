// ============================================================
// 🟢 FASE 2 — Interface do AppService (Application Layer)
// ============================================================
//
// Responsabilidade: "Contrato do tradutor entre camadas"
// Por que existe interface?
//   1. DIP (Dependency Inversion Principle):
//      O endpoint depende da abstração (interface), não da implementação
//   2. Testabilidade: podemos mockar IEmpresaAppService nos testes
//   3. Desacoplamento: se mudar a implementação, o endpoint não quebra
//
// Implementação: EmpresaAppService (mesma pasta)
// Registro DI: EmpresaSetup.cs — AddScoped<IEmpresaAppService, EmpresaAppService>()
// ============================================================

using CleanArchReference.Application.Empresas.ViewModels;

namespace CleanArchReference.Application.Empresas.Services;

public interface IEmpresaAppService
{
    Task<IList<EmpresaResultViewModel>> FindAllAsync(int skip = 0, int take = 50, CancellationToken ct = default);
    Task<EmpresaResultViewModel> CreateAsync(CreateEmpresaViewModel viewModel, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
    Task<IList<EmpresaResultViewModel>> SearchAsync(string query, CancellationToken ct = default);
}
