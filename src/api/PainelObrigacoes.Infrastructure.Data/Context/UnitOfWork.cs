using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Infrastructure.Data.Context;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context) => _context = context;

    public Task CompleteAsync(CancellationToken cancellationToken = default)
        => _context.SaveChangesAsync(cancellationToken);
}
