// ============================================================
// 🟠 FASE 4.4 — EmpresaEntity (Objeto do Banco)
// ============================================================
//
// Responsabilidade: "Representação da tabela Empresas no EF Core"
//
// DIFERENÇA DE EmpresaModel (Domain):
//
//   EmpresaModel (Domain)      → EmpresaEntity (Infrastructure.Data)
//   ─────────────────────        ──────────────────────────────────
//   Puro C#                      Tem atributos/navigation do EF
//   Sem dependências externas    Depende de Microsoft.EntityFrameworkCore
//   Usado pelo Handler           Usado pelo Repository
//   Não sabe que banco existe    Mapeia diretamente pra tabela SQL
//
// A TRADUÇÃO entre Model e Entity acontece no Repository:
//   EmpresaRepository.ToModel()  → Entity → Model (leitura)
//   EmpresaRepository.ToEntity() → Model → Entity (escrita)
//
// Herda de EntityBase que adiciona:
//   Id: Guid       — chave primária
//   CreatedAt: UTC — quando foi criado
//   UpdatedAt: UTC? — quando foi atualizado
//   IsActive: bool  — soft delete (true por padrão)
// ============================================================

using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Infrastructure.Data.Entities;

public sealed class EmpresaEntity : EntityBase
{
    public string CNPJ { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public RegimeTributario Regime { get; set; }
    // Navigation property: uma empresa tem várias obrigações (1:N)
    // O EF Core usa isso pra fazer JOIN e Cascade Delete
    public ICollection<ObrigacaoEntity> Obrigacoes { get; set; } = [];
}
