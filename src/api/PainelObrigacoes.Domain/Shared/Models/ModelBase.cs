// ============================================================
// 📦 BLOCO DE CONSTRUÇÃO — ModelBase (Base para Entidades de Domínio)
// ============================================================
//
// Responsabilidade: "Propriedades comuns a TODAS as entidades de domínio"
//
// TODO Model de domínio herda daqui:
//   EmpresaModel : ModelBase
//   ObrigacaoModel : ModelBase
//
// Propriedades:
//   Id: Guid       — Identificador único (gerado automaticamente se não informado)
//   CreatedAt: UTC — Data/hora de criação (preenchido automaticamente)
//   UpdatedAt: UTC? — Data/hora da última atualização (nulo se nunca atualizado)
// ============================================================

namespace PainelObrigacoes.Domain.Shared.Models;

public abstract class ModelBase
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
