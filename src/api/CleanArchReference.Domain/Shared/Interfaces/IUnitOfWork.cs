// ============================================================
// 🟡 FASE 3 — Interface do UnitOfWork (Definida no Domain)
// ============================================================
//
// Responsabilidade: "Contrato do ponto único de commit"
// O que faz:       Agrupa várias operações numa única transação
//
// REGRA DE OURO:
//   Repository NUNCA chama SaveChanges
//   UnitOfWork é o ÚNICO lugar que chama SaveChanges em todo o sistema
//
// Isso garante ATOMICIDADE:
//   - Várias operações (criar empresa + criar obrigações)
//   - Um único SaveChanges
//   - Se algo falhar → NADA é salvo (rollback automático do EF Core)
//
// Implementação: Infrastructure.Data/Context/UnitOfWork.cs
// ============================================================

namespace CleanArchReference.Domain.Shared.Interfaces;

public interface IUnitOfWork
{
    Task CompleteAsync(CancellationToken cancellationToken = default);
}
