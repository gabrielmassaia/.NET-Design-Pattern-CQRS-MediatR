namespace PainelObrigacoes.Domain.Shared.Interfaces;

public interface IUnitOfWork
{
    Task CompleteAsync(CancellationToken cancellationToken = default);
}
