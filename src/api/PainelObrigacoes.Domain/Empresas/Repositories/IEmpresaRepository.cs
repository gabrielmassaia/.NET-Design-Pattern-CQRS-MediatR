// ============================================================
// 🟡 FASE 3 — Interface do Repository (Definida no Domain)
// ============================================================
//
// Responsabilidade: "Contrato de acesso a dados"
//
// Essa interface é definida no DOMAIN (coração do sistema)
// mas implementada na INFRASTRUCTURE (onde tem EF Core)
//
// Isso é o "D" do SOLID (Dependency Inversion Principle):
//   - Módulos de alto nível (Domain) definem a interface
//   - Módulos de baixo nível (Infrastructure) implementam
//   - A DEPENDÊNCIA APONTA PARA DENTRO (regra da Clean Architecture)
//
// O Handler depende de IEmpresaRepository (abstração)
// NÃO de EmpresaRepository (implementação concreta)
//
// Implementação: Infrastructure.Data/Empresas/Repositories/EmpresaRepository.cs
// ============================================================

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
