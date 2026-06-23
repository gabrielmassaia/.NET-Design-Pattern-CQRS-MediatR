// ============================================================
// 🟠 FASE 4.2 — UnitOfWork (O Confirmador)
// ============================================================
//
// Responsabilidade: "ÚNICO lugar em todo o sistema que chama SaveChanges"
//
// FLUXO:
//   Handler fez várias operações:
//     1. _empresaRepository.Create(model)      → ChangeTracker: Added
//     2. _obrigacaoRepository.CreateRange(list) → ChangeTracker: Added
//     3. _unitOfWork.CompleteAsync()            → SaveChanges (agora sim, no banco)
//
// Se o SaveChanges falhar (ex: violação de índice único):
//   → TUDO é desfeito (rollback automático do EF Core)
//   → Nenhum dado inconsistente fica no banco
//
// Se cada repositório salvasse separado:
//   → Empresa salva, obrigações NÃO → dados inconsistentes 😱
//
// REGRA DE OURO:
//   Repository: rastreia mudanças (Add, Update, Remove)
//   UnitOfWork: CONFIRMA as mudanças (SaveChanges)
// ============================================================

using CleanArchReference.Domain.Shared.Interfaces;

namespace CleanArchReference.Infrastructure.Data.Context;

public sealed class UnitOfWork : IUnitOfWork
{
    // AppDbContext = mesmo contexto que os repositories usam
    // Como é o MESMO DbContext, as operações estão na mesma transação
    private readonly AppDbContext _context;

    // 🟠 CONSTRUTOR: DI injeta o AppDbContext
    public UnitOfWork(AppDbContext context) => _context = context;

    // 🟠 CompleteAsync: efetiva TODAS as mudanças pendentes no banco
    //
    // Chama SaveChangesAsync que:
    //   1. Gera INSERT/UPDATE/DELETE no SQL
    //   2. Executa num database transaction
    //   3. Se falhar, dá rollback em tudo
    //
    // Isso é chamado pelo Handler (FASE 3.4, PASSO 6)
    public Task CompleteAsync(CancellationToken cancellationToken = default)
        => _context.SaveChangesAsync(cancellationToken);
}
