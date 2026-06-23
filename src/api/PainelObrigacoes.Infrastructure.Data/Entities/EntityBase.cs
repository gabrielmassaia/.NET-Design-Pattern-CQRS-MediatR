// ============================================================
// 🟠 FASE 4 — EntityBase (Base para Entidades do EF Core)
// ============================================================
//
// Responsabilidade: "Propriedades comuns a TODAS as entidades do banco"
//
// TODO Entity do EF Core herda daqui:
//   EmpresaEntity : EntityBase
//   ObrigacaoEntity : EntityBase
//
// DIFERENÇA DE ModelBase (Domain):
//
//   ModelBase (Domain)           → EntityBase (Infrastructure.Data)
//   ─────────────────             ─────────────────────────────────
//   Só tem o essencial            Tem propriedade de infraestrutura
//   Sem IsActive                  TEM IsActive (soft delete)
//   Usado nas regras de negócio   Usado no mapeamento do banco
//
// IsActive: soft delete
//   - Quando "deleta" uma empresa, só marca IsActive = false
//   - O filtro global (HasQueryFilter) esconde automaticamente
//   - As obrigações em cascata também são "deletadas" (cascade soft delete)
// ============================================================

namespace PainelObrigacoes.Infrastructure.Data.Entities;

public abstract class EntityBase
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true; // Soft delete: true = ativo, false = deletado
}
