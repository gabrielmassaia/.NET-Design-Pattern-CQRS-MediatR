// ============================================================
// 🟡 FASE 3 — EmpresaModel (Entidade de Domínio)
// ============================================================
//
// Responsabilidade: "Representação da empresa no Domain (coração do sistema)"
// O que é:         A entidade PURA de negócio, sem qualquer referência
//                  a banco, HTTP, ou frameworks externos
//
// Herda de ModelBase que tem:
//   Id: Guid        — identificador único (gerado automaticamente)
//   CreatedAt: UTC  — quando foi criada
//   UpdatedAt: UTC? — quando foi atualizada (null se nunca atualizada)
//
// DIFERENÇA DE Entity (Infrastructure.Data):
//   EmpresaModel (Domain)       → EmpresaEntity (Infrastructure.Data)
//   - Puro C#                   → - Tem atributos do EF Core
//   - Sem dependências          → - Tem navigation properties
//   - Usado pelo Handler        → - Usado pelo Repository
//   - ToModel() no Repository   → - ToEntity() no Repository
//
// A tradução entre Model e Entity acontece no Repository
// (Infrastructure.Data/Empresas/Repositories)
// ============================================================

using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Shared.Models;

namespace CleanArchReference.Domain.Empresas.Models;

public sealed class EmpresaModel : ModelBase
{
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }
}
