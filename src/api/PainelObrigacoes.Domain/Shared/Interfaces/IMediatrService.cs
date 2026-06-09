using PainelObrigacoes.Domain.Shared.Commands;
using PainelObrigacoes.Domain.Shared.Queries;

namespace PainelObrigacoes.Domain.Shared.Interfaces;

public interface IMediatrService
{
    Task<TResult> SendCommand<TResult>(
        Command<TResult> command,
        CancellationToken cancellationToken = default);

    Task<TResult> SendQuery<TResult>(
        Query<TResult> query,
        CancellationToken cancellationToken = default);
}
